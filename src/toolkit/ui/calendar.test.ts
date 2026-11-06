import { describe, expect, it } from "vitest";
import {
  buildCalendarCells,
  formatMonthLabel,
  monthInfo,
  weekdayLabels,
  weekdayOrder,
  weekStartsOnMonday,
} from "./calendar";

describe("calendar 纯函数", () => {
  it("zh-CN 周一为首", () => {
    expect(weekStartsOnMonday("zh-CN")).toBe(true);
    expect(weekStartsOnMonday("en-US")).toBe(false);
    expect(weekdayOrder(true)).toEqual([1, 2, 3, 4, 5, 6, 0]);
    expect(weekdayOrder(false)).toEqual([0, 1, 2, 3, 4, 5, 6]);
  });

  it("monthInfo 归一 firstWeekday（周一为首）", () => {
    // 2026-08-01 是周六 → (6+6)%7 = 5，即从索引 5（周六）开始
    const info = monthInfo(2026, 7);
    expect(info.daysInMonth).toBe(31);
    expect(info.firstWeekday).toBe(5);
  });

  it("buildCalendarCells 完整网格（不含今天高亮）", () => {
    const fixed = new Date(2026, 0, 1); // 2026-01-01（固定，与 8 月无关）
    // 2026-08-01 周六，周一为首 → 前 5 格空
    const cells = buildCalendarCells(2026, 7, true, fixed);
    expect(cells.length % 7).toBe(0);
    expect(cells.slice(0, 5).every((c) => c.day === null)).toBe(true);
    expect(cells[5]?.day).toBe(1);
    expect(cells.filter((c) => c.day !== null)).toHaveLength(31);
    // 固定日期在 1 月，8 月无今天
    expect(cells.some((c) => c.isToday)).toBe(false);
  });

  it("buildCalendarCells 高亮 today（注入日期在本月）", () => {
    const fixed = new Date(2026, 7, 15); // 2026-08-15
    const cells = buildCalendarCells(2026, 7, true, fixed);
    const todayCell = cells.find((c) => c.day === 15);
    expect(todayCell?.isToday).toBe(true);
    expect(cells.find((c) => c.day === 14)?.isToday).toBe(false);
  });

  it("buildCalendarCells 周日为首（en 习惯）偏移不同", () => {
    // 2026-08-01 周六 → 周日为首时 lead 6
    const fixed = new Date(2026, 7, 1);
    const cells = buildCalendarCells(2026, 7, false, fixed);
    expect(cells.slice(0, 6).every((c) => c.day === null)).toBe(true);
    expect(cells[6]?.day).toBe(1);
  });

  it("weekdayLabels 本地化长度 7", () => {
    expect(weekdayLabels("zh-CN", true)).toHaveLength(7);
    expect(weekdayLabels("en-US", false)).toHaveLength(7);
  });

  it("formatMonthLabel 本地化", () => {
    expect(formatMonthLabel(2026, 7, "zh-CN")).toContain("2026");
    expect(formatMonthLabel(2026, 7, "zh-CN")).toContain("8");
  });
});
