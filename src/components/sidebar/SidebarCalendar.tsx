import { createMemo, createSignal, For, onMount } from "solid-js";

import { currentLocale, getT, type Locale } from "@/i18n";
import {
  buildCalendarCells,
  formatMonthLabel,
  weekdayLabels,
  weekStartsOnMonday,
} from "@/toolkit/ui/calendar";

import "./sidebarCalendar.css";

/**
 * 侧栏日历（Solid 响应式版，替代 SidebarCalendarPlaceholder 的"构建快照 + is:inline 补丁"）。
 * - SSR 渲染帧：today 取构建时间（与客户端首帧一致，无 hydration mismatch）
 * - 客户端 onMount 后切到真实 now：整网格响应式重渲染（含跨月），零命令式 DOM 补丁
 */
export function SidebarCalendar(props: { locale?: Locale }) {
  const locale = () => props.locale ?? currentLocale;
  const t = () => getT(locale());

  // SSR/首帧 = build 时间；onMount 后取运行时 now（更新 today 高亮与跨月）
  const [now, setNow] = createSignal(new Date());
  onMount(() => {
    setNow(new Date());
  });

  const mondayFirst = createMemo(() => weekStartsOnMonday(locale()));
  const cells = createMemo(() =>
    buildCalendarCells(now().getFullYear(), now().getMonth(), mondayFirst(), now()),
  );
  const monthLabel = createMemo(() =>
    formatMonthLabel(now().getFullYear(), now().getMonth(), locale()),
  );
  const weekdays = createMemo(() => weekdayLabels(locale(), mondayFirst()));

  return (
    <section class="calendar-card">
      <div class="card-head">
        <h3>{t()("sidebar.calendar.title")}</h3>
        <span class="badge">{monthLabel()}</span>
      </div>

      <div class="calendar-grid" aria-hidden="true">
        <For each={weekdays()}>{(label) => <span class="weekday">{label}</span>}</For>
        <For each={cells()}>
          {(cell) => (
            <span
              classList={{
                date: true,
                today: cell.isToday,
                empty: cell.day === null,
              }}
            >
              {cell.day ?? ""}
            </span>
          )}
        </For>
      </div>
    </section>
  );
}
