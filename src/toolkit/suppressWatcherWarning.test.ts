import { describe, expect, it } from "vitest";

import { shouldSuppressProcessWarning } from "./suppressWatcherWarning";

describe("shouldSuppressProcessWarning", () => {
  it("只屏蔽 FSWatcher 的 MaxListeners 警告", () => {
    expect(
      shouldSuppressProcessWarning(
        "Possible EventTarget memory leak detected. 11 change listeners added to [FSWatcher]. MaxListeners is undefined. Use events.setMaxListeners() to increase limit",
        "MaxListenersExceededWarning",
      ),
    ).toBe(true);
  });

  it("不会屏蔽其他 MaxListeners 警告", () => {
    expect(
      shouldSuppressProcessWarning(
        "Possible EventTarget memory leak detected. 11 change listeners added to [Foo].",
        "MaxListenersExceededWarning",
      ),
    ).toBe(false);
  });

  it("不会屏蔽非 MaxListeners 警告", () => {
    expect(shouldSuppressProcessWarning("Something else happened.", "DeprecationWarning")).toBe(
      false,
    );
  });
});
