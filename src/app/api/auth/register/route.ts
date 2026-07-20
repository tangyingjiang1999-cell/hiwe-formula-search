import { NextRequest, NextResponse } from "next/server";
import { createUser, getUserByUsername } from "@/lib/db";
import { hashPassword } from "@/lib/auth-helpers";
import { applyRateLimit, REGISTER_LIMIT } from "@/lib/rate-limit";

// 用户名规则：字母开头，3-20 位，仅允许字母、数字、下划线
const USERNAME_RE = /^[a-zA-Z][a-zA-Z0-9_]{2,19}$/;

export async function POST(req: NextRequest) {
  // 注册限流：每小时 3 次
  const limitRes = applyRateLimit(req, REGISTER_LIMIT);
  if (limitRes) return limitRes;
  const { username, password, confirmPassword } = await req.json();

  if (!username || !password) {
    return NextResponse.json({ error: "用户名和密码不能为空" }, { status: 400 });
  }
  if (!USERNAME_RE.test(username)) {
    return NextResponse.json(
      { error: "用户名需 3-20 位：以字母开头，仅含字母、数字、下划线" },
      { status: 400 }
    );
  }
  if (typeof password !== "string" || password.length < 8) {
    return NextResponse.json({ error: "密码至少 8 位" }, { status: 400 });
  }
  if (password !== confirmPassword) {
    return NextResponse.json({ error: "两次输入的密码不一致" }, { status: 400 });
  }

  try {
    const existing = await getUserByUsername(username);
    if (existing) {
      return NextResponse.json({ error: "该用户名已被注册" }, { status: 409 });
    }
    const hash = hashPassword(password);
    await createUser(username, hash, "user");
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "注册失败，请稍后重试" }, { status: 500 });
  }
}
