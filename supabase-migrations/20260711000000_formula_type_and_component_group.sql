-- =====================================================================
-- 迁移：配方类型精简 + 色母组件分组
-- 说明:
--   1. 将 formula_type 限制为三种：Single Stage / Two Stages / Pearl Paint
--   2. 历史非新类型值全部迁移为 Single Stage
--   3. formula_components 新增 component_group 列，仅 Pearl Paint 使用
-- 用法: Supabase Dashboard → SQL Editor → 粘贴 → Run
-- =====================================================================

-- 1. 更新 formulas.formula_type 约束并迁移历史数据
ALTER TABLE public.formulas
  DROP CONSTRAINT IF EXISTS formulas_formula_type_check;

UPDATE public.formulas
  SET formula_type = 'Single Stage'
  WHERE formula_type NOT IN ('Single Stage', 'Two Stages', 'Pearl Paint');

ALTER TABLE public.formulas
  ADD CONSTRAINT formulas_formula_type_check
  CHECK (formula_type IN ('Single Stage', 'Two Stages', 'Pearl Paint'));

-- 2. formula_components 新增 component_group 列
ALTER TABLE public.formula_components
  ADD COLUMN IF NOT EXISTS component_group TEXT
  CHECK (component_group IN ('Pearl Paint', 'Ground Paint'));

-- 3. 刷新 PostgREST schema cache
NOTIFY pgrst, 'reload schema';
