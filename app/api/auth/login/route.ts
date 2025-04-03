import { prisma } from "@/lib/prisma";
import { generateTokens } from "@/lib/token";
import { type NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";

export async function POST(req: NextRequest) {
  try {
    const { email, password } = await req.json();

    if (!email || !password) {
      return NextResponse.json({
        ok: false,
        error: "Email and password are required",
      });
    }

    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      return NextResponse.json({
        ok: false,
        error: "Invalid email or password",
      });
    }

    // Check if password is correct
    const isPasswordValid = await bcrypt.compare(password, user.password || "");
    if (!isPasswordValid) {
      return NextResponse.json({
        ok: false,
        error: "Invalid email or password",
      });
    }

    const productObj = {
      id: true,
      name: true,
      slug: true,
      price: true,
      mrp: true,
      images: true,
      sizes: true,
    };

    const userData = await prisma.user.findUnique({
      where: { email },
      include: {
        addresses: { where: { isDeleted: false } },
        orders: true,
        cart: { include: { product: { select: productObj } } },
        wishlist: { include: { product: { select: productObj } } },
      },
    });

    if (!userData) {
      return NextResponse.json({
        ok: false,
        error: "User not found",
      });
    }

    // Generate tokens
    const { accessToken, refreshToken } = generateTokens({ id: userData.id });

    return NextResponse.json({
      ok: true,
      message: "Login successful",
      data: {
        user: userData,
        accessToken,
        refreshToken,
      },
    });
  } catch (error) {
    console.log(error);
    return NextResponse.json({ ok: false, error: "Something went wrong" });
  }
}
