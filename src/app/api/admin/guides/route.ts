import { NextRequest, NextResponse } from "next/server";
import { getUserFromRequest, requireAdmin } from "@/lib/auth";
import { applyRateLimit, ADMIN_LIMIT } from "@/lib/rate-limit";
import { getGuides, saveGuide, deleteGuide } from "@/lib/db-guide";
import type { Guide } from "@/types";

export async function GET(req: NextRequest) {
  // 管理后台限流：每分钟 60 次
  const limitRes_GET = applyRateLimit(req, ADMIN_LIMIT);
  if (limitRes_GET) return limitRes_GET;
  const user = getUserFromRequest(req);
  const forbidden = requireAdmin(user);
  if (forbidden) return forbidden;
  return NextResponse.json(await getGuides());
}

export async function POST(req: NextRequest) {
  // 管理后台限流：每分钟 60 次
  const limitRes_POST = applyRateLimit(req, ADMIN_LIMIT);
  if (limitRes_POST) return limitRes_POST;
  const user = getUserFromRequest(req);
  const forbidden = requireAdmin(user);
  if (forbidden) return forbidden;
  let body: Guide;
  try { body = await req.json(); } catch { return NextResponse.json({ error: "请求格式错误" }, { status: 400 }); }
  if (!body.id || !body.categoryId || !body.title || !body.titleZh) {
    return NextResponse.json({ error: "缺少必填字段（id/categoryId/title/titleZh）" }, { status: 400 });
  }
  const saved = await saveGuide(body);
  return NextResponse.json(saved, { status: 201 });
}

export async function PUT(req: NextRequest) {
  // 管理后台限流：每分钟 60 次
  const limitRes_PUT = applyRateLimit(req, ADMIN_LIMIT);
  if (limitRes_PUT) return limitRes_PUT;
  const user = getUserFromRequest(req);
  const forbidden = requireAdmin(user);
  if (forbidden) return forbidden;
  let body: Guide;
  try { body = await req.json(); } catch { return NextResponse.json({ error: "请求格式错误" }, { status: 400 }); }
  if (!body.id) {
    return NextResponse.json({ error: "缺少 ID" }, { status: 400 });
  }
  const saved = await saveGuide(body);
  return NextResponse.json(saved);
}

export async function DELETE(req: NextRequest) {
  // 管理后台限流：每分钟 60 次
  const limitRes_DELETE = applyRateLimit(req, ADMIN_LIMIT);
  if (limitRes_DELETE) return limitRes_DELETE;
  const user = getUserFromRequest(req);
  const forbidden = requireAdmin(user);
  if (forbidden) return forbidden;
  let body: { id?: string };
  try { body = await req.json(); } catch { return NextResponse.json({ error: "请求格式错误" }, { status: 400 }); }
  const { id } = body;
  if (!id) return NextResponse.json({ error: "缺少 ID" }, { status: 400 });
  await deleteGuide(id);
  return NextResponse.json({ success: true });
}
