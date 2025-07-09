import { status_options } from "@/constants";
import { authenticate } from "@/lib/middleware/auth";
import { prisma } from "@/lib/prisma";
import { formatStatusLabel } from "@/lib/utils";
import { IOrderItem, IProduct } from "@/types";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  try {
    const authCheck = await authenticate(req);
    if (!authCheck.ok) {
      return NextResponse.json({ ok: false, error: authCheck.message });
    }
    if (!authCheck.user?.userId) {
      return NextResponse.json({ ok: false, error: "Authentication error" });
    }

    const orders = await prisma.order.findMany({
      where: { userId: authCheck.user?.userId },
      include: {
        items: {
          include: {
            product: {
              select: { id: true, name: true, slug: true, images: true },
            },
          },
        },
        ProductReviews: true,
      },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({
      ok: true,
      data: orders,
      orderStatus: status_options,
    });
  } catch (error) {
    console.log(error);
    return NextResponse.json({ ok: false, error: "Something went wrong" });
  }
}

export async function POST(req: NextRequest) {
  try {
    const authCheck = await authenticate(req);
    if (!authCheck.ok) {
      return NextResponse.json({ ok: false, error: authCheck.message });
    }
    if (!authCheck.user?.userId) {
      return NextResponse.json({ ok: false, error: "Authentication error" });
    }

    const body = await req.json();
    if (!body) {
      return NextResponse.json({ ok: false, error: "Missing body" });
    }
    if (!body.items || !Array.isArray(body.items) || !body.items.length) {
      return NextResponse.json({ ok: false, error: "Missing items" });
    }

    if (
      !body.orderNumber ||
      !body.userId ||
      !body.deliveryId ||
      !body.status ||
      !body.deliveryCharge === undefined ||
      body.giftWrapCharge === undefined ||
      !body.subTotal ||
      !body.paymentMode
    ) {
      return NextResponse.json({ ok: false, error: "Missing required fields" });
    }

    // check order number is unique
    const isExist = await prisma.order.findUnique({
      where: { orderNumber: body.orderNumber as string },
    });
    if (isExist) {
      return NextResponse.json({
        ok: false,
        error: "Something went wrong! Please try again.",
      });
    }

    // check the item quantity is available
    const productIds = body.items.map((item: IOrderItem) => item.id);
    const productSizes = body.items.map((item: IOrderItem) => item.size);
    const productQuantities = await prisma.productSizes.findMany({
      where: {
        productId: {
          in: productIds,
        },
        key: {
          in: productSizes,
        },
      },
      select: { productId: true, quantity: true },
    });

    // Check for missing or insufficient items
    const missingItems = body.items.reduce((acc: { productId: string; availableQuantity: number }[], item: IOrderItem) => {
      const product = productQuantities.find((p) => p.productId === item.id);

      if (!product || item.quantity > product.quantity) {
        acc.push({
          productId: item.id,
          availableQuantity: product ? product.quantity : 0,
        });
      }

      return acc;
    }, []);

    if (missingItems.length > 0) {
      return NextResponse.json({
        ok: false,
        error: "Some items are not available",
        missingItems,
      });
    }

    const validStatus = formatStatusLabel(body.status);
    if (!validStatus) {
      console.log("Invalid status", body.status);
      return NextResponse.json({ ok: false, error: "Invalid status" });
    }

    const order = await prisma.$transaction(async (prisma) => {
      const order = await prisma.order.create({
        data: {
          orderNumber: body?.orderNumber as string,
          userId: body?.userId as string,
          shippingId: body?.deliveryId as string,
          status: validStatus,
          totalAmount: body?.totalAmount as number,
          deliveryCharge: body?.deliveryCharge as number,
          giftWrapCharge: body?.giftWrapCharge as number,
          subTotal: body?.subTotal as number,
        },
      });

      await prisma.orderedItem.createMany({
        data: body?.items?.map((item: IOrderItem) => ({
          orderId: order.id,
          productId: item.id,
          quantity: item.quantity,
          color: item.color,
          size: item.size,
          price: item.price,
          totalPrice: item.totalPrice,
        })),
      });

      await prisma.orderTimeline.create({
        data: {
          orderNumber: order.orderNumber,
          status: "ORDER_CREATED",
          message: "Order created",
          completed: true,
        },
      });

      // if payment mode is COD, then create new order status "PROCESSING"
      if (body.paymentMode === "CASH_ON_DELIVERY") {
        await prisma.orderTimeline.create({
          data: {
            orderNumber: order.orderNumber,
            status: "PROCESSING",
            message: "Processing",
            completed: false,
          },
        });
      }

      // reduce stock quantity
      await Promise.all(
        body.items.map(async (item: IOrderItem) => {
          await prisma.productSizes.update({
            where: {
              key_productId_productColor: {
                productId: item.id,
                key: item.size,
                productColor: item.color,
              },
            },
            data: { quantity: { decrement: item.quantity } },
          });
        })
      );

      // create payment
      await prisma.payment.create({
        data: {
          userId: body.userId,
          orderNumber: order.orderNumber,
          amount: order.totalAmount,
          mode: body.paymentMode,
          status: "PENDING",
        },
      });

      return order;
    });

    // delete cart
    await prisma.cart.deleteMany({ where: { userId: body.userId } });

    return NextResponse.json({ ok: true, data: order });
  } catch (error: any) {
    console.log(error);
    return NextResponse.json({ ok: false, error: error.message });
  }
}
