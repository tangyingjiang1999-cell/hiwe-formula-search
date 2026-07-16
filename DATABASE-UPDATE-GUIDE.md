# 📋 Supabase 数据库更新指南

## 执行顺序（请按顺序执行）

### ✅ 第 1 步：添加配方类型和组件分组字段
**文件**: `supabase-migrations/20260711000000_formula_type_and_component_group.sql`
**作用**: 
- 为 formulas 表添加 formula_type 字段
- 为 toner_components 表添加 component_group 字段

### ✅ 第 2 步：添加车型字段
**文件**: `supabase-migrations/20260713000000_colors_car_model.sql`
**作用**: 为 colors 表添加 car_model 字段

### ✅ 第 3 步：回填车型数据
**文件**: `supabase-migrations/20260713000001_backfill_car_model.sql`
**作用**: 为现有颜色记录填充车型信息

### ✅ 第 4 步：优化车型数据
**文件**: `supabase-migrations/20260713000002_backfill_car_model_v2.sql`
**作用**: 改进车型数据格式

### ✅ 第 5 步：插入测试数据
**文件**: `supabase-seed-20-colors.sql`
**作用**: 
- 插入 10 个汽车品牌
- 插入 20 个测试颜色
- 插入对应的配方
- 插入色母组件数据

## 执行方式

打开 Supabase Dashboard → SQL Editor → 逐个文件粘贴执行

每执行一个文件后，等待成功提示再执行下一个。

## 验证

执行完成后运行：
```sql
SELECT COUNT(*) as total_colors FROM colors;
SELECT COUNT(*) as total_formulas FROM formulas;
SELECT COUNT(*) as total_brands FROM brands;
```

预期结果：colors=20, formulas=20, brands=10
