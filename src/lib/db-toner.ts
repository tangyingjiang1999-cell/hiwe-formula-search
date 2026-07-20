// ============================================================
// 色母数据访问层 — 读操作用 anon client，写操作用 supabaseAdmin
// ============================================================
import { supabase } from "./supabase-client";
import { supabaseAdmin } from "./supabase-server";
import type { Toner } from "@/types";

// ====== 读（anon，受 RLS SELECT 策略保护） ======

export async function getToners(): Promise<Toner[]> {
  const { data, error } = await supabase
    .from("toners")
    .select("*")
    .order("code", { ascending: true });
  if (error) throw error;
  return (data ?? []).map(mapTonerRow);
}

// ====== 写（supabaseAdmin，BYPASSRLS，仅服务端 API 调用） ======

export async function saveToner(toner: Toner): Promise<Toner> {
  const row = toTonerRow(toner);
  const { data, error } = await supabaseAdmin
    .from("toners")
    .upsert(row)
    .select()
    .single();
  if (error) throw error;
  return mapTonerRow(data as Record<string, unknown>);
}

export async function deleteToner(code: string): Promise<void> {
  const { error } = await supabaseAdmin.from("toners").delete().eq("code", code);
  if (error) throw error;
}

/** 批量种子数据 — 首次导入使用（幂等：ON CONFLICT DO NOTHING 需在 SQL 中配合） */
export async function seedToners(toners: Toner[]): Promise<void> {
  const rows = toners.map(toTonerRow);
  const { error } = await supabaseAdmin.from("toners").upsert(rows, {
    onConflict: "code",
    ignoreDuplicates: true,
  });
  if (error) throw error;
}

// ====== 内部映射（snake_case → camelCase） ======

function mapTonerRow(row: Record<string, unknown>): Toner {
  return {
    code: row.code as string,
    tradeName: row.trade_name as string,
    nameZh: row.name_zh as string,
    category: row.category as Toner["category"],
    hex: (row.hex as string) ?? "#FFFFFF",
  };
}

function toTonerRow(toner: Toner): Record<string, unknown> {
  return {
    code: toner.code,
    trade_name: toner.tradeName,
    name_zh: toner.nameZh,
    category: toner.category,
    hex: toner.hex,
  };
}
