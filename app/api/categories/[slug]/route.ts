import { defaultGenders } from "@/constants";
import { prisma } from "@/lib/prisma";
import type { NextApiRequest } from "next";
import { NextResponse } from "next/server";

const convertObject = (obj: Record<string, string>) => {
  const result: Record<string, string[]> = {};

  Object.keys(obj).forEach((key) => {
    if (key === "category") return (result[key] = obj[key].split("_"));
    let value = obj[key].replace("-", " ");
    result[key] = value.split("_");
  });

  return result;
};

export async function GET(req: NextApiRequest, { params }: { params: { slug: string } }) {
  const url = new URL(req.url || "");
  const searchParams = Object.fromEntries(url.searchParams.entries());

  const { slug } = params;
  const output = convertObject(searchParams);

  const conditionsArr: any[] = [];

  // Add filters by priority
  if (output.gender && output.gender.length) {
    conditionsArr.push({ genders: { hasSome: output.gender } });
  }

  if (output.colors && output.colors.length) {
    conditionsArr.push({ colors: { some: { name: { in: output.colors } } } });
  }

  if (output.sizes && output.sizes.length) {
    conditionsArr.push({ sizes: { some: { key: { in: output.sizes } } } });
  }

  if (output.fit && output.fit.length) {
    conditionsArr.push({ attributes: { some: { value: { in: output.fit } } } });
  }

  if (output.sleeve && output.sleeve.length) {
    conditionsArr.push({ attributes: { some: { value: { in: output.sleeve } } } });
  }

  if (output.neck && output.neck.length) {
    conditionsArr.push({ attributes: { some: { value: { in: output.neck } } } });
  }

  // filter by category
  const categoryArr: any[] = [];
  if (output.category && output.category.length) {
    categoryArr.push({ slug: { in: output.category } });
  }

  const childrenObj = {
    parent: { select: { name: true, slug: true } },
    products: {
      where: {
        AND: conditionsArr,
      },
      include: { images: true, sizes: true, attributes: true, colors: true },
    },
  };

  try {
    const start = Date.now();
    let category;
    let products;
    let subcategories;
    let genders;
    let productSizes;

    // fetch category with subcategories without filters
    const categoryData = await prisma.category.findUnique({
      where: { slug: slug },
      include: { children: { select: { name: true, slug: true } } },
    });

    // if parent category then fetch products from its subcategories with filters
    if (!categoryData?.parentId) {
      category = await prisma.category.findUnique({
        where: { slug: slug },
        include: { children: { where: { AND: categoryArr }, include: childrenObj } },
      });
      subcategories = categoryData?.children;
      productSizes = [...new Set(category?.children.map((item) => item.products.map((p) => p.sizeCategory)).flat())];

      const isUniSexExist = category?.children.some((child) =>
        child.products.some((product) => product.genders.includes("Unisex"))
      );
      if (isUniSexExist) {
        genders = ["Unisex"];
      }
    } else {
      // if sub category then fetch products with filters
      category = await prisma.category.findUnique({
        where: { slug: slug },
        include: childrenObj,
      });

      productSizes = [...new Set(category?.products.map((item) => item.sizeCategory))];
      const isUniSexExist = category?.products.some((child) => child.genders.includes("Unisex"));
      if (isUniSexExist) {
        genders = ["Unisex"];
      }
    }

    // If no category, check for groupCategory
    if (!categoryData) {
      category = await prisma.groupCategory.findUnique({
        where: { slug: slug },
      });
      // fetch products with filters
      const productsData = await prisma.groupCategoryProducts.findMany({
        where: { groupCategoryId: category?.id, product: { category: { AND: categoryArr }, AND: conditionsArr } },
        select: {
          product: {
            include: {
              images: true,
              sizes: true,
              attributes: true,
              colors: true,
              category: { select: { name: true, slug: true } },
            },
          },
        },
      });
      // fetch sub categories of all products in group category
      const subcategoriesData = await prisma.groupCategoryProducts.findMany({
        where: { groupCategoryId: category?.id },
        select: {
          product: {
            include: { category: { select: { name: true, slug: true } } },
          },
        },
      });
      products = productsData.map((item) => item.product);
      // set unique sub categories
      subcategories = [
        ...new Map(subcategoriesData.map((item) => [item.product.category.slug, item.product.category])).values(),
      ];
      productSizes = [...new Set(subcategoriesData.map((item) => item.product.sizeCategory))];

      // genders = [...new Set(productsData.map((item) => item.product.genders).flat())];
      genders = defaultGenders;
    }

    const duration = Date.now() - start;
    console.log("\x1b[32m%s\x1b[0m", `Categories [id] - Database query time: ${duration} ms`);

    return NextResponse.json({
      ok: true,
      category: category,
      products: products,
      subcategories: subcategories,
      genders: genders,
      productSizes: productSizes,
    });
  } catch (error: any) {
    console.error(error);
    return NextResponse.json({
      ok: false,
      error: error.message,
    });
  }
}
