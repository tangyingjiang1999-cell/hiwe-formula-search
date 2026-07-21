import { createClient } from "@supabase/supabase-js";

// 前端可用：publishable key 公开，受 RLS 限制，仅能读取公开数据（published 产品等）。
// 写操作请走 Next.js API 路由，使用 supabase-server 中的 supabaseAdmin。
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL ?? "";
const publishableKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ?? "";

export const supabase = createClient(supabaseUrl, publishableKey);
