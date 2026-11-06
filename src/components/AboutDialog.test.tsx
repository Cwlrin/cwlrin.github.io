import { cleanup, fireEvent, render } from "@solidjs/testing-library";
import { afterEach, beforeAll, describe, expect, it, vi } from "vitest";

import { initI18n } from "@/i18n";

import AboutDialog from "./AboutDialog";

/**
 * AboutDialog 聊天树状态机测试：
 * 首节点初始化、选项推进（user 消息 + bot 回复）、无效 nextId 兜底、typing 期间
 * 屏蔽交互、restart 重置、空 nodes 兜底、作者头像/首字回退、结束提示。
 *
 * 依赖 setup.ts 的同步 rAF stub；typingDelayMs=0 让推进无需等待动画时长。
 */

const NODES = [
  {
    id: "intro",
    text: "欢迎来到本站",
    options: [{ label: "了解作者", reply: "想了解", nextId: "about" }],
  },
  {
    id: "about",
    text: "我是站长",
    options: [{ label: "返回", reply: "返回吧", nextId: "intro" }],
  },
];

const BROKEN = [
  { id: "intro", text: "入口", options: [{ label: "死路", reply: "去", nextId: "missing" }] },
];

function renderDialog() {
  return render(() => <AboutDialog nodes={NODES} typingDelayMs={0} authorName="站长" />);
}

/** 非 typing 的气泡消息文本（不含打字指示器） */
function messagesOf(container: HTMLElement): string[] {
  return Array.from(container.querySelectorAll(".message-bubble:not(.typing-bubble)")).map(
    (el) => el.textContent ?? "",
  );
}

function optionButtonOf(container: HTMLElement, index: number): HTMLButtonElement {
  const el = container.querySelectorAll("button.option-button")[index];
  if (!(el instanceof HTMLButtonElement)) {
    throw new Error(`expected option-button #${index}`);
  }
  return el;
}

function optionLabels(container: HTMLElement): string[] {
  return Array.from(container.querySelectorAll("button.option-button")).map(
    (el) => el.textContent ?? "",
  );
}

beforeAll(async () => {
  await initI18n();
});

afterEach(() => {
  cleanup();
});

describe("AboutDialog 聊天树", () => {
  it("初始渲染首节点消息与选项、作者名与重启按钮", () => {
    const { container } = renderDialog();

    expect(messagesOf(container)).toEqual(["欢迎来到本站"]);
    expect(container.querySelector(".author-name")?.textContent).toBe("站长");
    expect(optionLabels(container)).toEqual(["了解作者"]);
    expect(container.querySelector("button.restart-button")).not.toBeNull();
  });

  it("无头像时用作者名首字作为头像回退", () => {
    const { container } = renderDialog();
    expect(container.querySelector(".author-avatar span")?.textContent).toBe("站");
    expect(container.querySelector(".author-avatar img")).toBeNull();
  });

  it("提供 authorAvatar 时渲染头像图", () => {
    const { container } = render(() => (
      <AboutDialog nodes={NODES} typingDelayMs={0} authorName="站长" authorAvatar="/avatar.png" />
    ));
    const img = container.querySelector(".author-avatar img");
    expect(img?.getAttribute("src")).toBe("/avatar.png");
    expect(container.querySelector(".author-avatar span")).toBeNull();
  });

  it("点击选项推进对话：user 消息 + typing 屏蔽 + bot 回复", async () => {
    const { container } = renderDialog();

    fireEvent.click(optionButtonOf(container, 0));

    // user 消息立即出现且进入 typing 态（气泡与按钮禁用）
    expect(messagesOf(container)).toContain("想了解");
    expect(container.querySelector(".typing-bubble")).not.toBeNull();
    expect(optionButtonOf(container, 0).disabled).toBe(true);
    expect(container.querySelector("button.restart-button")?.hasAttribute("disabled")).toBe(true);

    // typing 结束后 bot 回复，选项更新为下一节点
    await vi.waitFor(() => expect(messagesOf(container)).toContain("我是站长"));

    expect(container.querySelector(".typing-bubble")).toBeNull();
    expect(optionLabels(container)).toEqual(["返回"]);
    expect(optionButtonOf(container, 0).disabled).toBe(false);
  });

  it("无效 nextId 回退到未配置提示文案且保留当前选项供再选", async () => {
    const { container } = render(() => (
      <AboutDialog nodes={BROKEN} typingDelayMs={0} authorName="站长" />
    ));

    fireEvent.click(optionButtonOf(container, 0));
    await vi.waitFor(() =>
      expect(messagesOf(container)).toContain("这个分支还没配置完成，请先选择其它选项。"),
    );

    // 分支未配置时保留当前节点选项，避免用户被困死
    expect(optionLabels(container)).toEqual(["死路"]);
  });

  it("restart 重置对话回到首节点", async () => {
    const { container } = renderDialog();

    fireEvent.click(optionButtonOf(container, 0));
    await vi.waitFor(() => expect(messagesOf(container)).toContain("我是站长"));

    const restart = container.querySelector("button.restart-button");
    if (!(restart instanceof HTMLButtonElement)) {
      throw new Error("expected restart button");
    }
    fireEvent.click(restart);

    expect(messagesOf(container)).toEqual(["欢迎来到本站"]);
    expect(optionLabels(container)).toEqual(["了解作者"]);
  });

  it("空 nodes 展示未配置提示与结束提示", () => {
    const { container } = render(() => (
      <AboutDialog nodes={[]} typingDelayMs={0} endHint="对话已结束" />
    ));

    expect(messagesOf(container)).toContain("还没有配置对话节点。");
    expect(container.querySelector(".options-grid")).toBeNull();
    expect(container.querySelector(".dialog-end")?.textContent).toContain("对话已结束");
  });
});
