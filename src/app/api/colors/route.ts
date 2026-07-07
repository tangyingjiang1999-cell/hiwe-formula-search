import { NextRequest, NextResponse } from "next/server";
import { getUserFromRequest, requireAuth } from "@/lib/auth";
import { getColors } from "@/lib/db-formula";

// 公开读取接口：搜索页、颜色库等普通用户均可访问
export async function GET(req: NextRequest) {
  const user = getUserFromRequest(req);
  const unauthorized = requireAuth(user);
  if (unauthorized) return unauthorized;

  return NextResponse.json(await getColors());
}
