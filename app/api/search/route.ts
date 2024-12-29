import { prisma } from "@/lib/prisma";
import _ from "lodash";
import { NextApiRequest } from "next";
import { NextResponse } from "next/server";

const getProductIDs = async (query: string) => {
  const regexTerms = query.split(" ").map((term) => ({
    $or: [{ name: { $regex: term, $options: "i" } }, { description: { $regex: term, $options: "i" } }],
  }));

  const matchedProducts = await prisma.product.aggregateRaw({
    pipeline: [
      {
        $match: {
          $and: [...regexTerms],
        },
      },
      {
        $project: {
          _id: {
            $toString: "$_id",
          },
        },
      },
    ],
  });

  return _.map(matchedProducts, "_id");
};

const convertObject = (obj: Record<string, string>) => {
  const result: Record<string, string[] | string> = {};

  Object.keys(obj).forEach((key) => {
    if (key === "q") return (result[key] = obj[key]);
    let value = obj[key].replace("-", " ");
    result[key] = value.split("_");
  });

  return result;
};

const convertFilters = (obj: Record<string, string[] | string>) => {
  const result: any[] = [];

  // Add filters by priority
  if (obj.gender && obj.gender.length) {
    result.push({ genders: { hasSome: obj.gender } });
  }

  if (obj.category && obj.category.length) {
    result.push({ productType: { in: obj.category } });
  }

  if (obj.colors && obj.colors.length) {
    result.push({ colors: { some: { name: { in: obj.colors } } } });
  }

  if (obj.sizes && obj.sizes.length) {
    result.push({ sizes: { some: { key: { in: obj.sizes } } } });
  }

  if (obj.fit && obj.fit.length) {
    result.push({ attributes: { some: { value: { in: obj.fit } } } });
  }

  if (obj.sleeve && obj.sleeve.length) {
    result.push({ attributes: { some: { value: { in: obj.sleeve } } } });
  }

  if (obj.neck && obj.neck.length) {
    result.push({ attributes: { some: { value: { in: obj.neck } } } });
  }
  return result;
};

export async function GET(req: NextApiRequest) {
  try {
    console.log("\x1b[32m%s\x1b[0m", "Search API called");
    const start = Date.now();

    const url = new URL(req.url || "");
    const searchParams = Object.fromEntries(url.searchParams.entries());
    const obj = convertObject(searchParams);

    if (!obj.q) {
      return NextResponse.json({ ok: false, error: "Invalid query" });
    }

    const conditionsArr = convertFilters(obj);

    const productIds = await getProductIDs(searchParams.q);

    const result = await prisma.product.findMany({
      where: {
        id: { in: productIds },
        AND: conditionsArr,
      },
      include: {
        images: true,
        sizes: true,
        attributes: true,
        colors: true,
        category: { select: { name: true, slug: true } },
      },
    });

    const duration = Date.now() - start;
    console.log("\x1b[32m%s\x1b[0m", `Search - Database query time: ${duration} ms`);

    // set unique sub categories
    const productTypes = [...new Set(result.map((item) => item.productType))];

    // set unique product sizes
    const productSizes = [...new Set(result.map((item) => item.sizeCategory))];

    // set unique genders
    const genders = [...new Set(result.map((item) => item.genders).flat())];

    return NextResponse.json({
      ok: true,
      count: result.length,
      products: result,
      productTypes,
      productSizes,
      genders,
    });
  } catch (error: any) {
    console.error("Error -", error);
    return NextResponse.json({
      ok: false,
      error: "Something went wrong!",
    });
  }
}

// Create a text index on 'name' and 'description'
// await collection.createIndex({ name: "text", description: "text" });

// const result = await prisma.product.findRaw({
//   filter: {
//     $text: { $search: query },
//     genders: { $in: ["Male", "Unisex"] },
//   },
// });
