import { NextRequest, NextResponse as NextResponseClass } from "next/server";
import jwt from "jsonwebtoken";

// JWT_SECRET：生产环境必须通过环境变量设置，开发环境使用内置 fallback
const FALLBACK_SECRET = "hiwen-mix-secret-key-dev-only";
const JWT_SECRET = process.env.JWT_SECRET || (() => {
  if (process.env.NODE_ENV === "production") {
    console.error("⚠️  JWT_SECRET 环境变量未设置！生产环境请务必配置。");
  } else {
    console.warn("⚠️  JWT_SECRET 未设置，使用开发默认密钥。生产环境请配置环境变量。");
  }
  return FALLBACK_SECRET;
})();

export interface AuthToken {
  userId: number;
  username: string;
  role: string;
}

export function signToken(user: { id: number; username: string; role: string }): string {
  return jwt.sign(
    { userId: user.id, username: user.username, role: user.role },
    JWT_SECRET,
    { expiresIn: "7d" }
  );
}

export function verifyToken(token: string): AuthToken | null {
  try {
    return jwt.verify(token, JWT_SECRET) as AuthToken;
  } catch {
    return null;
  }
}

export function getTokenFromRequest(req: NextRequest): string | null {
  const cookie = req.cookies.get("auth_token")?.value;
  if (cookie) return cookie;
  const auth = req.headers.get("Authorization");
  if (auth?.startsWith("Bearer ")) return auth.slice(7);
  return null;
}

export function setAuthCookie(res: NextResponseClass, token: string): void {
  res.cookies.set("auth_token", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 60 * 60 * 24 * 7,
    path: "/",
  });
}

export function clearAuthCookie(res: NextResponseClass): void {
  res.cookies.set("auth_token", "", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 0,
    path: "/",
  });
}

// 同步获取当前用户（从请求中提取）
export function getUserFromRequest(req: NextRequest): AuthToken | null {
  const token = getTokenFromRequest(req);
  if (!token) return null;
  return verifyToken(token);
}

// 要求认证，否则返回 401 响应
export function requireAuth(user: AuthToken | null): NextResponseClass | null {
  if (!user) {
    return new NextResponseClass(JSON.stringify({ error: "unauthenticated" }), { status: 401, headers: { "Content-Type": "application/json" } });
  }
  return null;
}

// 要求管理员权限，否则返回 403 响应
export function requireAdmin(user: AuthToken | null): NextResponseClass | null {
  const authRes = requireAuth(user);
  if (authRes) return authRes;
  if (user!.role !== "admin") {
    return new NextResponseClass(JSON.stringify({ error: "forbidden" }), { status: 403, headers: { "Content-Type": "application/json" } });
  }
  return null;
}
