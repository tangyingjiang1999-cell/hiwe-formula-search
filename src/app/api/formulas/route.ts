import { NextRequest, NextResponse } from "next/server";
import { getUserFromRequest, requireAuth } from "@/lib/auth";
import { getFormulas } from "@/lib/db-formula";

// 公开读取接口：搜索页普通用户可访问
export async function GET(req: NextRequest) {
  const user = getUserFromRequest(req);
  const unauthorized = requireAuth(user);
  if (unauthorized) return unauthorized;

  return NextResponse.json(await getFormulas());
}
