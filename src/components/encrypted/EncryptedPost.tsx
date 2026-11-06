import { createSignal, Show } from "solid-js";

import { decryptContent } from "@/toolkit/encryption/crypto";
import type { EncryptedData, TocItem } from "@/toolkit/encryption/types";
import { currentLocale, getT } from "@/i18n";
import { encryptedTocStore } from "@/stores/encryptedTocStore";
import "./encrypted.css";
import PasswordModal from "./PasswordModal.tsx";

interface EncryptedPostProps {
  encryptedContent: EncryptedData;
  encryptedToc?: EncryptedData;
  title?: string;
  passwordPlaceholder?: string;
  submitText?: string;
  errorText?: string;
}

function EncryptedPost(props: EncryptedPostProps) {
  const t = getT(currentLocale);

  const [isDecrypted, setIsDecrypted] = createSignal(false);
  const [decryptedContent, setDecryptedContent] = createSignal("");
  const [isDecrypting, setIsDecrypting] = createSignal(false);

  async function handleDecrypted(content: string) {
    setIsDecrypting(true);
    try {
      setDecryptedContent(content);
      // 如果有加密的 TOC，解密 TOC
      if (props.encryptedToc) {
        const password = sessionStorage.getItem(`encrypted_${window.location.pathname}`) || "";
        const tocJson = await decryptContent(props.encryptedToc, password);
        const parsed = JSON.parse(tocJson);
        const toc: TocItem[] = Array.isArray(parsed) ? parsed : [];
        // 更新侧边栏 TOC
        encryptedTocStore.set(toc);
      }
      setIsDecrypted(true);
    } finally {
      setIsDecrypting(false);
    }
  }

  return (
    <>
      <Show when={isDecrypted()}>
        <div class="encrypted-content" innerHTML={decryptedContent()} />
      </Show>
      <Show when={!isDecrypted() && isDecrypting()}>
        <div class="encrypted-post encrypted-decrypting">
          <div class="loading-spinner"></div>
          <p class="encrypted-decrypting-text">{t("encrypted.decrypting")}</p>
        </div>
      </Show>
      <Show when={!isDecrypted() && !isDecrypting()}>
        <PasswordModal
          encryptedData={props.encryptedContent}
          title={props.title}
          passwordPlaceholder={props.passwordPlaceholder}
          submitText={props.submitText}
          errorText={props.errorText}
          onDecrypted={(content) => {
            void handleDecrypted(content);
          }}
        />
      </Show>
    </>
  );
}

export default EncryptedPost;
