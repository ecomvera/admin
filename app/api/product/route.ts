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

    if ("table-data" in searchParams) {
      data = await Product.find()
        .populate({ path: "category", select: "name" })
        .populate({ path: "subCategory", select: "name" });
    } else {
      data = await Product.find();
    }

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
