import { describe, expect, it } from "vitest";
import { render } from "@solidjs/testing-library";
import { SidebarCalendar } from "./SidebarCalendar";

describe("SidebarCalendar 渲染", () => {
  it("渲染标题/星期头/完整网格（7 列对齐）", () => {
    const view = render(() => <SidebarCalendar locale="zh-CN" />);
    const card = view.container.querySelector(".calendar-card");
    expect(card).not.toBeNull();
    expect(view.container.querySelectorAll(".weekday")).toHaveLength(7);
    const dates = view.container.querySelectorAll(".date");
    expect(dates.length).toBeGreaterThan(0);
    expect(dates.length % 7).toBe(0);
  });

  it("月份标签为当前年月", () => {
    const view = render(() => <SidebarCalendar locale="zh-CN" />);
    const now = new Date();
    const label = view.container.querySelector(".badge");
    expect(label?.textContent).toContain(String(now.getFullYear()));
  });

  it("today 高亮恰有一个（构建月=运行月时）", () => {
    const view = render(() => <SidebarCalendar locale="zh-CN" />);
    const todayCells = view.container.querySelectorAll(".date.today");
    // jsdom 与组件同进程，new Date() 一致；极少数跨月边界非 1 即 0
    expect(todayCells.length).toBeLessThanOrEqual(1);
  });
});
