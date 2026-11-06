import { defineConfig } from "oxlint";

export default defineConfig({
  // .migration/ 存放一次性迁移工具（Hexo → Astro 的转换脚本），
  // 不属于站点代码，按纯 JS 脚本处理即可，不参与 type-aware 检查。
  ignorePatterns: [".migration/**"],
  categories: {
    correctness: "error",
    suspicious: "error",
    perf: "warn",
  },
  rules: {
    "no-underscore-dangle": [
      "error",
      {
        allow: ["_id", "_title", "_passwordPlaceholder", "_submitText", "_errorText"],
      },
    ],
  },
});
