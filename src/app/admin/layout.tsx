// Mock 阶段：管理端布局不校验权限，直接透传
export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
