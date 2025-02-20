"use server";

import { fast2SMS, generateOTP } from "@/lib/otp";
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

  if (!user) {
    const newUser = await prisma.user.create({
      data: { phone },
    });

    if (!newUser) {
      return NextResponse.json({
        ok: false,
        error: "Something went wrong",
      });
    }
  }

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

  // // send otp sms
  // const data = await fast2SMS(otp, phone);

  // if (!data || !data.return) {
  //   return NextResponse.json({
  //     ok: false,
  //     error: "Something went wrong",
  //   });
  // }

  return NextResponse.json({
    ok: true,
    message: "OTP sent successfully",
    data: {
      user,
      otp,
    },
  });
}
