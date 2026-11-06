import { fileURLToPath } from "node:url";
import { defineConfig } from "vitest/config";
import solid from "vite-plugin-solid";

/**
 * 双 project 策略：
 * - unit：src/toolkit/** 纯逻辑 helper，node 环境（既有 151+ 测试保持原样）
 * - dom：src/components/** 元素/组件渲染测试，jsdom 环境
 *   （code-block/image-zoom 自定义元素原生 DOM 测试 + Solid 组件渲染测试）
 */
export default defineConfig({
  resolve: {
    // 对齐 tsconfig 的 @/ 路径别名
    alias: {
      "@": fileURLToPath(new URL("./src", import.meta.url)),
    },
  },
  test: {
    projects: [
      {
        extends: true,
        test: {
          name: "unit",
          include: ["src/toolkit/**/*.test.ts", "src/i18n/**/*.test.ts"],
          environment: "node",
        },
      },
      {
        extends: true,
        plugins: [solid({ hot: false })],
        test: {
          name: "dom",
          include: ["src/components/**/*.test.ts", "src/components/**/*.test.tsx"],
          environment: "jsdom",
          setupFiles: ["./src/components/test/setup.ts"],
        },
      },
    ],
  },
});
