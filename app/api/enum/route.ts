"use server";

import { attributes, colors, sizes } from "@/constants/enum";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const attributesData = await prisma.attribute.findMany();

    return NextResponse.json({
      ok: true,
      data: {
        sizes: sizes,
        attributes: attributesData,
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
