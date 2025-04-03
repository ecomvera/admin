import { authenticate } from "@/lib/middleware/auth";
import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

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
    if (!body || !body.item) {
      return NextResponse.json({ ok: false, error: "Missing body" });
    }

    console.log({ ...body.item, userId: authCheck.user?.userId });

    const item = await prisma.wishList.create({
      data: { ...body.item, userId: authCheck.user?.userId },
    });

    return NextResponse.json({ ok: true, data: item });
  } catch (error) {
    console.log(error);
    return NextResponse.json({ ok: false, error: "Something went wrong" });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const authCheck = await authenticate(req);
    if (!authCheck.ok) {
      return NextResponse.json({ ok: false, error: authCheck.message });
    }
    if (!authCheck.user?.userId) {
      return NextResponse.json({ ok: false, error: "Authentication error" });
    }

    const body = await req.json();
    if (!body || !body.id) {
      return NextResponse.json({ ok: false, error: "Missing body" });
    }

    const item = await prisma.wishList.delete({
      where: { userId_id: { userId: authCheck.user?.userId, id: body.id } },
    });

    return NextResponse.json({ ok: true, data: item });
  } catch (error) {
    console.log(error);
    return NextResponse.json({ ok: false, error: "Something went wrong" });
  }
}
