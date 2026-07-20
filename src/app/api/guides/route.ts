import { NextResponse } from "next/server";
import { applyRateLimit, PUBLIC_LIMIT } from "@/lib/rate-limit";
import { getGuideCategories, getGuides } from "@/lib/db-guide";

// 公开读（无需登录），供 Application Guide 页面加载
export async function GET() {
  const [categories, guides] = await Promise.all([getGuideCategories(), getGuides()]);
  return NextResponse.json({ categories, guides });
}
