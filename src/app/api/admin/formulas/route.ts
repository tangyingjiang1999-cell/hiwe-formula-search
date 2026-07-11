import { NextRequest, NextResponse } from "next/server";
import { getUserFromRequest, requireAdmin } from "@/lib/auth";
import { getFormulas, saveFormula, deleteFormula } from "@/lib/db-formula";
import type { Formula } from "@/types";

function validateFormula(body: Formula): string | null {
  if (body.paint_system === "2K" && body.formula_type !== "Single Stage") {
    return "2K 体系只能使用 Single Stage";
  }
  if (body.paint_system === "1K" && !["Two Stages", "Pearl Paint"].includes(body.formula_type)) {
    return "1K 体系只能选择 Two Stages 或 Pearl Paint";
  }
  if (body.formula_type !== "Pearl Paint") {
    const hasGroup = body.components.some((c) => c.component_group != null);
    if (hasGroup) return "非 Pearl Paint 配方不能设置 component_group";
  }
  if (body.formula_type === "Pearl Paint") {
    const missingGroup = body.components.some((c) => c.component_group == null);
    if (missingGroup) return "Pearl Paint 配方的每个色母都必须选择分组";
  }
  return null;
}

export async function GET(req: NextRequest) {
  const user = getUserFromRequest(req);
  const forbidden = requireAdmin(user);
  if (forbidden) return forbidden;
  return NextResponse.json(await getFormulas());
}

export async function POST(req: NextRequest) {
  const user = getUserFromRequest(req);
  const forbidden = requireAdmin(user);
  if (forbidden) return forbidden;
  const body = await req.json();
  if (!body.id || !body.color_id) {
    return NextResponse.json({ error: "缺少必填字段（id/color_id）" }, { status: 400 });
  }
  const validationError = validateFormula(body);
  if (validationError) {
    return NextResponse.json({ error: validationError }, { status: 400 });
  }
  const saved = await saveFormula(body);
  return NextResponse.json(saved, { status: 201 });
}

export async function PUT(req: NextRequest) {
  const user = getUserFromRequest(req);
  const forbidden = requireAdmin(user);
  if (forbidden) return forbidden;
  const body = await req.json();
  if (!body.id) {
    return NextResponse.json({ error: "缺少 ID" }, { status: 400 });
  }
  const validationError = validateFormula(body);
  if (validationError) {
    return NextResponse.json({ error: validationError }, { status: 400 });
  }
  const saved = await saveFormula(body);
  return NextResponse.json(saved);
}

export async function DELETE(req: NextRequest) {
  const user = getUserFromRequest(req);
  const forbidden = requireAdmin(user);
  if (forbidden) return forbidden;
  const body = await req.json();
  const { id } = body;
  if (!id) return NextResponse.json({ error: "缺少 ID" }, { status: 400 });
  await deleteFormula(id);
  return NextResponse.json({ success: true });
}
