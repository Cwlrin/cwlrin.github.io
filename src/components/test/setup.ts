/**
 * dom project 共享测试环境补齐（jsdom 已知缺口）。
 *
 * 1. jsdom 30 的 HTMLDialogElement 为空实现（无 showModal/close）：组件只依赖
 *    open 反射属性 + showModal()/close()，这里用 defineProperty 补最小语义。
 * 2. jsdom 不提供 requestAnimationFrame/scrollTo——AboutDialog 等滚动组件依赖；
 *    同步 rAF 让 async 流程在真实微任务中完成。
 */
if (
  typeof HTMLDialogElement !== "undefined" &&
  HTMLDialogElement.prototype.showModal === undefined
) {
  Object.defineProperty(HTMLDialogElement.prototype, "showModal", {
    configurable: true,
    value(this: HTMLDialogElement): void {
      this.open = true;
    },
  });

  Object.defineProperty(HTMLDialogElement.prototype, "close", {
    configurable: true,
    value(this: HTMLDialogElement): void {
      this.open = false;
    },
  });
}

if (typeof window !== "undefined" && typeof window.requestAnimationFrame !== "function") {
  Object.defineProperty(window, "requestAnimationFrame", {
    configurable: true,
    value(callback: FrameRequestCallback): number {
      callback(0);
      return 0;
    },
  });

  Object.defineProperty(window, "cancelAnimationFrame", {
    configurable: true,
    value(): void {},
  });
}

if (typeof HTMLElement !== "undefined" && HTMLElement.prototype.scrollTo === undefined) {
  Object.defineProperty(HTMLElement.prototype, "scrollTo", {
    configurable: true,
    value(): void {},
  });
}
