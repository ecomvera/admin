import { prisma } from "@/lib/prisma";
import { generateTokens } from "@/lib/token";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const { name, email, phone, otp, gender } = await req.json();

  if (!otp || !phone || !name || !gender || !email) {
    return NextResponse.json({
      ok: false,
      error: "Please provide all required fields",
    });
  }

  const isEmailExist = await prisma.user.findUnique({ where: { email } });
  if (isEmailExist) {
    return NextResponse.json({
      ok: false,
      error: "This email is already registered",
    });
  }

  const userOTP = await prisma.otp.findUnique({ where: { phone } });
  if (!userOTP || userOTP.otp !== otp) {
    return NextResponse.json({
      ok: false,
      error: "Invalid OTP",
    });
  }
  if (userOTP.expireAt < new Date()) {
    return NextResponse.json({
      ok: false,
      error: "OTP Expired",
    });
  }

  const updatedUser = await prisma.user.update({
    where: { phone },
    data: { name, email, phone, gender, onBoarded: true },
  });
  if (!updatedUser) {
    return NextResponse.json({
      ok: false,
      error: "Something went wrong",
    });
  }

  const user = await prisma.user.findUnique({
    where: { phone },
    include: { addresses: true, orders: true, cart: true, wishlist: true },
  });
  if (!user) {
    return NextResponse.json({
      ok: false,
      error: "Please register first!",
    });
  }

  // generate tokens
  const { accessToken, refreshToken } = generateTokens(user);

  await prisma.otp.delete({ where: { phone } });

  return NextResponse.json({ ok: true, data: { user, accessToken, refreshToken } });
}
