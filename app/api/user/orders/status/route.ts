import { authenticate } from "@/lib/middleware/auth";
import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function PUT(req: NextRequest) {
  const authCheck = await authenticate(req);
  if (!authCheck.ok) {
    return NextResponse.json({ ok: false, error: authCheck.message });
  }
  if (!authCheck.user?.userId) {
    return NextResponse.json({ ok: false, error: "Authentication error" });
  }

  const body = await req.json();
  if (!body || !body.id || !body.status) {
    return NextResponse.json({ ok: false, error: "Missing body" });
  }

  const order = await prisma.order.update({
    where: { id: body.id },
    data: { status: body.status },
  });

  return NextResponse.json({ ok: true, data: order });
}
