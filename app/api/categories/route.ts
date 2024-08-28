import Category from "@/lib/models/category.model";
import { connectDB } from "@/lib/mongoose";
import type { NextApiRequest } from "next";
import { NextResponse } from "next/server";

export async function GET(req: NextApiRequest) {
  await connectDB();

  const url = new URL(req.url || "");
  const searchParams = Object.fromEntries(url.searchParams.entries());

  try {
    const data = await Category.find({ parentId: null, isOffer: false }, { products: 0 })
      .populate({ path: "children", model: "Category", select: { products: 0 } })
      .exec();

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
