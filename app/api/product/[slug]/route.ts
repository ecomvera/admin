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
    const data = await Product.findOne({ slug }).exec();

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
