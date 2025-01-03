"use server";

import { delhiveryURL } from "@/constants/shipment_urls";
import { NextApiRequest } from "next";
import { NextResponse } from "next/server";

export async function GET(req: NextApiRequest) {
  try {
    const url = new URL(req.url || "");
    const searchParams = Object.fromEntries(url.searchParams.entries());
    const { code } = searchParams;
    if (!code) {
      return NextResponse.json({
        ok: false,
        error: "pincode is required",
      });
    }

    const res = await fetch(`${delhiveryURL.checkPincode}${code}`, {
      method: "GET",
      headers: { "Content-Type": "application/json", authorization: `Token ${process.env.DELHIVERY_API_KEY}` },
    }).then((res) => res.json());

    if (!res || !res.delivery_codes?.length) {
      return NextResponse.json({
        ok: false,
        error: "Delivery not available",
      });
    }

    return NextResponse.json({ ok: true, message: "Delivery available", data: res.delivery_codes[0].postal_code });
  } catch (error: any) {
    console.log("error -", error);
    return NextResponse.json({
      ok: false,
      error: "something went wrong!",
    });
  }
}
