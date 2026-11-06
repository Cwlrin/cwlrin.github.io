[English](./README.md) | [中文](./README_zh-cn.md)

# Astro Blog ShokaX

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/theme-shoka-x/astro-blog-shokax)
[![使用 EdgeOne Pages 部署](https://cdnstatic.tencentcs.com/edgeone/pages/deploy.svg)](https://edgeone.ai/pages/new?repository-url=https://github.com/theme-shoka-x/astro-blog-shokax)
[![Deploy to Netlify](https://www.netlify.com/img/deploy/button.svg)](https://app.netlify.com/start/deploy?repository=https://github.com/theme-shoka-x/astro-blog-shokax)
[![Deploy to Cloudflare](https://deploy.workers.cloudflare.com/button)](https://deploy.workers.cloudflare.com/?url=https://github.com/theme-shoka-x/astro-blog-shokax)

这是 [Hexo Theme ShokaX](https://github.com/theme-shoka-x/hexo-theme-shokaX) 在 Astro 上的重构版本，使用 Astro + SolidJS + UnoCSS 技术栈

[<img width="1920" height="911" alt="三栏式预览" src="https://github.com/user-attachments/assets/b8ad5bbe-43a3-4c49-a32f-45ba5ba3dcd1" />](https://preview.astro.kaitaku.xyz/)

双栏式布局：
<img width="1920" height="911" alt="双栏式预览" src="https://github.com/user-attachments/assets/df01c009-68cf-4bb3-9148-ff61afc0d159" />

🌐 在线预览（三栏式）：[https://preview.astro.kaitaku.xyz/](https://preview.astro.kaitaku.xyz/)

## ✨ 功能特性

- 延续 ShokaX 原版设计语言的优雅界面
- 内置日间 / 暗夜主题模式
- 双栏和三栏双布局支持
- 通过 Hyc 交互式安装、配置和使用博客
- 基于 Hyacine Plugins 的可扩展插件体系
- 丰富的 Markdown / MDX 增强特性
- 支持标签云、时间线视图与分类树结构
- 基于 Pagefind 的无后端高性能全文搜索
- 独立的友链、文章统计和关于页面支持
- 开箱即用的说说 / 动态支持
- 自动生成智能目录（ToC）
- HyC 赋能的 AI 摘要和 AI 文章推荐
- 基于 AES-256-GCM 和 PBKDF2 的构建时文章加密
- 以性能优先为核心的设计与开发理念
- 更多扩展能力，详见文档说明

## 📦 安装

本项目建议使用 [Node.js](https://nodejs.org/)（v22.12 及以上）与 [pnpm](https://pnpm.io/) 运行。

你可以直接将本仓库 Clone 到本地（并为我们点一个 Star 😜），来开始使用。也可使用[由 HyC 提供的交互式安装支持](https://docs.astro.kaitaku.xyz/start/guides/)

快速开始：

```bash
git clone https://github.com/theme-shoka-x/astro-blog-shokax

cd astro-blog-shokax

pnpm install

# 启动开发服务器
pnpm run dev

# 构建生产版本
pnpm run build
```

现在，你的站点已经可用了。如果你想自定义你的站点，查看完整文档来进行下一步：[ShokaX Astro 文档](https://docs.astro.kaitaku.xyz/start/guides/)

## 📂 项目结构

该项目遵循 Astro 5 和 Vite 的目录规范标准：

```tree
astro-blog-shokax
├── src/                          # 源文件文件夹
│   ├── assets/                   # 图片/字体存放处
│   │   ├── fonts/                # 字体
│   │   ├── images/               # 🌟 封面图片
│   │   ├── icons/                # RemixIcon 的部分图标（用于 Shadow DOM）
│   │   ├── avatar.avif           # 🌟 站点所有者头像
│   ├── components/               # Astro / SolidJS 组件
│   ├── content/                  # 不属于内容集合的内容
│   │   ├── friends-rules.md      # 🌟 友链规则
│   ├── i18n/                     # i18n 系统
│   ├── layouts/                  # 页面布局
│   ├── moments/                  # 🌟 动态/说说内容集合
│   ├── pages/                    # 页面路由
│   ├── posts/                    # 🌟 文章内容集合
│   ├── satteri-plugins/          # Markdown 扩展（Satteri）
│   ├── stores/                   # 全局 Store
│   ├── styles/                   # 非组件化样式表
│   ├── toolkit/                  # 工具函数
│   ├── content.config.ts         # 内容集合配置文件
│   ├── covers.config.ts          # 封面图预设配置
│   ├── theme.config.ts           # 🌟 主题配置文件
│   ├── theme.config.template.txt # HyC 交互式配置模板
├── hyacine.plugin.ts             # 🌟 Hyacine 插件配置文件
├── hyacine.yml                   # HyC 配置文件
├── astro.config.mjs              # 🌟 Astro 配置文件

# 带有 🌟 的是使用本主题时需要关注的文件夹和文件
```

## ⚙️ HyC 能力

ShokaX 内置 `@hyacine/cli` 与 `@hyacine/plugin-*` 插件生态，提供如下能力：

- AI 推荐和总结
- 交互式安装和配置
- 本地轻量 CMS
- 丰富的博客扩展插件（建站时间、点击特效、文章时效性预警、评论系统、音乐播放器、访问量统计等）

```shell
# 建议全局安装（或在本地 pnpm add -D @hyacine/cli 后使用 pnpm hyc）
pnpm add -g @hyacine/cli

hyc sync # 同步数据库和内容集合

# 创建新文章
hyc new "标题"

# 发布文章
hyc publish "标题/slug/文件名"

# 按分类整理文章
hyc sort category

# 启动本地 CMS 和交互式配置
hyc serve
# 访问官方控制台 https://hyc.kaitaku.xyz/ 以开始使用

# Hyacine 插件在 hyacine.plugin.ts 中集中配置
# 支持 site uptime、mouse fireworks、article age warning、vercount、waline 评论、AI 内容、nyx 播放器等
```

## 🚀 性能

我们使用 [LHCI](https://github.com/GoogleChrome/lighthouse-ci) 测试页面性能，每次提交下都有测试结果。我们对页面性能的最低要求为 Lighthouse 桌面 Performance 92+，实际表现在 98-100 之间：

<img width="1702" height="952" alt="lighthouse" src="https://github.com/user-attachments/assets/05b8768f-5f04-4204-8f4f-7f2f6f30e102" />

## ⚠️ 架构约束

以下耦合点与版本锁定，在重大升级前应重新评估：

- **自定义 Markdown 管线**：`@astrojs/markdown-satteri` + `satteri` 整体替换了 Astro 内置的 Markdown/remark/rehype 处理链（见 `astro.config.mjs` → `markdown.processor`）。这是未来 Astro 大版本升级时最大的耦合点——升级 Astro 前需优先验证该处理链。
- **版本锁定**：`astro` 精确固定（`7.2.4`）；`pnpm-workspace.yaml` 的 overrides 锁定 `vite@8.1.3` 与 `rolldown@1.1.4`。这些锁定仍因 Windows 构建稳定性保留（rolldown 新版本在 Windows 虚拟模块场景会崩溃）；依赖升级时应重新评估锁定是否仍必要。
- **加密文章**：AES-256-GCM + PBKDF2（600k 迭代，OWASP 2023 推荐阈值）。密文/salt/iv 随页面 HTML 下发，离线暴力破解始终可行——请使用强密码。加密文章已从 RSS 与 sitemap 中排除。

## 📦 版本控制

ShokaX Astro 遵循 SemVer 进行版本控制，每次版本发布后会设置对应的 Github Releases 和 Git tag（遵循vX.Y.Z格式），你可以通过 checkout 到特定 tag 来更新或回退版本

本部分中 API 指代对外暴露的项目脚本（`build`、`dev`等）、配置及配置项和对外 TS API 等内容

具体而言：我们的版本号使用`x.y.z`格式，并遵循如下发布策略：

### x：主要版本

该版本包括的更改有：

1. 已弃用 API 的删除
2. 底层架构或核心程序的破坏性修改
3. 次要版本或补丁版本允许存在的更改

主要版本升级时，现有项目若未经修改可能会无法运行，且若你自行修改了 ShokaX Astro 的源代码则可能导致大规模 Git 冲突，需自行解决

### y：次要版本

该版本包括的更改有：

1. 宣布特定 API 进入弃用状态（被弃用 API 仅会在下一个主要版本中删除）
2. 加入新功能
3. 对内部实现进行不影响公共 API 的较大规模重构
4. 补丁版本允许存在的更改

次要版本升级时，不会影响对现有项目的兼容性，现有项目无需修改即可升级。

### z：补丁版本

该版本包括的更改有：

1. 对现有错误进行修复
2. 对安全漏洞进行修复
3. 进行性能优化
4. 其他非破坏性小规模改动

补丁版本升级时，不会影响对现有项目的兼容性，现有项目无需修改即可升级。

### 预发布版本

对于主要版本发布前，我们可能会发布预发布版本以收集有关新更改的反馈和进行测试，预发布版本遵循：

1. `alpha`版本的发布策略与主要版本一致，允许引入破坏性修改
2. `beta`版本的发布策略与次要版本一致，但若极为必要仍会引入破坏性修改
3. `rc`版本的发布策略与次要版本一致

预发布版本的格式形如`x.y.z-alpha.1`，且遵循`rc` > `beta` > `alpha`的排序。不建议将预发布版本用于生产环境

## 🖌️ 三栏式布局

我们在 ShokaX Astro 中引入了三栏式布局：

<img width="1920" height="911" alt="三栏式预览" src="https://github.com/user-attachments/assets/b8ad5bbe-43a3-4c49-a32f-45ba5ba3dcd1" />

右侧边栏中可以配置显示卡片和它们的顺序，目前已经支持的有：

- 公告
- 全站搜索
- 日历
- 最近动态
- 随机文章
- 标签云

可通过修改配置文件启用：

```ts
layout: {
  mode: "three-column",
  rightSidebar: {
    order: ["announcement", "search", "calendar", "recentMoments", "randomPosts", "tagCloud"],
    announcement: true,
    search: true,
    calendar: true,
    recentMoments: true,
    randomPosts: true,
    tagCloud: true,
  },
},
```

右侧边栏中仅在宽屏（桌面端）显示，手机端为原双栏布局

## 🤝 贡献

欢迎提交 PR，本项目会使用以下工作流检查代码：

- **静态检查**：Oxlint 代码检查（`pnpm run lint:ci`）、Oxfmt 格式化检查（`pnpm run format:ci`）、Astro 类型与内容检查（`pnpm run check`）、Vitest 单元测试（`pnpm run test`）、部署配置一致性校验（`pnpm run config:deploy:check`）
- **构建与链接检查**：站点构建（`pnpm run build`）与离线死链检查（[Lychee](https://lychee.cli.rs/)）
- **E2E 测试**：基于 Playwright 的多层级端到端测试（Smoke、Critical、Regression）
- **Lighthouse CI**：页面性能断言（Performance >= 0.92，Accessibility >= 0.9，Best Practices >= 0.95，SEO >= 0.95）

如果出现未通过 CI 的情况也可提交 PR，我们会协助修改

本项目采用 AGPL v3 许可证

## 📄 备注

### 有关资源与许可证说明

- 本项目的主要样式与设计理念来自 [Shoka](https://github.com/amehime/hexo-theme-shoka)，但本项目为独立实现，仅在设计理念与风格上受到启发，出于致敬目的，在`licenses`目录下放置 Shoka 的原始 MIT 许可证(LICENSE-shoka)
- 本项目是 [Hexo ShokaX](https://github.com/theme-shoka-x/hexo-theme-shokaX) 的独立自研重写版本，未直接使用其代码与资源，为独立实现，且本仓库由 ShokaX 项目团队直接维护，与 Hexo ShokaX 作者相同，所以本项目使用 ShokaX 作为项目名称
- 本项目中默认的 avatar 图片为 [QuAn\_](https://www.pixiv.net/users/6657532) 的作品，本项目中该图片仅用于展示，版权归原作者所有，用户需自行确认使用合规性，请在正式部署前使用版权可控的图片替换本图片
- 本项目使用了 [Maple Mono](https://font.subf.dev/zh-cn/) 和[霞鹜文楷](https://github.com/lxgw/LxgwWenKai) 作为项目的默认字体，两款字体均为 OFL 1.1 许可证，其分发许可证分别为`licenses/LICENSE-maple-mono.txt`和`licenses/OFL.txt`
  本项目在构建过程中会在遵从 OFL 1.1 许可证的前提下对字体进行子集化、格式转换与压缩
- 本项目默认使用的 cover 来自 [Unsplash](https://unsplash.com/)，遵循 [Unsplash License](https://unsplash.com/license) 使用与分发
- 本项目本身（即根目录下的`LICENSE`）只适用于本项目中的代码资源，对于不包含于上述内容中的其他未标明或未知的非代码资产，本项目本身的 LICENSE 不适用，应视为原作者保留所有权

### 🙏 致谢

ShokaX 开发组向所有 ShokaX 在过去、现在和未来的使用过与可能使用的开源项目与所有 ShokaX 的用户、贡献者和开发者致谢，如果没有他们的支持，我们不可能构建出 ShokaX

其中，这些项目为我们的开发做出了极大的支持，特此再次致谢（随机排列，不分先后）：

- [Astro](https://astro.build/)：本项目的基石
- [UnoCSS](https://unocss.dev/)：现代化的原子 CSS 引擎，彻底解决了在前作中困扰开发组很长时间的图标问题
- [SolidJS](https://www.solidjs.com/)：本项目的前端 UI 框架（JSX + signals）
- [Mizuki](https://github.com/matsuzaka-yuki/Mizuki)：直接启发了开发组进行 Astro 迁移，为我们的迁移提供了极好的榜样
- [Node.js](https://nodejs.org/)：本项目使用的运行时
- [Shoka](https://github.com/amehime/hexo-theme-shoka)：ShokaX 的起源，没有 Shoka 便不可能有 ShokaX
