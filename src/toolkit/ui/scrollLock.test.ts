import { describe, expect, it } from "vitest";
import { lockBodyScroll } from "./scrollLock";

type ScrollLockDocument = Parameters<typeof lockBodyScroll>[0];
type ScrollLockWindow = Parameters<typeof lockBodyScroll>[1];

function createDocumentMock(options?: {
  clientWidth?: number;
  overflow?: string;
  paddingInlineEnd?: string;
}): ScrollLockDocument {
  const { clientWidth = 1184, overflow = "", paddingInlineEnd = "" } = options ?? {};

  return {
    body: {
      style: {
        overflow,
        paddingInlineEnd,
      },
    },
    documentElement: {
      clientWidth,
    },
  };
}

function createWindowMock(options?: {
  innerWidth?: number;
  computedPaddingInlineEnd?: string;
}): ScrollLockWindow {
  const { innerWidth = 1200, computedPaddingInlineEnd = "12px" } = options ?? {};

  return {
    innerWidth,
    getComputedPaddingInlineEnd() {
      return computedPaddingInlineEnd;
    },
  };
}

describe("lockBodyScroll", () => {
  it("locks body scroll and compensates for scrollbar width", () => {
    const doc = createDocumentMock();
    const win = createWindowMock();

    const release = lockBodyScroll(doc, win);

    expect(doc.body.style.overflow).toBe("hidden");
    expect(doc.body.style.paddingInlineEnd).toBe("28px");

    release();

    expect(doc.body.style.overflow).toBe("");
    expect(doc.body.style.paddingInlineEnd).toBe("");
  });

  it("preserves existing inline styles after release", () => {
    const doc = createDocumentMock({
      overflow: "clip",
      paddingInlineEnd: "6px",
    });
    const win = createWindowMock({ computedPaddingInlineEnd: "20px" });

    const release = lockBodyScroll(doc, win);

    expect(doc.body.style.overflow).toBe("hidden");
    expect(doc.body.style.paddingInlineEnd).toBe("36px");

    release();

    expect(doc.body.style.overflow).toBe("clip");
    expect(doc.body.style.paddingInlineEnd).toBe("6px");
  });

  it("keeps the lock until the last consumer releases it", () => {
    const doc = createDocumentMock();
    const win = createWindowMock();

    const releaseFirst = lockBodyScroll(doc, win);
    const releaseSecond = lockBodyScroll(doc, win);

    releaseFirst();

    expect(doc.body.style.overflow).toBe("hidden");
    expect(doc.body.style.paddingInlineEnd).toBe("28px");

    releaseSecond();

    expect(doc.body.style.overflow).toBe("");
    expect(doc.body.style.paddingInlineEnd).toBe("");
  });

  it("does not add padding when there is no scrollbar gap", () => {
    const doc = createDocumentMock({ clientWidth: 1200 });
    const win = createWindowMock({ innerWidth: 1200, computedPaddingInlineEnd: "0px" });

    const release = lockBodyScroll(doc, win);

    expect(doc.body.style.overflow).toBe("hidden");
    expect(doc.body.style.paddingInlineEnd).toBe("");

    release();

    expect(doc.body.style.overflow).toBe("");
    expect(doc.body.style.paddingInlineEnd).toBe("");
  });
});
