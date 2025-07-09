import { authenticate } from "@/lib/middleware/auth";
import { prisma } from "@/lib/prisma";
import { formatStatusLabel } from "@/lib/utils";
import { NextRequest, NextResponse } from "next/server";

export async function PUT(req: NextRequest) {
  try {
    const authCheck = await authenticate(req);
    if (!authCheck.ok) {
      return NextResponse.json({ ok: false, error: authCheck.message });
    }
    if (!authCheck.user?.userId) {
      return NextResponse.json({ ok: false, error: "Authentication error" });
    }

    const body = await req.json();
    if (!body || !body.orderNo || !body.status) {
      return NextResponse.json({ ok: false, error: "Missing body" });
    }

    const validStatus = formatStatusLabel(body.status);
    if (!validStatus) {
      console.log("Invalid status", body.status);
      return NextResponse.json({ ok: false, error: "Invalid status" });
    }

    await prisma.payment.update({
      where: { orderNumber: body.orderNo },
      data: { status: "FAILED" },
    });

    await prisma.order.update({
      where: { orderNumber: body.orderNo },
      data: { status: validStatus },
    });

    await prisma.orderTimeline.updateMany({
      where: { orderNumber: body.orderNo },
      data: {
        completed: true,
      },
    });

    await prisma.orderTimeline.create({
      data: {
        orderNumber: body.orderNo,
        status: body.status,
        message: validStatus,
        completed: true,
      },
    });

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.log(error);
    return NextResponse.json({ ok: false, error: "Something went wrong" });
  }
}
