"use server";

import { prisma } from "@/lib/prisma";
import type { NextApiRequest } from "next";
import { NextResponse } from "next/server";

export async function GET(req: NextApiRequest) {
  const url = new URL(req.url || "");
  const searchParams = Object.fromEntries(url.searchParams.entries());

  try {
    let data;

    const start = Date.now();
    if ("table-data" in searchParams) {
      data = await prisma.product.findMany({ include: { category: { include: { parent: true } } } });
    } else {
      data = await prisma.product.findMany({
        include: { category: { include: { parent: true } }, images: true, attributes: true, sizes: true },
      });
    }
    const duration = Date.now() - start;
    console.log("\x1b[32m%s\x1b[0m", `Products - Database query time: ${duration} ms`);

    return NextResponse.json({
      ok: true,
      data,
    });
  } catch (error: any) {
    console.error(error);
    return NextResponse.json({
      ok: false,
      error: error.message,
    });
  }
}
