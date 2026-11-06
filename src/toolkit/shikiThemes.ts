/**
 * Shiki 明暗主题名（唯一来源）
 *
 * 供 `astro.config.mjs` 与需要渲染代码块的页面共用。
 *
 * 为什么单独抽出来：`src/pages/friends/index.astro` 原先直接
 * `import astroConfig from "../../../astro.config.mjs"` 来读取主题名，
 * 这在 dev 模式下会把 `@astrojs/solid-js` 及其 CJS 依赖
 * （babel-preset-solid）拖进 Vite 的 SSR 图，报 `require is not defined`，
 * 导致 /friends/ 在 dev 下 500。用具名常量模块替换即可避开。
 */
export const SHIKI_THEMES = {
  light: "github-light",
  dark: "github-dark",
} as const;
