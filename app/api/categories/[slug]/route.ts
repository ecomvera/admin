import { convertFilters, convertObject } from "@/lib/api-filters";
import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

const productSelects = {
  id: true,
  name: true,
  slug: true,
  price: true,
  mrp: true,
  images: { take: 1 },
};

export async function GET(req: NextRequest, { params }: { params: { slug: string } }) {
  try {
    console.log("\x1b[32m%s\x1b[0m", `🔍 Category [${params.slug}] API called`);

    const url = new URL(req.url || "");
    const searchParams = Object.fromEntries(url.searchParams.entries());
    const queryParams = convertObject(searchParams);

    const page = parseInt(url.searchParams.get("page") || "1");
    const limit = parseInt(url.searchParams.get("limit") || "20");
    const offset = (page - 1) * limit;

    const conditions = convertFilters(queryParams);
    const { slug } = params;

    // fetch category with subcategories without filters
    const categoryData = await prisma.category.findUnique({
      where: { slug },
      include: {
        children: {
          select: {
            name: true,
            slug: true,
            garmentType: true,
            wearType: true,
            products: { where: { AND: conditions }, select: { id: true } },
          },
        },
        products: { where: { AND: conditions }, select: { id: true } },
        parent: {
          select: {
            name: true,
            slug: true,
            garmentType: true,
            wearType: true,
          },
        },
      },
    });

    if (!categoryData) {
      return NextResponse.json({ ok: false, error: "Category not found" }, { status: 404 });
    }

    let category;
    let parentCategory;
    let subCategories;
    let productIds: string[] = [];
    let products;

    category = {
      name: categoryData.name,
      slug: categoryData.slug,
      garmentType: categoryData.garmentType
        ? [categoryData.garmentType]
        : categoryData.children.map((child) => child.garmentType),
      wearType: categoryData.wearType ? [categoryData.wearType] : categoryData.children.map((child) => child.wearType),
    };
    if (categoryData.parentId) {
      parentCategory = {
        name: categoryData.parent?.name,
        slug: categoryData.parent?.slug,
      };
      productIds = categoryData.products.map((product) => product.id);
    } else {
      subCategories = categoryData.children.map((child) => ({
        name: child.name,
        slug: child.slug,
      }));
      productIds = categoryData.children.flatMap((child) => child.products || []).map((product) => product.id);
    }

    // removing duplicates
    category.garmentType = [...new Set(category.garmentType)];
    category.wearType = [...new Set(category.wearType)];

    // Fetch products with pagination
    products = await prisma.product.findMany({
      where: { id: { in: productIds } },
      select: productSelects,
      skip: offset,
      take: limit,
    });

    return NextResponse.json({
      ok: true,
      category,
      parentCategory,
      subCategories,
      products,
      pagination: {
        page,
        limit,
        total: productIds.length,
        totalPages: Math.ceil(productIds.length / limit),
      },
    });
  } catch (error) {
    console.log(error);
    return NextResponse.json({ ok: false, error: "Failed to fetch category" }, { status: 500 });
  }
}
