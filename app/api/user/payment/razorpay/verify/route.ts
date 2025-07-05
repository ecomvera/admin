import { authenticate } from "@/lib/middleware/auth";
import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";
import { prisma } from "@/lib/prisma";

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

    if (
      !body ||
      !body.orderNo ||
      !body.razorpayPaymentId ||
      !body.razorpayOrderId ||
      !body.razorpaySignature ||
      !body.response
    ) {
      return NextResponse.json({ ok: false, error: "Missing body" });
    }

    const expectedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET!)
      .update(body.razorpayOrderId + "|" + body.razorpayPaymentId)
      .digest("hex");
    if (expectedSignature !== body.razorpaySignature) {
      return NextResponse.json({ ok: false, error: "Invalid signature" });
    }

    const payment = await prisma.payment.update({
      where: {
        orderNumber: body.orderNo,
        userId: authCheck.user?.userId,
      },
      data: {
        status: "PAID",
        response: body.response,
      },
    });
    if (!payment) {
      return NextResponse.json({ ok: false, error: "Payment not found" });
    }

    await prisma.order.update({
      where: { orderNumber: body.orderNo },
      data: { status: "PROCESSING", paymentId: payment.id },
    });

    // notification

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ ok: false, error: "Something went wrong" });
  }
}
