import { createSignal } from "solid-js";

import type { EncryptedData } from "@/toolkit/encryption/types";
import { decryptContent, verifyPassword } from "@/toolkit/encryption/crypto";
import { currentLocale, getT } from "@/i18n";

interface PasswordModalProps {
  encryptedData: EncryptedData;
  title?: string;
  passwordPlaceholder?: string;
  submitText?: string;
  errorText?: string;
  onDecrypted?: (content: string) => void;
}

function PasswordModal(props: PasswordModalProps) {
  const t = getT(currentLocale);

  const title = () => props.title || t("encrypted.title");
  const passwordPlaceholder = () => props.passwordPlaceholder || t("encrypted.passwordPlaceholder");
  const submitText = () => props.submitText || t("encrypted.submit");
  const errorText = () => props.errorText || t("encrypted.error");

  const [password, setPassword] = createSignal("");
  const [isLoading, setIsLoading] = createSignal(false);
  const [error, setError] = createSignal("");
  let inputRef: HTMLInputElement | null = null;

  async function handleSubmit(e: Event) {
    e.preventDefault();

    if (!password().trim()) {
      setError(t("encrypted.passwordRequired"));
      return;
    }

    setIsLoading(true);
    setError("");

    try {
      const isValid = await verifyPassword(props.encryptedData, password());
      if (isValid) {
        const content = await decryptContent(props.encryptedData, password());
        // 保存密码到 sessionStorage
        sessionStorage.setItem(`encrypted_${window.location.pathname}`, password());
        props.onDecrypted?.(content);
      } else {
        setError(errorText());
        setPassword("");
        // 先解除 loading 态：disabled 输入框无法获得焦点，focus 需在可聚焦后调用
        setIsLoading(false);
        inputRef?.focus();
      }
    } catch {
      setError(errorText());
      setPassword("");
      setIsLoading(false);
      inputRef?.focus();
    } finally {
      setIsLoading(false);
    }
  }

  function handleInput(e: Event) {
    const target = e.target;
    if (!(target instanceof HTMLInputElement)) {
      return;
    }
    setPassword(target.value);
    if (error()) {
      setError("");
    }
  }

  return (
    <div class="encrypted-post encrypted-lock-screen">
      <div class="encrypted-lock-icon">
        <i class="i-ri-lock-line"></i>
      </div>

      <h2 class="encrypted-title">{title()}</h2>

      <p class="encrypted-description">{t("encrypted.description")}</p>

      <form class="encrypted-password-form" onsubmit={handleSubmit}>
        <input
          ref={(el) => (inputRef = el)}
          type="password"
          class="encrypted-password-input"
          placeholder={passwordPlaceholder()}
          value={password()}
          onInput={handleInput}
          disabled={isLoading()}
          autocomplete="current-password"
        />

        <button
          type="submit"
          class="encrypted-submit-btn"
          disabled={isLoading() || !password().trim()}
        >
          {isLoading() ? (
            <>
              <span class="loading-spinner"></span>
              <span>{t("encrypted.decrypting")}</span>
            </>
          ) : (
            <>
              <i class="i-ri-lock-unlock-line"></i>
              <span>{submitText()}</span>
            </>
          )}
        </button>

        {error() && (
          <div class="encrypted-error">
            <i class="i-ri-error-warning-line icon"></i>
            <span>{error()}</span>
          </div>
        )}
      </form>
    </div>
  );
}

export default PasswordModal;
