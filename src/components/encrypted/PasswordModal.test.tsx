import { cleanup, fireEvent, render } from "@solidjs/testing-library";
import { afterEach, beforeAll, beforeEach, describe, expect, it, vi } from "vitest";

import { decryptContent, verifyPassword } from "@/toolkit/encryption/crypto";
import type { EncryptedData } from "@/toolkit/encryption/types";
import { initI18n } from "@/i18n";

import PasswordModal from "./PasswordModal";

/**
 * PasswordModal 加密密码状态机测试：
 * 空密码校验、错误密码清空聚焦、loading 中间态、成功回调与 sessionStorage 存取、异常兜底。
 * crypto 模块打桩（摘要/派生逻辑由 toolkit/encryption 单测覆盖）。
 */

vi.mock("@/toolkit/encryption/crypto", () => ({
  decryptContent: vi.fn(),
  verifyPassword: vi.fn(),
}));

const ENCRYPTED: EncryptedData = {
  ciphertext: "abc",
  iv: "iv",
  salt: "salt",
  algorithm: "AES-GCM",
  iterations: 100_000,
};

function inputOf(container: HTMLElement): HTMLInputElement {
  const el = container.querySelector("input.encrypted-password-input");
  if (!(el instanceof HTMLInputElement)) {
    throw new Error("expected input.encrypted-password-input");
  }
  return el;
}

function formOf(container: HTMLElement): HTMLFormElement {
  const el = container.querySelector("form.encrypted-password-form");
  if (!(el instanceof HTMLFormElement)) {
    throw new Error("expected form");
  }
  return el;
}

function submitButtonOf(container: HTMLElement): HTMLButtonElement {
  const el = container.querySelector("button.encrypted-submit-btn");
  if (!(el instanceof HTMLButtonElement)) {
    throw new Error("expected submit button");
  }
  return el;
}

function errorOf(container: HTMLElement): string {
  return container.querySelector(".encrypted-error")?.textContent ?? "";
}

beforeAll(async () => {
  await initI18n();
});

beforeEach(() => {
  vi.mocked(verifyPassword).mockReset();
  vi.mocked(decryptContent).mockReset();
  sessionStorage.clear();
});

afterEach(() => {
  cleanup();
});

describe("PasswordModal 加密密码表单", () => {
  it("初始渲染：标题/占位符/锁定图标，空密码时提交禁用且无错误", () => {
    const { container } = render(() => <PasswordModal encryptedData={ENCRYPTED} />);

    expect(container.querySelector(".encrypted-title")?.textContent).toBe("文章已加密");
    expect(container.querySelector(".i-ri-lock-line")).not.toBeNull();

    const input = inputOf(container);
    expect(input.getAttribute("type")).toBe("password");
    expect(input.getAttribute("placeholder")).toBe("请输入密码");
    expect(input.getAttribute("autocomplete")).toBe("current-password");

    expect(submitButtonOf(container).disabled).toBe(true);
    expect(errorOf(container)).toBe("");
  });

  it("输入密码后启用提交按钮", () => {
    const { container } = render(() => <PasswordModal encryptedData={ENCRYPTED} />);

    fireEvent.input(inputOf(container), { target: { value: "secret" } });
    expect(submitButtonOf(container).disabled).toBe(false);
  });

  it("空白密码提交：提示必填且不调用 verify", () => {
    const { container } = render(() => <PasswordModal encryptedData={ENCRYPTED} />);

    fireEvent.submit(formOf(container));

    expect(errorOf(container)).toBe("请输入密码");
    expect(verifyPassword).not.toHaveBeenCalled();
  });

  it("密码错误：展示错误文案、清空输入并聚焦回输入框", async () => {
    vi.mocked(verifyPassword).mockResolvedValue(false);

    const { container } = render(() => (
      <PasswordModal encryptedData={ENCRYPTED} errorText="自定义错误" />
    ));

    const input = inputOf(container);
    fireEvent.input(input, { target: { value: "wrong" } });
    fireEvent.submit(formOf(container));
    await vi.waitFor(() => expect(verifyPassword).toHaveBeenCalled());

    expect(verifyPassword).toHaveBeenCalledWith(ENCRYPTED, "wrong");
    expect(errorOf(container)).toBe("自定义错误");
    expect(input.value).toBe("");
    // 错误后聚焦回输入框等待重试
    expect(document.activeElement).toBe(input);
  });

  it("密码正确：解密正文、存储 sessionStorage 并回调 onDecrypted", async () => {
    const onDecrypted = vi.fn();
    vi.mocked(verifyPassword).mockResolvedValue(true);
    vi.mocked(decryptContent).mockResolvedValue("<p>解密内容</p>");

    const { container } = render(() => (
      <PasswordModal encryptedData={ENCRYPTED} onDecrypted={onDecrypted} />
    ));

    fireEvent.input(inputOf(container), { target: { value: "right" } });
    fireEvent.submit(formOf(container));
    await vi.waitFor(() => expect(onDecrypted).toHaveBeenCalled());

    expect(decryptContent).toHaveBeenCalledWith(ENCRYPTED, "right");
    expect(sessionStorage.getItem("encrypted_/")).toBe("right");
    expect(onDecrypted).toHaveBeenCalledWith("<p>解密内容</p>");
    expect(errorOf(container)).toBe("");
  });

  it("解密抛错：展示错误文案且不回调", async () => {
    const onDecrypted = vi.fn();
    vi.mocked(verifyPassword).mockResolvedValue(true);
    vi.mocked(decryptContent).mockRejectedValue(new Error("decrypt failed"));

    const { container } = render(() => (
      <PasswordModal encryptedData={ENCRYPTED} onDecrypted={onDecrypted} />
    ));

    fireEvent.input(inputOf(container), { target: { value: "right" } });
    fireEvent.submit(formOf(container));
    await vi.waitFor(() => expect(errorOf(container)).toBe("密码错误，请重试"));

    expect(onDecrypted).not.toHaveBeenCalled();
  });

  it("loading 中间态：输入与提交禁用、展示加载文案", async () => {
    // definite-assignment：由 mockImplementation 的 executor 在调用时注入
    let resolveVerify!: (value: boolean) => void;
    vi.mocked(verifyPassword).mockImplementation(
      () => new Promise((resolve) => (resolveVerify = resolve)),
    );

    const { container } = render(() => <PasswordModal encryptedData={ENCRYPTED} />);
    const input = inputOf(container);

    fireEvent.input(input, { target: { value: "secret" } });
    fireEvent.submit(formOf(container));

    const submitButton = submitButtonOf(container);
    expect(input.disabled).toBe(true);
    expect(submitButton.disabled).toBe(true);
    expect(submitButton.textContent).toContain("正在解密内容...");
    expect(submitButton.querySelector(".loading-spinner")).not.toBeNull();

    resolveVerify(true);
    await vi.waitFor(() => expect(submitButton.textContent).not.toContain("正在解密内容..."));
    // 解密成功且密码保留：允许再次提交
    expect(submitButton.disabled).toBe(false);
  });

  it("输入过程中清除已有错误", async () => {
    vi.mocked(verifyPassword).mockResolvedValue(false);
    const { container } = render(() => <PasswordModal encryptedData={ENCRYPTED} />);

    const input = inputOf(container);
    fireEvent.input(input, { target: { value: "bad" } });
    fireEvent.submit(formOf(container));
    await vi.waitFor(() => expect(errorOf(container)).toBe("密码错误，请重试"));

    fireEvent.input(input, { target: { value: "new" } });
    expect(errorOf(container)).toBe("");
  });
});
