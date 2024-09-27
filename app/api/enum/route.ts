"use server";

import { prisma } from "@/lib/prisma";
import { NextApiResponse } from "next";

export async function GET(res: NextApiResponse) {
  res.setHeader("Cache-Control", "no-store");

  try {
    console.log("\x1b[32m%s\x1b[0m", "ENUM api called!");
    const attributes = await prisma.attribute.findMany();
    const sizes = await prisma.size.findMany();
    const colors = await prisma.color.findMany();

    res.status(200).json({
      ok: true,
      data: {
        sizes: sizes,
        attributes: attributes,
        colors: colors,
      },
    });
  } catch (error: any) {
    console.error("error -", error);
    res.status(500).json({
      ok: false,
      error: "something went wrong!",
    });
  }
}
