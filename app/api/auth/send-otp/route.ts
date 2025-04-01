import { prisma } from "@/lib/prisma";
import { generateOTP, sendOTP } from "@/lib/otp";
import { type NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const { phone } = await req.json();

  if (!phone) {
    return NextResponse.json({
      ok: false,
      error: "Phone is required",
    });
  }

  const otp = await generateOTP();
  const expireAt = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

  const userOTP = await prisma.oTP.upsert({
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

  const res = await sendOTP(otp, phone);

  if (!res.ok) {
    return NextResponse.json({
      ok: false,
      error: res.error,
    });
  }

  return NextResponse.json({
    ok: true,
    message: res.message,
  });
}
