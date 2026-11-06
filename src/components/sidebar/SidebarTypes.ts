import type { NavItemType } from "../navbar/NavTypes";
import type { ThemeColorValue } from "@/toolkit/themeColor";

export interface SidebarConfig {
  /**
   * 作者名称。
   * - 显示在侧边栏顶部的作者信息区域
   * - 通常配合头像一起展示
   */
  author?: string;

  /**
   * 作者简介。
   * - 显示在作者名称下方
   * - 用于简短的自我介绍或网站说明
   */
  description?: string;

  /**
   * 社交链接配置。
   * - 键名可自定义（如 "github"、"twitter"、"email" 等）
   * - 值为 SocialLink 对象，包含链接地址、图标和颜色
   * - 会在侧边栏显示为图标按钮
   */
  social?: Record<string, SocialLink>;

  /**
   * 侧边栏菜单。
   * - 在侧边栏显示的导航菜单项
   * - 格式与顶部导航栏相同，支持下拉菜单
   * - 可用于快速访问常用页面或分类
   */
  menu?: NavItemType[];
}

export interface SocialLink {
  /**
   * 社交链接地址。
   * - 支持任意 URL（如 "https://github.com/username"）
   * - 邮箱使用 "mailto:" 前缀（如 "mailto:your@email.com"）
   */
  url: string;

  /**
   * 社交图标。
   * - 使用 Iconify Remix Icon 格式：如 "i-ri-github-fill"
   * - 图标会显示为圆形按钮
   */
  icon: string;

  /**
   * 图标颜色（可选）。
   * - 推荐优先使用 design token 引用：`var(--color-*)`
   * - 兼容十六进制与函数色值；不填时使用主题默认颜色
   */
  color?: ThemeColorValue;
}

// TOC (Table of Contents) types
export interface TocItem {
  id: string;
  text: string;
  level: number;
  children?: TocItem[];
}

// Related posts types
export interface RelatedPost {
  slug: string;
  title: string;
  date?: Date;
  category?: string;
}

// Quick navigation types
export interface QuickNavigation {
  prevUrl?: string;
  prevTitle?: string;
  nextUrl?: string;
  nextTitle?: string;
}

// Sidebar panel types
export type PanelType = "overview" | "related" | "contents";

export interface PanelConfig {
  id: PanelType;
  title: string;
  hasContent: boolean;
}

// Extended sidebar props for post pages
export interface PostSidebarProps {
  toc?: TocItem[];
  relatedPosts?: RelatedPost[];
  currentSlug?: string;
  navigation?: QuickNavigation;
}
