"use server";

import { attributes, colors, sizes } from "@/constants/enum";
import { NextResponse } from "next/server";

export async function GET() {
  try {
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
