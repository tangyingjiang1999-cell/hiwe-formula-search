// ============================================================
// 国际化文案 Barrel — 按语言拆分，此处合并导出
// ============================================================

import type { I18nDict } from './_helpers';

// 导入各语言文案（已通过 dict() 处理，类型完整）
import dict_en from './en';
import dict_zh from './zh';
import dict_fr from './fr';
import dict_de from './de';
import dict_es from './es';
import dict_pt from './pt';
import dict_it from './it';
import dict_ru from './ru';
import dict_sl from './sl';
import dict_tr from './tr';
import dict_he from './he';
import dict_ar from './ar';
import dict_nl from './nl';

export type Lang = "en" | "zh" | "fr" | "ru" | "ar" | "es" | "pt" | "it" | "sl" | "he" | "de" | "tr" | "nl";

// 语言元信息：显示名、国旗 ISO 代码（用于 SVG 图标）、文本方向
export interface LangMeta {
  code: Lang;
  name: string;
  flag: string;
  dir: "ltr" | "rtl";
}

export const LANGS: LangMeta[] = [
  { code: "en", name: "English",   flag: "GB", dir: "ltr" },
  { code: "zh", name: "中文",      flag: "CN", dir: "ltr" },
  { code: "fr", name: "Français",  flag: "FR", dir: "ltr" },
  { code: "de", name: "Deutsch",   flag: "DE", dir: "ltr" },
  { code: "es", name: "Español",   flag: "ES", dir: "ltr" },
  { code: "pt", name: "Português", flag: "PT", dir: "ltr" },
  { code: "it", name: "Italiano",  flag: "IT", dir: "ltr" },
  { code: "ru", name: "Русский",   flag: "RU", dir: "ltr" },
  { code: "sl", name: "Slovenščina", flag: "SI", dir: "ltr" },
  { code: "tr", name: "Türkçe",    flag: "TR", dir: "ltr" },
  { code: "he", name: "עברית",     flag: "IL", dir: "rtl" },
  { code: "ar", name: "العربية",   flag: "SA", dir: "rtl" },
];

export const i18n: Record<Lang, I18nDict> = {
  en: dict_en,
  zh: dict_zh,
  fr: dict_fr,
  de: dict_de,
  es: dict_es,
  pt: dict_pt,
  it: dict_it,
  ru: dict_ru,
  sl: dict_sl,
  tr: dict_tr,
  he: dict_he,
  ar: dict_ar,
  nl: dict_nl,
};
