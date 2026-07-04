import { neon, neonConfig } from "@neondatabase/serverless";
import Database from "better-sqlite3";
import path from "path";
import bcrypt from "bcryptjs";

export interface User {
  id: number;
  username: string;
  role: string;
  created_at: string;
  updated_at: string;
}

interface UserRow {
  id: number;
  username: string;
  password_hash: string;
  role: string;
  created_at: string;
  updated_at: string;
}

// ====== 存储后端选择 =======
// 1. Neon Postgres（生产，POSTGRES_URL 由 Vercel 集成自动注入）
// 2. SQLite（本地开发，data/hiwe.db 持久化）

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
    await sql`
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        username TEXT NOT NULL UNIQUE,
        password_hash TEXT NOT NULL,
        role TEXT NOT NULL DEFAULT 'user',
        created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
        updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
      )
    `;
    // 默认 admin 账号（仅当表为空时）
    const countRows = (await sql`SELECT COUNT(*) as c FROM users`) as Array<{ c: number | string }>;
    if (Number(countRows[0].c) === 0) {
      const hash = bcrypt.hashSync("admin123", 10);
      await sql`
        INSERT INTO users (username, password_hash, role)
        VALUES (${"admin"}, ${hash}, ${"admin"})
      `;
      console.log("✅ [Neon] 默认管理员账号已创建：admin / admin123");
    }
  })();
  return neonInitPromise;
}

function rowToUser(row: UserRow): User {
  return {
    id: row.id,
    username: row.username,
    role: row.role,
    created_at: typeof row.created_at === "string" ? row.created_at : new Date(row.created_at).toISOString(),
    updated_at: typeof row.updated_at === "string" ? row.updated_at : new Date(row.updated_at).toISOString(),
  };
}

// ====== SQLite 本地存储 =======

type SqliteDatabase = ReturnType<typeof Database.prototype.constructor>;

let dbInstance: SqliteDatabase | null = null;

function getDb(): SqliteDatabase {
  if (dbInstance) return dbInstance;
  const dbPath = path.join(process.cwd(), "data", "hiwe.db");
  dbInstance = new Database(dbPath);
  dbInstance.pragma("journal_mode = WAL");
  dbInstance.exec(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      username TEXT NOT NULL UNIQUE,
      password_hash TEXT NOT NULL,
      role TEXT NOT NULL DEFAULT 'user',
      created_at TEXT NOT NULL DEFAULT (datetime('now', 'localtime')),
      updated_at TEXT NOT NULL DEFAULT (datetime('now', 'localtime'))
    )
  `);
  const count = dbInstance.prepare("SELECT COUNT(*) as c FROM users").get() as { c: number };
  if (count.c === 0) {
    const hash = bcrypt.hashSync("admin123", 10);
    dbInstance.prepare(
      "INSERT INTO users (username, password_hash, role) VALUES (?, ?, ?)"
    ).run("admin", hash, "admin");
    console.log("✅ [SQLite] 默认管理员账号已创建：admin / admin123");
  }
  return dbInstance;
}

// ====== 用户 CRUD ======

export async function getUsers(): Promise<User[]> {
  if (isNeonAvailable()) {
    await ensureNeonSchema();
    const rows = await getNeonSql()`
      SELECT id, username, role, created_at, updated_at
      FROM users ORDER BY id
    ` as UserRow[];
    return rows.map(rowToUser);
  }

  const db = getDb();
  const rows = db.prepare(
    "SELECT id, username, role, created_at, updated_at FROM users ORDER BY id"
  ).all() as UserRow[];
  return rows.map(rowToUser);
}

export async function getUserByUsername(
  username: string
): Promise<(User & { password_hash: string }) | null> {
  if (isNeonAvailable()) {
    await ensureNeonSchema();
    const rows = await getNeonSql()`
      SELECT * FROM users WHERE username = ${username}
    ` as UserRow[];
    return rows[0] ?? null;
  }

  const db = getDb();
  const row = db.prepare("SELECT * FROM users WHERE username = ?").get(username) as
    | UserRow
    | undefined;
  return row ?? null;
}

export async function getUserById(id: number): Promise<User | null> {
  if (isNeonAvailable()) {
    await ensureNeonSchema();
    const rows = await getNeonSql()`
      SELECT id, username, role, created_at, updated_at
      FROM users WHERE id = ${id}
    ` as UserRow[];
    return rows[0] ? rowToUser(rows[0]) : null;
  }

  const db = getDb();
  const row = db.prepare(
    "SELECT id, username, role, created_at, updated_at FROM users WHERE id = ?"
  ).get(id) as UserRow | undefined;
  return row ? rowToUser(row) : null;
}

export async function createUser(
  username: string,
  password_hash: string,
  role = "user"
): Promise<User> {
  if (isNeonAvailable()) {
    await ensureNeonSchema();
    const rows = await getNeonSql()`
      INSERT INTO users (username, password_hash, role)
      VALUES (${username}, ${password_hash}, ${role})
      RETURNING id, username, role, created_at, updated_at
    ` as UserRow[];
    return rowToUser(rows[0]);
  }

  const db = getDb();
  const result = db.prepare(
    "INSERT INTO users (username, password_hash, role) VALUES (?, ?, ?)"
  ).run(username, password_hash, role);
  const newId = Number(result.lastInsertRowid);
  const row = db.prepare(
    "SELECT id, username, role, created_at, updated_at FROM users WHERE id = ?"
  ).get(newId) as UserRow;
  return rowToUser(row);
}

export async function updateUser(
  id: number,
  fields: { username?: string; password_hash?: string; role?: string }
): Promise<void> {
  if (isNeonAvailable()) {
    await ensureNeonSchema();
    // 查询当前用户名（用于主键索引）
    const current = await getUserById(id);
    if (!current) return;
    // 用参数化 SQL 防注入，Postgres SQL 模板拼接
    if (fields.username) {
      await getNeonSql()`
        UPDATE users
        SET username = ${fields.username},
            password_hash = COALESCE(${fields.password_hash ?? null}, password_hash),
            role = COALESCE(${fields.role ?? null}, role),
            updated_at = NOW()
        WHERE id = ${id}
      `;
    } else {
      await getNeonSql()`
        UPDATE users
        SET password_hash = COALESCE(${fields.password_hash ?? null}, password_hash),
            role = COALESCE(${fields.role ?? null}, role),
            updated_at = NOW()
        WHERE id = ${id}
      `;
    }
    return;
  }

  const db = getDb();
  const sets: string[] = [];
  const values: (string | number)[] = [];
  if (fields.username) {
    sets.push("username = ?");
    values.push(fields.username);
  }
  if (fields.password_hash) {
    sets.push("password_hash = ?");
    values.push(fields.password_hash);
  }
  if (fields.role) {
    sets.push("role = ?");
    values.push(fields.role);
  }
  if (sets.length === 0) return;
  sets.push("updated_at = datetime('now', 'localtime')");
  values.push(id);
  db.prepare(`UPDATE users SET ${sets.join(", ")} WHERE id = ?`).run(...values);
}

export async function deleteUser(id: number): Promise<void> {
  if (isNeonAvailable()) {
    await ensureNeonSchema();
    // 不允许删除 admin 账号
    const target = await getUserById(id);
    if (!target || target.username === "admin") return;
    await getNeonSql()`DELETE FROM users WHERE id = ${id}`;
    return;
  }

  const db = getDb();
  const row = db.prepare("SELECT username FROM users WHERE id = ?").get(id) as
    | { username: string }
    | undefined;
  if (!row || row.username === "admin") return;
  db.prepare("DELETE FROM users WHERE id = ?").run(id);
}

export async function initDefaultAdmin(): Promise<void> {
  if (isNeonAvailable()) {
    await ensureNeonSchema();
  } else {
    getDb();
  }
}
