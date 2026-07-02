import { kv } from "@vercel/kv";
import { mockCarMakes, mockColors, mockFormulas } from "./mock-data";
import type { CarMake, Color, Formula, AppSettings } from "@/types";

// KV keys
const KV_BRANDS = "formula:brands";
const KV_COLORS = "formula:colors";
const KV_FORMULAS = "formula:formulas";
const KV_SETTINGS = "formula:settings";

// Default settings
const DEFAULT_SETTINGS: AppSettings = {
  finishes: ["Solid", "Metallic", "Pearl", "Matte", "Candy"],
  types: ["Basecoat", "Clearcoat", "Single Stage", "Primer", "Topcoat"],
  yearMin: 1990,
  yearMax: 2026,
};

// --- Brands ---
export async function getBrands(): Promise<CarMake[]> {
  const stored = await kv.get<string>(KV_BRANDS);
  if (stored) return JSON.parse(stored);
  // First time: seed from mock data
  await kv.set(KV_BRANDS, JSON.stringify(mockCarMakes));
  return mockCarMakes;
}

export async function saveBrands(data: CarMake[]): Promise<void> {
  await kv.set(KV_BRANDS, JSON.stringify(data));
}

// --- Colors ---
export async function getColors(): Promise<Color[]> {
  const stored = await kv.get<string>(KV_COLORS);
  if (stored) return JSON.parse(stored);
  await kv.set(KV_COLORS, JSON.stringify(mockColors));
  return mockColors;
}

export async function saveColors(data: Color[]): Promise<void> {
  await kv.set(KV_COLORS, JSON.stringify(data));
}

// --- Formulas ---
export async function getFormulas(): Promise<Formula[]> {
  const stored = await kv.get<string>(KV_FORMULAS);
  if (stored) return JSON.parse(stored);
  await kv.set(KV_FORMULAS, JSON.stringify(mockFormulas));
  return mockFormulas;
}

export async function saveFormulas(data: Formula[]): Promise<void> {
  await kv.set(KV_FORMULAS, JSON.stringify(data));
}

// --- Settings ---
export async function getSettings(): Promise<AppSettings> {
  const stored = await kv.get<string>(KV_SETTINGS);
  if (stored) return JSON.parse(stored);
  return DEFAULT_SETTINGS;
}

export async function saveSettings(data: AppSettings): Promise<void> {
  await kv.set(KV_SETTINGS, JSON.stringify(data));
}

// --- Force seed from mock data ---
export async function seedFromMockData(): Promise<void> {
  await kv.set(KV_BRANDS, JSON.stringify(mockCarMakes));
  await kv.set(KV_COLORS, JSON.stringify(mockColors));
  await kv.set(KV_FORMULAS, JSON.stringify(mockFormulas));
  await kv.set(KV_SETTINGS, JSON.stringify(DEFAULT_SETTINGS));
}
