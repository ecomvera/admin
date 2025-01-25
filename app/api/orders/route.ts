import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    console.log("\x1b[32m%s\x1b[0m", "Orders api called!");
    const orders = await prisma.order.findMany({
      include: { items: { select: { quantity: true, product: { select: { name: true, slug: true } } } } },
    });
    return NextResponse.json({ ok: true, data: orders });
  } catch (error) {
    console.log("error -", error);
    return NextResponse.json({ ok: false, error: "something went wrong!" });
  }
}
