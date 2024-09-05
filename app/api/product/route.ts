"use server";

import Product from "@/lib/models/product.model";
import { connectDB } from "@/lib/mongoose";
import type { NextApiRequest } from "next";
import { NextResponse } from "next/server";

export async function GET(req: NextApiRequest) {
  await connectDB();

  const url = new URL(req.url || "");
  const searchParams = Object.fromEntries(url.searchParams.entries());

  try {
    let data;

    const start = Date.now();
    if ("table-data" in searchParams) {
      data = await Product.find()
        .populate({ path: "category", select: "name", strictPopulate: false })
        .populate({ path: "subCategory", select: "name", strictPopulate: false })
        .exec();
    } else {
      data = await Product.find().exec();
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
