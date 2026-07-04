import { neon, neonConfig } from "@neondatabase/serverless";
import Database from "better-sqlite3";
import path from "path";
import { mockCarMakes, mockColors, mockFormulas } from "./mock-data";
import type { CarMake, Color, Formula, AppSettings } from "@/types";

type SqliteDatabase = ReturnType<typeof Database.prototype.constructor>;

const DEFAULT_SETTINGS: AppSettings = {
  finishes: ["Solid", "Metallic", "Pearl", "Matte", "Candy"],
  types: ["Basecoat", "Clearcoat", "Single Stage", "Primer", "Topcoat"],
  yearMin: 1990,
  yearMax: 2026,
};

function isNeonAvailable(): boolean {
  return !!process.env.POSTGRES_URL;
}

function isVercel(): boolean {
  return !!process.env.VERCEL;
}

function useSqlite(): boolean {
  return !isNeonAvailable() && !isVercel();
}

// ====== Neon Postgres =======

let neonSql: ReturnType<typeof neon> | null = null;
let neonInitPromise: Promise<void> | null = null;

function getNeonSql() {
  if (!neonSql) {
    neonConfig.fetchConnectionCache = true;
    neonSql = neon(process.env.POSTGRES_URL!);
  }
  return neonSql;
}

async function ensureNeonSchema(): Promise<void> {
  if (neonInitPromise) return neonInitPromise;
  neonInitPromise = (async () => {
    const sql = getNeonSql();
    // 单表 JSON 存储，与 SQLite 方案对齐（4 张表）
    await sql`
      CREATE TABLE IF NOT EXISTS formula_store (
        key TEXT PRIMARY KEY,
        value JSONB NOT NULL,
        updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
      )
    `;
    // 首次启动 seed mock 数据
    const countRows = (await sql`SELECT COUNT(*) as c FROM formula_store`) as Array<{ c: number | string }>;
    if (Number(countRows[0].c) === 0) {
      await sql`INSERT INTO formula_store (key, value) VALUES ('brands', ${JSON.stringify(mockCarMakes)}::jsonb)`;
      await sql`INSERT INTO formula_store (key, value) VALUES ('colors', ${JSON.stringify(mockColors)}::jsonb)`;
      await sql`INSERT INTO formula_store (key, value) VALUES ('formulas', ${JSON.stringify(mockFormulas)}::jsonb)`;
      await sql`INSERT INTO formula_store (key, value) VALUES ('settings', ${JSON.stringify(DEFAULT_SETTINGS)}::jsonb)`;
      console.log("✅ [Neon] 配方数据已从 mock seed");
    }
  })();
  return neonInitPromise;
}

// ====== SQLite 本地存储 =======

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
  const row = dbInstance.prepare("SELECT COUNT(*) as c FROM formula_brands").get() as { c: number };
  if (row.c === 0) {
    dbInstance.prepare("INSERT OR REPLACE INTO formula_brands (key, value) VALUES ('data', ?)").run(JSON.stringify(mockCarMakes));
    dbInstance.prepare("INSERT OR REPLACE INTO formula_colors (key, value) VALUES ('data', ?)").run(JSON.stringify(mockColors));
    dbInstance.prepare("INSERT OR REPLACE INTO formula_formulas (key, value) VALUES ('data', ?)").run(JSON.stringify(mockFormulas));
    dbInstance.prepare("INSERT OR REPLACE INTO formula_settings (key, value) VALUES ('data', ?)").run(JSON.stringify(DEFAULT_SETTINGS));
    console.log("✅ [SQLite] 配方数据已从 mock seed");
  }
  return dbInstance;
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
  if (isNeonAvailable()) {
    await ensureNeonSchema();
    const rows = (await getNeonSql()`SELECT value FROM formula_store WHERE key = 'brands'`) as Array<{ value: CarMake[] }>;
    return rows[0]?.value ?? mockCarMakes;
  }
  const stored = sqliteGet("formula_brands");
  return stored ? JSON.parse(stored) : mockCarMakes;
}

export async function saveBrands(data: CarMake[]): Promise<void> {
  if (isNeonAvailable()) {
    await ensureNeonSchema();
    await getNeonSql()`
      INSERT INTO formula_store (key, value, updated_at)
      VALUES ('brands', ${JSON.stringify(data)}::jsonb, NOW())
      ON CONFLICT (key) DO UPDATE SET value = EXCLUDED.value, updated_at = NOW()
    `;
    return;
  }
  sqliteSet("formula_brands", JSON.stringify(data));
}

// ====== Colors ======
export async function getColors(): Promise<Color[]> {
  if (isNeonAvailable()) {
    await ensureNeonSchema();
    const rows = (await getNeonSql()`SELECT value FROM formula_store WHERE key = 'colors'`) as Array<{ value: Color[] }>;
    return rows[0]?.value ?? mockColors;
  }
  const stored = sqliteGet("formula_colors");
  return stored ? JSON.parse(stored) : mockColors;
}

export async function saveColors(data: Color[]): Promise<void> {
  if (isNeonAvailable()) {
    await ensureNeonSchema();
    await getNeonSql()`
      INSERT INTO formula_store (key, value, updated_at)
      VALUES ('colors', ${JSON.stringify(data)}::jsonb, NOW())
      ON CONFLICT (key) DO UPDATE SET value = EXCLUDED.value, updated_at = NOW()
    `;
    return;
  }
  sqliteSet("formula_colors", JSON.stringify(data));
}

// ====== Formulas ======
export async function getFormulas(): Promise<Formula[]> {
  if (isNeonAvailable()) {
    await ensureNeonSchema();
    const rows = (await getNeonSql()`SELECT value FROM formula_store WHERE key = 'formulas'`) as Array<{ value: Formula[] }>;
    return rows[0]?.value ?? mockFormulas;
  }
  const stored = sqliteGet("formula_formulas");
  return stored ? JSON.parse(stored) : mockFormulas;
}

export async function saveFormulas(data: Formula[]): Promise<void> {
  if (isNeonAvailable()) {
    await ensureNeonSchema();
    await getNeonSql()`
      INSERT INTO formula_store (key, value, updated_at)
      VALUES ('formulas', ${JSON.stringify(data)}::jsonb, NOW())
      ON CONFLICT (key) DO UPDATE SET value = EXCLUDED.value, updated_at = NOW()
    `;
    return;
  }
  sqliteSet("formula_formulas", JSON.stringify(data));
}

// ====== Settings ======
export async function getSettings(): Promise<AppSettings> {
  if (isNeonAvailable()) {
    await ensureNeonSchema();
    const rows = (await getNeonSql()`SELECT value FROM formula_store WHERE key = 'settings'`) as Array<{ value: AppSettings }>;
    return rows[0]?.value ?? DEFAULT_SETTINGS;
  }
  const stored = sqliteGet("formula_settings");
  return stored ? JSON.parse(stored) : DEFAULT_SETTINGS;
}

export async function saveSettings(data: AppSettings): Promise<void> {
  if (isNeonAvailable()) {
    await ensureNeonSchema();
    await getNeonSql()`
      INSERT INTO formula_store (key, value, updated_at)
      VALUES ('settings', ${JSON.stringify(data)}::jsonb, NOW())
      ON CONFLICT (key) DO UPDATE SET value = EXCLUDED.value, updated_at = NOW()
    `;
    return;
  }
  sqliteSet("formula_settings", JSON.stringify(data));
}

// ====== Force seed from mock data ======
export async function seedFromMockData(): Promise<void> {
  if (isNeonAvailable()) {
    await ensureNeonSchema();
    await getNeonSql()`TRUNCATE formula_store`;
    await getNeonSql()`INSERT INTO formula_store (key, value) VALUES ('brands', ${JSON.stringify(mockCarMakes)}::jsonb)`;
    await getNeonSql()`INSERT INTO formula_store (key, value) VALUES ('colors', ${JSON.stringify(mockColors)}::jsonb)`;
    await getNeonSql()`INSERT INTO formula_store (key, value) VALUES ('formulas', ${JSON.stringify(mockFormulas)}::jsonb)`;
    await getNeonSql()`INSERT INTO formula_store (key, value) VALUES ('settings', ${JSON.stringify(DEFAULT_SETTINGS)}::jsonb)`;
    return;
  }
  sqliteSet("formula_brands", JSON.stringify(mockCarMakes));
  sqliteSet("formula_colors", JSON.stringify(mockColors));
  sqliteSet("formula_formulas", JSON.stringify(mockFormulas));
  sqliteSet("formula_settings", JSON.stringify(DEFAULT_SETTINGS));
}
