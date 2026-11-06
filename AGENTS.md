# AGENTS.md — astro-blog-shokax

本文件定义你在此仓库工作的最小安全边界与执行流程。

## 运行环境与总原则

- 运行时与包管理器：**Node.js ≥ 22.12 + pnpm**（`packageManager: pnpm@11.22.0`）
- 默认沟通语言：**中文**（输出与代码注释优先中文）
- 优先使用仓库脚本，不要自创命令
- 路由要求：`trailingSlash: "always"`（内部链接保留尾 `/`）
- 不要随意偏离现有架构（Astro + SolidJS + UnoCSS + Pagefind）
- SolidJS 交互代码遵循现有风格（createSignal/createEffect/createMemo + JSX）
- 有代码改动后至少执行：
  1. `pnpm run format`
  2. `pnpm run lint`
  3. `pnpm run check`

## 注释

- 默认中文输出与中文注释
- 不要新增“工作总结 Markdown 报告”文件

## 已知踩坑（防再犯）

- **UnoCSS 工具类挟持**：UnoCSS 会为扫描到的每个 class 名生成工具类，用作样式钩子的 id/class 一旦与工具类重名（如 `contents`→`display: contents`）就会被覆盖。样式钩子类名加业务前缀（`panel-*`），或显隐规则用更高特异性选择器（`.panels .panel`）防御。
- **框架渲染与手改 DOM class 是双写者**：Solid/React 重新渲染 `className` 会整体覆盖 JS 直接 `classList.add()` 的类（曾致分类卡片悬停时 `show` 丢失、卡片消失）。动态可见等状态一律收编为组件状态，class 由唯一来源拼装。
- **shadow DOM 样式够不着 slot 分发内容**：`<code-block>` 等自定义元素 shadow 内 `:host pre`/`:host code` 选择器不匹配 light DOM 子元素；作用于插槽内容的样式放全局 CSS（宿主前缀选择器 `code-block pre`）或 `::slotted`（无法带后代选择器）。shadow 内只留结构样式，内容样式见 `src/styles/code-block-light.css`。
- **CSS 默认隐藏 + JS 异步加显示类很脆**：默认 `opacity/display` 隐藏、由脚本迟加显示类的模式，水合失败或 class 被重写时内容就“消失”。能默认可见就默认可见，或用 Solid 状态驱动。

## 代码标准

- 可复用独立 helper 优先放置到`/src/toolkit/`中，并编写独立单元测试
- 较为复杂的 UI 组件或页面需编写对应 E2E 测试
- 如果需要添加测试用或展示效果的 Markdown/MDX 页面，优先复用现有文件
