import Category from "@/lib/models/category.model";
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
    const data = await Category.findOne({ slug })
      .populate({
        path: "products",
        model: "Product",
        select: { category: 0, subCategory: 0 },
      })
      .populate({
        path: "parentId",
        model: "Category",
        select: "_id name slug",
      })
      .exec();
    const duration = Date.now() - start;
    console.log("\x1b[32m%s\x1b[0m", `Categories [id] - Database query time: ${duration} ms`);

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
