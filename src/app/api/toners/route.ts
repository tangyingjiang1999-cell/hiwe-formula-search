import { NextResponse } from "next/server";
import { getToners } from "@/lib/db-toner";

// 公开读取接口：色母库页面普通用户也可访问（无需登录）
export async function GET() {
  return NextResponse.json(await getToners());
}
