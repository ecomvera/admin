import { authenticate } from "@/lib/middleware/auth";
import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

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
    if (!body) {
      return NextResponse.json({ ok: false, error: "Missing body" });
    }

    const user = await prisma.user.update({
      where: { id: authCheck.user?.userId },
      data: { ...body },
    });
    return NextResponse.json({ ok: true, data: user });
  } catch (error: any) {
    console.log(error);

    if (error.code === "P2002") {
      return NextResponse.json({ ok: false, error: "Email already exists" });
    }

    return NextResponse.json({ ok: false, error: "Something went wrong" });
  }
}
