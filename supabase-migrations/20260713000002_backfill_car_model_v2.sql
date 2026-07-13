-- =====================================================================
-- 车型回填（写死随机映射）
-- 每个品牌预定义 3-5 个真实车型池
-- 同品牌下不同颜色随机分配一个车型
-- 仅更新 car_model 为空或 NULL 的记录（幂等可重复执行）
-- 用法: Supabase Dashboard → SQL Editor → 粘贴 → Run
-- =====================================================================

UPDATE public.colors
SET car_model = (CASE make_id
  WHEN 'toyota' THEN (ARRAY['Camry','Corolla','RAV4','Highlander','Sienna'])[1 + floor(random() * 5)::int]
  WHEN 'bmw' THEN (ARRAY['3 Series','5 Series','X3','X5'])[1 + floor(random() * 4)::int]
  WHEN 'mercedes' THEN (ARRAY['C-Class','E-Class','GLC','A-Class'])[1 + floor(random() * 4)::int]
  WHEN 'audi' THEN (ARRAY['A4','A6','Q5','Q3'])[1 + floor(random() * 4)::int]
  WHEN 'honda' THEN (ARRAY['Civic','Accord','CR-V','HR-V'])[1 + floor(random() * 4)::int]
  WHEN 'ford' THEN (ARRAY['F-150','Mustang','Explorer','Escape'])[1 + floor(random() * 4)::int]
  WHEN 'hyundai' THEN (ARRAY['Elantra','Sonata','Tucson','Kona'])[1 + floor(random() * 4)::int]
  WHEN 'kia' THEN (ARRAY['K5','Sportage','Sorento','Forte'])[1 + floor(random() * 4)::int]
  WHEN 'volkswagen' THEN (ARRAY['Passat','Tiguan','Golf','Jetta'])[1 + floor(random() * 4)::int]
  WHEN 'nissan' THEN (ARRAY['Altima','Sentra','Rogue','Pathfinder'])[1 + floor(random() * 4)::int]
  ELSE car_model
END)
WHERE car_model IS NULL OR car_model = '';

-- 刷新 PostgREST schema cache
NOTIFY pgrst, 'reload schema';
