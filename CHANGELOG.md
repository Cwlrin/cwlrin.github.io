# 📝 Changelog

本文件由 [git-cliff](https://git-cliff.org) 根据 Conventional Commits 自动生成。

## [2.0.0] - 2026-08-27

### ✨ 新功能

- Migrate to next-gen @hyacine/plugin-astro system & official plugins ([d24e160](https://github.com/theme-shoka-x/astro-blog-shokax/commit/d24e1607f4604aaa8dee29d54e0db2418f907f04))
- Support replica/ai-only mode with dedicated aiGateway resolution ([df35c86](https://github.com/theme-shoka-x/astro-blog-shokax/commit/df35c86a9af0ef83add8c99e519db521e36307cf))
- Add summaryModel support to schema and post page ([3214560](https://github.com/theme-shoka-x/astro-blog-shokax/commit/3214560e0eab679fb91e2faf0b682fc0b264148a))
- Adapt to @hyacine/sdk & @hyacine/cli 0.1.0 with D1 live collections & AI support ([22b70c2](https://github.com/theme-shoka-x/astro-blog-shokax/commit/22b70c20b3e69d62c5d53014411857dc7d2feb4b))
- 音乐播放器迁移到 nyx-player-solid@0.1.3（modern meting provider） ([2261925](https://github.com/theme-shoka-x/astro-blog-shokax/commit/22619254e7ee3a294613f4d4bcbbf5e3127d3367))
- Cloudflare Workers Static Assets 纯静态部署支持 ([4a6b0dc](https://github.com/theme-shoka-x/astro-blog-shokax/commit/4a6b0dce5f03d04e053f67307c99bdee81774cec))
- 组件测试分层落地——vitest 拆 unit/dom 双 project + 37 例元素/组件测试 ([179fc4a](https://github.com/theme-shoka-x/astro-blog-shokax/commit/179fc4a7e460b882b678715ee6e302748c684a79))
- P3 完成——Svelte 5 → SolidJS 全量迁移（32/32 组件） ([8e41758](https://github.com/theme-shoka-x/astro-blog-shokax/commit/8e41758eaf84a945c85120c4e90917f4ba85ecf8))
- P3 Svelte→SolidJS 迁移——ArticleStatisticsCharts 组件切换（31/32） ([a5a7ee5](https://github.com/theme-shoka-x/astro-blog-shokax/commit/a5a7ee56772d42a4ab6c0b594fa45a10dc2c59e8))
- P3 Svelte→SolidJS 迁移——SearchPage 组件切换（30/32） ([6bb30f2](https://github.com/theme-shoka-x/astro-blog-shokax/commit/6bb30f2edc401744095472e63ecb8a9cc18f9805))
- P3 Svelte→SolidJS 迁移——AboutDialog 组件切换（29/32） ([a0aeec2](https://github.com/theme-shoka-x/astro-blog-shokax/commit/a0aeec2fbaada69c82f0e15e1ec8364680bd4a4c))
- P3 Svelte→SolidJS 迁移——FloatingToolbar + encrypted 族（4 组件）切换 ([c283a40](https://github.com/theme-shoka-x/astro-blog-shokax/commit/c283a40c4bc34d99049f1fdb6b90d37004bc77de))
- P3 Svelte→SolidJS 迁移——CategoryCards/CategoryCard 组件切换 ([2b3a194](https://github.com/theme-shoka-x/astro-blog-shokax/commit/2b3a1948e8b80537f18effe62ff10988c376bc8e))
- P3 Svelte→SolidJS 迁移——Widgets + WalineComments 组件切换 ([cd0960e](https://github.com/theme-shoka-x/astro-blog-shokax/commit/cd0960ece4a01157860f3f85af7909f77ed7dbf5))
- P3 Svelte→SolidJS 迁移——sidebar 组件族（12 组件）已切换 ([b3f0300](https://github.com/theme-shoka-x/astro-blog-shokax/commit/b3f0300a4c57aebf6f0c765d5ef7afddc78bc9bf))
- P3 Svelte→SolidJS 迁移——navbar 组件族（8 组件）已切换 ([8309323](https://github.com/theme-shoka-x/astro-blog-shokax/commit/83093235dec7f5639ad90f4d01c3a81fa323e5f9))

### 🐛 修复

- Pass statistics data directly and through extraProps ([c876c86](https://github.com/theme-shoka-x/astro-blog-shokax/commit/c876c86f8ed470cf6ed097c0f1e1b42e015ed585))
- 宽屏汉堡按钮不隐藏 + 移动端菜单只出遮罩——级联与管线双修 ([7ff5c23](https://github.com/theme-shoka-x/astro-blog-shokax/commit/7ff5c23583d051ab4df20802b1bb6870d62927ae))
- CI 干净环境补齐 astro sync；三栏布局适配 client 组件的 astro-island 层级 ([afa1782](https://github.com/theme-shoka-x/astro-blog-shokax/commit/afa1782900413959d1e9b7e5a0c28cef4fc19c26))
- 加密文章防泄漏——RSS 排除明文正文、PBKDF2 提升至 600k、sitemap 排除加密页 ([a3aeebd](https://github.com/theme-shoka-x/astro-blog-shokax/commit/a3aeebd4d26efe80aa878d9b42f7cd84c5f3d9e4))
- SonarCloud issues 清理——正则回溯×4/BLOCKER/批量 MINOR 等价改写 ([c5d4cc8](https://github.com/theme-shoka-x/astro-blog-shokax/commit/c5d4cc8e74185d69d6c4a2b9be73765b7dfce9d0))
- 移动端超长 permalink 撑破版权区布局 ([a4d329f](https://github.com/theme-shoka-x/astro-blog-shokax/commit/a4d329fa1d2d827e117841c3abc65a6b6ad75443))
- 侧边栏面板切换残留 + code-block slot 样式丢失(Solid 迁移双回归) ([fce613e](https://github.com/theme-shoka-x/astro-blog-shokax/commit/fce613e1bcd9189c6d058655f67c8ade003171b9))
- 首页精选分类卡片悬停后消失——show 类双写者冲突修复 ([8e450a4](https://github.com/theme-shoka-x/astro-blog-shokax/commit/8e450a4e7f123707776ed78f0f0e3e43bdd497c1))
- P3 E2E 回归修复（code-block 折叠按钮/融入卡片、搜索面板打开） ([7ff93eb](https://github.com/theme-shoka-x/astro-blog-shokax/commit/7ff93eb6bddcf3e0fb80cfddd39449ec62525a00))
- E2E webServer 命令适配 pnpm/astro CLI（pnpm run 的 -- 不会被剥离） ([f08158b](https://github.com/theme-shoka-x/astro-blog-shokax/commit/f08158b81226f09134bb447c136cf31ecc4a07cf))
- 修复 P2 以来构建失败链（CI 恢复绿的关键修复合集） ([3e0f559](https://github.com/theme-shoka-x/astro-blog-shokax/commit/3e0f5591c855e62077625dce171ff6feb7de9868))
- 停用 @hyacine/astro 插件（与 Astro 7 config:setup 生命周期不兼容）+ rolldown 对齐 1.1.4 ([86fd820](https://github.com/theme-shoka-x/astro-blog-shokax/commit/86fd820571eb613ee803f80e4890f89ba02b4b9b))
- P3 review 修复——about.mdx svelte import 与自定义元素 SSR 风险 ([ad49f6c](https://github.com/theme-shoka-x/astro-blog-shokax/commit/ad49f6c0abf9bdca919c0b62ef8605d3e2ec04c2))
- Encrypted/index.ts 导出路径更新（.svelte→无扩展解析 .tsx） ([53fe30a](https://github.com/theme-shoka-x/astro-blog-shokax/commit/53fe30afec0cd15a63e3d05bdb5172cca12d773e))
- P3 补修复 lint 错误（FloatingToolbar dataset 守卫 + EncryptedPost 类型赋值） ([d814530](https://github.com/theme-shoka-x/astro-blog-shokax/commit/d814530b0df1f81cd0bf046e3447d5efa115caa6))

### ♻️ 重构

- Switch hyacine packages to npm releases and decouple plugin configs ([7e6b481](https://github.com/theme-shoka-x/astro-blog-shokax/commit/7e6b4811e3d3bfd67469b704bdf19338942e78bd))
- Standardize mode names to cloud and local ([7f46adc](https://github.com/theme-shoka-x/astro-blog-shokax/commit/7f46adc070da1adc344ffb1f6c2f94d477397250))
- 移除 @playform/inline——修复管线丢规则与每页 72.5KB 重复 CSS（2.0 CSS 调查定论） ([a7da8ba](https://github.com/theme-shoka-x/astro-blog-shokax/commit/a7da8bacb23a7176ddeed23de50e7459deeb8bf9))
- 右侧栏/日历迁移 Solid 细粒度 + echarts 绑定层抽取使用 hook ([34a0eaa](https://github.com/theme-shoka-x/astro-blog-shokax/commit/34a0eaa32df64234b7e4d6462eed95eefefc96a1))
- 适配依赖移除——hyacine/nyx-player 类型存根与降级路径 + README 注记 ([03f080a](https://github.com/theme-shoka-x/astro-blog-shokax/commit/03f080acf95c4462c24bc00a518f548e5ba51cc5))
- 自定义元素基类抽取 + Post 投影函数库归一化 ([e4916fd](https://github.com/theme-shoka-x/astro-blog-shokax/commit/e4916fd1643baba46d0015a91e3b41ab2659c450))

### 💄 样式

- Oxfmt 规范 layout-three-column.css（astro-island 选择器缩进） ([b548a70](https://github.com/theme-shoka-x/astro-blog-shokax/commit/b548a70416dc0ab22047bd57aabc7bf9d1117b4c))

### 📝 文档

- README 移除 Cloudflare 部署说明（后续并入部署文档） ([b128cfa](https://github.com/theme-shoka-x/astro-blog-shokax/commit/b128cfa57cc480c660b065849e60bea1852ba0dd))
- README 增补架构约束小节（satteri 管线耦合/版本 pin/休眠集成/加密前提） ([41b8753](https://github.com/theme-shoka-x/astro-blog-shokax/commit/41b8753c5adde00c4ba79e6960996cd54fcbefae))
- 沉淀三类踩坑教训到 AGENTS.md 与 copilot-instructions.md ([b975ad8](https://github.com/theme-shoka-x/astro-blog-shokax/commit/b975ad8e5886e56749281998d301b11364792b1a))
- P3 文档同步（README/README_zh-cn/copilot-instructions 的 Svelte→SolidJS 提及） ([19cce5e](https://github.com/theme-shoka-x/astro-blog-shokax/commit/19cce5ecab9e29182d9ef8af931cb20c423cf308))

### ✅ 测试

- 键名一致性强制防护——编译期 satisfies + 运行期双向键集单测 ([0d80e21](https://github.com/theme-shoka-x/astro-blog-shokax/commit/0d80e215450ebc7f68112ae7c7ae4548a2feb788))
- 高价值组件测试——加密状态机 13 例 + AboutDialog 聊天树 7 例 ([f6553fe](https://github.com/theme-shoka-x/astro-blog-shokax/commit/f6553fee69b0c301531e9ad313ccd5550ce35e8a))
- 第一梯队组件测试 12 文件 52 例——Sidebar 展示族/Navbar/分类卡片全覆盖 ([e897859](https://github.com/theme-shoka-x/astro-blog-shokax/commit/e897859bb88438a2538818e9e2305749bf97c411))

### 🔧 杂项

- Bump @hyacine/plugin-astro to 0.2.2 and @hyacine/plugin-article-statistics to 0.1.1 ([887bf7d](https://github.com/theme-shoka-x/astro-blog-shokax/commit/887bf7dcfcd6467aada63d5f2451330a441e20f4))
- Bump @hyacine/plugin-astro, plugin-article-age-warning, plugin-site-uptime to 0.2.1 ([ca7ecd5](https://github.com/theme-shoka-x/astro-blog-shokax/commit/ca7ecd5a91c1bdf557cadacef1a42e2cbcf213d3))
- Update @hyacine packages to npm release versions in lockfile ([d13a2de](https://github.com/theme-shoka-x/astro-blog-shokax/commit/d13a2deb436df0ea927530e93301eb0c12986aa0))
- 升级 nyx-player-solid 0.1.4→0.1.5 (封面图内联 base64，修复 check-links 死链) ([0f28b92](https://github.com/theme-shoka-x/astro-blog-shokax/commit/0f28b9275674bace92fa796d388084e48c7199c8))
- 升级 nyx-player-solid 0.1.3→0.1.4 (播放失败版权提示) ([8bf8b62](https://github.com/theme-shoka-x/astro-blog-shokax/commit/8bf8b62841fff18a0a33502ac897c43caf0b2cde))
- 临时移除 @hyacine/\* 与 nyx-player 依赖；overrides 抬升 deepmerge-ts/uuid/ip 修复 CVE ([0e05290](https://github.com/theme-shoka-x/astro-blog-shokax/commit/0e05290d5128996ccf78a31208cefea57bf3caa1))
- Bun 迁移残留与死依赖清理 + CI 并行改造 + 部署配置生成器 ([607bc4d](https://github.com/theme-shoka-x/astro-blog-shokax/commit/607bc4d11c71b32a3a151bd9b11d2a69d16ee0de))
- 依赖语义整治（构建工具移入 devDependencies + 移除 turbo 死依赖 + .nvmrc） ([fb64882](https://github.com/theme-shoka-x/astro-blog-shokax/commit/fb6488261063b737a76a056058245ce6fc806545))
- 从 Bun 迁移到 Node.js + pnpm（去除 bun 专有部分） ([d149864](https://github.com/theme-shoka-x/astro-blog-shokax/commit/d149864815f683471bd7925a0c72b3d260d391da))
- 添加 git-cliff 自动生成 changelog 的 GitHub Release 流程 ([588a97c](https://github.com/theme-shoka-x/astro-blog-shokax/commit/588a97c009948a2e1dafe6b9a0c19d1549f57023))

## [1.6.0] - 2026-07-04

### ✨ 新功能

- 为常用语言维护精选徽标颜色表 ([f3a879c](https://github.com/theme-shoka-x/astro-blog-shokax/commit/f3a879c1acc84ccc7c9800325c928f4b8a19cd15))
- 优化 Code Group 显示效果为 macOS 窗口风格 ([0bf68d6](https://github.com/theme-shoka-x/astro-blog-shokax/commit/0bf68d6ec1d9b129064f0fd8f0b1a6b6e809c141))
- 代码块、自动外链标记和图片说明 ([807cb27](https://github.com/theme-shoka-x/astro-blog-shokax/commit/807cb271bbf8e914b906e5d363d1aa47b52f4624))
- 完成 emoji 和 ruby-directive satteri 插件迁移 ([9e37534](https://github.com/theme-shoka-x/astro-blog-shokax/commit/9e37534cf587ae79686f4c5937310b120b5606f6))
- Satteri 迁移 PoC — 验证 remark 到 satteri 可行性 ([4be9096](https://github.com/theme-shoka-x/astro-blog-shokax/commit/4be9096d8859c0ea49b5182671903212be6d03cd))
- Rss端点 ([f1a3f27](https://github.com/theme-shoka-x/astro-blog-shokax/commit/f1a3f277b2593f760a3313a2f9097604dcde6dfb))
- 友链页面可打开评论区 ([1878c2b](https://github.com/theme-shoka-x/astro-blog-shokax/commit/1878c2ba4f5bcbcc091c9cc0c63c94c76ad6cb90))
- 首页文章摘要支持 AI 摘要 ([bd4c299](https://github.com/theme-shoka-x/astro-blog-shokax/commit/bd4c299bee1b692b10dc4611488b4db877bf7b26))
- Web analytics ([c1a4b8a](https://github.com/theme-shoka-x/astro-blog-shokax/commit/c1a4b8ade71bd4cb644e61b6de824197efe7836b))

### 🐛 修复

- 转义图片说明文字 ([90aaffb](https://github.com/theme-shoka-x/astro-blog-shokax/commit/90aaffb5f135c78374e5348e87d1aeeccf49942b))
- 合并rel和class值而非替换 ([ba6b68a](https://github.com/theme-shoka-x/astro-blog-shokax/commit/ba6b68a6f7c4b3038252a0944441cf4cfa93f540))
- 修复搜索面板模糊效果不同步问题 ([fd11c5a](https://github.com/theme-shoka-x/astro-blog-shokax/commit/fd11c5ae1e92c8cb86d2ba2d5fb31a0ab0f08ccb))
- Code-group 内代码块保留红黄绿圆点 ([c931328](https://github.com/theme-shoka-x/astro-blog-shokax/commit/c931328e2f7e3a2a728dd8008abd767887b714d7))
- 修复E2E搜索框错误 ([1e58ab7](https://github.com/theme-shoka-x/astro-blog-shokax/commit/1e58ab7d56df35daca83b0c8647a6bfe4397a604))
- 修复E2E错误 ([bded5f7](https://github.com/theme-shoka-x/astro-blog-shokax/commit/bded5f7b20ca319042df259e92b7fe8c35c0af56))
- Cap layout frame width to viewport to prevent horizontal overflow ([08c4dc0](https://github.com/theme-shoka-x/astro-blog-shokax/commit/08c4dc04f358eb6643b76e1b5a159abd0c71680a))

### ♻️ 重构

- WrapExternalLinks 改用 siteUrl 并兼容子路径 ([331ddd4](https://github.com/theme-shoka-x/astro-blog-shokax/commit/331ddd49f222540788d66fe71808eddfdbd52149))
- Satteri 插件迁移到 TypeScript ([5ab9cd5](https://github.com/theme-shoka-x/astro-blog-shokax/commit/5ab9cd50018508a6e10d5bcb3a1eebc2f5c985f4))
- 将 analytics 默认配置移至 DEFAULT_THEME_CONFIG ([018178a](https://github.com/theme-shoka-x/astro-blog-shokax/commit/018178aab963ff83196c34746b9562eb4159816d))

### 🔧 杂项

- 修复依赖 ([677d8ed](https://github.com/theme-shoka-x/astro-blog-shokax/commit/677d8ede24cdbf0d731a355d83943ec81277dd4f))
- 清理 remark 残余文件和依赖 ([3c3dfff](https://github.com/theme-shoka-x/astro-blog-shokax/commit/3c3dfff39c1e6732612e9c023d9b4160ae3f67bb))
- 优化对V7适配 ([8ed17ba](https://github.com/theme-shoka-x/astro-blog-shokax/commit/8ed17ba2a28419b978a6243859ccbdfb02a4e7f8))
- 升级到 Astro v7 ([bff57e7](https://github.com/theme-shoka-x/astro-blog-shokax/commit/bff57e7daa5a10628ed52cbdd39fe7899f241703))

## [1.5.0] - 2026-06-06

### ✨ 新功能

- 新cover行为可控 ([83691ce](https://github.com/theme-shoka-x/astro-blog-shokax/commit/83691ce524a28e3d485299e4c33666b03fa9aeeb))
- 新增 resolveHeaderCovers 函數以處理封面 URL ([2332b4e](https://github.com/theme-shoka-x/astro-blog-shokax/commit/2332b4ebe7563b2ac000ccbc9d08c2c25f68f91d))
- Add covers configuration and defineCovers function with tests ([bee1ad0](https://github.com/theme-shoka-x/astro-blog-shokax/commit/bee1ad07f7bd376d0151b86241fda6a82f536e3e))
- Make index post covers fallback to header carousel source ([8952e76](https://github.com/theme-shoka-x/astro-blog-shokax/commit/8952e76a5eec27a5e5ef7ca4573ea8e6135dbe04))
- Support remote URLs and local JSON source for header carousel ([d46d325](https://github.com/theme-shoka-x/astro-blog-shokax/commit/d46d325079bb613b0f2d992b79a3010571fc8caa))
- Add Google Analytics and Umami analytics support ([ca36feb](https://github.com/theme-shoka-x/astro-blog-shokax/commit/ca36feb8acdc4837a6924d1342dd2aa114c61d79))

### 🐛 修复

- 抑制错误 ([7ea43bc](https://github.com/theme-shoka-x/astro-blog-shokax/commit/7ea43bcfe75007b3fea3445925c95aa715eb4cb8))
- 修复lint优化中引入的新错误 ([f7b94c1](https://github.com/theme-shoka-x/astro-blog-shokax/commit/f7b94c1f56aa43e244595bede03eb3773a979246))
- 修复潜在依赖问题 ([d12509e](https://github.com/theme-shoka-x/astro-blog-shokax/commit/d12509e7869fcfcb24891f15e73bc219818659c9))
- Share carousel source resolution between layout and index ([5e1e35f](https://github.com/theme-shoka-x/astro-blog-shokax/commit/5e1e35f53cff6189aad5e89422844c5ec7f2748f))
- Update PostSegments types ([e5bd231](https://github.com/theme-shoka-x/astro-blog-shokax/commit/e5bd231d1a8aaa89f8c17c60516a13d61b960972))

### ⚡ 性能优化

- Lazy-load non-primary carousel images ([84e2cdc](https://github.com/theme-shoka-x/astro-blog-shokax/commit/84e2cdcf1de6b10c6f0a9a586ca481a524010b98))

### ♻️ 重构

- 修复部分lint问题 ([d17f210](https://github.com/theme-shoka-x/astro-blog-shokax/commit/d17f21047d55447538b60faf51a2d7c40868b0f4))
- 更新封面圖片 URL 並調整測試用例以符合新配置 ([e3584c6](https://github.com/theme-shoka-x/astro-blog-shokax/commit/e3584c6b6c689bbb301de6205e4c57c9b7cf06d6))
- 重命名 carouselCovers 為 Covers，並移除不必要的 headerCarousel.ts 檔案 ([acf3eef](https://github.com/theme-shoka-x/astro-blog-shokax/commit/acf3eeff164b03f0f82fc3154b1ba6d864da93e5))
- 統一 cover 命名 ([c00c251](https://github.com/theme-shoka-x/astro-blog-shokax/commit/c00c2515c9d42a0bd4eb3e3483d31e5f70cbf86c))
- 用 covers.config.ts 取代 carousel-covers.json，統一 cover 命名 ([d2fcc6f](https://github.com/theme-shoka-x/astro-blog-shokax/commit/d2fcc6faf4cba2f5ec2965b3785ce540d911a253))

### 🔧 杂项

- 更新CI & fix: 修复单元测试 ([03d6b83](https://github.com/theme-shoka-x/astro-blog-shokax/commit/03d6b83784fb6d89a49288e9c918b772d6f746bd))
- 适配 Astro 6.4 remark渲染模式 ([40588ca](https://github.com/theme-shoka-x/astro-blog-shokax/commit/40588ca7408e9575d5a5e3020ea030ef7003d479))
- 更新依赖项 & 强化 Lint ([4894f25](https://github.com/theme-shoka-x/astro-blog-shokax/commit/4894f25060fb2ba0291c1c9b89061447ac362977))

## [1.4.0] - 2026-05-03

### ✨ 新功能

- 支持通过${folder}简化分类 ([d27e3d6](https://github.com/theme-shoka-x/astro-blog-shokax/commit/d27e3d6b00e7cc1f8df9fa94934ff6c4ab7559bd))

### 🐛 修复

- 修复folder解析跨平台不一致问题 ([2b3ea4a](https://github.com/theme-shoka-x/astro-blog-shokax/commit/2b3ea4a773e2a4c0872bf3965c29157672003432))

### ♻️ 重构

- 优化about可读性 ([80325e0](https://github.com/theme-shoka-x/astro-blog-shokax/commit/80325e069114e6992df5919a6f249633d165c29e))

### 🔧 杂项

- 增加POSIX风格测试用例 ([3d1cb3b](https://github.com/theme-shoka-x/astro-blog-shokax/commit/3d1cb3b4fe7aa1fa1a5ca96174138596b8d94e04))

## [1.3.1] - 2026-04-18

### 🐛 修复

- 修复文章页面的widgets样式异常问题 ([b351fa7](https://github.com/theme-shoka-x/astro-blog-shokax/commit/b351fa7b68872ab8dd81d15e5e51b2cd92cf14b0))

## [1.3.0] - 2026-04-18

### ♻️ 重构

- Image-zoom新增按钮的i18n ([63dd99b](https://github.com/theme-shoka-x/astro-blog-shokax/commit/63dd99b3ba66322911d0780d5dd97a710e5f740e))

### 📝 文档

- 修复README的图像比例问题 ([698e945](https://github.com/theme-shoka-x/astro-blog-shokax/commit/698e945ba8b5be1437f7aada6df46e2e15ee0d9b))
- 修复README中图片被错误拉伸的问题 ([725cfe7](https://github.com/theme-shoka-x/astro-blog-shokax/commit/725cfe785d556cc8dc3e6bd2c69bac4c0bea20f8))

### 🔧 杂项

- 文档修改 ([bf241f3](https://github.com/theme-shoka-x/astro-blog-shokax/commit/bf241f30fe192d50f4dbe0ba59b2076700a268f1))
- README ([f555f83](https://github.com/theme-shoka-x/astro-blog-shokax/commit/f555f835b5329145e2ede936848fd30765e57cb5))

## [1.1.0] - 2026-04-11

### ✨ 新功能

- 为行内代码块添加样式 ([5f239b4](https://github.com/theme-shoka-x/astro-blog-shokax/commit/5f239b4a64f2503fedf821b30e2c3c0b0f3afa3a))
- 允许主动抑制FSWatcher警告 ([6183612](https://github.com/theme-shoka-x/astro-blog-shokax/commit/6183612374f682633bd599b7f10cd2e583f427b3))
- 繁体中文和日语翻译 ([d121ba6](https://github.com/theme-shoka-x/astro-blog-shokax/commit/d121ba6b66f6126d7f196924789633a80ced4cfc))
- 优化右侧边栏视觉设计 ([8c84c2b](https://github.com/theme-shoka-x/astro-blog-shokax/commit/8c84c2be9641af9bdde37fed62545d65057ce737))
- 优化友链页面视觉设计效果 ([280154c](https://github.com/theme-shoka-x/astro-blog-shokax/commit/280154c5347ac8d1d6173ae0299522ebf20d8800))
- Moments帖子内图片支持切换 ([7576998](https://github.com/theme-shoka-x/astro-blog-shokax/commit/757699873b2c620e8a8495f27d26143e94841be6))
- Moments适配image-zoom ([e1d6c96](https://github.com/theme-shoka-x/astro-blog-shokax/commit/e1d6c96db293143fa35f75cfa512be43c2b088be))
- 支持主题配置合并和默认配置功能 ([fbde516](https://github.com/theme-shoka-x/astro-blog-shokax/commit/fbde516eb9b5861ab8990b6ccb060d91259db16a))
- 文章统计页面 ([9f66d7e](https://github.com/theme-shoka-x/astro-blog-shokax/commit/9f66d7e672953654f38d1a6af01e5f9f830803b8))

### 🐛 修复

- 修复brand对比度过低的问题 ([3a6e41e](https://github.com/theme-shoka-x/astro-blog-shokax/commit/3a6e41e7da12a5f2ad7cc6038018a35cd992bd6b))

### ♻️ 重构

- 将右侧边栏底部和widgets对齐 ([ce1a957](https://github.com/theme-shoka-x/astro-blog-shokax/commit/ce1a957a852dab5415ae73115cf661cf0aac13aa))
- 去除加密文章中未使用的事件逻辑 ([3c867ca](https://github.com/theme-shoka-x/astro-blog-shokax/commit/3c867ca206ee80f21e5099014b04a77fb7b83e8a))
- 优化overlay展示时背景的偏移问题 ([cf789ce](https://github.com/theme-shoka-x/astro-blog-shokax/commit/cf789cee2f983845a05e9acba3a4067be06c8a62))
- 优化侧边栏流畅程度 ([010231d](https://github.com/theme-shoka-x/astro-blog-shokax/commit/010231d2ce341cf434ad0b685fa19d153d8ee59b))
- 改进文章页面无障碍友好性 ([24cd962](https://github.com/theme-shoka-x/astro-blog-shokax/commit/24cd9621804e36747eeb09b27a79253052d7c281))

### 👷 CI

- 优化ci运行效率 ([ebdaf5a](https://github.com/theme-shoka-x/astro-blog-shokax/commit/ebdaf5a2550886d2f4618413aa2f8d39187295b3))

### 🔧 杂项

- 合并e2e和ci ([7f68948](https://github.com/theme-shoka-x/astro-blog-shokax/commit/7f68948447cf1ff00aff5686c3b5b70f66f8442d))
- 使用lychee替代linkinator ([f007dc7](https://github.com/theme-shoka-x/astro-blog-shokax/commit/f007dc7ca4334628f667edb3c289ddda2fe960e7))
- 修复链接检查 ([55cfff6](https://github.com/theme-shoka-x/astro-blog-shokax/commit/55cfff6da9647459a38660352015555ca3aa8b94))
- 更新依赖 ([2daa6a2](https://github.com/theme-shoka-x/astro-blog-shokax/commit/2daa6a21a44285c50c098c361f54f20d5599bc5b))
- 移除错误E2E测试 ([ccf3c85](https://github.com/theme-shoka-x/astro-blog-shokax/commit/ccf3c85f4bb9dfc849f23d7bd2e72deeefa72a4f))
- 删除混入的临时文件 ([634d26c](https://github.com/theme-shoka-x/astro-blog-shokax/commit/634d26c0f4f5bbb0514bfdf3e56b562bb12acef5))
- About i18n化 ([0c436cf](https://github.com/theme-shoka-x/astro-blog-shokax/commit/0c436cfa6e3f3b2accd51e7c51e16c896e802f56))

## [1.0.0] - 2026-04-05

### ✨ 新功能

- 文章内页封面与内容集合同步 ([7e43f1d](https://github.com/theme-shoka-x/astro-blog-shokax/commit/7e43f1de144ebff3416aca1969b2f12895b95901))
- 关于页面、图片预览 ([af78cda](https://github.com/theme-shoka-x/astro-blog-shokax/commit/af78cda98d62cbfdccc0db1b2fa539105cbac06f))
- 优化footer布局 ([29e840b](https://github.com/theme-shoka-x/astro-blog-shokax/commit/29e840bb267c76d8b5e3cfcefb0b364b5970567f))
- 优化可读性 ([9d4999d](https://github.com/theme-shoka-x/astro-blog-shokax/commit/9d4999df3d8b09c7cf782ece9360891a34d72374))
- 扩展可用三栏卡片 ([c9c32ab](https://github.com/theme-shoka-x/astro-blog-shokax/commit/c9c32ab6fbfb0ae07011d748d2f3587bd47020e0))
- 引入三栏式布局 ([6af9a69](https://github.com/theme-shoka-x/astro-blog-shokax/commit/6af9a696b6f22a3c4a4952da71e78b00e5eb7676))
- 随机文章页面 ([c191cdd](https://github.com/theme-shoka-x/astro-blog-shokax/commit/c191cdd080cf86953160c0b1a69ef5b96c6d7225))
- 针对 shokax hexo 中md语法的兼容 ([ffc0cdf](https://github.com/theme-shoka-x/astro-blog-shokax/commit/ffc0cdf16d7d74f5bdee4312a5d1c50287ba9af0))
- 优化日夜切换动画 ([80a2958](https://github.com/theme-shoka-x/astro-blog-shokax/commit/80a29582284bdb52b6e23b6677e187fae7956d1f))
- 说说功能 ([2169424](https://github.com/theme-shoka-x/astro-blog-shokax/commit/2169424e1c9ddc8d9b3c1d442ccebe8e6b1ea184))
- 文章加密 ([12c38d1](https://github.com/theme-shoka-x/astro-blog-shokax/commit/12c38d12de2c0e17eba6f6767b3d6bd7d382a76b))
- 优化icp备案设置 ([b6cd01e](https://github.com/theme-shoka-x/astro-blog-shokax/commit/b6cd01ea8c90500e3707588ae9811233c2935a3d))
- AI 有关功能 ([cbb791d](https://github.com/theme-shoka-x/astro-blog-shokax/commit/cbb791d6bf5c274f6c4f52f27210730064de718c))
- 优化分隔线视觉效果 ([646704a](https://github.com/theme-shoka-x/astro-blog-shokax/commit/646704adc27295aa451d4fee74ab62f578b9bc46))
- 完成 Stage 4 MDX 适配 ([46b36b0](https://github.com/theme-shoka-x/astro-blog-shokax/commit/46b36b0e23c143c86c897e8e27a7e8a30f71cfb8))
- Quiz ([c3fd063](https://github.com/theme-shoka-x/astro-blog-shokax/commit/c3fd063f8471116c74125d53949eeacdb1f190ec))
- 可视度监听 ([2611a1a](https://github.com/theme-shoka-x/astro-blog-shokax/commit/2611a1aa6d780be58d230a0db7a8b728bf7a0dc9))
- 完成nyx-player适配 ([215905c](https://github.com/theme-shoka-x/astro-blog-shokax/commit/215905cda3091b8c24617c24cf39cef8ca29d16d))
- 完成Stage2 MDX组件适配 ([1156b30](https://github.com/theme-shoka-x/astro-blog-shokax/commit/1156b3039bfbc0d56702c28f8ea63bc66d5d62e2))
- 工具栏 ([7fdb3f3](https://github.com/theme-shoka-x/astro-blog-shokax/commit/7fdb3f3ee5508e699feef9ed0ec69f8ae2654b8f))
- 友链页面 ([d83398d](https://github.com/theme-shoka-x/astro-blog-shokax/commit/d83398d5a87cb0ffe6b4360473a61bfeb185fc35))
- 插件上下文 ([04a12bd](https://github.com/theme-shoka-x/astro-blog-shokax/commit/04a12bd7bcea71413912785a4b0acfcbf8c36274))
- Astro集成与注入点 ([980b627](https://github.com/theme-shoka-x/astro-blog-shokax/commit/980b627643ee8ceda3c612a47f611dac7e8f1f90))
- Plugins骨架 ([d7ee4a8](https://github.com/theme-shoka-x/astro-blog-shokax/commit/d7ee4a8afa8d4f6e644cb966af4ddbc499b72741))
- 适配代码块高级功能 ([119f63c](https://github.com/theme-shoka-x/astro-blog-shokax/commit/119f63c1a3b6f1bd0d22d7503c6520c87795fe66))
- Spoiler ([5ec2887](https://github.com/theme-shoka-x/astro-blog-shokax/commit/5ec28873e6f1b0d77afab8dc9981a089755bee7a))
- 增加转载许可配置 ([b7fe136](https://github.com/theme-shoka-x/astro-blog-shokax/commit/b7fe13664a9beb355c31853401256477a5e59526))
- 代码块高亮颜色自动适配不同主题 ([969caa4](https://github.com/theme-shoka-x/astro-blog-shokax/commit/969caa4ac4de94770a48b0e6618d156a1fd5ddef))
- I18n ([dda09f1](https://github.com/theme-shoka-x/astro-blog-shokax/commit/dda09f162a65fa527751c221ca749ef08823ae1e))
- 代码块全屏功能 ([3a4a625](https://github.com/theme-shoka-x/astro-blog-shokax/commit/3a4a6258694b73887b8028529195a2ba215a33db))
- 首页分页骨架 ([85dfb83](https://github.com/theme-shoka-x/astro-blog-shokax/commit/85dfb83ec3b16485036a26513f0449704b263da6))
- 搜索功能 ([d1f19fa](https://github.com/theme-shoka-x/astro-blog-shokax/commit/d1f19fa2132f84c93729411d3b4b36933efafef1))
- 修正 cover 默认值 ([759f63f](https://github.com/theme-shoka-x/astro-blog-shokax/commit/759f63faac31e53083ce3a0fba4e340946bf48c8))
- 添加 pagefind 索引 ([0815062](https://github.com/theme-shoka-x/astro-blog-shokax/commit/081506200104a484f4cd40a6fcaa106abb0e9065))
- 优化加载动画 ([0ece637](https://github.com/theme-shoka-x/astro-blog-shokax/commit/0ece637c9199342d9d5b9da0f9af5ca480e8198b))
- 修改默认配置 ([8121c30](https://github.com/theme-shoka-x/astro-blog-shokax/commit/8121c30f98a185954a57643b749b273555b4b830))
- 加载动画 ([a21a8db](https://github.com/theme-shoka-x/astro-blog-shokax/commit/a21a8dba9265b379fb3260f9feaca4dae0f79c72))
- 支持 UIKIT 代码块 ([ae8758a](https://github.com/theme-shoka-x/astro-blog-shokax/commit/ae8758af10e1477abcbf545cc2d914c524299ff8))
- 引入codeblock ([d9b0d1e](https://github.com/theme-shoka-x/astro-blog-shokax/commit/d9b0d1e3197bc851db99c25ffed320672fe0127c))
- 配置精选分类 ([156b342](https://github.com/theme-shoka-x/astro-blog-shokax/commit/156b34228e677dcfd6857b54836fa5679fc88e45))
- 优化首屏加载 ([4a16663](https://github.com/theme-shoka-x/astro-blog-shokax/commit/4a16663a68e8e41be480c8417a33ae420d4debf7))
- 实验性字体修改 ([74cbc15](https://github.com/theme-shoka-x/astro-blog-shokax/commit/74cbc15cb66ad12cdef44a064b7e80dbc4ab8c9d))
- 视图过渡 & chore: 杂项优化 ([e1a51d0](https://github.com/theme-shoka-x/astro-blog-shokax/commit/e1a51d00da01f8a10d472d2941d91f78fafa70f9))
- 复原Brand副标题行为 ([9fa3658](https://github.com/theme-shoka-x/astro-blog-shokax/commit/9fa3658ec3e56c0bfd7d944190d7c6668ab70883))
- 复原Brand行为 ([97e2754](https://github.com/theme-shoka-x/astro-blog-shokax/commit/97e27545451b2b62e58e4f739dda7ebac11e4b12))
- Post样式 ([be78926](https://github.com/theme-shoka-x/astro-blog-shokax/commit/be78926e8c96640a07a357486c6d0ee30cb8e680))
- Tags ([5692e7e](https://github.com/theme-shoka-x/astro-blog-shokax/commit/5692e7e2d8f7b3429c0a8352ce0745ca421d49bc))
- 存档页面 ([de4e8b2](https://github.com/theme-shoka-x/astro-blog-shokax/commit/de4e8b2b1fd283a0e4da2e0b69db41187e8f974c))
- 分类页面 ([ca8697e](https://github.com/theme-shoka-x/astro-blog-shokax/commit/ca8697e971f5b3a1c818316a0eef9490cdeca062))
- Post骨架 ([0e3dc70](https://github.com/theme-shoka-x/astro-blog-shokax/commit/0e3dc701a377fd45fbbb4c2e40534ee94706349e))
- Header Cover ([eb79b18](https://github.com/theme-shoka-x/astro-blog-shokax/commit/eb79b1853937ec93cd716c27ca20da08bd64f236))
- Waves 和 Brand ([f523d24](https://github.com/theme-shoka-x/astro-blog-shokax/commit/f523d2492a146095b8dc25e09acd57890a0a855a))
- Index骨架 ([f4bd572](https://github.com/theme-shoka-x/astro-blog-shokax/commit/f4bd57290c9a3c0c0ac1785eb90486c930c239cf))
- Sidebar svelte化 ([9bc3993](https://github.com/theme-shoka-x/astro-blog-shokax/commit/9bc39931edb783fd96145d67a165c84faf4c2330))
- Svelte ([20fed09](https://github.com/theme-shoka-x/astro-blog-shokax/commit/20fed097b5072883acf1ef72c706c25f424c2fcc))

### 🐛 修复

- 升级 astro 以修复 mdx 转义问题 ([d6c5cf2](https://github.com/theme-shoka-x/astro-blog-shokax/commit/d6c5cf20f8720de2faf2a46503a509d0de374211))
- 修复mdx转义问题 ([a17a01c](https://github.com/theme-shoka-x/astro-blog-shokax/commit/a17a01c1afccc4d902efedc45f6582d6ef31f518))
- 修复 percentLabel 可能为负的问题 ([72f11a6](https://github.com/theme-shoka-x/astro-blog-shokax/commit/72f11a69348babe56f43a14b4199caa06096f08f))
- 修复标题过长可能导致首页标签卡样式异常的问题 ([e2ca330](https://github.com/theme-shoka-x/astro-blog-shokax/commit/e2ca330b5bd8967ba80bc43bb2072e56733fec3d))
- 修复侧边栏toggle显示错误问题 ([0c5d0ec](https://github.com/theme-shoka-x/astro-blog-shokax/commit/0c5d0ecd401a726e38aa0717af86f68ac2544341))
- 补充缺失包 ([41d84fe](https://github.com/theme-shoka-x/astro-blog-shokax/commit/41d84fe7b87880c635e5d1a5107c89713d2a8084))
- 修复fixedCover功能 ([eb6bab2](https://github.com/theme-shoka-x/astro-blog-shokax/commit/eb6bab238e88c35a001320a82535b5caf2c9126f))
- 修复路径错误 ([0c346b5](https://github.com/theme-shoka-x/astro-blog-shokax/commit/0c346b53f1ea5bc7aaaab73028b54cd5396c3e27))
- 修复quick btn显示问题 ([4af8687](https://github.com/theme-shoka-x/astro-blog-shokax/commit/4af86871b1fe4ba19f13f41a4e5313af7e882028))
- 链接格式错误 & feat: 快速按钮适配 ([ecb5d1e](https://github.com/theme-shoka-x/astro-blog-shokax/commit/ecb5d1e37c3025c524e6777770516e429fa616ae))
- 修复导入错误 ([5eadee5](https://github.com/theme-shoka-x/astro-blog-shokax/commit/5eadee53693610e923d776393d298f719dc9754e))
- 修复两个路径错误 ([0602b3d](https://github.com/theme-shoka-x/astro-blog-shokax/commit/0602b3d0807c5e1fe48b6eac4393ae011cfc467c))
- 修复代码块图标问题 ([f8dfdea](https://github.com/theme-shoka-x/astro-blog-shokax/commit/f8dfdea4f0f1a4f117ecc9ea77213b1912eb8626))
- 修复错误链接 & feat: edgeone 优化 & feat: sitemap ([8606663](https://github.com/theme-shoka-x/astro-blog-shokax/commit/86066632f89685f6bfcbc8c3a4f9b49eae64286d))
- 修复导航栏会遮挡侧边栏tab按钮的错误 ([d13aebb](https://github.com/theme-shoka-x/astro-blog-shokax/commit/d13aebb8287be206c7c332efdc2fc48d26fcd630))
- 修复侧边栏按钮样式错误 ([db222a2](https://github.com/theme-shoka-x/astro-blog-shokax/commit/db222a2051f9e4dae82628be38126dc1d1256dfe))
- 修复图标与面包屑导航链接错误 ([e56ab36](https://github.com/theme-shoka-x/astro-blog-shokax/commit/e56ab3680c264009b97dae3489b8a450dd9d3fa6))
- 修复加载动画永不停止的问题 ([1e1adfc](https://github.com/theme-shoka-x/astro-blog-shokax/commit/1e1adfcb82150bf18e30103bc05ec287afead02d))
- 修复loading的大小写错误 ([a005f84](https://github.com/theme-shoka-x/astro-blog-shokax/commit/a005f8450f5f5e448f8e24dac65a736a16f2b221))
- 修复移动端切换侧边栏按钮样式错误 ([f33a9d7](https://github.com/theme-shoka-x/astro-blog-shokax/commit/f33a9d7d8c4d44147d25ec383ea7ac2e87a7532f))
- 修复codeblock图标 & 修复codeblock语言显示 ([2a9ee4e](https://github.com/theme-shoka-x/astro-blog-shokax/commit/2a9ee4e0ffb86efb66edbdc9a7cb67232513e336))
- 修复 cn-font-split 的 bun 环境执行错误问题 ([e261e3f](https://github.com/theme-shoka-x/astro-blog-shokax/commit/e261e3fdac4f2e8c401560f4cffa8be03d8e8e27))
- 修复侧边栏和导航栏图标与动画 ([1fd9e8c](https://github.com/theme-shoka-x/astro-blog-shokax/commit/1fd9e8c32ede1e178ad09324f8e5a57805fc5210))
- 修复类型错误 ([a345dd3](https://github.com/theme-shoka-x/astro-blog-shokax/commit/a345dd31eba522b1367ea95f2fe68b2623bd1e11))
- 修复CateCard的样式错误 ([8c44770](https://github.com/theme-shoka-x/astro-blog-shokax/commit/8c44770d261ca7a8c92d96650fb50dd32312b662))
- 修复footer层级错误 & 修复widgets样式作用错误 ([10fa510](https://github.com/theme-shoka-x/astro-blog-shokax/commit/10fa510f3d3e32ad870dcf2813cbd7496b5b5244))

### ⚡ 性能优化

- 服务端替换组件 ([8564c65](https://github.com/theme-shoka-x/astro-blog-shokax/commit/8564c65c5d2587f7334639ebe5e6816ebc8b966e))
- 代码块渲染改为构建时进行 ([0c7552c](https://github.com/theme-shoka-x/astro-blog-shokax/commit/0c7552cb746856d6cbe44404586e99a09005881a))
- 优化滚动性能 ([7fe89d6](https://github.com/theme-shoka-x/astro-blog-shokax/commit/7fe89d66563f95ed61ea7144b45aac7440775d08))
- 改善随机性能 ([93699d8](https://github.com/theme-shoka-x/astro-blog-shokax/commit/93699d8f32cd9056fc700ac62cd84f4b1f098046))
- 优化双栏布局时对moments的获取策略 ([cc5304f](https://github.com/theme-shoka-x/astro-blog-shokax/commit/cc5304fac0156a8bd69ab24dd2f86f2c26c7fd21))
- 优化三栏生成性能 ([464a775](https://github.com/theme-shoka-x/astro-blog-shokax/commit/464a775a756399f80701deb639fba288675102ba))
- 优化无障碍表现 ([4a8eb58](https://github.com/theme-shoka-x/astro-blog-shokax/commit/4a8eb586b3b4edd5d48e8c3bd17745e2c853d4dc))
- 修改默认首页大图 ([083a570](https://github.com/theme-shoka-x/astro-blog-shokax/commit/083a570e9c646aa0dba5965351ed515bf899cef1))
- 优化文章标签卡图片性能 ([a1da3eb](https://github.com/theme-shoka-x/astro-blog-shokax/commit/a1da3ebefc62d42c49f5406d019b3f040304dcf8))
- 使用optional字体 ([5435674](https://github.com/theme-shoka-x/astro-blog-shokax/commit/54356745f15e02f03a3a0a33544c4efe5712aba7))
- 使用@playform/inline提高CSS性能 ([ab352fa](https://github.com/theme-shoka-x/astro-blog-shokax/commit/ab352fa6e92a464e6cd2146e3878c0e359e26cae))
- Sidebar原子化 ([7f68a70](https://github.com/theme-shoka-x/astro-blog-shokax/commit/7f68a702c5959fd037d39dc02e8bbe32943f450b))
- 优化部分CSS性能 ([727d813](https://github.com/theme-shoka-x/astro-blog-shokax/commit/727d8137f510b188c203dc3a0ab5356053dc6e35))
- 修改i18n为全局单例 ([a46e292](https://github.com/theme-shoka-x/astro-blog-shokax/commit/a46e292280094342e249cd9d947b053f44332705))
- 优化author图片加载方式 ([b701324](https://github.com/theme-shoka-x/astro-blog-shokax/commit/b70132427f1d7a50b354750772aa796ad93de91c))
- 优化codeblock性能 ([d28cd43](https://github.com/theme-shoka-x/astro-blog-shokax/commit/d28cd43a2d9bd81fc352ad4d1dfbc237d8a555bd))
- 将brand改为astro组件 ([289ecbd](https://github.com/theme-shoka-x/astro-blog-shokax/commit/289ecbd3cea4ec5d1844d0059a68d89de6901960))
- 视口外暂停waves动画 ([7edbc71](https://github.com/theme-shoka-x/astro-blog-shokax/commit/7edbc710895ca3a8d6f0fc27a5f2b6b2722d8595))
- 优化背景图加载性能 ([6895a2f](https://github.com/theme-shoka-x/astro-blog-shokax/commit/6895a2f3f1fa7b6e5c46ce9692885502dc1d41bc))
- 优化图片性能 ([c944acf](https://github.com/theme-shoka-x/astro-blog-shokax/commit/c944acf0cfc01db7e99635ea92b04a90b2645faa))
- 优化加载体验与CLS ([512f76a](https://github.com/theme-shoka-x/astro-blog-shokax/commit/512f76a1b1cb0aebf589b61277e6f71aad472f18))
- 按需引入与使用字体 ([8b377b8](https://github.com/theme-shoka-x/astro-blog-shokax/commit/8b377b8489b456f87281e1d72c53b9a4372df7e9))
- 优化CLS ([bbbce6c](https://github.com/theme-shoka-x/astro-blog-shokax/commit/bbbce6c12b6a9049777740dd14eb79af206915aa))

### ♻️ 重构

- 提取工具函数 ([f6db12c](https://github.com/theme-shoka-x/astro-blog-shokax/commit/f6db12cb19af3b7f112cba414a1aa8ffc00b26dc))
- 提高代码质量 ([fd075f7](https://github.com/theme-shoka-x/astro-blog-shokax/commit/fd075f75518b416feab4ed4bc70b53cafcf67977))
- 提高 CSS 安全性 & 优化测试 ([58314ad](https://github.com/theme-shoka-x/astro-blog-shokax/commit/58314ad356852ee3163b19fde796b174e019b9ad))
- 统一化设计token ([7e85288](https://github.com/theme-shoka-x/astro-blog-shokax/commit/7e85288f866c219a1cec0e226fc12f4f7d998e86))
- 统一化散落色 ([9762040](https://github.com/theme-shoka-x/astro-blog-shokax/commit/97620406caf59dba108963ac9c3712821fb5405b))
- 重构整体颜色表现 ([8d7677f](https://github.com/theme-shoka-x/astro-blog-shokax/commit/8d7677ff5ae4f450b36c945e383f7630e9a1a650))
- Oklch化 ([055edc5](https://github.com/theme-shoka-x/astro-blog-shokax/commit/055edc5c60d905e8e50f58c72c7251cd00105d68))
- 优化a11y ([77cda71](https://github.com/theme-shoka-x/astro-blog-shokax/commit/77cda716c68f69555603c50d49281a76fca8341d))
- 类型修复 ([8ffbe86](https://github.com/theme-shoka-x/astro-blog-shokax/commit/8ffbe8656851d6862e7fad35e4c3724f269e74bc))
- 美化 Pagefind 样式 ([6330a3e](https://github.com/theme-shoka-x/astro-blog-shokax/commit/6330a3e8731fdc1074095831804e634b0d5f70e6))
- 优化标题可见度 ([6b9520d](https://github.com/theme-shoka-x/astro-blog-shokax/commit/6b9520dc9aa0b99c4e0c181a745e411e26ffeb96))
- 修复部分svelte警告 ([e8bd45a](https://github.com/theme-shoka-x/astro-blog-shokax/commit/e8bd45aec18bcd6377ade20d870a734cabf110b8))
- 使用svg替换内嵌base64 ([95e0204](https://github.com/theme-shoka-x/astro-blog-shokax/commit/95e02042ae55b0194c7c7425412c079f6f6a8de1))
- 优化footer显示效果 ([19c4fb4](https://github.com/theme-shoka-x/astro-blog-shokax/commit/19c4fb49f74d16f55bbbf8cc354fe3e3ae7fd296))
- 优化NavBar可读性 ([4acdb95](https://github.com/theme-shoka-x/astro-blog-shokax/commit/4acdb955d8f16df622b0cae8dadcbc8645722560))
- 独立化插件功能 ([eb65fe1](https://github.com/theme-shoka-x/astro-blog-shokax/commit/eb65fe145dbec07cf40a9044dc7e9233e7e464c4))
- 组件归类 ([b9aa331](https://github.com/theme-shoka-x/astro-blog-shokax/commit/b9aa3315a59dd83f960a12203aba590ac6d2c78a))
- 完成代码块适配 ([596d59b](https://github.com/theme-shoka-x/astro-blog-shokax/commit/596d59b45776d71fe10eac6b0ddbe0fbed651c65))
- 修正不完整的html ([bebd8d4](https://github.com/theme-shoka-x/astro-blog-shokax/commit/bebd8d4a7ee3d3870555052301e5c0fc052a776d))
- 更改image组织形式 ([7e38b4c](https://github.com/theme-shoka-x/astro-blog-shokax/commit/7e38b4c2c656061239fe86e195384a48ad3e5b54))
- 减少svelte使用量 ([4adb03c](https://github.com/theme-shoka-x/astro-blog-shokax/commit/4adb03c6536c57cf25140cd133bff51cad947360))
- 统一化 Post 类型 ([6c0538e](https://github.com/theme-shoka-x/astro-blog-shokax/commit/6c0538e37777f664b7fb7702b438e67b4f392415))
- Svelte 5 & sidebar 重构 ([4bf5e07](https://github.com/theme-shoka-x/astro-blog-shokax/commit/4bf5e0705dbfdad540fa90c0f734a817fadf0920))
- Sidebar & footer样式微调 ([34d46c3](https://github.com/theme-shoka-x/astro-blog-shokax/commit/34d46c3a2b89f7addab97908f0f5559295604485))
- NavBar svelte化 ([ceecdb7](https://github.com/theme-shoka-x/astro-blog-shokax/commit/ceecdb71e9d407f7b8ebdba1ce9fa6481389cd59))

### 💄 样式

- 使用 oxlint 和 oxfmt 规范代码格式 ([78eab17](https://github.com/theme-shoka-x/astro-blog-shokax/commit/78eab17be9008fe45944e5768106b51a02f6c73a))

### 📝 文档

- 更新 lighthouse ([3892883](https://github.com/theme-shoka-x/astro-blog-shokax/commit/3892883833389a1265c9331e82400f9c0209d232))
- README ([c30e599](https://github.com/theme-shoka-x/astro-blog-shokax/commit/c30e599fd8d37dd456e713fd11f4567d43d61253))
- 优化readme ([7851ca8](https://github.com/theme-shoka-x/astro-blog-shokax/commit/7851ca8ae5819e4214001d14588083710cc58567))
- README ([f0b43f1](https://github.com/theme-shoka-x/astro-blog-shokax/commit/f0b43f16551154356567869693418221584b4b6b))
- 优化配置注释 ([8140978](https://github.com/theme-shoka-x/astro-blog-shokax/commit/81409784419dc3999c01f2dcbb909d272264f9a5))
- README ([ab2fdbf](https://github.com/theme-shoka-x/astro-blog-shokax/commit/ab2fdbf96de113807577ac3c6fac4eaf31aea58b))
- README ([df304ff](https://github.com/theme-shoka-x/astro-blog-shokax/commit/df304ffbf57297199e2b9a5d112d1b4538198600))

### 👷 CI

- 强化e2e ([1a15d5b](https://github.com/theme-shoka-x/astro-blog-shokax/commit/1a15d5b7551dd5d62ba7be6deb963305b32a3b10))
- 集成测试 ([8ff1ffc](https://github.com/theme-shoka-x/astro-blog-shokax/commit/8ff1ffcb8f82cd86ecc911a41322c1ad0ca228a3))
- 修复ci ([9d0747d](https://github.com/theme-shoka-x/astro-blog-shokax/commit/9d0747d5a7800e95209d18fa7ff2c4ea6f36b37d))
- 优化lhci流程 ([1d66b65](https://github.com/theme-shoka-x/astro-blog-shokax/commit/1d66b65075d733fdac62f264c446481c8c7be40c))

### ⏪ 回滚

- 回退Image修改 ([54167b2](https://github.com/theme-shoka-x/astro-blog-shokax/commit/54167b23c7d0f48b6e6632d0ba665c868682919e))

### 🔧 杂项

- 版本控制 ([d3734a9](https://github.com/theme-shoka-x/astro-blog-shokax/commit/d3734a911fc08ae13a6bcd5fce1b35f3ec95849b))
- 强化E2E ([cfa3dd3](https://github.com/theme-shoka-x/astro-blog-shokax/commit/cfa3dd3582e151c8f11e265992f86bfa9eb05b33))
- 细化测试 ([7dfe0c5](https://github.com/theme-shoka-x/astro-blog-shokax/commit/7dfe0c51dde7e957662e517d0c218798a8308e02))
- 升级 astro ([bd4f57a](https://github.com/theme-shoka-x/astro-blog-shokax/commit/bd4f57aa58b93dc60958442e44a25e32cb04e877))
- Ci ([ea9b0d1](https://github.com/theme-shoka-x/astro-blog-shokax/commit/ea9b0d19edb9f9f15102bd16edb7ed522106ea49))
- Astro v6 适配 & refactor: oklch 调色盘 ([576c0ad](https://github.com/theme-shoka-x/astro-blog-shokax/commit/576c0adaa22a944ce1ff8491a34c2790bd562e1c))
- 默认两栏布局 ([f3efa3f](https://github.com/theme-shoka-x/astro-blog-shokax/commit/f3efa3f2227325aa32312eb7d5631aa1708ad80d))
- 同步lock ([3765572](https://github.com/theme-shoka-x/astro-blog-shokax/commit/37655726c1c8266969391cd201d859ebc4d1f791))
- 优化调色板 ([b7e9c77](https://github.com/theme-shoka-x/astro-blog-shokax/commit/b7e9c77b15fbf430956fc6e3cdd8bf762ca73a7b))
- 解决oxfmt格式化错误问题 ([b05b908](https://github.com/theme-shoka-x/astro-blog-shokax/commit/b05b908e3d4186409bb265888712ccc9e06e982a))
- 优化 ([5e56a09](https://github.com/theme-shoka-x/astro-blog-shokax/commit/5e56a09a029bbef7a9479ef5cd46579ee7a7b3a8))
- 生态系统适配 ([9560080](https://github.com/theme-shoka-x/astro-blog-shokax/commit/9560080cda9d61d839d7a8a7542c9bce06967a3b))
- 修改默认配置 ([605b42a](https://github.com/theme-shoka-x/astro-blog-shokax/commit/605b42aea4495f913c54bdf7955e216cc3494e25))
- LHCI ([3ab8b64](https://github.com/theme-shoka-x/astro-blog-shokax/commit/3ab8b64b818704b1fffa6f31c256b7b56f9a29c9))
- 更新依赖 ([a65068c](https://github.com/theme-shoka-x/astro-blog-shokax/commit/a65068cda060d1cc9c20ed27e06a452a2160a3db))
- 完成插件适配 ([ed5a288](https://github.com/theme-shoka-x/astro-blog-shokax/commit/ed5a288c902f2c21bf15684377a18d9c1c5d1104))
- Format和依赖更新 ([c1c2bd3](https://github.com/theme-shoka-x/astro-blog-shokax/commit/c1c2bd37b64c099cde8ee7949b9b78ed756039e9))
- 修改页脚链接 ([b325b58](https://github.com/theme-shoka-x/astro-blog-shokax/commit/b325b5817952797a9b877994bd3c06ad0d9efd4d))
- 优化页脚表述 ([1d24878](https://github.com/theme-shoka-x/astro-blog-shokax/commit/1d248785c0ae95470bfdc3e2b83b2ec06a385958))
- 优化页脚表述 ([fb6a09a](https://github.com/theme-shoka-x/astro-blog-shokax/commit/fb6a09a95b080ff374eb6195c0276b18d83b4c0e))
- 更新copilot指令 ([256321b](https://github.com/theme-shoka-x/astro-blog-shokax/commit/256321b845777ec063b200906e7e35aab2c0fbeb))
- 为Edgeone添加HSTS ([84ac99a](https://github.com/theme-shoka-x/astro-blog-shokax/commit/84ac99a841556752cba31fd686a7f457e09063a9))
- 删除turbo ([d479acc](https://github.com/theme-shoka-x/astro-blog-shokax/commit/d479acc55deda3a9ac6aa0283ade85b74e3cce61))
- 使用双requestAnimationFrame优化加载体验 ([48b1152](https://github.com/theme-shoka-x/astro-blog-shokax/commit/48b11527d1172f2b31ce74b96f7acd8b36124e56))
- 优化加载动画效果 ([7d68b48](https://github.com/theme-shoka-x/astro-blog-shokax/commit/7d68b48b91e469b84daac6c7fa93aa98ce9b25ae))
- 字体合规 ([f6ad1a6](https://github.com/theme-shoka-x/astro-blog-shokax/commit/f6ad1a6a86facf34a38dbdad9c2c9524c621fbd8))
- 使用jetbrains的OFL替代通用OFL ([0f55b11](https://github.com/theme-shoka-x/astro-blog-shokax/commit/0f55b117de04e9f4265e3601d4a86c8005efbb60))
- 规范化授权说明 ([3d3adf5](https://github.com/theme-shoka-x/astro-blog-shokax/commit/3d3adf5f587735979384a72b88ae69a4fc10ee3f))
- 修改turbo配置 ([b63cbe1](https://github.com/theme-shoka-x/astro-blog-shokax/commit/b63cbe10c9eafdc9e7ad35b16eb36bb1cc6b4494))
- 修复依赖 ([048d3a1](https://github.com/theme-shoka-x/astro-blog-shokax/commit/048d3a172d05ca73245ca87b3c0a65268e1ba266))
- 去monorepo化 ([392a4ef](https://github.com/theme-shoka-x/astro-blog-shokax/commit/392a4efa1959ff8e73fdf28fe157e609b2533f5f))
- 杂项清理 ([dacb71c](https://github.com/theme-shoka-x/astro-blog-shokax/commit/dacb71c5628aec8d49614f1fd9315b8169d753e9))
- 使用Image ([cc8a7ad](https://github.com/theme-shoka-x/astro-blog-shokax/commit/cc8a7adef867568e483a4ecfda5eb2a96570a6d5))
- 更新版本 ([da740a1](https://github.com/theme-shoka-x/astro-blog-shokax/commit/da740a189e8a8891f317c5fbc1f2591636ae2c7c))
- Turbo ([1168dea](https://github.com/theme-shoka-x/astro-blog-shokax/commit/1168dead6af22ab6f524ab7fe9fd4d747ea9eb2f))
- 整理样式 ([f0c9b0e](https://github.com/theme-shoka-x/astro-blog-shokax/commit/f0c9b0e963a7d14f7bf642fa3e66f5f01767ed2e))
  [2.0.0]: https://github.com/theme-shoka-x/astro-blog-shokax/compare/v1.6.0..v2.0.0
  [1.6.0]: https://github.com/theme-shoka-x/astro-blog-shokax/compare/v1.5.0..v1.6.0
  [1.5.0]: https://github.com/theme-shoka-x/astro-blog-shokax/compare/v1.4.0..v1.5.0
  [1.4.0]: https://github.com/theme-shoka-x/astro-blog-shokax/compare/v1.3.1..v1.4.0
  [1.3.1]: https://github.com/theme-shoka-x/astro-blog-shokax/compare/v1.3.0..v1.3.1
  [1.3.0]: https://github.com/theme-shoka-x/astro-blog-shokax/compare/v1.2.0..v1.3.0
  [1.1.0]: https://github.com/theme-shoka-x/astro-blog-shokax/compare/v1.0.0..v1.1.0

<!-- generated by git-cliff -->
