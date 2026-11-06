/**
 * 日历网格纯函数（SSR 快照 + 客户端 live 修正复用同一渲染源）。
 * 原 SidebarCalendarPlaceholder 采用"构建快照 + is:inline 运行时打补丁"双份逻辑，
 * 这里把网格生成收敛为单一纯函数：fixedDate 给定 → 输出完整网格。
 */

export interface CalendarCell {
  /** 日期数字；null 表示该网格位置为空（月首偏移/月末补齐） */
  day: number | null;
  /** 是否为 today（按传入日期判定，构建期与客户端一致） */
  isToday: boolean;
}

export interface CalendarMonth {
  year: number;
  month: number; // 0-11
  daysInMonth: number;
  firstWeekday: number; // 0=周日..6=周六（按 UI 首列规则归一）
}

/** 按 locale 决定一周首日：zh-CN 等东亚习惯周一为首，其余周日（Intl 默认） */
export function weekStartsOnMonday(locale: string): boolean {
  return locale === "zh-CN";
}

export function monthInfo(year: number, month: number): CalendarMonth {
  const monthStart = new Date(year, month, 1);
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  return {
    year,
    month,
    daysInMonth,
    firstWeekday: (monthStart.getDay() + 6) % 7, // 归一：周一为首时 0=周一
  };
}

/** 周一为首：[一..日]；周日为首：[日..六]（0=周日） */
export function weekdayOrder(mondayFirst: boolean): number[] {
  return mondayFirst ? [1, 2, 3, 4, 5, 6, 0] : [0, 1, 2, 3, 4, 5, 6];
}

/** 完整 6×7（或 5×7）网格：月首偏移 + 全月日期 + 月末补齐
 * @param today 注入当前日期（默认运行时 now）——测试可固定日期 */
export function buildCalendarCells(
  year: number,
  month: number,
  mondayFirst: boolean,
  today: Date = new Date(),
): CalendarCell[] {
  const { daysInMonth, firstWeekday } = monthInfo(year, month);
  // mondayFirst 时 firstWeekday 已是周一归一；周日为首时用原始 getDay()
  const leadSpaces = mondayFirst ? firstWeekday : new Date(year, month, 1).getDay();
  const cells: CalendarCell[] = [];

  for (let index = 0; index < leadSpaces; index += 1) {
    cells.push({ day: null, isToday: false });
  }

  const isCurrentMonth = today.getFullYear() === year && today.getMonth() === month;
  for (let day = 1; day <= daysInMonth; day += 1) {
    cells.push({ day, isToday: isCurrentMonth && day === today.getDate() });
  }

  while (cells.length % 7 !== 0) {
    cells.push({ day: null, isToday: false });
  }
  return cells;
}

/** 当前月标签（如 2026年8月） */
export function formatMonthLabel(year: number, month: number, locale: string): string {
  return new Intl.DateTimeFormat(locale, {
    year: "numeric",
    month: "long",
  }).format(new Date(year, month, 1));
}

/** 星期短标签数组（周一为首或周日为首，本地化） */
export function weekdayLabels(locale: string, mondayFirst: boolean): string[] {
  const formatter = new Intl.DateTimeFormat(locale, { weekday: "short" });
  return weekdayOrder(mondayFirst).map((day) =>
    formatter.format(new Date(2026, 2, 1 + ((day + 7) % 7))),
  );
}
