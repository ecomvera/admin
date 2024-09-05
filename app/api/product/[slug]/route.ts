import Product from "@/lib/models/product.model";
import { connectDB } from "@/lib/mongoose";
import type { NextApiRequest } from "next";
import { NextResponse } from "next/server";

export async function GET(req: NextApiRequest, { params }: { params: { slug: string } }) {
  await connectDB();

  const url = new URL(req.url || "");
  const searchParams = Object.fromEntries(url.searchParams.entries());

  const { slug } = params;

  try {
    const start = Date.now();
    const data = await Product.findOne({ slug })
      .populate({
        path: "category",
        model: "Category",
        select: "_id name slug",
        strictPopulate: false,
      })
      .populate({
        path: "subCategory",
        model: "Category",
        select: "_id name slug",
        strictPopulate: false,
      })
      .exec();
    const duration = Date.now() - start;
    console.log("\x1b[32m%s\x1b[0m", `Product [id] - Database query time: ${duration} ms`);

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
