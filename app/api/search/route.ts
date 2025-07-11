import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

// Converts URLSearchParams to proper object with split values
const convertObject = (obj: Record<string, string>) => {
  const result: Record<string, string[] | string> = {};
  for (const key in obj) {
    if (key === "q") result[key] = obj[key];
    else result[key] = obj[key].replace("-", " ").split("_");
  }
  return result;
};

// Build Prisma filter conditions
const convertFilters = (obj: Record<string, string[] | string>) => {
  const filters: any[] = [];

  if (obj.gender) filters.push({ genders: { hasSome: obj.gender } });
  if (obj.category) filters.push({ productType: { in: obj.category } });
  if (obj.color) filters.push({ colors: { some: { name: { in: obj.color } } } });
  if (obj.size) filters.push({ sizes: { some: { key: { in: obj.size } } } });

  // remove key like [q, page, limit] and already handled filters
  const keysToIgnore = ["q", "page", "limit", "gender", "category", "color", "size"];
  for (const key of keysToIgnore) {
    delete obj[key];
  }

  // Handle attributes like brand, material, etc.
  for (const key of Object.keys(obj)) {
    if (obj[key]) {
      filters.push({
        attributes: {
          some: { value: { in: obj[key] } },
        },
      });
    }
  }

  return filters;
};

// Preprocess search query for PostgreSQL full-text
const preprocessSearchQuery = (query: string) => {
  return query
    .toLowerCase()
    .replace(/-/g, " ")
    .replace(/[^\w\s]/g, " ")
    .split(/\s+/)
    .filter((word) => word.length > 2)
    .map((word) => `${word}:*`)
    .join(" & ");
};

export async function GET(req: Request) {
  try {
    console.log("\x1b[32m%s\x1b[0m", "🔍 Search API called");

    const url = new URL(req.url!);
    const rawParams = Object.fromEntries(url.searchParams.entries());
    const obj = convertObject(rawParams);

    if (!obj.q || (typeof obj.q === "string" && obj.q.length < 2)) {
      return NextResponse.json({ ok: false, message: "Invalid query" }, { status: 400 });
    }

    const page = parseInt(url.searchParams.get("page") || "1");
    const limit = parseInt(url.searchParams.get("limit") || "20");
    const offset = (page - 1) * limit;

    const searchQuery = preprocessSearchQuery(obj.q as string);
    const conditions = convertFilters(obj);

    // Get matching product IDs based on full-text search
    const productIds = await prisma.$queryRaw<{ _id: string }[]>`
      SELECT _id
      FROM products
      WHERE search_vector @@ to_tsquery('english', ${searchQuery})
      ORDER BY ts_rank(search_vector, to_tsquery('english', ${searchQuery})) DESC
      LIMIT ${limit} OFFSET ${offset};
    `;

    const ids = productIds.map((p) => p._id);
    if (ids.length === 0) {
      return NextResponse.json({ ok: true, data: [], pagination: { page, limit, total: 0, totalPages: 0 } });
    }

    // Get full product data from Prisma
    const results = await prisma.product.findMany({
      where: {
        id: { in: ids },
        AND: conditions,
      },
      include: {
        images: true,
        sizes: true,
        attributes: true,
        colors: true,
        category: { select: { name: true, slug: true } },
        productType: { include: { attributes: true } },
      },
    });

    // Optional: get total count for pagination
    const total = await prisma.product.count({
      where: {
        id: { in: ids },
        AND: conditions,
      },
    });

    return NextResponse.json({
      ok: true,
      data: results,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error: any) {
    console.error("Search error:", error);
    return NextResponse.json({ ok: false, error: "Search failed. Try again later." }, { status: 500 });
  }
}
