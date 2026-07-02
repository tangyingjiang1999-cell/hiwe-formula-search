import { NextRequest, NextResponse } from "next/server";
import { getTokenFromRequest, verifyToken, requireAdmin } from "@/lib/auth";
import { seedFromMockData } from "@/lib/db-formula";

export async function POST(req: NextRequest) {
  const token = getTokenFromRequest(req);
  if (!token) return NextResponse.json({ error: "unauthenticated" }, { status: 401 });
  const user = verifyToken(token);
  const forbidden = requireAdmin(user);
  if (forbidden) return forbidden;

  await seedFromMockData();
  return NextResponse.json({ success: true, message: "Data seeded from mock data" });
}
