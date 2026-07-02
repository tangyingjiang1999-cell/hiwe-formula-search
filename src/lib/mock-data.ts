import {
  CarMake,
  Color,
  ColorVariant,
  Formula,
  FormulaComponent,
  SearchParams,
  SearchResult,
} from "../types";

// ============================================================
// 车辆品牌 — 10 大主流品牌
// ============================================================
export const mockCarMakes: CarMake[] = [
  { id: "toyota",    name: "Toyota",        region: "JPN" },
  { id: "honda",     name: "Honda",         region: "JPN" },
  { id: "bmw",       name: "BMW",           region: "EUR" },
  { id: "mercedes",  name: "Mercedes-Benz", region: "EUR" },
  { id: "audi",      name: "Audi",          region: "EUR" },
  { id: "lexus",     name: "Lexus",         region: "JPN" },
  { id: "nissan",    name: "Nissan",        region: "JPN" },
  { id: "ford",      name: "Ford",          region: "USA" },
  { id: "chevrolet", name: "Chevrolet",     region: "USA" },
  { id: "volkswagen", name: "Volkswagen",   region: "EUR" },
];

// ============================================================
// 颜色变体（每个变体有年份范围和适用车型）
// ============================================================
const v_std      = { id: "v_std",      name: "Standard",       year_range: "2020-2026" };
const v_pearl    = { id: "v_pearl",    name: "Pearl Effect",   year_range: "2020-2026" };
const v_metallic = { id: "v_metallic", name: "Metallic Finish", year_range: "2018-2026" };
const v_premium  = { id: "v_premium",  name: "Premium",        year_range: "2022-2026" };
const v_classic  = { id: "v_classic",  name: "Classic",        year_range: "2010-2024" };

// ============================================================
// 颜色 — 40 个 OEM 颜色代码（来自 formula-search db.json）
// ============================================================
export const mockColors: Color[] = [
  // ---- Toyota (5) ----
  { id: "col_toy_040",    make_id: "toyota", color_code: "040",    color_name: "Super White / 超白",                      color_type: "solid",    hex_preview: "#F8F8F5", variants: [v_std] },
  { id: "col_toy_070",    make_id: "toyota", color_code: "070",    color_name: "Blizzard Pearl / 珍珠白",                 color_type: "pearl",    hex_preview: "#F0F0E8", variants: [v_std, v_pearl] },
  { id: "col_toy_202",    make_id: "toyota", color_code: "202",    color_name: "Black / 纯黑",                            color_type: "solid",    hex_preview: "#1A1A1A", variants: [v_std, v_classic] },
  { id: "col_toy_1G3",    make_id: "toyota", color_code: "1G3",    color_name: "Magnetic Gray Metallic / 金属灰",         color_type: "metallic", hex_preview: "#7A7E82", variants: [v_std, v_metallic] },
  { id: "col_toy_3R3",    make_id: "toyota", color_code: "3R3",    color_name: "Barcelona Red Metallic / 金属红",         color_type: "metallic", hex_preview: "#C12B2B", variants: [v_std, v_pearl] },

  // ---- Honda (4) ----
  { id: "col_hon_NH731P", make_id: "honda",  color_code: "NH731P", color_name: "Crystal Black Pearl / 晶黑珍珠",           color_type: "pearl",    hex_preview: "#1B1B1F", variants: [v_std, v_pearl] },
  { id: "col_hon_NH883P", make_id: "honda",  color_code: "NH883P", color_name: "Platinum White Pearl / 铂金白",           color_type: "pearl",    hex_preview: "#EFEFEA", variants: [v_std, v_pearl] },
  { id: "col_hon_B593M",  make_id: "honda",  color_code: "B593M",  color_name: "Modern Steel Metallic / 现代钢",           color_type: "metallic", hex_preview: "#828588", variants: [v_std, v_metallic] },
  { id: "col_hon_R513",   make_id: "honda",  color_code: "R513",   color_name: "Rallye Red / 拉力红",                     color_type: "solid",    hex_preview: "#DA0B1E", variants: [v_std] },

  // ---- BMW (4) ----
  { id: "col_bmw_300",    make_id: "bmw",    color_code: "300",    color_name: "Alpine White / 阿尔卑斯白",               color_type: "solid",    hex_preview: "#F9F9F5", variants: [v_std] },
  { id: "col_bmw_475",    make_id: "bmw",    color_code: "475",    color_name: "Black Sapphire Metallic / 宝石黑",        color_type: "metallic", hex_preview: "#1C1C1E", variants: [v_std, v_premium] },
  { id: "col_bmw_C31",    make_id: "bmw",    color_code: "C31",    color_name: "Portimao Blue Metallic / 波尔蒂芒蓝",      color_type: "metallic", hex_preview: "#1E4B8C", variants: [v_std, v_premium] },
  { id: "col_bmw_P7S",    make_id: "bmw",    color_code: "P7S",    color_name: "San Marino Blue / 圣马力诺蓝",             color_type: "special",  hex_preview: "#0D3B6E", variants: [v_premium] },

  // ---- Mercedes-Benz (4) ----
  { id: "col_merc_040",   make_id: "mercedes", color_code: "040",  color_name: "Black / 黑色",                            color_type: "solid",    hex_preview: "#16181A", variants: [v_std, v_classic] },
  { id: "col_merc_149",   make_id: "mercedes", color_code: "149",  color_name: "Polar White / 极地白",                    color_type: "solid",    hex_preview: "#F6F7F3", variants: [v_std] },
  { id: "col_merc_775",   make_id: "mercedes", color_code: "775",  color_name: "Iridium Silver Metallic / 铱银色",        color_type: "metallic", hex_preview: "#C0C4C8", variants: [v_std, v_metallic] },
  { id: "col_merc_996",   make_id: "mercedes", color_code: "996",  color_name: "Hyacinth Red Metallic / 风信子红",        color_type: "metallic", hex_preview: "#8B2228", variants: [v_metallic] },

  // ---- Audi (4) ----
  { id: "col_audi_LY9Y",  make_id: "audi",   color_code: "LY9Y",   color_name: "Glacier White Metallic / 冰川白",         color_type: "metallic", hex_preview: "#F3F4F0", variants: [v_std, v_metallic] },
  { id: "col_audi_LZ5B",  make_id: "audi",   color_code: "LZ5B",   color_name: "Mythos Black Metallic / 神话黑",          color_type: "metallic", hex_preview: "#151618", variants: [v_std, v_premium] },
  { id: "col_audi_LY7W",  make_id: "audi",   color_code: "LY7W",   color_name: "Navarra Blue Metallic / 纳瓦拉蓝",        color_type: "metallic", hex_preview: "#1A3A6E", variants: [v_std, v_premium] },
  { id: "col_audi_LZ3N",  make_id: "audi",   color_code: "LZ3N",   color_name: "Tango Red Metallic / 探戈红",             color_type: "metallic", hex_preview: "#B71C1C", variants: [v_std] },

  // ---- Lexus (4) ----
  { id: "col_lex_083",    make_id: "lexus",  color_code: "083",    color_name: "Eminent White Pearl / 珍珠白",            color_type: "pearl",    hex_preview: "#F2F1EC", variants: [v_std, v_pearl] },
  { id: "col_lex_212",    make_id: "lexus",  color_code: "212",    color_name: "Obsidian / 曜黑",                         color_type: "solid",    hex_preview: "#121316", variants: [v_std] },
  { id: "col_lex_1J4",    make_id: "lexus",  color_code: "1J4",    color_name: "Atomic Silver / 原子银",                  color_type: "metallic", hex_preview: "#B4B8BC", variants: [v_std, v_metallic, v_premium] },
  { id: "col_lex_3T5",    make_id: "lexus",  color_code: "3T5",    color_name: "Infrared / 红外",                         color_type: "candy",    hex_preview: "#C41E1E", variants: [v_premium] },

  // ---- Nissan (4) ----
  { id: "col_nis_QAB",    make_id: "nissan", color_code: "QAB",    color_name: "Pearl White / 珍珠白",                    color_type: "pearl",    hex_preview: "#F4F3EF", variants: [v_std, v_pearl] },
  { id: "col_nis_GAG",    make_id: "nissan", color_code: "GAG",    color_name: "Gun Metallic / 枪灰金属",                 color_type: "metallic", hex_preview: "#7D8185", variants: [v_std, v_metallic] },
  { id: "col_nis_NAH",    make_id: "nissan", color_code: "NAH",    color_name: "Scarlet Ember / 炽焰红",                  color_type: "candy",    hex_preview: "#B51C1C", variants: [v_std, v_premium] },
  { id: "col_nis_K23",    make_id: "nissan", color_code: "K23",    color_name: "Phoenix Orange / 凤凰橙",                 color_type: "candy",    hex_preview: "#E85D04", variants: [v_premium] },

  // ---- Ford (4) ----
  { id: "col_frd_YZ",     make_id: "ford",   color_code: "YZ",     color_name: "Oxford White / 牛津白",                   color_type: "solid",    hex_preview: "#F9F9F4", variants: [v_std, v_classic] },
  { id: "col_frd_UA",     make_id: "ford",   color_code: "UA",     color_name: "Absolute Black / 至尊黑",                 color_type: "solid",    hex_preview: "#131416", variants: [v_std] },
  { id: "col_frd_RR",     make_id: "ford",   color_code: "RR",     color_name: "Race Red / 竞速红",                       color_type: "solid",    hex_preview: "#D4081A", variants: [v_std, v_classic] },
  { id: "col_frd_FM",     make_id: "ford",   color_code: "FM",     color_name: "Iconic Silver Metallic / 标志银",         color_type: "metallic", hex_preview: "#AAADB1", variants: [v_std, v_metallic] },

  // ---- Chevrolet (3) ----
  { id: "col_chv_GAZ",    make_id: "chevrolet", color_code: "GAZ", color_name: "Summit White / 顶峰白",                 color_type: "solid",    hex_preview: "#F7F8F4", variants: [v_std] },
  { id: "col_chv_GBA",    make_id: "chevrolet", color_code: "GBA", color_name: "Black / 黑色",                           color_type: "solid",    hex_preview: "#15171A", variants: [v_std, v_classic] },
  { id: "col_chv_G7Q",    make_id: "chevrolet", color_code: "G7Q", color_name: "Red Hot / 热力红",                       color_type: "solid",    hex_preview: "#D4121E", variants: [v_std] },

  // ---- Volkswagen (4) ----
  { id: "col_vw_LB9A",    make_id: "volkswagen", color_code: "LB9A", color_name: "Pure White / 纯白",                  color_type: "solid",    hex_preview: "#F7F8F4", variants: [v_std, v_classic] },
  { id: "col_vw_L041",    make_id: "volkswagen", color_code: "L041", color_name: "Deep Black Pearl / 深黑珍珠",         color_type: "pearl",    hex_preview: "#191A1D", variants: [v_std, v_metallic] },
  { id: "col_vw_LH5X",    make_id: "volkswagen", color_code: "LH5X", color_name: "Atlantic Blue Metallic / 大西洋蓝",    color_type: "metallic", hex_preview: "#2A4A7E", variants: [v_std, v_metallic] },
  { id: "col_vw_LN1Z",    make_id: "volkswagen", color_code: "LN1Z", color_name: "Indium Gray Metallic / 铟灰",          color_type: "metallic", hex_preview: "#8A8D90", variants: [v_metallic] },
];

// ============================================================
// 配方色母组件辅助函数
// ============================================================
function comp(
  toner_code: string,
  toner_name: string,
  grams_per_100g: number,
  density?: number,
  rgb?: [number, number, number],
): FormulaComponent {
  return {
    toner_code,
    toner_name,
    grams_per_100g,
    percentage: grams_per_100g,
    ...(density != null ? { density } : {}),
    ...(rgb != null ? { rgb_r: rgb[0], rgb_g: rgb[1], rgb_b: rgb[2] } : {}),
  };
}

// ============================================================
// 调漆配方 — 覆盖主流颜色，含多个变体
// ============================================================
export const mockFormulas: Formula[] = [
  // ---- Toyota ----
  {
    id: "fml_toy_040", color_id: "col_toy_040", variant_id: v_std.id,
    version: "v1.0", paint_system: "2K", formula_type: "Basecoat",
    components: [
      comp("HW-2001", "Titanium White / 钛白",      60.0, 1.85, [255,255,255]),
      comp("HW-3001", "Black / 黑色",                 0.5, 1.10, [30,30,30]),
      comp("HW-5002", "Yellow Oxide / 氧化黄",        1.5, 1.40, [200,180,50]),
      comp("HW-9001", "Binder Resin / 树脂黏合剂",   38.0, 1.05, [240,240,240]),
    ],
    notes: "建议喷涂2遍底色，遮盖力优秀",
    updated_at: "2024-06-15",
  },
  {
    id: "fml_toy_070_std", color_id: "col_toy_070", variant_id: v_std.id,
    version: "v1.1", paint_system: "2K", formula_type: "Basecoat",
    components: [
      comp("HW-2001", "Titanium White / 钛白",       55.0, 1.85, [255,255,255]),
      comp("HW-2103", "Pearl White / 珍珠白",        12.0, 1.60, [245,240,230]),
      comp("HW-3001", "Black / 黑色",                 0.8, 1.10, [30,30,30]),
      comp("HW-5002", "Yellow Oxide / 氧化黄",        2.2, 1.40, [200,180,50]),
      comp("HW-9001", "Binder Resin / 树脂黏合剂",   30.0, 1.05, [240,240,240]),
    ],
    notes: "珍珠白需喷涂3遍底色 + 1遍清漆，侧视角度珍珠光泽明显",
    updated_at: "2024-07-20",
  },
  {
    id: "fml_toy_1G3", color_id: "col_toy_1G3", variant_id: v_std.id,
    version: "v1.0", paint_system: "2K", formula_type: "Basecoat",
    components: [
      comp("HW-2001", "Titanium White / 钛白",       35.0, 1.85, [255,255,255]),
      comp("HW-3001", "Black / 黑色",                15.0, 1.10, [30,30,30]),
      comp("HW-4101", "Metallic Flake Fine / 细银粉",  8.0, 2.20, [200,200,205]),
      comp("HW-5003", "Red Oxide / 氧化红",           0.8, 1.50, [180,60,40]),
      comp("HW-5002", "Yellow Oxide / 氧化黄",        1.2, 1.40, [200,180,50]),
      comp("HW-9001", "Binder Resin / 树脂黏合剂",   40.0, 1.05, [240,240,240]),
    ],
    notes: "中灰金属色，细银粉需均匀分散避免发花",
    updated_at: "2024-05-10",
  },
  {
    id: "fml_toy_3R3", color_id: "col_toy_3R3", variant_id: v_std.id,
    version: "v1.2", paint_system: "2K", formula_type: "Basecoat",
    components: [
      comp("HW-5001", "Bright Red / 亮红",           45.0, 1.55, [220,25,20]),
      comp("HW-5003", "Red Oxide / 氧化红",           8.0, 1.50, [180,60,40]),
      comp("HW-5004", "Magenta / 品红",               5.0, 1.45, [200,20,80]),
      comp("HW-4101", "Metallic Flake Fine / 细银粉",  3.0, 2.20, [200,200,205]),
      comp("HW-9001", "Binder Resin / 树脂黏合剂",   39.0, 1.05, [240,240,240]),
    ],
    notes: "金属红色，铝粉排列影响最终颜色，注意喷涂手法",
    updated_at: "2024-08-10",
  },

  // ---- Honda ----
  {
    id: "fml_hon_NH731P", color_id: "col_hon_NH731P", variant_id: v_std.id,
    version: "v1.3", paint_system: "2K", formula_type: "Basecoat",
    components: [
      comp("HW-3001", "Black / 黑色",                50.0, 1.10, [30,30,30]),
      comp("HW-3102", "Carbon Black / 碳黑",          8.0, 1.15, [20,20,25]),
      comp("HW-2101", "Pearl Blue / 珍珠蓝",          6.0, 1.60, [30,50,120]),
      comp("HW-2102", "Pearl Green / 珍珠绿",         2.0, 1.55, [20,80,60]),
      comp("HW-9001", "Binder Resin / 树脂黏合剂",   34.0, 1.05, [240,240,240]),
    ],
    notes: "在强光下珍珠蓝绿色颗粒可见，建议喷涂2遍底色 + 清漆",
    updated_at: "2024-07-18",
  },
  {
    id: "fml_hon_R513", color_id: "col_hon_R513", variant_id: v_std.id,
    version: "v1.0", paint_system: "2K", formula_type: "Basecoat",
    components: [
      comp("HW-5001", "Bright Red / 亮红",           52.0, 1.55, [220,25,20]),
      comp("HW-5003", "Red Oxide / 氧化红",           8.0, 1.50, [180,60,40]),
      comp("HW-5004", "Magenta / 品红",               5.0, 1.45, [200,20,80]),
      comp("HW-9001", "Binder Resin / 树脂黏合剂",   35.0, 1.05, [240,240,240]),
    ],
    notes: "遮盖力偏弱，建议使用同色中涂底漆",
    updated_at: "2024-04-28",
  },

  // ---- BMW ----
  {
    id: "fml_bmw_475", color_id: "col_bmw_475", variant_id: v_std.id,
    version: "v2.0", paint_system: "2K", formula_type: "Basecoat",
    components: [
      comp("HW-3001", "Black / 黑色",                42.0, 1.10, [30,30,30]),
      comp("HW-3102", "Carbon Black / 碳黑",         10.0, 1.15, [20,20,25]),
      comp("HW-4101", "Metallic Flake Fine / 细银粉",  3.0, 2.20, [200,200,205]),
      comp("HW-4202", "Blue Shade / 蓝相调节",        5.0, 1.30, [20,40,90]),
      comp("HW-9001", "Binder Resin / 树脂黏合剂",   40.0, 1.05, [240,240,240]),
    ],
    notes: "细银粉需均匀分散，避免发花",
    updated_at: "2024-06-01",
  },
  {
    id: "fml_bmw_C31", color_id: "col_bmw_C31", variant_id: v_std.id,
    version: "v1.0", paint_system: "2K", formula_type: "Basecoat",
    components: [
      comp("HW-4001", "Ultramarine Blue / 群青蓝",   35.0, 1.50, [25,40,140]),
      comp("HW-4010", "Phthalo Blue / 酞菁蓝",       18.0, 1.55, [15,30,120]),
      comp("HW-4101", "Metallic Flake Fine / 细银粉",  4.0, 2.20, [200,200,205]),
      comp("HW-3001", "Black / 黑色",                 5.0, 1.10, [30,30,30]),
      comp("HW-9001", "Binder Resin / 树脂黏合剂",   38.0, 1.05, [240,240,240]),
    ],
    notes: "蓝色系银粉需低速搅拌防止发黑",
    updated_at: "2024-08-22",
  },
  {
    id: "fml_bmw_P7S", color_id: "col_bmw_P7S", variant_id: v_premium.id,
    version: "v1.0", paint_system: "2K", formula_type: "Clearcoat",
    components: [
      comp("HW-4001", "Ultramarine Blue / 群青蓝",   30.0, 1.50, [25,40,140]),
      comp("HW-4015", "Violet Shade / 紫相调节",      8.0, 1.35, [80,20,130]),
      comp("HW-4102", "Metallic Flake Medium / 中银粉", 3.5, 2.25, [195,195,200]),
      comp("HW-3001", "Black / 黑色",                 4.0, 1.10, [30,30,30]),
      comp("HW-9001", "Binder Resin / 树脂黏合剂",   54.5, 1.05, [240,240,240]),
    ],
    notes: "Individual 特殊漆，紫相饱满，需清漆层增亮",
    updated_at: "2024-09-05",
  },

  // ---- Mercedes-Benz ----
  {
    id: "fml_merc_775", color_id: "col_merc_775", variant_id: v_std.id,
    version: "v1.5", paint_system: "2K", formula_type: "Basecoat",
    components: [
      comp("HW-2001", "Titanium White / 钛白",       30.0, 1.85, [255,255,255]),
      comp("HW-4102", "Metallic Flake Medium / 中银粉", 16.0, 2.25, [195,195,200]),
      comp("HW-3001", "Black / 黑色",                 1.5, 1.10, [30,30,30]),
      comp("HW-5003", "Red Oxide / 氧化红",            0.5, 1.50, [180,60,40]),
      comp("HW-9001", "Binder Resin / 树脂黏合剂",   52.0, 1.05, [240,240,240]),
    ],
    notes: "银粉含量较高，施工时注意持枪角度保持一致",
    updated_at: "2024-05-10",
  },
  {
    id: "fml_merc_996", color_id: "col_merc_996", variant_id: v_metallic.id,
    version: "v1.1", paint_system: "2K", formula_type: "Basecoat",
    components: [
      comp("HW-5001", "Bright Red / 亮红",           38.0, 1.55, [220,25,20]),
      comp("HW-5003", "Red Oxide / 氧化红",          12.0, 1.50, [180,60,40]),
      comp("HW-5004", "Magenta / 品红",               6.0, 1.45, [200,20,80]),
      comp("HW-4101", "Metallic Flake Fine / 细银粉",  4.0, 2.20, [200,200,205]),
      comp("HW-9001", "Binder Resin / 树脂黏合剂",   40.0, 1.05, [240,240,240]),
    ],
    notes: "金属红，需多次薄喷确保均匀",
    updated_at: "2024-07-15",
  },

  // ---- Audi ----
  {
    id: "fml_audi_LZ5B", color_id: "col_audi_LZ5B", variant_id: v_std.id,
    version: "v1.0", paint_system: "2K", formula_type: "Basecoat",
    components: [
      comp("HW-3001", "Black / 黑色",                44.0, 1.10, [30,30,30]),
      comp("HW-3102", "Carbon Black / 碳黑",          9.0, 1.15, [20,20,25]),
      comp("HW-4101", "Metallic Flake Fine / 细银粉",  5.0, 2.20, [200,200,205]),
      comp("HW-4202", "Blue Shade / 蓝相调节",        3.0, 1.30, [20,40,90]),
      comp("HW-9001", "Binder Resin / 树脂黏合剂",   39.0, 1.05, [240,240,240]),
    ],
    notes: "浓郁黑色金属效果，清漆后光泽度极佳",
    updated_at: "2024-09-20",
  },
  {
    id: "fml_audi_LY7W", color_id: "col_audi_LY7W", variant_id: v_std.id,
    version: "v1.0", paint_system: "2K", formula_type: "Basecoat",
    components: [
      comp("HW-4010", "Phthalo Blue / 酞菁蓝",       34.0, 1.55, [15,30,120]),
      comp("HW-4003", "Indanthrone Blue / 阴丹士林蓝", 14.0, 1.50, [20,35,125]),
      comp("HW-4101", "Metallic Flake Fine / 细银粉",  4.0, 2.20, [200,200,205]),
      comp("HW-3001", "Black / 黑色",                 4.0, 1.10, [30,30,30]),
      comp("HW-9001", "Binder Resin / 树脂黏合剂",   44.0, 1.05, [240,240,240]),
    ],
    notes: "深蓝金属色，2遍底色 + 1遍清漆",
    updated_at: "2024-08-30",
  },
  {
    id: "fml_audi_LZ3N", color_id: "col_audi_LZ3N", variant_id: v_std.id,
    version: "v1.0", paint_system: "2K", formula_type: "Single Stage",
    components: [
      comp("HW-5001", "Bright Red / 亮红",           40.0, 1.55, [220,25,20]),
      comp("HW-5003", "Red Oxide / 氧化红",          10.0, 1.50, [180,60,40]),
      comp("HW-5004", "Magenta / 品红",               5.0, 1.45, [200,20,80]),
      comp("HW-4102", "Metallic Flake Medium / 中银粉", 5.0, 2.25, [195,195,200]),
      comp("HW-9001", "Binder Resin / 树脂黏合剂",   40.0, 1.05, [240,240,240]),
    ],
    notes: "单工序金属红，一次成型效率高",
    updated_at: "2024-10-05",
  },

  // ---- Lexus ----
  {
    id: "fml_lex_083", color_id: "col_lex_083", variant_id: v_std.id,
    version: "v1.0", paint_system: "2K", formula_type: "Basecoat",
    components: [
      comp("HW-2001", "Titanium White / 钛白",       52.0, 1.85, [255,255,255]),
      comp("HW-2103", "Pearl White / 珍珠白",        14.0, 1.60, [245,240,230]),
      comp("HW-3001", "Black / 黑色",                 0.5, 1.10, [30,30,30]),
      comp("HW-5002", "Yellow Oxide / 氧化黄",        1.5, 1.40, [200,180,50]),
      comp("HW-9001", "Binder Resin / 树脂黏合剂",   32.0, 1.05, [240,240,240]),
    ],
    notes: "凌志标志性珍珠白，3遍底色 + 清漆",
    updated_at: "2024-06-28",
  },
  {
    id: "fml_lex_1J4", color_id: "col_lex_1J4", variant_id: v_std.id,
    version: "v1.0", paint_system: "2K", formula_type: "Basecoat",
    components: [
      comp("HW-2001", "Titanium White / 钛白",       32.0, 1.85, [255,255,255]),
      comp("HW-3001", "Black / 黑色",                 8.0, 1.10, [30,30,30]),
      comp("HW-4102", "Metallic Flake Medium / 中银粉", 14.0, 2.25, [195,195,200]),
      comp("HW-4101", "Metallic Flake Fine / 细银粉",   4.0, 2.20, [200,200,205]),
      comp("HW-9001", "Binder Resin / 树脂黏合剂",   42.0, 1.05, [240,240,240]),
    ],
    notes: "原子银金属质感极强，中细银粉搭配呈现深度层次",
    updated_at: "2024-07-22",
  },

  // ---- Nissan ----
  {
    id: "fml_nis_NAH", color_id: "col_nis_NAH", variant_id: v_std.id,
    version: "v1.0", paint_system: "2K", formula_type: "Basecoat",
    components: [
      comp("HW-5001", "Bright Red / 亮红",           42.0, 1.55, [220,25,20]),
      comp("HW-5003", "Red Oxide / 氧化红",          10.0, 1.50, [180,60,40]),
      comp("HW-5004", "Magenta / 品红",               6.0, 1.45, [200,20,80]),
      comp("HW-5002", "Yellow Oxide / 氧化黄",        2.0, 1.40, [200,180,50]),
      comp("HW-9001", "Binder Resin / 树脂黏合剂",   40.0, 1.05, [240,240,240]),
    ],
    notes: "炽焰糖果红，层次感强，需3遍底色",
    updated_at: "2024-08-15",
  },
  {
    id: "fml_nis_K23", color_id: "col_nis_K23", variant_id: v_premium.id,
    version: "v1.0", paint_system: "2K", formula_type: "Basecoat",
    components: [
      comp("HW-5001", "Bright Red / 亮红",           30.0, 1.55, [220,25,20]),
      comp("HW-5002", "Yellow Oxide / 氧化黄",       18.0, 1.40, [200,180,50]),
      comp("HW-5003", "Red Oxide / 氧化红",           8.0, 1.50, [180,60,40]),
      comp("HW-5006", "Orange / 橙色",                6.0, 1.45, [240,120,20]),
      comp("HW-9001", "Binder Resin / 树脂黏合剂",   38.0, 1.05, [240,240,240]),
    ],
    notes: "凤凰橙糖果色，色彩鲜艳饱满，需清漆保护",
    updated_at: "2024-09-10",
  },

  // ---- Ford ----
  {
    id: "fml_frd_RR", color_id: "col_frd_RR", variant_id: v_std.id,
    version: "v1.0", paint_system: "2K", formula_type: "Single Stage",
    components: [
      comp("HW-5001", "Bright Red / 亮红",           55.0, 1.55, [220,25,20]),
      comp("HW-5003", "Red Oxide / 氧化红",           5.0, 1.50, [180,60,40]),
      comp("HW-5004", "Magenta / 品红",               5.0, 1.45, [200,20,80]),
      comp("HW-9001", "Binder Resin / 树脂黏合剂",   35.0, 1.05, [240,240,240]),
    ],
    notes: "单工序纯红，浓烈醒目，福特标志色",
    updated_at: "2024-05-20",
  },
  {
    id: "fml_frd_FM", color_id: "col_frd_FM", variant_id: v_std.id,
    version: "v1.0", paint_system: "2K", formula_type: "Basecoat",
    components: [
      comp("HW-2001", "Titanium White / 钛白",       28.0, 1.85, [255,255,255]),
      comp("HW-3001", "Black / 黑色",                 6.0, 1.10, [30,30,30]),
      comp("HW-4102", "Metallic Flake Medium / 中银粉", 14.0, 2.25, [195,195,200]),
      comp("HW-4101", "Metallic Flake Fine / 细银粉",   6.0, 2.20, [200,200,205]),
      comp("HW-9001", "Binder Resin / 树脂黏合剂",   46.0, 1.05, [240,240,240]),
    ],
    notes: "标志性银色金属，中细银粉搭配，遮盖力强",
    updated_at: "2024-06-05",
  },

  // ---- Chevrolet ----
  {
    id: "fml_chv_G7Q", color_id: "col_chv_G7Q", variant_id: v_std.id,
    version: "v1.0", paint_system: "2K", formula_type: "Basecoat",
    components: [
      comp("HW-5001", "Bright Red / 亮红",           54.0, 1.55, [220,25,20]),
      comp("HW-5003", "Red Oxide / 氧化红",           6.0, 1.50, [180,60,40]),
      comp("HW-5004", "Magenta / 品红",               4.0, 1.45, [200,20,80]),
      comp("HW-9001", "Binder Resin / 树脂黏合剂",   36.0, 1.05, [240,240,240]),
    ],
    notes: "热力红高饱和度，2遍底色即可",
    updated_at: "2024-04-15",
  },

  // ---- Volkswagen ----
  {
    id: "fml_vw_L041_std", color_id: "col_vw_L041", variant_id: v_std.id,
    version: "v1.2", paint_system: "2K", formula_type: "Basecoat",
    components: [
      comp("HW-3001", "Black / 黑色",                 48.0, 1.10, [30,30,30]),
      comp("HW-3102", "Carbon Black / 碳黑",          8.0, 1.15, [20,20,25]),
      comp("HW-2101", "Pearl Blue / 珍珠蓝",          5.0, 1.60, [30,50,120]),
      comp("HW-2102", "Pearl Green / 珍珠绿",         1.0, 1.55, [20,80,60]),
      comp("HW-9001", "Binder Resin / 树脂黏合剂",   38.0, 1.05, [240,240,240]),
    ],
    notes: "标准黑珍珠效果，阳光下泛蓝绿光泽",
    updated_at: "2024-07-05",
  },
  {
    id: "fml_vw_LH5X", color_id: "col_vw_LH5X", variant_id: v_std.id,
    version: "v1.0", paint_system: "2K", formula_type: "Basecoat",
    components: [
      comp("HW-4010", "Phthalo Blue / 酞菁蓝",       30.0, 1.55, [15,30,120]),
      comp("HW-4003", "Indanthrone Blue / 阴丹士林蓝", 15.0, 1.50, [20,35,125]),
      comp("HW-4101", "Metallic Flake Fine / 细银粉",  5.0, 2.20, [200,200,205]),
      comp("HW-3001", "Black / 黑色",                 4.0, 1.10, [30,30,30]),
      comp("HW-5003", "Red Oxide / 氧化红",            1.0, 1.50, [180,60,40]),
      comp("HW-9001", "Binder Resin / 树脂黏合剂",   45.0, 1.05, [240,240,240]),
    ],
    notes: "标准配方，2遍底色即可",
    updated_at: "2024-06-28",
  },
  {
    id: "fml_vw_LN1Z", color_id: "col_vw_LN1Z", variant_id: v_metallic.id,
    version: "v1.0", paint_system: "2K", formula_type: "Basecoat",
    components: [
      comp("HW-2001", "Titanium White / 钛白",       25.0, 1.85, [255,255,255]),
      comp("HW-3001", "Black / 黑色",                10.0, 1.10, [30,30,30]),
      comp("HW-4102", "Metallic Flake Medium / 中银粉", 12.0, 2.25, [195,195,200]),
      comp("HW-4101", "Metallic Flake Fine / 细银粉",   8.0, 2.20, [200,200,205]),
      comp("HW-5003", "Red Oxide / 氧化红",            0.5, 1.50, [180,60,40]),
      comp("HW-9001", "Binder Resin / 树脂黏合剂",   44.5, 1.05, [240,240,240]),
    ],
    notes: "铟灰色金属质感，中细银粉混合呈现科技感灰调",
    updated_at: "2024-08-08",
  },
];

// ============================================================
// 搜索函数：按品牌、颜色代码、颜色名称、类型、年份模糊匹配
// ============================================================
export function getMockSearchResults(params: SearchParams): SearchResult[] {
  let filteredColors = mockColors;

  if (params.make_id) {
    filteredColors = filteredColors.filter(
      (c) => c.make_id === params.make_id,
    );
  }

  if (params.color_code) {
    const code = params.color_code.toUpperCase();
    filteredColors = filteredColors.filter((c) =>
      c.color_code.toUpperCase().includes(code),
    );
  }

  if (params.color_name) {
    const name = params.color_name.toLowerCase();
    filteredColors = filteredColors.filter((c) =>
      c.color_name.toLowerCase().includes(name),
    );
  }

  if (params.color_type) {
    filteredColors = filteredColors.filter(
      (c) => c.color_type === params.color_type,
    );
  }

  if (params.year) {
    filteredColors = filteredColors.filter((c) =>
      c.variants.some((v) => v.year_range.includes(params.year!)),
    );
  }

  return filteredColors.map((color) => ({
    color,
    formulas: mockFormulas.filter((f) => f.color_id === color.id),
  }));
}
