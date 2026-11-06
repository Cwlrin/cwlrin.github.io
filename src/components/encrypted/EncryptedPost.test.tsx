import { cleanup, fireEvent, render } from "@solidjs/testing-library";
import { afterEach, beforeAll, beforeEach, describe, expect, it, vi } from "vitest";

import { decryptContent, verifyPassword } from "@/toolkit/encryption/crypto";
import type { EncryptedData, TocItem } from "@/toolkit/encryption/types";
import { initI18n } from "@/i18n";
import { encryptedTocStore } from "@/stores/encryptedTocStore";

import EncryptedPost from "./EncryptedPost";

/**
 * EncryptedPost 解密流程测试：
 * 解锁前展示 PasswordModal、解密展示 innerHTML 内容、带加密 TOC 时解密并写入
 * encryptedTocStore、解密中间态（decrypting 面板）。
 */

vi.mock("@/toolkit/encryption/crypto", () => ({
  decryptContent: vi.fn(),
  verifyPassword: vi.fn(),
}));

const CONTENT: EncryptedData = {
  ciphertext: "content",
  iv: "iv",
  salt: "salt",
  algorithm: "AES-GCM",
  iterations: 100_000,
};

const TOC: EncryptedData = {
  ciphertext: "toc",
  iv: "iv",
  salt: "salt",
  algorithm: "AES-GCM",
  iterations: 100_000,
};

const DECRYPTED_TOC: TocItem[] = [
  { id: "sec-1", text: "第一节", level: 1 },
  { id: "sec-2", text: "第二节", level: 2 },
];

function lockInputOf(container: HTMLElement): HTMLInputElement {
  const el = container.querySelector("input.encrypted-password-input");
  if (!(el instanceof HTMLInputElement)) {
    throw new Error("expected password input");
  }
  return el;
}

function lockFormOf(container: HTMLElement): HTMLFormElement {
  const el = container.querySelector("form.encrypted-password-form");
  if (!(el instanceof HTMLFormElement)) {
    throw new Error("expected form");
  }
  return el;
}

async function unlock(container: HTMLElement, password = "secret") {
  fireEvent.input(lockInputOf(container), { target: { value: password } });
  fireEvent.submit(lockFormOf(container));
  await vi.waitFor(() => expect(decryptContent).toHaveBeenCalled());
}

beforeAll(async () => {
  await initI18n();
});

beforeEach(() => {
  vi.mocked(verifyPassword).mockReset();
  vi.mocked(decryptContent).mockReset();
  sessionStorage.clear();
  encryptedTocStore.clear();
  vi.mocked(verifyPassword).mockResolvedValue(true);
});

afterEach(() => {
  cleanup();
});

describe("EncryptedPost 加密文章", () => {
  it("解锁前展示密码锁定界面", () => {
    const { container } = render(() => <EncryptedPost encryptedContent={CONTENT} />);

    expect(container.querySelector("input.encrypted-password-input")).not.toBeNull();
    expect(container.querySelector(".encrypted-content")).toBeNull();
    expect(container.querySelector(".encrypted-decrypting")).toBeNull();
  });

  it("解密成功后展示正文 innerHTML 且锁定界面消失", async () => {
    vi.mocked(decryptContent).mockResolvedValue("<p>解密正文</p>");
    const { container } = render(() => <EncryptedPost encryptedContent={CONTENT} />);

    await unlock(container);

    expect(container.querySelector(".encrypted-content")?.innerHTML).toBe("<p>解密正文</p>");
    expect(container.querySelector("input.encrypted-password-input")).toBeNull();
  });

  it("带加密 TOC 时解密正文 + TOC 并写入 encryptedTocStore", async () => {
    vi.mocked(decryptContent).mockImplementation(async (data: EncryptedData) => {
      if (data === CONTENT) {
        return "<p>正文</p>";
      }
      if (data === TOC) {
        return JSON.stringify(DECRYPTED_TOC);
      }
      throw new Error("unexpected data");
    });

    const { container } = render(() => (
      <EncryptedPost encryptedContent={CONTENT} encryptedToc={TOC} />
    ));

    await unlock(container);
    await vi.waitFor(() => expect(decryptContent).toHaveBeenCalledTimes(2));

    // 正文 + TOC 各解密一次
    expect(encryptedTocStore.get()).toEqual(DECRYPTED_TOC);
    expect(container.querySelector(".encrypted-content")).not.toBeNull();
  });

  it("TOC 解密期间展示 decrypting 中间面板", async () => {
    // definite-assignment：由 decryptContent 的 executor 在调用时注入
    let resolveToc!: (value: string) => void;
    vi.mocked(decryptContent).mockImplementation(async (data: EncryptedData) => {
      if (data === CONTENT) {
        return "<p>正文</p>";
      }
      if (data === TOC) {
        return new Promise((resolve) => (resolveToc = resolve));
      }
      throw new Error("unexpected data");
    });

    const { container } = render(() => (
      <EncryptedPost encryptedContent={CONTENT} encryptedToc={TOC} />
    ));

    fireEvent.input(lockInputOf(container), { target: { value: "secret" } });
    fireEvent.submit(lockFormOf(container));
    await vi.waitFor(() => expect(container.querySelector(".encrypted-decrypting")).not.toBeNull());

    // TOC promise 挂起 → decrypting 面板可见且锁定界面已隐藏
    expect(container.querySelector(".loading-spinner")).not.toBeNull();
    expect(container.querySelector("input.encrypted-password-input")).toBeNull();
    expect(container.querySelector(".encrypted-content")).toBeNull();

    resolveToc(JSON.stringify(DECRYPTED_TOC));
    await vi.waitFor(() => expect(container.querySelector(".encrypted-content")).not.toBeNull());

    expect(container.querySelector(".encrypted-decrypting")).toBeNull();
    expect(encryptedTocStore.get()).toEqual(DECRYPTED_TOC);
  });

  it("正文解密失败时保持锁定状态不展示内容", async () => {
    vi.mocked(decryptContent).mockRejectedValue(new Error("boom"));
    const { container } = render(() => <EncryptedPost encryptedContent={CONTENT} />);

    await unlock(container);

    expect(container.querySelector("input.encrypted-password-input")).not.toBeNull();
    expect(container.querySelector(".encrypted-content")).toBeNull();
  });
});
