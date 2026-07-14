import { createClient } from "@supabase/supabase-js";

// 仅服务端使用：service_role key 自带 BYPASSRLS，可执行写操作。
// 严禁在 "use client" 组件中 import 此模块，否则 secret key 会泄露到浏览器。
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL ?? "";
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY ?? "";

export const supabaseAdmin = createClient(supabaseUrl, serviceRoleKey, {
  auth: { persistSession: false, autoRefreshToken: false },
});
