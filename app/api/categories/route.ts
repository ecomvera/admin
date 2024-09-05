import Category from "@/lib/models/category.model";
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
    if ("no-children" in searchParams) {
      data = await Category.find({ parentId: null, isOffer: false }, { products: 0, children: 0 }).exec();
    } else {
      data = await Category.find({ parentId: null, isOffer: false }, { products: 0 })
        .populate({ path: "children", model: "Category", select: { products: 0 }, strictPopulate: false })
        .exec();
    }
    const duration = Date.now() - start;
    console.log("\x1b[32m%s\x1b[0m", `Categories - Database query time: ${duration} ms`);

    const response = NextResponse.json({
      ok: true,
      data,
    });

    if (searchParams.cache === "no-cache") {
      response.headers.set("Cache-Control", "no-store, no-cache, must-revalidate, proxy-revalidate");
      response.headers.set("Pragma", "no-cache");
      response.headers.set("Expires", "0");
    }

    return response;
  } catch (error: any) {
    console.error("ERROR:", "<fetch categories>", error);
    const errorResponse = NextResponse.json({
      ok: false,
      error: error.message,
    });

    if (searchParams.cache === "no-cache") {
      errorResponse.headers.set("Cache-Control", "no-store, no-cache, must-revalidate, proxy-revalidate");
      errorResponse.headers.set("Pragma", "no-cache");
      errorResponse.headers.set("Expires", "0");
    }

    return errorResponse;
  }
}
