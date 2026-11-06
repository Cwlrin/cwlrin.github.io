import { describe, expect, it } from "vitest";
import { resolveExcerpt, toPlainExcerptSource } from "./excerpt";

describe("toPlainExcerptSource", () => {
  it("去掉标题、列表与强调符号，只留正文", () => {
    const body =
      "## 目前常用的程序调试方式\n\n- **串口调试**：通过串口通信\n- 显示屏调试：直接看屏幕";
    expect(toPlainExcerptSource(body)).toBe(
      "目前常用的程序调试方式 串口调试：通过串口通信 显示屏调试：直接看屏幕",
    );
  });

  it("丢弃代码块，保留代码块之外的内容", () => {
    const body = "前言\n\n```cpp\nint main() { return 0; }\n```\n\n结尾说明";
    const plain = toPlainExcerptSource(body);
    expect(plain).not.toContain("int main");
    expect(plain).toContain("前言");
    expect(plain).toContain("结尾说明");
  });

  it("链接保留文字、图片整体丢弃", () => {
    const body = "![封面](https://example.com/a.png) 参见 [官方文档](https://example.com/doc)";
    expect(toPlainExcerptSource(body)).toBe("参见 官方文档");
  });
});

describe("resolveExcerpt", () => {
  it("没有 description 时用清理过的正文", () => {
    const excerpt = resolveExcerpt({ body: "# 标题\n\n正文内容" });
    expect(excerpt).toBe("标题 正文内容");
  });

  it("description 优先于正文", () => {
    const excerpt = resolveExcerpt({
      body: "正文内容",
      data: { description: "自定义摘要" },
    });
    expect(excerpt).toBe("自定义摘要");
  });

  it("加密文章且无占位摘要时不暴露正文", () => {
    const excerpt = resolveExcerpt({
      body: "机密内容",
      data: { encrypted: true },
    });
    expect(excerpt).toBe("");
  });

  it("按码点截断，不切断 emoji", () => {
    expect(resolveExcerpt({ body: "😀😀😀" }, { length: 2 })).toBe("😀😀");
  });
});
