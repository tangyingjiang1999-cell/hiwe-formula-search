import { NextRequest, NextResponse } from "next/server";
import { getTokenFromRequest, verifyToken, requireAdmin } from "@/lib/auth";
import { getUsers, getUserById, updateUser } from "@/lib/db";
import { hashPassword } from "@/lib/auth-helpers";

function getUser(req: NextRequest): { userId: number; username: string; role: string } | null {
  const token = getTokenFromRequest(req);
  if (!token) return null;
  return verifyToken(token);
}

export async function GET(req: NextRequest) {
  const user = getUser(req);
  const forbidden = requireAdmin(user);
  if (forbidden) return forbidden;

  return NextResponse.json(await getUsers());
}

export async function POST(req: NextRequest) {
  const user = getUser(req);
  const forbidden = requireAdmin(user);
  if (forbidden) return forbidden;

  return NextResponse.json({ error: "当前模式不支持创建用户" }, { status: 501 });
}

export async function PUT(req: NextRequest) {
  const user = getUser(req);
  const forbidden = requireAdmin(user);
  if (forbidden) return forbidden;

  const body = await req.json();
  const { id, userId, password, newPassword } = body;
  const targetUserId = userId || id;
  const targetNewPassword = newPassword || password;

  if (!targetUserId || !targetNewPassword) {
    return NextResponse.json({ error: "缺少必要参数" }, { status: 400 });
  }

  // 验证目标用户存在
  const targetUser = await getUserById(targetUserId);
  if (!targetUser) {
    return NextResponse.json({ error: "用户不存在" }, { status: 404 });
  }

  // 更新密码（bcrypt 加密存储）
  const password_hash = hashPassword(targetNewPassword);
  await updateUser(targetUserId, { password_hash });

  return NextResponse.json({ success: true, message: "密码修改成功" });
}

export async function DELETE(req: NextRequest) {
  const user = getUser(req);
  const forbidden = requireAdmin(user);
  if (forbidden) return forbidden;

  return NextResponse.json({ error: "当前模式不支持删除用户" }, { status: 501 });
}
