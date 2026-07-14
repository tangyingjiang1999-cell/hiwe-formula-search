import { NextResponse } from "next/server";
import { getFormulas } from "@/lib/db-formula";

// 公开读取接口：搜索页普通用户可访问（无需登录）
export async function GET() {
  return NextResponse.json(await getFormulas());
}
