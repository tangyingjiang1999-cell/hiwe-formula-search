"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    if (!username || !password) {
      setError("请输入用户名和密码");
      return;
    }
    setLoading(true);
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        router.push("/");
        router.refresh();
      } else {
        setError(data.error || "登录失败");
      }
    } catch {
      setError("网络错误，请重试");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div
      className="flex min-h-screen items-center justify-center p-4 sm:p-6 lg:p-8"
      style={{ backgroundColor: "#f8f9fa" }}
    >
      {/* 主卡片：左侧产品图 + 右侧表单 */}
      <div className="flex w-full max-w-[920px] overflow-hidden rounded-[28px] bg-white shadow-xl shadow-black/10">
        {/* ===== 左侧：产品图片区域 ===== */}
        <div className="hidden lg:block lg:w-[45%]">
          <img
            src="/haiwen-products.jpg"
            alt="HAIWEN Products"
            className="h-full w-full object-cover"
          />
        </div>

        {/* ===== 右侧：登录表单 ===== */}
        <div className="flex w-full flex-col justify-center px-8 py-12 sm:px-12 lg:w-[55%] lg:px-14">
          {/* 移动端 Logo（仅小屏显示） */}
          <div className="mb-8 flex items-center gap-3 lg:hidden">
            <img
              src="/haiwen-logo.png"
              alt="HAIWEN"
              className="h-10 w-auto object-contain"
            />
            <span
              className="text-lg font-semibold text-gray-800"
              style={{ fontFamily: 'var(--font-outfit), "Outfit", sans-serif' }}
            >
              HAIWEN MIX
            </span>
          </div>

          {/* 标题 */}
          <h1
            className="text-[26px] font-bold leading-tight tracking-tight text-gray-900 sm:text-[30px]"
            style={{
              fontFamily: '-apple-system, "SF Pro Display", "Segoe UI", Roboto, sans-serif',
            }}
          >
            Welcome to HAIWEN
          </h1>
          <p className="mt-2 text-base text-gray-500">
            Sign in to access formula search system
          </p>

          {/* 表单 */}
          <form onSubmit={handleSubmit} className="mt-8 space-y-5">
            {/* 用户名 */}
            <div>
              <label className="mb-1.5 block text-sm font-medium text-gray-700">
                Username
              </label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Enter your username"
                autoFocus
                className="h-12 w-full rounded-xl border border-gray-200 bg-gray-50/50 px-4 text-[15px] text-gray-900 outline-none transition-all placeholder:text-gray-400 focus:border-teal-500 focus:bg-white focus:ring-2 focus:ring-teal-500/20"
              />
            </div>

            {/* 密码 */}
            <div>
              <label className="mb-1.5 block text-sm font-medium text-gray-700">
                Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                className="h-12 w-full rounded-xl border border-gray-200 bg-gray-50/50 px-4 text-[15px] text-gray-900 outline-none transition-all placeholder:text-gray-400 focus:border-teal-500 focus:bg-white focus:ring-2 focus:ring-teal-500/20"
              />
            </div>

            {/* 错误提示 */}
            {error && (
              <div className="rounded-lg border border-red-100 bg-red-50 px-4 py-3 text-sm text-red-600">
                {error}
              </div>
            )}

            {/* 登录按钮 - 使用渐变色系中的 teal */}
            <button
              type="submit"
              disabled={loading}
              className="mt-2 h-12 w-full rounded-xl text-base font-medium text-white transition-all active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-60"
              style={{
                backgroundColor: loading ? "#1FA8AD" : "#23a3b3",
              }}
              onMouseEnter={(e) => {
                if (!loading) e.currentTarget.style.backgroundColor = "#1c8a98";
              }}
              onMouseLeave={(e) => {
                if (!loading) e.currentTarget.style.backgroundColor = "#23a3b3";
              }}
            >
              {loading ? "Signing in..." : "Sign In"}
            </button>
          </form>

          {/* 底部信息 */}
          <p className="mt-8 text-center text-xs text-gray-400">
            Authorized users only &middot; HAIWEN MIX &copy; {new Date().getFullYear()}
          </p>
        </div>
      </div>
    </div>
  );
}
