import Database from "better-sqlite3";
import path from "path";
import bcrypt from "bcryptjs";
import { kv } from "@vercel/kv";

export interface User {
  id: number;
  username: string;
  role: string;
  created_at: string;
  updated_at: string;
}

interface UserRecord {
  id: number;
  username: string;
  password_hash: string;
  role: string;
  created_at: string;
  updated_at: string;
}

// better-sqlite3 的实例类型（从构造函数推导，兼容 @types/better-sqlite3 的 export = 语法）
type SqliteDatabase = ReturnType<typeof Database.prototype.constructor>;

// ====== 存储后端选择 ======
// - 生产（Vercel）：检测到 KV_URL / KV_REST_API_URL 时用 Vercel KV（Redis）
// - 本地开发：用 data/hiwe.db（SQLite 文件，重启不丢）

function isKVAvailable(): boolean {
  return !!(process.env.KV_URL || process.env.KV_REST_API_URL);
}

// ====== SQLite 本地存储（开发兜底）======

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

function rowToUser(row: UserRecord): User {
  const { password_hash: _ph, ...rest } = row;
  return rest;
}

// ====== 用户 CRUD ======

// 获取所有用户（不含密码哈希）
export async function getUsers(): Promise<User[]> {
  if (isKVAvailable()) {
    // ===== Vercel KV 路径 =====
    const ids = await kv.smembers("users:ids");
    if (!ids || ids.length === 0) {
      await initDefaultAdminKV();
      return getUsers();
    }
    const usersRaw = await kv.mget(ids.map((id: string) => `user:${id}`));
    return (usersRaw as (UserRecord | null)[])
      .filter((u): u is UserRecord => u !== null && u !== undefined)
      .map(({ password_hash: _ph, ...u }) => u as User)
      .sort((a, b) => a.id - b.id);
  }

  // ===== SQLite 本地路径 =====
  const db = getDb();
  const rows = db.prepare(
    "SELECT id, username, role, created_at, updated_at FROM users ORDER BY id"
  ).all() as UserRecord[];
  return rows.map(rowToUser);
}

// 根据用户名获取用户（含密码哈希，用于登录校验）
export async function getUserByUsername(
  username: string
): Promise<(User & { password_hash: string }) | null> {
  if (isKVAvailable()) {
    const id = await kv.get<string>(`users:byname:${username}`);
    if (!id) return null;
    const user = await kv.get<UserRecord>(`user:${id}`);
    return user ?? null;
  }

  const db = getDb();
  const row = db.prepare("SELECT * FROM users WHERE username = ?").get(username) as
    | UserRecord
    | undefined;
  return row ?? null;
}

// 根据 id 获取用户
export async function getUserById(id: number): Promise<User | null> {
  if (isKVAvailable()) {
    const user = await kv.get<UserRecord>(`user:${id}`);
    if (!user) return null;
    const { password_hash: _ph, ...rest } = user;
    return rest;
  }

  const db = getDb();
  const row = db.prepare(
    "SELECT id, username, role, created_at, updated_at FROM users WHERE id = ?"
  ).get(id) as UserRecord | undefined;
  return row ? rowToUser(row) : null;
}

// 创建用户
export async function createUser(
  username: string,
  password_hash: string,
  role = "user"
): Promise<User> {
  if (isKVAvailable()) {
    const id = await kv.incr("users:next_id");
    const now = new Date().toISOString();
    const user: UserRecord = {
      id,
      username,
      password_hash,
      role,
      created_at: now,
      updated_at: now,
    };
    await kv.set(`user:${id}`, user);
    await kv.set(`users:byname:${username}`, String(id));
    await kv.sadd("users:ids", String(id));
    const { password_hash: _ph, ...rest } = user;
    return rest;
  }

  const db = getDb();
  const result = db.prepare(
    "INSERT INTO users (username, password_hash, role) VALUES (?, ?, ?)"
  ).run(username, password_hash, role);
  const newId = Number(result.lastInsertRowid);
  const row = db.prepare(
    "SELECT id, username, role, created_at, updated_at FROM users WHERE id = ?"
  ).get(newId) as UserRecord;
  return rowToUser(row);
}

// 更新用户（username / password_hash / role 任选）
export async function updateUser(
  id: number,
  fields: { username?: string; password_hash?: string; role?: string }
): Promise<void> {
  if (isKVAvailable()) {
    const user = await kv.get<UserRecord>(`user:${id}`);
    if (!user) return;
    if (fields.username) {
      await kv.del(`users:byname:${user.username}`);
      user.username = fields.username;
      await kv.set(`users:byname:${user.username}`, String(id));
    }
    if (fields.password_hash) user.password_hash = fields.password_hash;
    if (fields.role) user.role = fields.role;
    user.updated_at = new Date().toISOString();
    await kv.set(`user:${id}`, user);
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

// 删除用户（保护 admin 账号不能删）
export async function deleteUser(id: number): Promise<void> {
  if (isKVAvailable()) {
    const user = await kv.get<UserRecord>(`user:${id}`);
    if (!user || user.username === "admin") return;
    await kv.del(`users:byname:${user.username}`);
    await kv.srem("users:ids", String(id));
    await kv.del(`user:${id}`);
    return;
  }

  const db = getDb();
  const row = db.prepare("SELECT username FROM users WHERE id = ?").get(id) as
    | { username: string }
    | undefined;
  if (!row || row.username === "admin") return;
  db.prepare("DELETE FROM users WHERE id = ?").run(id);
}

// 初始化默认管理员（KV 首次启动时调用）
async function initDefaultAdminKV(): Promise<void> {
  const admin = await getUserByUsername("admin");
  if (!admin) {
    const hash = bcrypt.hashSync("admin123", 10);
    await createUser("admin", hash, "admin");
    console.log("✅ [KV] 默认管理员账号已创建：admin / admin123");
  }
}

// 兼容旧调用：本地开发由 getDb 自动初始化，KV 由 getUsers 触发
export async function initDefaultAdmin(): Promise<void> {
  if (isKVAvailable()) {
    await initDefaultAdminKV();
  } else {
    getDb();
  }
}
