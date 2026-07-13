-- =====================================================================
-- 为 colors 表添加 car_model（车型）字段
-- 用途: 每个颜色关联一个车型（OEM 厂商的车型，如 Toyota Camry）
-- 默认 NULL，由管理员在 Data Management 后台手动回填
-- 用法: Supabase Dashboard → SQL Editor → 粘贴 → Run
-- =====================================================================

ALTER TABLE public.colors
  ADD COLUMN IF NOT EXISTS car_model TEXT;

COMMENT ON COLUMN public.colors.car_model IS '车型（OEM 厂商车型），如 Camry / Corolla';

-- 刷新 PostgREST schema cache（让 REST API 立即识别新列）
NOTIFY pgrst, 'reload schema';
