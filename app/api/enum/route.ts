"use server";

import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    console.log("\x1b[32m%s\x1b[0m", "ENUM api called!");
    const attributes = await prisma.attribute.findMany();
    const sizes = await prisma.size.findMany();
    const colors = await prisma.color.findMany();

    return NextResponse.json({
      ok: true,
      data: {
        sizes: sizes,
        attributes: attributes,
        colors: colors,
      },
    });
  } catch (error: any) {
    console.error(error);
    return NextResponse.json({
      ok: false,
      error: "something went wrong!",
    });
  }
}
