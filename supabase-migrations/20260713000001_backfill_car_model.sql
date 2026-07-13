-- =====================================================================
-- 为已有 colors 填充 car_model（车型）
-- 依据 make_id 用 CASE 写入对应品牌的真实 OEM 车型
-- 仅更新 car_model 为空或 NULL 的记录，幂等可重复执行
-- 用法: Supabase Dashboard → SQL Editor → 粘贴 → Run
-- =====================================================================

UPDATE public.colors
SET car_model = CASE make_id
  WHEN 'toyota' THEN 'Camry'
  WHEN 'bmw' THEN '3 Series'
  WHEN 'mercedes' THEN 'C-Class'
  WHEN 'audi' THEN 'A4'
  WHEN 'honda' THEN 'Civic'
  WHEN 'ford' THEN 'F-150'
  WHEN 'hyundai' THEN 'Elantra'
  WHEN 'kia' THEN 'K5'
  WHEN 'volkswagen' THEN 'Passat'
  WHEN 'nissan' THEN 'Altima'
  ELSE car_model
END
WHERE car_model IS NULL OR car_model = '';

-- 刷新 PostgREST schema cache
NOTIFY pgrst, 'reload schema';
