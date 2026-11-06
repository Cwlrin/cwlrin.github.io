[English](./README.md) | [中文](./README_zh-cn.md)

# Astro Blog ShokaX

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/theme-shoka-x/astro-blog-shokax)
[![Deploy with EdgeOne Pages](https://cdnstatic.tencentcs.com/edgeone/pages/deploy.svg)](https://edgeone.ai/pages/new?repository-url=https://github.com/theme-shoka-x/astro-blog-shokax)
[![Deploy to Netlify](https://www.netlify.com/img/deploy/button.svg)](https://app.netlify.com/start/deploy?repository=https://github.com/theme-shoka-x/astro-blog-shokax)
[![Deploy to Cloudflare](https://deploy.workers.cloudflare.com/button)](https://deploy.workers.cloudflare.com/?url=https://github.com/theme-shoka-x/astro-blog-shokax)

This project is a reconstruction of [Hexo Theme ShokaX](https://github.com/theme-shoka-x/hexo-theme-shokaX) on Astro, built with Astro + SolidJS + UnoCSS.

[<img width="1920" height="911" alt="Three-column preview" src="https://github.com/user-attachments/assets/b8ad5bbe-43a3-4c49-a32f-45ba5ba3dcd1" />](https://preview.astro.kaitaku.xyz/)

Two-column layout:
<img width="1920" height="911" alt="Two-column preview" src="https://github.com/user-attachments/assets/df01c009-68cf-4bb3-9148-ff61afc0d159" />

🌐 Live preview (three-column): [https://preview.astro.kaitaku.xyz/](https://preview.astro.kaitaku.xyz/)

## ✨ Features

- Elegant UI that continues the original ShokaX design language
- Built-in light / dark theme support
- Support for both two-column and three-column layouts
- Interactive blog installation, configuration, and usage through HyC
- Extensible plugin system powered by Hyacine Plugins
- Rich Markdown / MDX enhancement features
- Tag cloud, timeline view, and category tree support
- Backend-free, high-performance full-text search powered by Pagefind
- Standalone pages for friends links, article statistics, and about
- Built-in moments / status updates support
- Automatically generated smart table of contents (ToC)
- AI summaries and AI article recommendations powered by HyC
- Build-time post encryption based on AES-256-GCM and PBKDF2
- Performance-first design and development philosophy
- More extension capabilities — see the documentation for details

## 📦 Installation

We recommend using [Node.js](https://nodejs.org/) (v22.12 or higher) with [pnpm](https://pnpm.io/) to run this project.

You can clone this repository directly to get started (and maybe drop us a Star 😜), or use the [interactive installation flow provided by HyC](https://docs.astro.kaitaku.xyz/start/guides/).

Quick start:

```bash
git clone https://github.com/theme-shoka-x/astro-blog-shokax

cd astro-blog-shokax

pnpm install

# Start the development server
pnpm run dev

# Build for production
pnpm run build
```

Your site is now ready to use. If you'd like to customize it, check the full documentation for the next step: [ShokaX Astro Docs](https://docs.astro.kaitaku.xyz/start/guides/)

## 📂 Project Structure

This project follows the standard directory conventions of Astro 5 and Vite:

```tree
astro-blog-shokax
├── src/                          # Source files
│   ├── assets/                   # Images / fonts
│   │   ├── fonts/                # Fonts
│   │   ├── images/               # 🌟 Cover images
│   │   ├── icons/                # Part of RemixIcon assets (used for Shadow DOM)
│   │   ├── avatar.avif           # 🌟 Site owner avatar
│   ├── components/               # Astro / SolidJS components
│   ├── content/                  # Content outside collections
│   │   ├── friends-rules.md      # 🌟 Friends link rules
│   ├── i18n/                     # i18n system
│   ├── layouts/                  # Page layouts
│   ├── moments/                  # 🌟 Moments / status content collection
│   ├── pages/                    # Route pages
│   ├── posts/                    # 🌟 Post content collection
│   ├── satteri-plugins/          # Markdown extensions (Satteri)
│   ├── stores/                   # Global stores
│   ├── styles/                   # Non-component stylesheets
│   ├── toolkit/                  # Utilities
│   ├── content.config.ts         # Content collections config
│   ├── covers.config.ts          # Cover image presets
│   ├── theme.config.ts           # 🌟 Theme configuration
│   ├── theme.config.template.txt # HyC interactive config template
├── hyacine.plugin.ts             # 🌟 Hyacine plugin configuration
├── hyacine.yml                   # HyC configuration
├── astro.config.mjs              # 🌟 Astro configuration

# Items marked with 🌟 are the key files/folders you will likely care about when using this theme
```

## ⚙️ HyC Capabilities

ShokaX includes `@hyacine/cli` and the `@hyacine/plugin-*` ecosystem, providing the following capabilities:

- AI recommendations and summaries
- Interactive installation and configuration
- Lightweight local CMS
- Extensible blog plugins (site age, click effects, article age warning, comments, music player, visitor analytics, etc.)

```shell
# Global installation is recommended (or use `pnpm add -D @hyacine/cli` locally and `pnpm hyc`)
pnpm add -g @hyacine/cli

hyc sync # Sync database and content collections

# Create a new post
hyc new "Title"

# Publish a post
hyc publish "title/slug/file-name"

# Sort posts by category
hyc sort category

# Start the local CMS and interactive configuration
hyc serve
# Visit the official console at https://hyc.kaitaku.xyz/ to get started

# Hyacine plugins are configured in hyacine.plugin.ts
# Supports site uptime, mouse fireworks, article age warning, vercount, waline comments, AI content, nyx player, etc.
```

## 🚀 Performance

We use [LHCI](https://github.com/GoogleChrome/lighthouse-ci) to test page performance, and each commit includes test results. Our minimum requirement is Lighthouse desktop Performance 92+, and in practice the score is usually around 98–100:

<img width="1702" height="952" alt="lighthouse" src="https://github.com/user-attachments/assets/05b8768f-5f04-4204-8f4f-7f2f6f30e102" />

## ⚠️ Architecture Constraints

Known coupling points and version pins that should be reviewed before major upgrades:

- **Custom Markdown pipeline.** `@astrojs/markdown-satteri` + `satteri` replace Astro's built-in Markdown/remark/rehype processing (see `astro.config.mjs` → `markdown.processor`). This is the largest coupling point for future Astro major upgrades — verify the processor chain first when bumping Astro.
- **Pinned versions.** `astro` is pinned exactly (`7.2.4`); `pnpm-workspace.yaml` overrides pin `vite@8.1.3` and `rolldown@1.1.4`. These remain for Windows build reliability (rolldown releases break virtual modules on Windows); reassess the pins whenever the underlying packages are upgraded.
- **Encrypted posts.** AES-256-GCM + PBKDF2 (600k iterations, OWASP 2023 recommendation). Ciphertext/salt/IV are shipped in the page HTML, so offline brute-force is always possible; use strong passwords. Encrypted posts are excluded from RSS and sitemap.

## 📦 Versioning

ShokaX Astro follows **SemVer** for version control. Each release will have a corresponding **GitHub Release** and **Git tag** (following the `vX.Y.Z` format). You can update or roll back to a specific version by checking out the corresponding tag.

In this section, **API** refers to publicly exposed project scripts (such as `build`, `dev`, etc.), configurations and configuration options, and external TypeScript APIs.

Specifically, our version numbers follow the format `x.y.z` and adhere to the following release strategy:

### 1. `x`: Major Version

This version includes changes such as:

1. Removal of deprecated APIs
2. Breaking changes to the underlying architecture or core system
3. Changes that are also allowed in minor or patch versions

When upgrading a **major version**, existing projects may fail to run without modification. Additionally, if you have modified the source code of ShokaX Astro yourself, it may cause large-scale Git conflicts that must be resolved manually.

### 2. `y`: Minor Version

This version includes changes such as:

1. Marking specific APIs as **deprecated** (deprecated APIs will only be removed in the next major version)
2. Introducing new features
3. Large-scale internal refactoring that does **not** affect the public API
4. Changes that are also allowed in patch versions

Upgrading a **minor version** will not affect compatibility with existing projects. Existing projects can upgrade without modification.

### 3. `z`: Patch Version

This version includes changes such as:

1. Bug fixes
2. Security vulnerability fixes
3. Performance improvements
4. Other small, non-breaking changes

Upgrading a **patch version** will not affect compatibility with existing projects. Existing projects can upgrade without modification.

### Pre-release Versions

Before releasing a **major version**, we may publish **pre-release versions** to gather feedback and conduct testing for new changes. The pre-release policies are:

1. **`alpha` releases** follow the same strategy as major versions and may introduce breaking changes.
2. **`beta` releases** follow the strategy of minor versions, but may introduce breaking changes if absolutely necessary.
3. **`rc` (Release Candidate) releases** follow the strategy of minor versions.

The format of a pre-release version is `x.y.z-alpha.1`, and the precedence order is:

`rc` > `beta` > `alpha`

It is **not recommended** to use pre-release versions in production environments.

## 🖌️ Three-Column Layout

We have introduced a three-column layout in ShokaX Astro:

<img width="1920" height="911" alt="Three-column layout preview" src="https://github.com/user-attachments/assets/b8ad5bbe-43a3-4c49-a32f-45ba5ba3dcd1" />

You can configure which cards are shown in the right sidebar and in what order. The currently supported cards are:

- Announcement
- Site search
- Calendar
- Recent moments
- Random posts
- Tag cloud

You can enable it by editing the configuration file:

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

The right sidebar is shown only on wide screens (desktop). On mobile, the original two-column layout is used.

## 🤝 Contributing

Pull requests are welcome. The project uses the following workflows to validate changes:

- **Static Checks**: Oxlint (`pnpm run lint:ci`), Oxfmt (`pnpm run format:ci`), Astro check (`pnpm run check`), Vitest unit tests (`pnpm run test`), and deploy config consistency checks (`pnpm run config:deploy:check`)
- **Build & Link Verification**: Site build (`pnpm run build`) and offline dead link check ([Lychee](https://lychee.cli.rs/))
- **E2E Testing**: Multi-level end-to-end tests powered by Playwright (Smoke, Critical, Regression)
- **Lighthouse CI**: Page performance assertions (Performance >= 0.92, Accessibility >= 0.9, Best Practices >= 0.95, SEO >= 0.95)

If CI does not pass, you can still submit a PR and we will help improve it.

This project is licensed under AGPL v3.

## 📄 Notes

### About assets and licensing

- The main styles and design philosophy of this project are inspired by [Shoka](https://github.com/amehime/hexo-theme-shoka). However, this project is an independent implementation. To pay tribute, the original MIT license of Shoka is included in the `licenses` directory as `LICENSE-shoka`.
- This project is an independently developed rewrite of [Hexo ShokaX](https://github.com/theme-shoka-x/hexo-theme-shokaX). It does not directly reuse its code or assets. It is maintained directly by the ShokaX project team, which is also why the project uses the ShokaX name.
- The default avatar image in this project is artwork by [QuAn\_](https://www.pixiv.net/users/6657532). It is included for demonstration purposes only and remains the property of the original author. Please replace it with an asset you are authorized to use before deploying to production.
- This project uses [Maple Mono](https://font.subf.dev/zh-cn/) and [LXGW WenKai](https://github.com/lxgw/LxgwWenKai) as the default fonts. Both are distributed under the OFL 1.1 license, with license texts available at `licenses/LICENSE-maple-mono.txt` and `licenses/OFL.txt` respectively.
  During the build process, fonts may be subsetted, converted, and compressed in compliance with OFL 1.1.
- The default cover images in this project come from [Unsplash](https://unsplash.com/) and are used and distributed under the [Unsplash License](https://unsplash.com/license).
- The project's own `LICENSE` in the repository root applies only to the code assets in this project. For any non-code assets not covered above or not explicitly identified, the root license does not apply and rights should be considered reserved by the original author.

### 🙏 Acknowledgements

The ShokaX development team would like to thank every open source project, user, contributor, and developer who has supported ShokaX in the past, present, and future. Without them, this project would not exist.

These projects in particular have provided tremendous support during development, and we would like to thank them again here (in no particular order):

- [Astro](https://astro.build/): the foundation of this project
- [UnoCSS](https://unocss.dev/): a modern atomic CSS engine that completely solved the icon issues that troubled the team for a long time in earlier iterations
- [SolidJS](https://www.solidjs.com/): the frontend UI framework used in this project (JSX + signals)
- [Mizuki](https://github.com/matsuzaka-yuki/Mizuki): directly inspired the team's Astro migration and provided an excellent example to follow
- [Node.js](https://nodejs.org/): the runtime used in this project
- [Shoka](https://github.com/amehime/hexo-theme-shoka): the origin of ShokaX — without Shoka, ShokaX would not exist
