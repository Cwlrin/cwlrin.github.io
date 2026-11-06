import i18next from "i18next";
import themeConfig from "@/theme.config";
import { DEFAULT_LOCALE, resolveLocale, type ResolvedLocale } from "@/toolkit/i18n/resolveLocale";

// Import translation files
import zhCN from "./locales/zh-CN.json";
import zhTW from "./locales/zh-TW.json";
import ja from "./locales/ja.json";
import en from "./locales/en.json";

// Type for supported locales
export type Locale = ResolvedLocale;

// 以 en 为键名基准：所有语言文件必须与 en 的键结构兼容。
// 编译期防线——任何语言从 en 中缺失键（或结构不一）都会直接报错。
// 注意：satisfies 只校验单向（各语言 ⊆ en），反向独有键由测试
// src/i18n/locales-consistency.test.ts 兜底。
type LocaleMessages = typeof en;

// Resources type
const resources = {
  "zh-CN": { translation: zhCN },
  "zh-TW": { translation: zhTW },
  ja: { translation: ja },
  en: { translation: en },
} as const satisfies Record<ResolvedLocale, { translation: LocaleMessages }>;

// Get current locale from theme config
export const currentLocale = resolveLocale(themeConfig.locale);

/**
 * Initialize i18n with the locale from theme config
 */
export async function initI18n(locale: Locale = DEFAULT_LOCALE) {
  if (!i18next.isInitialized) {
    await i18next.init({
      lng: locale,
      fallbackLng: DEFAULT_LOCALE,
      resources,
      interpolation: {
        escapeValue: false, // React/Astro already handles escaping
      },
    });
  } else if (i18next.language !== locale) {
    await i18next.changeLanguage(locale);
  }
  return i18next;
}

/**
 * Get translation function for the configured locale
 */
export function getT(locale: Locale = DEFAULT_LOCALE) {
  if (!i18next.isInitialized || i18next.language !== locale) {
    // Synchronous init for SSR predictability
    void i18next.init({
      lng: locale,
      fallbackLng: DEFAULT_LOCALE,
      resources,
      interpolation: {
        escapeValue: false,
      },
    });
  }
  return i18next.t.bind(i18next);
}

/**
 * Helper to get locale from theme config
 */
export function getLocaleFromConfig(config: typeof themeConfig): Locale {
  return resolveLocale(config.locale);
}

/**
 * Pre-configured translation function using theme config locale
 * Import this directly in your components for convenience:
 *
 * import { t } from "@/i18n";
 *
 * <h1>{t("nav.home")}</h1>
 */
export const t = getT(currentLocale);

export { i18next };
