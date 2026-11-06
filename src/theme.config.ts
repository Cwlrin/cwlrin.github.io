// cannot use path alias here because unocss can not resolve it
import { defineConfig } from "./toolkit/themeConfig";

/**
 * ShokaX Astro 站点配置
 *
 * 由原 ShokaX Hexo 的 `_config.yml` + `_config.shokax.yml` 迁移而来，
 * 每个字段旁的中文注释标明了它对应的旧配置项。
 */
export default defineConfig({
  // ── 站点标识 ───────────────────────────────────────────────
  siteName: "Nana7ha's Café Stella",
  locale: "zh-CN",

  // ── 导航栏 ─────────────────────────────────────────────────
  // 原 menu：home / about(aboutsite, admiration) / posts(archives, categories, tags) / friends
  nav: [
    {
      href: "/",
      text: "首页",
      icon: "i-ri-home-line",
    },
    {
      text: "关于",
      href: "/about/",
      icon: "i-ri-user-3-line",
      dropbox: {
        enable: true,
        items: [
          {
            href: "/about/",
            text: "关于本站",
            icon: "i-ri-user-smile-line",
          },
          {
            href: "/admiration/",
            text: "赞助博主",
            icon: "i-ri-cup-line",
          },
        ],
      },
    },
    {
      text: "文章",
      // Astro 版没有 /posts/ 列表页（只有 /posts/<slug>/ 详情页），
      // 这里指向归档页作为「文章总览」入口，避免 404
      href: "/archives/",
      icon: "i-ri-quill-pen-fill",
      dropbox: {
        enable: true,
        items: [
          {
            href: "/archives/",
            text: "归档",
            icon: "i-ri-archive-line",
          },
          {
            href: "/categories/",
            text: "分类",
            icon: "i-ri-book-shelf-fill",
          },
          {
            href: "/tags/",
            text: "标签",
            icon: "i-ri-price-tag-3-fill",
          },
        ],
      },
    },
    {
      text: "友链",
      href: "/friends/",
      icon: "i-ri-link",
    },
  ],

  // ── 品牌区 ─────────────────────────────────────────────────
  // 原 `alternate: 七葉の喫茶ステラ` 是页面展示用大标题；siteName 仅用于 SEO
  brand: {
    title: "七葉の喫茶ステラ",
    subtitle: "技术与美日新月异",
  },

  // ── 侧边栏 ─────────────────────────────────────────────────
  sidebar: {
    author: "樱小路七叶",
    description: "技术与美日新月异",
    // 原 social：github / zhihu / music / bilibili（均带主题色）
    social: {
      github: {
        url: "https://github.com/cwlrin",
        icon: "i-ri-github-fill",
        color: "#191717",
      },
      zhihu: {
        url: "https://www.zhihu.com/people/ying-xiao-lu-qi-ye",
        icon: "i-ri-zhihu-fill",
        color: "#1e88e5",
      },
      music: {
        url: "https://music.163.com/#/user/home?id=411590211",
        icon: "i-ri-netease-cloud-music-fill",
        color: "#e60026",
      },
      bilibili: {
        url: "https://space.bilibili.com/8013992",
        icon: "i-ri-bilibili-fill",
        color: "#55acd5",
      },
    },
  },

  // ── 头图 ───────────────────────────────────────────────────
  // 原 experiments.coverConfig：enableCover / enablePreload / enableNextGradientCover
  // 原 homeConfig.gradient 为 false、fixedCover 为空 → ShokaX Hexo 走 randomBG()，
  // 从 source/_data/images_index.yml 里取图（该文件只有 1 张，所以实际是固定图）。
  // 这里对应：
  //   - gradient: false            不用必应每日图
  //   - fixedCover.enable: false   必须显式关掉：主题默认值是 { enable: true, url: "cover-4" }
  //                                且 defineConfig 是深合并，不写 false 会一直用本地预设 cover-4
  //   - advancedCarousel: true     让 covers.config.ts 参与取图（只有 1 张，不会轮播）
  //   - covers.config.ts           = 原 images_index.yml 的那张图
  cover: {
    enable: true,
    preload: true,
    fixedCover: {
      enable: false,
    },
    advancedCarousel: true,
    gradient: false,
    nextGradientCover: true,
  },

  // ── 页脚 ───────────────────────────────────────────────────
  footer: {
    since: 2020,
    icon: {
      name: "sakura rotate",
      color: "#ffc0cb",
    },
    count: true,
    powered: true,
    icp: {
      // 原配置 icp.enable: false，备案号原样保留，需要时改 true 即可
      enable: false,
      icon: "/beian.png",
      icpnumber: "黑ICP备2021000748号-1",
      beian: "黑公网安备23120202000171号",
      recordcode: "23120202000171",
    },
  },

  // ── 小部件 ─────────────────────────────────────────────────
  // 原 widgets.random_posts / recent_comments 均为 false
  widgets: {
    randomPosts: false,
    recentComments: false,
  },

  // ── 首页 ───────────────────────────────────────────────────
  // 原 index_generator.per_page: 10
  home: {
    pageSize: 10,
  },

  // ── 布局 ───────────────────────────────────────────────────
  // 原主题为「左侧栏 + 正文」，未启用右栏小部件 → 两栏布局
  layout: {
    mode: "two-column",
  },

  // ── 版权 ───────────────────────────────────────────────────
  // 原 creative_commons.license: by-nc-sa → CC-BY-NC-SA-4.0
  copyright: {
    license: "CC-BY-NC-SA-4.0",
    show: true,
  },

  // ── 友链 ───────────────────────────────────────────────────
  // 由原 friends 页面 `{% links %}` 的数据迁移而来
  friends: {
    title: "友链",
    description: "欢迎交换友链，卡片式展示，支持站点预览与主题色点缀。",
    links: [
      {
        url: "https://shoka.lostyu.me",
        title: "優萌初華",
        desc: "琉璃的医学 & 编程笔记",
        author: "霜月琉璃",
        avatar: "https://cdn.jsdelivr.net/gh/amehime/shoka@latest/images/avatar.jpg",
        color: "#e9546b",
      },
      {
        url: "https://xiaoyou66.com",
        title: "小游",
        desc: "二次元技术宅",
        author: "小游",
        avatar:
          "https://dlink.host/1drv/aHR0cHM6Ly8xZHJ2Lm1zL2kvYy9iZGU1MWU2MjVlZjhmY2M1L0VUNVMyTmRjM2VWTnZXQWNSc3pBX2ZFQnc0TS03SFpqdnJONFBnYklWa0JjSVE_ZT03emZHdDM.jpg",
        color: "#f38171",
      },
      {
        url: "https://blog.catouo.cn/",
        title: "灯火橘Channel",
        desc: "灯火橘的博客",
        author: "灯火橘",
        avatar:
          "https://dlink.host/1drv/aHR0cHM6Ly8xZHJ2Lm1zL2kvYy9iZGU1MWU2MjVlZjhmY2M1L0VVWVRUZzhSZjFkRHBNekd2ZnloQVRzQmV5ZkpNc1dLMmI5NlVrNU5KUC1KVWc_ZT1reHgxWkQ.jpg",
        color: "#f5c87b",
      },
    ],
  },

  // ── 标签云 ─────────────────────────────────────────────────
  // 原 tagcloud: start #72cecf / end #ffbac3
  tagCloud: {
    startColor: "#72cecf",
    endColor: "#ffbac3",
  },
});
