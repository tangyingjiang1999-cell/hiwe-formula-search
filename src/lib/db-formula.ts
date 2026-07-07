import { supabase } from "./supabase-client";
import type {
  CarMake,
  Color,
  ColorVariant,
  Formula,
  FormulaComponent,
  AppSettings,
} from "@/types";

const DEFAULT_SETTINGS: AppSettings = {
  finishes: ["Solid", "Metallic", "Pearl", "Matte", "Candy"],
  types: ["Basecoat", "Clearcoat", "Single Stage", "Primer", "Topcoat"],
  yearMin: 1990,
  yearMax: 2026,
};

// ====== Brands ======

export async function getBrands(): Promise<CarMake[]> {
  const { data, error } = await supabase
    .from("brands")
    .select("*")
    .order("name", { ascending: true });
  if (error) throw error;
  return (data ?? []) as CarMake[];
}

// ====== Colors ======

export async function getColors(): Promise<Color[]> {
  const { data, error } = await supabase
    .from("colors")
    .select("*, color_variant_map(color_variants(*))")
    .order("color_code", { ascending: true });
  if (error) throw error;
  return (data ?? []).map(mapColorRow);
}

// ====== Formulas ======

export async function getFormulas(): Promise<Formula[]> {
  const { data, error } = await supabase
    .from("formulas")
    .select("*, formula_components(*)")
    .order("updated_at", { ascending: false });
  if (error) throw error;
  return (data ?? []).map(mapFormulaRow);
}

// ====== Settings ======

export async function getSettings(): Promise<AppSettings> {
  const { data, error } = await supabase
    .from("settings")
    .select("*")
    .eq("id", 1)
    .maybeSingle();
  if (error) throw error;
  if (!data) return DEFAULT_SETTINGS;
  return {
    finishes: data.finishes ?? DEFAULT_SETTINGS.finishes,
    types: data.types ?? DEFAULT_SETTINGS.types,
    yearMin: data.year_min ?? DEFAULT_SETTINGS.yearMin,
    yearMax: data.year_max ?? DEFAULT_SETTINGS.yearMax,
  };
}

// ====== 内部辅助 ======

function mapColorRow(row: Record<string, unknown>): Color {
  const map =
    (row.color_variant_map as Array<{ color_variants: ColorVariant } | null> | null) ?? [];
  const variants: ColorVariant[] = map
    .map((m) => m?.color_variants)
    .filter((v): v is ColorVariant => v != null);
  return {
    id: row.id as string,
    make_id: row.make_id as string,
    color_code: row.color_code as string,
    color_name: row.color_name as string,
    color_type: row.color_type as Color["color_type"],
    hex_preview: row.hex_preview as string,
    variants,
  };
}

function mapFormulaRow(row: Record<string, unknown>): Formula {
  const comps =
    (row.formula_components as Array<Record<string, unknown>> | null) ?? [];
  const components: FormulaComponent[] = comps.map((c) => {
    const comp: FormulaComponent = {
      toner_code: c.toner_code as string,
      toner_name: c.toner_name as string,
      percentage: Number(c.percentage),
      grams_per_100g: Number(c.grams_per_100g),
    };
    if (c.density != null) comp.density = Number(c.density);
    if (c.rgb_r != null) {
      comp.rgb_r = c.rgb_r as number;
      comp.rgb_g = c.rgb_g as number;
      comp.rgb_b = c.rgb_b as number;
    }
    return comp;
  });
  return {
    id: row.id as string,
    color_id: row.color_id as string,
    variant_id: row.variant_id as string,
    version: row.version as string,
    paint_system: row.paint_system as Formula["paint_system"],
    formula_type: row.formula_type as Formula["formula_type"],
    components,
    notes: (row.notes as string) ?? "",
    updated_at: row.updated_at as string,
  };
}
