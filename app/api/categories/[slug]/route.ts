import { prisma } from "@/lib/prisma";
import type { NextApiRequest } from "next";
import { NextResponse } from "next/server";

const convertObject = (obj: Record<string, string>) => {
  const result: Record<string, string[]> = {};

  Object.keys(obj).forEach((key) => {
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
  if (output.color && output.color.length) {
    conditionsArr.push({ colors: { hasSome: output.color } });
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

  try {
    const start = Date.now();
    const data = await prisma.category.findUnique({
      where: { slug: slug },
      include: {
        parent: { select: { name: true, slug: true } },
        products: {
          where: {
            AND: conditionsArr,
          },
          include: { images: true, sizes: true, attributes: true },
        },
      },
    });
    const duration = Date.now() - start;
    console.log("\x1b[32m%s\x1b[0m", `Categories [id] - Database query time: ${duration} ms`);

    return NextResponse.json({
      ok: true,
      category: data,
    });
  } catch (error: any) {
    console.error(error);
    return NextResponse.json({
      ok: false,
      error: error.message,
    });
  }
}
