import { authenticate } from "@/lib/middleware/auth";
import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

// create
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

    const cart = await prisma.cart.create({
      data: { ...body.item, userId: authCheck.user?.userId },
    });

    return NextResponse.json({ ok: true, data: cart });
  } catch (error) {
    console.log(error);
    return NextResponse.json({ ok: false, error: "Something went wrong" });
  }
}

// replace full cart
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
    if (!body || !body.cart) {
      return NextResponse.json({ ok: false, error: "Missing body" });
    }

    await prisma.cart.deleteMany({ where: { userId: authCheck.user?.userId } });

    await prisma.cart.createMany({
      data: body.cart.map((item: any) => ({ ...item, userId: authCheck.user?.userId })),
    });

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.log(error);
    return NextResponse.json({ ok: false, error: "Something went wrong" });
  }
}

// update quantity
export async function PATCH(req: NextRequest) {
  try {
    const authCheck = await authenticate(req);
    if (!authCheck.ok) {
      return NextResponse.json({ ok: false, error: authCheck.message });
    }
    if (!authCheck.user?.userId) {
      return NextResponse.json({ ok: false, error: "Authentication error" });
    }

    const body = await req.json();
    if (!body || !body.id || !body.quantity) {
      return NextResponse.json({ ok: false, error: "Missing body" });
    }

    const item = await prisma.cart.update({
      where: { id: body.id },
      data: { quantity: body.quantity },
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

    await prisma.cart.delete({ where: { id: body.id } });
    return NextResponse.json({ ok: true });
  } catch (error) {
    console.log(error);
    return NextResponse.json({ ok: false, error: "Something went wrong" });
  }
}
