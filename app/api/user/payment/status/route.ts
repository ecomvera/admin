import { authenticate } from "@/lib/middleware/auth";
import { prisma } from "@/lib/prisma";
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

    const payment = await prisma.payment.update({
      where: { orderNumber: body.orderNo },
      data: { status: body.status },
    });

    if (!payment) {
      return NextResponse.json({ ok: false, error: "Payment not found" });
    }

    return NextResponse.json({ ok: true, data: payment });
  } catch (error) {
    console.log(error);
    return NextResponse.json({ ok: false, error: "Something went wrong" });
  }
}
