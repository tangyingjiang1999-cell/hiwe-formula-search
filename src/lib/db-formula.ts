import Database from "better-sqlite3";
import path from "path";
import { kv } from "@vercel/kv";
import { mockCarMakes, mockColors, mockFormulas } from "./mock-data";
import type { CarMake, Color, Formula, AppSettings } from "@/types";

// better-sqlite3 实例类型
type SqliteDatabase = ReturnType<typeof Database.prototype.constructor>;

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

function isKVAvailable(): boolean {
  return !!(process.env.KV_URL || process.env.KV_REST_API_URL);
}

// ====== SQLite 本地持久化（开发兜底）======
// 复用 data/hiwe.db，新增 4 张表：formula_brands / formula_colors / formula_formulas / formula_settings
// 全部以 JSON 字符串形式存储（单行单列），简化 schema 与迁移

let dbInstance: SqliteDatabase | null = null;

function getDb(): SqliteDatabase {
  if (dbInstance) return dbInstance;
  const dbPath = path.join(process.cwd(), "data", "hiwe.db");
  dbInstance = new Database(dbPath);
  dbInstance.pragma("journal_mode = WAL");
  dbInstance.exec(`
    CREATE TABLE IF NOT EXISTS formula_brands (
      key TEXT PRIMARY KEY,
      value TEXT NOT NULL
    );
    CREATE TABLE IF NOT EXISTS formula_colors (
      key TEXT PRIMARY KEY,
      value TEXT NOT NULL
    );
    CREATE TABLE IF NOT EXISTS formula_formulas (
      key TEXT PRIMARY KEY,
      value TEXT NOT NULL
    );
    CREATE TABLE IF NOT EXISTS formula_settings (
      key TEXT PRIMARY KEY,
      value TEXT NOT NULL
    );
  `);
  // 首次启动 seed mock 数据
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

// ====== Brands ======
export async function getBrands(): Promise<CarMake[]> {
  if (isKVAvailable()) {
    const stored = await kv.get<string>(KV_BRANDS);
    if (stored) return JSON.parse(stored);
    await kv.set(KV_BRANDS, JSON.stringify(mockCarMakes));
    return mockCarMakes;
  }
  const stored = sqliteGet("formula_brands");
  return stored ? JSON.parse(stored) : mockCarMakes;
}

export async function saveBrands(data: CarMake[]): Promise<void> {
  if (isKVAvailable()) {
    await kv.set(KV_BRANDS, JSON.stringify(data));
    return;
  }
  sqliteSet("formula_brands", JSON.stringify(data));
}

// ====== Colors ======
export async function getColors(): Promise<Color[]> {
  if (isKVAvailable()) {
    const stored = await kv.get<string>(KV_COLORS);
    if (stored) return JSON.parse(stored);
    await kv.set(KV_COLORS, JSON.stringify(mockColors));
    return mockColors;
  }
  const stored = sqliteGet("formula_colors");
  return stored ? JSON.parse(stored) : mockColors;
}

export async function saveColors(data: Color[]): Promise<void> {
  if (isKVAvailable()) {
    await kv.set(KV_COLORS, JSON.stringify(data));
    return;
  }
  sqliteSet("formula_colors", JSON.stringify(data));
}

// ====== Formulas ======
export async function getFormulas(): Promise<Formula[]> {
  if (isKVAvailable()) {
    const stored = await kv.get<string>(KV_FORMULAS);
    if (stored) return JSON.parse(stored);
    await kv.set(KV_FORMULAS, JSON.stringify(mockFormulas));
    return mockFormulas;
  }
  const stored = sqliteGet("formula_formulas");
  return stored ? JSON.parse(stored) : mockFormulas;
}

export async function saveFormulas(data: Formula[]): Promise<void> {
  if (isKVAvailable()) {
    await kv.set(KV_FORMULAS, JSON.stringify(data));
    return;
  }
  sqliteSet("formula_formulas", JSON.stringify(data));
}

// ====== Settings ======
export async function getSettings(): Promise<AppSettings> {
  if (isKVAvailable()) {
    const stored = await kv.get<string>(KV_SETTINGS);
    if (stored) return JSON.parse(stored);
    return DEFAULT_SETTINGS;
  }
  const stored = sqliteGet("formula_settings");
  return stored ? JSON.parse(stored) : DEFAULT_SETTINGS;
}

export async function saveSettings(data: AppSettings): Promise<void> {
  if (isKVAvailable()) {
    await kv.set(KV_SETTINGS, JSON.stringify(data));
    return;
  }
  sqliteSet("formula_settings", JSON.stringify(data));
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
  sqliteSet("formula_brands", JSON.stringify(mockCarMakes));
  sqliteSet("formula_colors", JSON.stringify(mockColors));
  sqliteSet("formula_formulas", JSON.stringify(mockFormulas));
  sqliteSet("formula_settings", JSON.stringify(DEFAULT_SETTINGS));
}
