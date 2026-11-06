type ScrollLockStyle = Pick<CSSStyleDeclaration, "overflow" | "paddingInlineEnd">;

type ScrollLockDocument = {
  body: {
    style: ScrollLockStyle;
  };
  documentElement: {
    clientWidth: number;
  };
};

type ScrollLockWindow = {
  innerWidth: number;
  getComputedPaddingInlineEnd: () => string;
};

let activeScrollLocks = 0;
let previousOverflow = "";
let previousPaddingInlineEnd = "";

function getScrollbarWidth(doc: ScrollLockDocument, win: ScrollLockWindow) {
  return Math.max(0, win.innerWidth - doc.documentElement.clientWidth);
}

function readComputedPaddingInlineEnd(win: ScrollLockWindow) {
  const computedPadding = win.getComputedPaddingInlineEnd();
  const parsedPadding = Number.parseFloat(computedPadding);

  return Number.isFinite(parsedPadding) ? parsedPadding : 0;
}

export function lockBodyScroll(doc: ScrollLockDocument, win: ScrollLockWindow) {
  const { body } = doc;
  let released = false;

  if (activeScrollLocks === 0) {
    previousOverflow = body.style.overflow;
    previousPaddingInlineEnd = body.style.paddingInlineEnd;

    const scrollbarWidth = getScrollbarWidth(doc, win);
    const currentPaddingInlineEnd = readComputedPaddingInlineEnd(win);

    body.style.overflow = "hidden";

    if (scrollbarWidth > 0) {
      body.style.paddingInlineEnd = `${currentPaddingInlineEnd + scrollbarWidth}px`;
    }
  }

  activeScrollLocks += 1;

  return () => {
    if (released) {
      return;
    }

    released = true;
    activeScrollLocks = Math.max(0, activeScrollLocks - 1);

    if (activeScrollLocks > 0) {
      return;
    }

    body.style.overflow = previousOverflow;
    body.style.paddingInlineEnd = previousPaddingInlineEnd;
  };
}
