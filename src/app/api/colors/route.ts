import { NextResponse } from "next/server";
import { getColors } from "@/lib/db-formula";

// 公开读取接口：搜索页、颜色库等普通用户均可访问（无需登录）
export async function GET() {
  return NextResponse.json(await getColors());
}
