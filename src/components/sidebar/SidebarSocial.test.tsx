import { cleanup, render } from "@solidjs/testing-library";
import { afterEach, describe, expect, it } from "vitest";

import SidebarSocial from "./SidebarSocial";
import type { SocialLink } from "./SidebarTypes";

/**
 * SidebarSocial 渲染测试（纯 props 条件渲染）：
 * 链接渲染、外部跳转属性、合法主题色 token 写入 --social-color。
 * 非法色值回退逻辑由 toolkit/themeColor.test.ts 覆盖。
 */

function linkOf(container: HTMLElement, name: string): HTMLAnchorElement {
  const el = container.querySelector(`a.item.${name}`);
  if (!(el instanceof HTMLAnchorElement)) {
    throw new Error(`expected a.item.${name}`);
  }
  return el;
}

afterEach(() => {
  cleanup();
});

describe("SidebarSocial 社交链接", () => {
  it("无 social 配置时不渲染", () => {
    const { container } = render(() => <SidebarSocial />);
    expect(container.querySelector(".social")).toBeNull();
  });

  it("渲染链接、图标类与外部跳转属性", () => {
    const social: Record<string, SocialLink> = {
      github: { url: "https://github.com/shokax", icon: "i-ri-github-fill" },
    };
    const { container } = render(() => <SidebarSocial social={social} />);

    const link = linkOf(container, "github");
    expect(link.getAttribute("href")).toBe("https://github.com/shokax");
    expect(link.getAttribute("target")).toBe("_blank");
    expect(link.getAttribute("rel")).toBe("noopener noreferrer");
    expect(link.querySelector(".i-ri-github-fill")).not.toBeNull();
  });

  it("合法色值 token 写入 --social-color 自定义属性", () => {
    const social: Record<string, SocialLink> = {
      github: {
        url: "https://github.com/shokax",
        icon: "i-ri-github-fill",
        color: "var(--color-github)",
      },
    };
    const { container } = render(() => <SidebarSocial social={social} />);

    const link = linkOf(container, "github");
    expect(link.style.getPropertyValue("--social-color")).toContain("var(--color-github)");
  });

  it("未提供颜色时不写 --social-color", () => {
    const social: Record<string, SocialLink> = {
      twitter: { url: "https://x.com/shokax", icon: "i-ri-twitter-fill" },
    };
    const { container } = render(() => <SidebarSocial social={social} />);

    const link = linkOf(container, "twitter");
    expect(link.style.getPropertyValue("--social-color")).toBe("");
  });

  it("多个链接全部渲染", () => {
    const social: Record<string, SocialLink> = {
      github: { url: "https://github.com/shokax", icon: "i-ri-github-fill" },
      rss: { url: "/feed.xml", icon: "i-ri-rss-fill" },
      email: { url: "mailto:hi@example.com", icon: "i-ri-mail-fill" },
    };
    const { container } = render(() => <SidebarSocial social={social} />);
    expect(container.querySelectorAll("a.item")).toHaveLength(3);
  });
});
