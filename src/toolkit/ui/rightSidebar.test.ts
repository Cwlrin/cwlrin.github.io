import { describe, expect, it } from "vitest";
import {
  RIGHT_SIDEBAR_CARD_ORDER,
  normalizeRightSidebarCardOrder,
  truncateRightSidebarText,
} from "./rightSidebar";

describe("normalizeRightSidebarCardOrder", () => {
  it("在未提供顺序时返回默认卡片顺序", () => {
    expect(normalizeRightSidebarCardOrder()).toEqual([...RIGHT_SIDEBAR_CARD_ORDER]);
  });

  it("会过滤非法项、去重并补齐缺失卡片", () => {
    expect(
      normalizeRightSidebarCardOrder([
        "tagCloud",
        "search",
        "tagCloud",
        "invalid-card",
        "calendar",
      ]),
    ).toEqual(["tagCloud", "search", "calendar", "announcement", "recentMoments", "randomPosts"]);
  });
});

describe("truncateRightSidebarText", () => {
  it("文本长度未超限时保持原值", () => {
    expect(truncateRightSidebarText("hello", 5)).toBe("hello");
    expect(truncateRightSidebarText("你好", 8)).toBe("你好");
  });

  it("文本超限时追加省略号", () => {
    expect(truncateRightSidebarText("abcdefghijklmn", 6)).toBe("abcdef...");
  });
});
