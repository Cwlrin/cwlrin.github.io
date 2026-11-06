export type ThemeTokenRef = `var(--${string})`;

export type ThemeColorValue =
  | ThemeTokenRef
  | `#${string}`
  | `rgb(${string})`
  | `rgba(${string})`
  | `hsl(${string})`
  | `hsla(${string})`
  | `oklch(${string})`
  | `oklab(${string})`
  | `color-mix(${string})`;

const UNSAFE_CSS_VALUE_DELIMITER_RE = /[;{}]/;
const SAFE_FUNCTION_COLOR_CONTENT_RE = /^[a-z0-9\s.,%()+\-/*#]+$/i;

const warnedContexts = new Set<string>();

function warnInvalidColor(context: string, value: unknown, fallback: ThemeColorValue) {
  if (typeof console === "undefined") return;

  const key = `${context}:${String(value)}`;
  if (warnedContexts.has(key)) return;
  warnedContexts.add(key);

  console.warn(`[theme-config] ${context} 的颜色值无效：${String(value)}，已回退为 ${fallback}`);
}

export function isThemeTokenRef(value: string): value is ThemeTokenRef {
  return /^var\(--[a-z0-9-]+\)$/i.test(value.trim());
}

function supportsCssColorInBrowser(value: string): boolean | null {
  if (typeof CSS === "undefined" || typeof CSS.supports !== "function") {
    return null;
  }

  return CSS.supports("color", value);
}

function isSafeFunctionalColorValue(value: string, fnName: string): boolean {
  const normalized = value.trim();
  const prefix = `${fnName}(`;

  if (!normalized.toLowerCase().startsWith(prefix) || !normalized.endsWith(")")) {
    return false;
  }

  if (UNSAFE_CSS_VALUE_DELIMITER_RE.test(normalized)) {
    return false;
  }

  const inner = normalized.slice(prefix.length, -1).trim();
  if (!inner) {
    return false;
  }

  if (!SAFE_FUNCTION_COLOR_CONTENT_RE.test(inner)) {
    return false;
  }

  const browserSupport = supportsCssColorInBrowser(normalized);
  if (browserSupport === false) {
    return false;
  }

  return true;
}

export function isThemeColorValue(value: string): value is ThemeColorValue {
  const normalized = value.trim();

  if (!normalized || UNSAFE_CSS_VALUE_DELIMITER_RE.test(normalized)) {
    return false;
  }

  return (
    isThemeTokenRef(normalized) ||
    /^#[0-9a-f]{3,8}$/i.test(normalized) ||
    isSafeFunctionalColorValue(normalized, "rgb") ||
    isSafeFunctionalColorValue(normalized, "rgba") ||
    isSafeFunctionalColorValue(normalized, "hsl") ||
    isSafeFunctionalColorValue(normalized, "hsla") ||
    isSafeFunctionalColorValue(normalized, "oklch") ||
    isSafeFunctionalColorValue(normalized, "oklab") ||
    isSafeFunctionalColorValue(normalized, "color-mix")
  );
}

export function sanitizeThemeColor(
  value: unknown,
  fallback: ThemeColorValue,
  context: string,
): ThemeColorValue {
  if (typeof value !== "string") {
    if (value !== undefined && value !== null) {
      warnInvalidColor(context, value, fallback);
    }
    return fallback;
  }

  const normalized = value.trim();
  if (isThemeColorValue(normalized)) {
    return normalized;
  }

  warnInvalidColor(context, value, fallback);
  return fallback;
}
