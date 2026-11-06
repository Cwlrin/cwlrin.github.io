import { createSignal, For, onMount } from "solid-js";

import { t } from "@/i18n";

type Speaker = "bot" | "user";

interface ChatOption {
  label: string;
  nextId: string;
  reply?: string;
}

interface ChatNode {
  id: string;
  text: string;
  options?: ChatOption[];
}

interface ChatMessage {
  id: string;
  speaker: Speaker;
  text: string;
}

interface AboutDialogProps {
  title?: string;
  intro?: string;
  authorName?: string;
  authorAvatar?: string;
  startId?: string;
  nodes?: ChatNode[];
  endHint?: string;
  typingDelayMs?: number;
}

const defaultNodes: ChatNode[] = [
  {
    id: "intro",
    text: t("aboutDialog.defaultNodes.intro.text"),
    options: [
      {
        label: t("aboutDialog.defaultNodes.intro.optionA.label"),
        reply: t("aboutDialog.defaultNodes.intro.optionA.reply"),
        nextId: "answer-a",
      },
      {
        label: t("aboutDialog.defaultNodes.intro.optionB.label"),
        reply: t("aboutDialog.defaultNodes.intro.optionB.reply"),
        nextId: "answer-b",
      },
    ],
  },
  {
    id: "answer-a",
    text: t("aboutDialog.defaultNodes.answerA.text"),
    options: [
      {
        label: t("aboutDialog.defaultNodes.backToMenu.label"),
        reply: t("aboutDialog.defaultNodes.backToMenu.reply"),
        nextId: "intro",
      },
    ],
  },
  {
    id: "answer-b",
    text: t("aboutDialog.defaultNodes.answerB.text"),
    options: [
      {
        label: t("aboutDialog.defaultNodes.backToMenu.label"),
        reply: t("aboutDialog.defaultNodes.backToMenu.reply"),
        nextId: "intro",
      },
    ],
  },
];

const createMessage = (speaker: Speaker, text: string): ChatMessage => ({
  id: `${speaker}-${Date.now()}-${Math.random().toString(16).slice(2)}`,
  speaker,
  text,
});

const waitForTyping = (delay: number) =>
  new Promise<void>((resolve) => {
    const normalizedDelay = Number.isFinite(delay) ? Math.max(0, delay) : 0;
    setTimeout(resolve, normalizedDelay);
  });

function AboutDialog(props: AboutDialogProps) {
  const title = () => props.title ?? t("aboutDialog.defaults.title");
  const intro = () => props.intro ?? t("aboutDialog.defaults.intro");
  const authorName = () => props.authorName ?? t("aboutDialog.defaults.authorName");
  const authorAvatar = () => props.authorAvatar ?? "";
  const startId = () => props.startId ?? "intro";
  const endHint = () => props.endHint ?? t("aboutDialog.defaults.endHint");
  const typingDelayMs = () => props.typingDelayMs ?? 650;
  const nodes = () => props.nodes ?? defaultNodes;

  const [viewport, setViewport] = createSignal<HTMLDivElement | null>(null);
  const [messages, setMessages] = createSignal<ChatMessage[]>([]);
  const [currentNodeId, setCurrentNodeId] = createSignal("");
  const [isTyping, setIsTyping] = createSignal(false);

  const nodeMap = () => new Map(nodes().map((node) => [node.id, node]));
  const currentNode = () => nodeMap().get(currentNodeId());
  const currentOptions = () => currentNode()?.options ?? [];
  const authorInitial = () =>
    authorName().trim().slice(0, 1) || t("aboutDialog.defaults.authorInitial");

  const scrollToBottom = async () => {
    // Solid 渲染是同步批处理，延迟一帧确保 DOM 已更新
    await new Promise<void>((resolve) => {
      window.requestAnimationFrame(() => resolve());
    });
    viewport()?.scrollTo({
      top: viewport()!.scrollHeight,
      behavior: "smooth",
    });
  };

  const initializeConversation = () => {
    const firstNode = nodeMap().get(startId());
    setCurrentNodeId(firstNode?.id ?? startId());
    setIsTyping(false);

    setMessages(
      firstNode
        ? [createMessage("bot", firstNode.text)]
        : [createMessage("bot", t("aboutDialog.runtime.noNodesConfigured"))],
    );
    if (typeof window !== "undefined") {
      void scrollToBottom();
    }
  };

  const chooseOption = async (option: ChatOption) => {
    if (isTyping()) {
      return;
    }

    const nextNode = nodeMap().get(option.nextId);
    const botReply = nextNode ? nextNode.text : t("aboutDialog.runtime.branchNotConfigured");

    setMessages([...messages(), createMessage("user", option.reply ?? option.label)]);
    setIsTyping(true);
    await scrollToBottom();

    await waitForTyping(typingDelayMs());

    if (nextNode) {
      setCurrentNodeId(nextNode.id);
    }

    setMessages([...messages(), createMessage("bot", botReply)]);
    setIsTyping(false);
    await scrollToBottom();
  };

  const restart = () => {
    initializeConversation();
  };

  onMount(() => {
    initializeConversation();
  });

  return (
    <section class="about-dialog" aria-label={title()}>
      <header class="dialog-header">
        <h3>{title()}</h3>
        <p>{intro()}</p>
      </header>

      <div class="dialog-body" ref={(el) => setViewport(el)}>
        {messages().length === 0 ? (
          <p class="dialog-empty">{t("aboutDialog.runtime.noDialogContent")}</p>
        ) : (
          <>
            <For each={messages()}>
              {(message) => (
                <div class={`message-row ${message.speaker === "user" ? "is-user" : ""}`}>
                  {message.speaker === "bot" && (
                    <div class="author-avatar" aria-hidden="true">
                      {authorAvatar() ? (
                        <img src={authorAvatar()} alt="" loading="lazy" decoding="async" />
                      ) : (
                        <span>{authorInitial()}</span>
                      )}
                    </div>
                  )}

                  <div class={`message-content ${message.speaker === "user" ? "is-user" : ""}`}>
                    {message.speaker === "bot" && <p class="author-name">{authorName()}</p>}
                    <div class={`message-bubble ${message.speaker === "user" ? "is-user" : ""}`}>
                      {message.text}
                    </div>
                  </div>
                </div>
              )}
            </For>

            {isTyping() && (
              <div class="message-row">
                <div class="author-avatar" aria-hidden="true">
                  {authorAvatar() ? (
                    <img src={authorAvatar()} alt="" loading="lazy" decoding="async" />
                  ) : (
                    <span>{authorInitial()}</span>
                  )}
                </div>

                <div class="message-content">
                  <p class="author-name">{authorName()}</p>
                  <div
                    class="message-bubble typing-bubble"
                    role="status"
                    aria-live="polite"
                    aria-label={t("aboutDialog.typing.ariaLabel")}
                  >
                    <span class="typing-dot"></span>
                    <span class="typing-dot"></span>
                    <span class="typing-dot"></span>
                  </div>
                </div>
              </div>
            )}
          </>
        )}
      </div>

      <footer class="dialog-footer">
        <div class={`fake-input ${isTyping() ? "is-typing" : ""}`} aria-hidden="true">
          <span class="fake-input-text">
            {isTyping()
              ? t("aboutDialog.typing.peerTyping")
              : t("aboutDialog.typing.inputPlaceholder")}
          </span>
          <span class="fake-input-action">{t("aboutDialog.actions.send")}</span>
        </div>

        {currentOptions().length > 0 ? (
          <div class="options-grid">
            <For each={currentOptions()}>
              {(option) => (
                <button
                  type="button"
                  class="option-button"
                  disabled={isTyping()}
                  onclick={() => void chooseOption(option)}
                >
                  {option.label}
                </button>
              )}
            </For>
          </div>
        ) : (
          <p class="dialog-end">{endHint()}</p>
        )}

        <button type="button" class="restart-button" disabled={isTyping()} onclick={restart}>
          {t("aboutDialog.actions.restart")}
        </button>
      </footer>
    </section>
  );
}

export default AboutDialog;
