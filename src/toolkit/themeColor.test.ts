import { describe, expect, it } from "vitest";
import { isThemeColorValue, isThemeTokenRef, sanitizeThemeColor } from "./themeColor";

describe("themeColor", () => {
  describe("isThemeTokenRef", () => {
    it("should accept valid var token", () => {
      expect(isThemeTokenRef("var(--color-blue)")).toBe(true);
    });

    it("should reject invalid token", () => {
      expect(isThemeTokenRef("var(color-blue)")).toBe(false);
      expect(isThemeTokenRef("var(--color blue)")).toBe(false);
    });
  });

  describe("isThemeColorValue", () => {
    it("should accept common valid values", () => {
      expect(isThemeColorValue("var(--grey-6)")).toBe(true);
      expect(isThemeColorValue("#abc")).toBe(true);
      expect(isThemeColorValue("#aabbccdd")).toBe(true);
      expect(isThemeColorValue("rgb(255 0 0 / 0.5)")).toBe(true);
      expect(isThemeColorValue("hsl(220 40% 50%)")).toBe(true);
      expect(isThemeColorValue("oklch(0.72 0.15 245)")).toBe(true);
      expect(
        isThemeColorValue("color-mix(in oklch, var(--grey-6) 40%, var(--color-blue) 60%)"),
      ).toBe(true);
    });

    it("should reject invalid or unsafe values", () => {
      expect(isThemeColorValue("")).toBe(false);
      expect(isThemeColorValue("   ")).toBe(false);
      expect(isThemeColorValue("rgb(255, 0, 0); background: red")).toBe(false);
      expect(isThemeColorValue("hsl(220 40% 50%) { color: red; }")).toBe(false);
      expect(isThemeColorValue("oklch(0.72 0.15 245);--x:1")).toBe(false);
      expect(isThemeColorValue("color-mix(in oklch, #fff 50%, #000 50%);}")).toBe(false);
      expect(isThemeColorValue("rgb()")).toBe(false);
    });
  });

  describe("sanitizeThemeColor", () => {
    const fallback = "var(--grey-6)";

    it("should return fallback for non-string values", () => {
      expect(sanitizeThemeColor(undefined, fallback, "x")).toBe(fallback);
      expect(sanitizeThemeColor(null, fallback, "x")).toBe(fallback);
      expect(sanitizeThemeColor(123, fallback, "x")).toBe(fallback);
      expect(sanitizeThemeColor({ color: "#fff" }, fallback, "x")).toBe(fallback);
    });

    it("should return normalized color for valid string", () => {
      expect(sanitizeThemeColor("  #aabbcc  ", fallback, "x")).toBe("#aabbcc");
      expect(sanitizeThemeColor(" var(--color-blue) ", fallback, "x")).toBe("var(--color-blue)");
    });

    it("should fallback for invalid/unsafe string", () => {
      expect(sanitizeThemeColor("not-a-color", fallback, "x")).toBe(fallback);
      expect(sanitizeThemeColor("rgb(0,0,0);color:red", fallback, "x")).toBe(fallback);
    });
  });
});
