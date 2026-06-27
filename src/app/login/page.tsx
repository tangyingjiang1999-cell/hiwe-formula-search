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
      style={{ backgroundColor: "#7DD3C0" }}
    >
      {/* 主卡片：左侧图片 + 右侧表单 */}
      <div className="flex w-full max-w-[900px] overflow-hidden rounded-[28px] bg-white shadow-sm">
        {/* ===== 左侧：Logo / 品牌区域 ===== */}
        <div
          className="hidden flex-col items-center justify-center p-10 lg:flex lg:w-[45%]"
          style={{
            background:
              "linear-gradient(145deg, #0EA5A0 0%, #14B8A6 50%, #2DD4BF 100%)",
          }}
        >
          {/* Logo */}
          <img
            src="/haiwen-logo.png"
            alt="HAIWEN"
            className="mb-6 h-28 w-auto object-contain drop-shadow-lg"
          />

          {/* 品牌文字 */}
          <h2
            className="text-center text-2xl font-semibold tracking-wide text-white"
            style={{ fontFamily: 'var(--font-outfit), "Outfit", sans-serif' }}
          >
            HAIWEN MIX
          </h2>
          <p className="mt-2 text-center text-sm text-white/80">
            Automotive Refinish Formula Search
          </p>

          {/* 装饰性元素 */}
          <div className="mt-8 flex gap-2">
            <div className="h-1 w-8 rounded-full bg-white/40" />
            <div className="h-1 w-8 rounded-full bg-white/60" />
            <div className="h-1 w-8 rounded-full bg-white" />
          </div>
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
            style={{ fontFamily: '-apple-system, "SF Pro Display", "Segoe UI", Roboto, sans-serif' }}
          >
            Welcome back
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

            {/* 登录按钮 */}
            <button
              type="submit"
              disabled={loading}
              className="mt-2 h-12 w-full rounded-xl text-base font-medium text-white transition-all active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-60"
              style={{
                backgroundColor: loading ? "#0EA5A0" : "#14B8A6",
              }}
              onMouseEnter={(e) => {
                if (!loading) e.currentTarget.style.backgroundColor = "#0D9488";
              }}
              onMouseLeave={(e) => {
                if (!loading) e.currentTarget.style.backgroundColor = "#14B8A6";
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

      {/* 底部品牌标识（桌面端显示） */}
      <div className="mt-6 hidden items-center justify-center gap-2 lg:flex">
        <div
          className="flex h-9 w-9 items-center justify-center rounded-full bg-white/20 backdrop-blur-sm"
        >
          <img
            src="/haiwen-logo.png"
            alt="HAIWEN"
            className="h-6 w-auto object-contain"
          />
        </div>
        <span
          className="text-base font-medium text-white/90"
          style={{ fontFamily: 'var(--font-outfit), "Outfit", sans-serif' }}
        >
          HAIWEN MIX
        </span>
      </div>
    </div>
  );
}
