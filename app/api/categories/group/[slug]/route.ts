import { prisma } from "@/lib/prisma";
import type { NextApiRequest } from "next";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextApiRequest, { params }: { params: { slug: string } }) {
  const url = new URL(req.url || "");
  const searchParams = Object.fromEntries(url.searchParams.entries());
  console.log("fetchApi called - group category");

  const { slug } = params;
  try {
    const start = Date.now();
    const data = await prisma.groupCategory.findUnique({
      where: { slug },
      include: { products: true },
    });

    const res = await prisma.groupCategoryProducts.findMany({
      where: { groupCategoryId: data?.id },
      select: { product: { select: { id: true, name: true, slug: true } } },
    });
    const products = res.map((item) => item.product);

    const duration = Date.now() - start;
    console.log("\x1b[32m%s\x1b[0m", `Categories - Database query time: ${duration} ms`);

    const response = NextResponse.json({
      ok: true,
      data: { ...data, products },
    });

    return response;
  } catch (error: any) {
    console.error("ERROR:", "<fetch group category>", error);
    const errorResponse = NextResponse.json({
      ok: false,
      error: error.message,
    });
    return errorResponse;
  }
}

export async function PATCH(req: NextRequest, { params }: { params: { slug: string } }) {
  const { slug } = params;

  try {
    const body = await req.json();
    const res = await prisma.groupCategory.update({
      where: { slug },
      data: body,
    });

    const response = NextResponse.json({
      ok: true,
      data: res,
    });

    return response;
  } catch (error: any) {
    const errorResponse = NextResponse.json({
      ok: false,
      error: error.message,
    });
    return errorResponse;
  }
}

export async function PUT(req: NextRequest, { params }: { params: { slug: string } }) {
  try {
    const body = await req.json();
    const productIds = body.productIds;
    const groupCategoryId = body.groupCategoryId;

    await prisma.groupCategoryProducts.deleteMany({
      where: { groupCategoryId },
    });

    await prisma.groupCategoryProducts.createMany({
      data: productIds.map((id: string) => ({ groupCategoryId, productId: id })),
    });

    const response = NextResponse.json({
      ok: true,
      data: {},
    });

    return response;
  } catch (error: any) {
    const errorResponse = NextResponse.json({
      ok: false,
      error: error.message,
    });
    return errorResponse;
  }
}

export async function DELETE(req: NextApiRequest, { params }: { params: { id: string; slug: string } }) {
  const url = new URL(req.url || "");
  const searchParams = Object.fromEntries(url.searchParams.entries());

  const id = searchParams.id;
  const slug = params.slug;

  console.log(id, slug);

  try {
    await prisma.groupCategory.delete({
      where: { slug },
    });

    await prisma.groupCategoryProducts.deleteMany({
      where: { groupCategoryId: id },
    });

    return NextResponse.json({
      ok: true,
      data: {},
    });
  } catch (error: any) {
    return NextResponse.json({
      ok: false,
      error: error.message,
    });
  }
}
