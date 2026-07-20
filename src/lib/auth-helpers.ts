import bcrypt from "bcryptjs";
import { getUserByUsername, createUser } from "@/lib/db";

// 验证密码（使用 bcryptjs 比较）
export function verifyPassword(password: string, hash: string): boolean {
  return bcrypt.compareSync(password, hash);
}

export function hashPassword(password: string): string {
  return bcrypt.hashSync(password, 10);
}

// 初始化默认管理员账号（首次运行时调用）
export async function initDefaultAdmin(): Promise<void> {
  const user = await getUserByUsername("admin");
  if (!user) {
    const hash = hashPassword("admin123");
    await createUser("admin", hash, "admin");
    if (process.env.NODE_ENV !== "production") {
      console.log("✅ 默认管理员账号已创建（仅开发环境）");
    }
  }
}
