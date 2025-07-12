import { convertObject } from "@/lib/api-filters";
import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";
export const dynamic = "force-dynamic";

// fetch filters based on the category or globally
export async function GET(req: NextRequest) {
  try {
    console.log("\x1b[32m%s\x1b[0m", "Filters api called!");

    const { searchParams } = new URL(req.url);
    const obj = convertObject(Object.fromEntries(searchParams.entries()));

    // @ts-ignore
    const garmentTypeArr: string[] = obj.garment_type;
    // @ts-ignore
    const wearTypeArr: string[] = obj.wear_type;

    console.log(garmentTypeArr, wearTypeArr);

    let attributes;
    let sizes;
    let colors;

    // If category is provided, fetch filters for that category
    if (garmentTypeArr) {
      attributes = await prisma.attribute.findMany({
        where: { productType: { name: { in: garmentTypeArr } } },
      });
    } else {
      attributes = await prisma.attribute.findMany();
    }

    // If wear type is provided, fetch sizes for that category
    if (wearTypeArr) {
      sizes = (
        await prisma.size.findMany({
          where: { type: { in: wearTypeArr } },
        })
      ).reverse();
    } else {
      sizes = (await prisma.size.findMany()).reverse(); // Reverse to maintain order
    }

    // Fetch colors globally
    // This can be optimized later if needed
    colors = await prisma.color.findMany();

    const response = NextResponse.json({
      ok: true,
      data: { attributes, sizes, colors },
    });
    return response;
  } catch (error: any) {
    console.log("error -", error);
    return NextResponse.json({
      ok: false,
      error: "something went wrong!",
    });
  }
}
