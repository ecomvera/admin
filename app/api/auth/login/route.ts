"use server";

import { generateOTP } from "@/lib/otp";
import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const { phone } = await req.json();

  if (!phone) {
    return NextResponse.json({
      ok: false,
      error: "Phone is required",
    });
  }

  const user = await prisma.user.findUnique({
    where: { phone: phone },
  });

  const otp = await generateOTP();
  const expireAt = new Date(Date.now() + 10 * 60 * 1000);
  const userOTP = await prisma.otp.upsert({
    where: { phone },
    update: { otp, expireAt },
    create: { phone, otp, expireAt },
  });

  if (!userOTP) {
    return NextResponse.json({
      ok: false,
      error: "Something went wrong",
    });
  }

  if (!user) {
    const newUser = await prisma.user.create({
      data: { phone },
    });

    return NextResponse.json({ ok: true, data: { user: newUser, otp } });
  }

  if (!user.onBoarded) {
    return NextResponse.json({ ok: true, data: { user, otp } });
  }

  return NextResponse.json({
    ok: true,
    data: {
      user,
      otp,
    },
  });
}
