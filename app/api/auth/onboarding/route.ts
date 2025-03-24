import { prisma } from "@/lib/prisma";
import { generateTokens } from "@/lib/token";
import { type NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";

export async function POST(req: NextRequest) {
  const { name, email, password, gender } = await req.json();

  if (!name || !email || !password || !gender) {
    return NextResponse.json({
      ok: false,
      error: "Please provide all required fields",
    });
  }

  const isEmailExist = await prisma.user.findUnique({ where: { email } });
  if (isEmailExist && isEmailExist.onBoarded) {
    return NextResponse.json({
      ok: false,
      error: "This email is already registered",
    });
  }

  // Hash the password
  const hashedPassword = await bcrypt.hash(password, 10);

  // Update or create user
  const updatedUser = await prisma.user.upsert({
    where: { email },
    update: { name, email, gender, password: hashedPassword, onBoarded: true },
    create: { name, email, gender, password: hashedPassword, onBoarded: true },
  });

  if (!updatedUser) {
    return NextResponse.json({
      ok: false,
      error: "Something went wrong",
    });
  }

  const productObj = {
    id: true,
    name: true,
    slug: true,
    price: true,
    mrp: true,
    images: { take: 1, select: { url: true } },
    sizes: true,
  };

  const user = await prisma.user.findUnique({
    where: { email },
    include: {
      addresses: true,
      orders: true,
      cart: { include: { product: { select: productObj } } },
      wishlist: { include: { product: { select: productObj } } },
    },
  });

  if (!user) {
    return NextResponse.json({
      ok: false,
      error: "Something went wrong",
    });
  }

  // Generate tokens
  const { accessToken, refreshToken } = generateTokens(user);

  return NextResponse.json({
    ok: true,
    data: {
      user,
      accessToken,
      refreshToken,
    },
  });
}
