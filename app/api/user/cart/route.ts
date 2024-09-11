import { authenticate } from "@/lib/middleware/auth";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const authCheck = await authenticate(req);
  if (!authCheck.ok) {
    return NextResponse.json({ ok: false, error: authCheck.message });
  }

  return NextResponse.json({ ok: true, data: authCheck.user });
}
