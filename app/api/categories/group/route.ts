import { prisma } from "@/lib/prisma";
import type { NextApiRequest } from "next";
import { NextResponse } from "next/server";

export async function GET(req: NextApiRequest) {
  const url = new URL(req.url || "");
  const searchParams = Object.fromEntries(url.searchParams.entries());
  console.log("fetchApi called - group categories");

  const isActive = searchParams.active;
  const obj: any = {};
  if (isActive) obj["isActive"] = isActive === "true" ? true : false;

  try {
    const start = Date.now();
    const data = await prisma.groupCategory.findMany({
      where: obj,
    });
    const duration = Date.now() - start;
    console.log("\x1b[32m%s\x1b[0m", `Categories - Database query time: ${duration} ms`);

    const response = NextResponse.json({
      ok: true,
      data: data,
    });

    return response;
  } catch (error: any) {
    console.error("ERROR:", "<fetch group categories>", error);
    const errorResponse = NextResponse.json({
      ok: false,
      error: error.message,
    });
    return errorResponse;
  }
}
