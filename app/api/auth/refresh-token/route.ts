import { prisma } from "@/lib/prisma";
import { generateTokens, verifyToken } from "@/lib/token";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const { refresh_token } = await req.json();
  if (!refresh_token) {
    return NextResponse.json({
      ok: false,
      error: "Refresh token is required",
    });
  }

  const res = await verifyToken(refresh_token, "REFRESH");
  if (!res.ok) {
    return NextResponse.json({
      ok: false,
      error: res.error,
    });
  }

  if (!res.data.userId) {
    return NextResponse.json({
      ok: false,
      error: "Invalid refresh token",
    });
  }

  const { accessToken, refreshToken } = generateTokens({
    id: res.data?.userId,
  });

  return NextResponse.json({
    ok: true,
    data: { accessToken, refreshToken },
  });
}
