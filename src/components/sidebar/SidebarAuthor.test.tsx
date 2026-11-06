import { cleanup, render } from "@solidjs/testing-library";
import { afterEach, describe, expect, it } from "vitest";

import SidebarAuthor from "./SidebarAuthor";

/**
 * SidebarAuthor 渲染测试（纯 props 条件渲染）：
 * author/avatarImage/description 各自独立触发对应区块与 schema.org 标记。
 */

afterEach(() => {
  cleanup();
});

describe("SidebarAuthor 作者卡片", () => {
  it("全部 props 为空时不渲染", () => {
    const { container } = render(() => <SidebarAuthor />);
    expect(container.querySelector(".author")).toBeNull();
  });

  it("有 author 时渲染姓名并标记 itemprop=name", () => {
    const { container } = render(() => <SidebarAuthor author="ShokaX" />);
    expect(container.querySelector(".author")).not.toBeNull();
    expect(container.querySelector('[itemprop="name"]')?.textContent).toBe("ShokaX");
  });

  it("有 description 时渲染简介并标记 itemprop=description", () => {
    const { container } = render(() => <SidebarAuthor author="ShokaX" description="博客作者" />);
    expect(container.querySelector('[itemprop="description"]')?.textContent).toBe("博客作者");
  });

  it("仅提供 avatarImage 时也渲染且不出现姓名", () => {
    const { container } = render(() => (
      <SidebarAuthor avatarImage={<img alt="avatar" src="/a.png" />} />
    ));
    expect(container.querySelector(".author")).not.toBeNull();
    expect(container.querySelector('[itemprop="image"] img')).not.toBeNull();
    expect(container.querySelector('[itemprop="name"]')).toBeNull();
  });

  it("三要素齐全时全部渲染", () => {
    const { container } = render(() => (
      <SidebarAuthor
        author="ShokaX"
        description="写作者"
        avatarImage={<img alt="avatar" src="/a.png" />}
      />
    ));
    expect(container.querySelector('[itemprop="name"]')?.textContent).toBe("ShokaX");
    expect(container.querySelector('[itemprop="description"]')?.textContent).toBe("写作者");
    expect(container.querySelector('[itemprop="image"] img')).not.toBeNull();
  });
});
