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

// ====== 存储后端选择（三层兜底）======
// 1. Vercel KV（生产持久化，需配置 KV_URL）
// 2. 内存 Map（Vercel 无 KV 时兜底，重启丢失但至少能用）
// 3. SQLite（本地开发，data/hiwe.db 持久化）

function isKVAvailable(): boolean {
  return !!(process.env.KV_URL || process.env.KV_REST_API_URL);
}

function isVercel(): boolean {
  return !!process.env.VERCEL;
}

// ====== SQLite 本地存储 ======

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

// ====== 内存 Map（Vercel 无 KV 时兜底）======

let localNextId = 1;
const localUsers = new Map<number, UserRecord>();
const localUserByName = new Map<string, number>();
const localUserIds = new Set<string>();

function initLocalDefaultAdmin() {
  if (localUserByName.has("admin")) return;
  const hash = bcrypt.hashSync("admin123", 10);
  const now = new Date().toISOString();
  const admin: UserRecord = {
    id: 1,
    username: "admin",
    password_hash: hash,
    role: "admin",
    created_at: now,
    updated_at: now,
  };
  localUsers.set(1, admin);
  localUserByName.set("admin", 1);
  localUserIds.add("1");
  localNextId = 2;
}

// 判断用 SQLite 还是内存 Map
function useSqlite(): boolean {
  return !isKVAvailable() && !isVercel();
}

// ====== 用户 CRUD ======

export async function getUsers(): Promise<User[]> {
  if (isKVAvailable()) {
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

  if (useSqlite()) {
    const db = getDb();
    const rows = db.prepare(
      "SELECT id, username, role, created_at, updated_at FROM users ORDER BY id"
    ).all() as UserRecord[];
    return rows.map(rowToUser);
  }

  // Vercel 无 KV → 内存 Map
  if (localUserIds.size === 0) initLocalDefaultAdmin();
  const users: User[] = [];
  for (const [, user] of localUsers) {
    const { password_hash: _ph, ...rest } = user;
    users.push(rest as User);
  }
  return users.sort((a, b) => a.id - b.id);
}

export async function getUserByUsername(
  username: string
): Promise<(User & { password_hash: string }) | null> {
  if (isKVAvailable()) {
    const id = await kv.get<string>(`users:byname:${username}`);
    if (!id) return null;
    const user = await kv.get<UserRecord>(`user:${id}`);
    return user ?? null;
  }

  if (useSqlite()) {
    const db = getDb();
    const row = db.prepare("SELECT * FROM users WHERE username = ?").get(username) as
      | UserRecord
      | undefined;
    return row ?? null;
  }

  if (localUserIds.size === 0) initLocalDefaultAdmin();
  const id = localUserByName.get(username);
  if (id === undefined) return null;
  return localUsers.get(id) ?? null;
}

export async function getUserById(id: number): Promise<User | null> {
  if (isKVAvailable()) {
    const user = await kv.get<UserRecord>(`user:${id}`);
    if (!user) return null;
    const { password_hash: _ph, ...rest } = user;
    return rest;
  }

  if (useSqlite()) {
    const db = getDb();
    const row = db.prepare(
      "SELECT id, username, role, created_at, updated_at FROM users WHERE id = ?"
    ).get(id) as UserRecord | undefined;
    return row ? rowToUser(row) : null;
  }

  const user = localUsers.get(id);
  if (!user) return null;
  const { password_hash: _ph, ...rest } = user;
  return rest;
}

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

  if (useSqlite()) {
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

  // 内存 Map
  if (localUserIds.size === 0) initLocalDefaultAdmin();
  if (localUserByName.has(username)) {
    throw new Error("用户名已存在");
  }
  const id = localNextId++;
  const now = new Date().toISOString();
  const user: UserRecord = {
    id,
    username,
    password_hash,
    role,
    created_at: now,
    updated_at: now,
  };
  localUsers.set(id, user);
  localUserByName.set(username, id);
  localUserIds.add(String(id));
  const { password_hash: _ph, ...rest } = user;
  return rest;
}

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

  if (useSqlite()) {
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
    return;
  }

  // 内存 Map
  const user = localUsers.get(id);
  if (!user) return;
  if (fields.username) {
    localUserByName.delete(user.username);
    user.username = fields.username;
    localUserByName.set(user.username, id);
  }
  if (fields.password_hash) user.password_hash = fields.password_hash;
  if (fields.role) user.role = fields.role;
  user.updated_at = new Date().toISOString();
}

export async function deleteUser(id: number): Promise<void> {
  if (isKVAvailable()) {
    const user = await kv.get<UserRecord>(`user:${id}`);
    if (!user || user.username === "admin") return;
    await kv.del(`users:byname:${user.username}`);
    await kv.srem("users:ids", String(id));
    await kv.del(`user:${id}`);
    return;
  }

  if (useSqlite()) {
    const db = getDb();
    const row = db.prepare("SELECT username FROM users WHERE id = ?").get(id) as
      | { username: string }
      | undefined;
    if (!row || row.username === "admin") return;
    db.prepare("DELETE FROM users WHERE id = ?").run(id);
    return;
  }

  // 内存 Map
  const user = localUsers.get(id);
  if (!user || user.username === "admin") return;
  localUserByName.delete(user.username);
  localUserIds.delete(String(id));
  localUsers.delete(id);
}

async function initDefaultAdminKV(): Promise<void> {
  const admin = await getUserByUsername("admin");
  if (!admin) {
    const hash = bcrypt.hashSync("admin123", 10);
    await createUser("admin", hash, "admin");
    console.log("✅ [KV] 默认管理员账号已创建：admin / admin123");
  }
}

export async function initDefaultAdmin(): Promise<void> {
  if (isKVAvailable()) {
    await initDefaultAdminKV();
  } else if (useSqlite()) {
    getDb();
  } else {
    initLocalDefaultAdmin();
  }
}
