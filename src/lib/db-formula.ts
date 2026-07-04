import Database from "better-sqlite3";
import path from "path";
import { kv } from "@vercel/kv";
import { mockCarMakes, mockColors, mockFormulas } from "./mock-data";
import type { CarMake, Color, Formula, AppSettings } from "@/types";

type SqliteDatabase = ReturnType<typeof Database.prototype.constructor>;

const KV_BRANDS = "formula:brands";
const KV_COLORS = "formula:colors";
const KV_FORMULAS = "formula:formulas";
const KV_SETTINGS = "formula:settings";

const DEFAULT_SETTINGS: AppSettings = {
  finishes: ["Solid", "Metallic", "Pearl", "Matte", "Candy"],
  types: ["Basecoat", "Clearcoat", "Single Stage", "Primer", "Topcoat"],
  yearMin: 1990,
  yearMax: 2026,
};

function isKVAvailable(): boolean {
  return !!(process.env.KV_URL || process.env.KV_REST_API_URL);
}

function isVercel(): boolean {
  return !!process.env.VERCEL;
}

function useSqlite(): boolean {
  return !isKVAvailable() && !isVercel();
}

// ====== SQLite 本地存储 ======

let dbInstance: SqliteDatabase | null = null;

function getDb(): SqliteDatabase {
  if (dbInstance) return dbInstance;
  const dbPath = path.join(process.cwd(), "data", "hiwe.db");
  dbInstance = new Database(dbPath);
  dbInstance.pragma("journal_mode = WAL");
  dbInstance.exec(`
    CREATE TABLE IF NOT EXISTS formula_brands (key TEXT PRIMARY KEY, value TEXT NOT NULL);
    CREATE TABLE IF NOT EXISTS formula_colors (key TEXT PRIMARY KEY, value TEXT NOT NULL);
    CREATE TABLE IF NOT EXISTS formula_formulas (key TEXT PRIMARY KEY, value TEXT NOT NULL);
    CREATE TABLE IF NOT EXISTS formula_settings (key TEXT PRIMARY KEY, value TEXT NOT NULL);
  `);
  seedSqliteIfEmpty(dbInstance);
  return dbInstance;
}

function seedSqliteIfEmpty(db: SqliteDatabase): void {
  const row = db.prepare("SELECT COUNT(*) as c FROM formula_brands").get() as { c: number };
  if (row.c === 0) {
    db.prepare("INSERT OR REPLACE INTO formula_brands (key, value) VALUES ('data', ?)").run(JSON.stringify(mockCarMakes));
    db.prepare("INSERT OR REPLACE INTO formula_colors (key, value) VALUES ('data', ?)").run(JSON.stringify(mockColors));
    db.prepare("INSERT OR REPLACE INTO formula_formulas (key, value) VALUES ('data', ?)").run(JSON.stringify(mockFormulas));
    db.prepare("INSERT OR REPLACE INTO formula_settings (key, value) VALUES ('data', ?)").run(JSON.stringify(DEFAULT_SETTINGS));
    console.log("✅ [SQLite] 配方数据已从 mock seed");
  }
}

function sqliteGet(table: string): string | null {
  const db = getDb();
  const row = db.prepare(`SELECT value FROM ${table} WHERE key = 'data'`).get() as
    | { value: string }
    | undefined;
  return row?.value ?? null;
}

function sqliteSet(table: string, value: string): void {
  const db = getDb();
  db.prepare(`INSERT OR REPLACE INTO ${table} (key, value) VALUES ('data', ?)`).run(value);
}

// ====== 内存 Map（Vercel 无 KV 时兜底）======

let memBrands: CarMake[] | null = null;
let memColors: Color[] | null = null;
let memFormulas: Formula[] | null = null;
let memSettings: AppSettings | null = null;

function seedMemFromMock(): void {
  if (!memBrands) memBrands = [...mockCarMakes];
  if (!memColors) memColors = [...mockColors];
  if (!memFormulas) memFormulas = [...mockFormulas];
  if (!memSettings) memSettings = { ...DEFAULT_SETTINGS, finishes: [...DEFAULT_SETTINGS.finishes], types: [...DEFAULT_SETTINGS.types] };
}

// ====== Brands ======
export async function getBrands(): Promise<CarMake[]> {
  if (isKVAvailable()) {
    const stored = await kv.get<string>(KV_BRANDS);
    if (stored) return JSON.parse(stored);
    await kv.set(KV_BRANDS, JSON.stringify(mockCarMakes));
    return mockCarMakes;
  }
  if (useSqlite()) {
    const stored = sqliteGet("formula_brands");
    return stored ? JSON.parse(stored) : mockCarMakes;
  }
  seedMemFromMock();
  return memBrands!;
}

export async function saveBrands(data: CarMake[]): Promise<void> {
  if (isKVAvailable()) {
    await kv.set(KV_BRANDS, JSON.stringify(data));
    return;
  }
  if (useSqlite()) {
    sqliteSet("formula_brands", JSON.stringify(data));
    return;
  }
  memBrands = [...data];
}

// ====== Colors ======
export async function getColors(): Promise<Color[]> {
  if (isKVAvailable()) {
    const stored = await kv.get<string>(KV_COLORS);
    if (stored) return JSON.parse(stored);
    await kv.set(KV_COLORS, JSON.stringify(mockColors));
    return mockColors;
  }
  if (useSqlite()) {
    const stored = sqliteGet("formula_colors");
    return stored ? JSON.parse(stored) : mockColors;
  }
  seedMemFromMock();
  return memColors!;
}

export async function saveColors(data: Color[]): Promise<void> {
  if (isKVAvailable()) {
    await kv.set(KV_COLORS, JSON.stringify(data));
    return;
  }
  if (useSqlite()) {
    sqliteSet("formula_colors", JSON.stringify(data));
    return;
  }
  memColors = [...data];
}

// ====== Formulas ======
export async function getFormulas(): Promise<Formula[]> {
  if (isKVAvailable()) {
    const stored = await kv.get<string>(KV_FORMULAS);
    if (stored) return JSON.parse(stored);
    await kv.set(KV_FORMULAS, JSON.stringify(mockFormulas));
    return mockFormulas;
  }
  if (useSqlite()) {
    const stored = sqliteGet("formula_formulas");
    return stored ? JSON.parse(stored) : mockFormulas;
  }
  seedMemFromMock();
  return memFormulas!;
}

export async function saveFormulas(data: Formula[]): Promise<void> {
  if (isKVAvailable()) {
    await kv.set(KV_FORMULAS, JSON.stringify(data));
    return;
  }
  if (useSqlite()) {
    sqliteSet("formula_formulas", JSON.stringify(data));
    return;
  }
  memFormulas = [...data];
}

// ====== Settings ======
export async function getSettings(): Promise<AppSettings> {
  if (isKVAvailable()) {
    const stored = await kv.get<string>(KV_SETTINGS);
    if (stored) return JSON.parse(stored);
    return DEFAULT_SETTINGS;
  }
  if (useSqlite()) {
    const stored = sqliteGet("formula_settings");
    return stored ? JSON.parse(stored) : DEFAULT_SETTINGS;
  }
  seedMemFromMock();
  return memSettings!;
}

export async function saveSettings(data: AppSettings): Promise<void> {
  if (isKVAvailable()) {
    await kv.set(KV_SETTINGS, JSON.stringify(data));
    return;
  }
  if (useSqlite()) {
    sqliteSet("formula_settings", JSON.stringify(data));
    return;
  }
  memSettings = { ...data, finishes: [...data.finishes], types: [...data.types] };
}

// ====== Force seed from mock data ======
export async function seedFromMockData(): Promise<void> {
  if (isKVAvailable()) {
    await kv.set(KV_BRANDS, JSON.stringify(mockCarMakes));
    await kv.set(KV_COLORS, JSON.stringify(mockColors));
    await kv.set(KV_FORMULAS, JSON.stringify(mockFormulas));
    await kv.set(KV_SETTINGS, JSON.stringify(DEFAULT_SETTINGS));
    return;
  }
  if (useSqlite()) {
    sqliteSet("formula_brands", JSON.stringify(mockCarMakes));
    sqliteSet("formula_colors", JSON.stringify(mockColors));
    sqliteSet("formula_formulas", JSON.stringify(mockFormulas));
    sqliteSet("formula_settings", JSON.stringify(DEFAULT_SETTINGS));
    return;
  }
  memBrands = [...mockCarMakes];
  memColors = [...mockColors];
  memFormulas = [...mockFormulas];
  memSettings = { ...DEFAULT_SETTINGS, finishes: [...DEFAULT_SETTINGS.finishes], types: [...DEFAULT_SETTINGS.types] };
}
