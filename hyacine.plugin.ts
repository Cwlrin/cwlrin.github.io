import { defineConfig } from "@hyacine/plugin-core";
import siteUptime from "@hyacine/plugin-site-uptime";
import mouseFirework from "@hyacine/plugin-mouse-firework";
import aiContent from "@hyacine/plugin-ai-content";
import articleStatistics from "@hyacine/plugin-article-statistics";

/**
 * Hyacine 插件配置
 *
 * 相对模板默认值的调整（对齐原 ShokaX Hexo 站点设置）：
 * - 建站时间改为 2020-01-01（原 footer.since: 2020）
 * - 移除 Waline 评论：原配置 twikoo / waline 均 enable: false
 * - 移除 vercount 访问计数：原配置 visitor.* 全部关闭
 * - 移除 analytics：原配置 visitor.clarity / baiduAnalytics / googleAnalytics 均为 false
 * - 移除「文章过期提醒」：原配置 outime.enable: false
 * - 移除 music 播放器：原配置 modules.player: false，audio 未配置
 * - 移除 visibilityTitle 标题切换：原站点未使用该效果
 * - 保留鼠标点击烟花：原配置 modules.fireworks: true
 */
export default defineConfig({
  injectPoints: {
    "footer-status": {
      selector: "#footer .status",
      position: "append",
    },
    "post-header": {
      selector: "article.post header",
      position: "after",
    },
    "post-footer": {
      selector: "article.post .body",
      position: "after",
    },
  },
  plugins: [
    siteUptime({
      siteCreatedAt: "2020-01-01T00:00:00+08:00",
      prefixText: "本站已运行",
    }),
    mouseFirework({
      count: 16,
      radius: 80,
    }),
    // AI 摘要 / 推荐保持关闭：原站点 summary.enable: false
    aiContent({
      enable: false,
      aiSummary: {
        enable: true,
        title: "AI 摘要",
        showModel: true,
      },
      aiRecommend: {
        enable: true,
        limit: 3,
        minSimilarity: 0.4,
      },
    }),
    articleStatistics(),
  ],
});
