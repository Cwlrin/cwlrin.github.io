import { defineCovers } from "@/toolkit/coversConfig";

/**
 * 站点头图 / 无封面文章的兜底图。
 *
 * 来源：原 ShokaX Hexo 的 `source/_data/images_index.yml`。
 * 旧主题用 `randomBG()` 从这个列表里随机取图，该列表当时只有 1 张，
 * 所以首页头图和没有 `cover:` 的文章实际都固定用这张。
 *
 * 行为对照：
 * - 首页/页面头图 → `covers[0]`（`cover.gradient` 为 false 且未设 fixedCover 时）
 * - 文章没有 frontmatter `cover` → 也取这张（IndexContent → getPostCover 的兜底）
 * - 只有 1 张图，低于轮播阈值（advancedCarousel 下需 ≥2 张），因此不会轮播
 *
 * 想换头图：改下面这行的 URL；想轮播：贴 ≥2 张 URL。
 */
export default defineCovers([
  // 原 images_index.yml 唯一一张图
  "https://dlink.host/1drv/aHR0cHM6Ly8xZHJ2Lm1zL2kvYy9iZGU1MWU2MjVlZjhmY2M1L0VhT3lZb1A2dlYxTmt1Rnd2ZUxPS0RJQnRJYTRqV1N4eThSVkZqdUVaMlptQmc_ZT1wUjhjZFU.jpg",
]);
