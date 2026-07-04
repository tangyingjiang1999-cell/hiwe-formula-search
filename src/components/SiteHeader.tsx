"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import LanguageSwitcher from "@/components/LanguageSwitcher";
import { useAuth } from "@/components/AuthContext";
import { useLang } from "@/components/LanguageContext";

interface SiteHeaderProps {
  subtitle?: string;
}

export default function SiteHeader({ subtitle }: SiteHeaderProps) {
  const { user: authUser, logout } = useAuth();
  const { t } = useLang();
  const pathname = usePathname();

  // 顶部导航链接，与 HAIWEN MIX 同行水平对齐
  const navItems: { label: string; href: string; requireAdmin?: boolean }[] = [
    { label: t.navFormulaSearch, href: "/" },
    { label: t.navColorLibrary, href: "/color-library" },
    { label: t.navAppGuide, href: "/application-guide" },
    { label: t.navAdmin, href: "/admin/formulas", requireAdmin: true },
  ];

  return (
    <header className="fixed top-0 left-0 right-0 z-50 border-b border-[#bdc9c8] bg-white/95 backdrop-blur-sm">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-10 lg:px-20">
        {/* Logo - 左侧 */}
        <Link href="/" className="flex items-center gap-3">
          <Image
            src="/haiwen.png"
            alt="HAIWEN"
            width={56}
            height={56}
            className="h-12 w-12 object-contain sm:h-14 sm:w-14"
          />
          <span className="text-lg font-bold text-[#0D9488] sm:text-xl">
            HAIWEN MIX{subtitle ? " " + subtitle : ""}
          </span>
        </Link>

        {/* 中间导航链接 - 与 HAIWEN MIX 水平对齐 */}
        <nav className="hidden md:flex items-center gap-8">
          {navItems.map((item) => {
            // 管理员功能仅 admin 角色可见
            if (item.requireAdmin && authUser?.role !== "admin") return null;
            const isActive =
              (item.href === "/" && pathname === "/") ||
              (item.href !== "/" && pathname?.startsWith(item.href));
            return (
              <Link
                key={item.label}
                href={item.href}
                className={[
                  "text-sm font-medium transition-colors",
                  isActive
                    ? "text-[#0D9488] font-semibold"
                    : "text-[#6B7280] hover:text-[#0D9488]",
                ].join(" ")}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>

        {/* Right side actions */}
        <div className="flex items-center gap-3">
          {authUser ? (
            <div className="flex items-center gap-2">
              {authUser.role === "admin" && (
                <Link
                  href="/admin/users"
                  className="rounded-lg bg-[#0D9488] px-4 py-1.5 text-sm font-semibold text-white transition-opacity hover:opacity-90"
                >
                  {authUser.username}
                </Link>
              )}
              <button
                onClick={logout}
                className="rounded-lg bg-[#0D9488] px-4 py-1.5 text-sm font-semibold text-white transition-opacity hover:opacity-90"
              >
                {t.logout}
              </button>
            </div>
          ) : (
            <Link
              href="/login"
              className="rounded-lg bg-[#0D9488] px-4 py-2 text-sm font-semibold text-white transition-opacity hover:opacity-90"
            >
              Login
            </Link>
          )}
          <LanguageSwitcher />
        </div>
      </div>
    </header>
  );
}
