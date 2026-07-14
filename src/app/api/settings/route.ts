import { NextResponse } from "next/server";
import { getSettings } from "@/lib/db-formula";

// 公开读（无需登录），供 SearchPanel 加载自定义参数
export async function GET() {
  return NextResponse.json(await getSettings());
}
