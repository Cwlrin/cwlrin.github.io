import { ShadowSlotElement } from "./web-components-base";
import { lockBodyScroll } from "@/toolkit/ui/scrollLock";
import { currentLocale, getT } from "@/i18n";

const CLOSE_ANIMATION_MS = 220;

type PreviewImage = { src: string; alt: string };
type PreviewImageCandidate = PreviewImage & { element: HTMLImageElement };
type PreviewImages = PreviewImage[];

/**
 * image-zoom 自定义元素（P3 迁移自 ImageZoom.svelte 的 <svelte:options customElement="image-zoom" />）
 *
 * 机制一致：open shadow DOM + <slot> 分发；light DOM 内 <image-zoom><img /></image-zoom>。
 * dialog 预览 UI 位于 shadow 内；宿主角标样式在全局 image-zoom.css。
 */
class ImageZoomElement extends ShadowSlotElement {
  private container: HTMLElement | null = null;
  private dialogElement: HTMLDialogElement | null = null;
  private isOpen = false;
  private isClosing = false;
  private previewIndex = 0;
  private previewImages: PreviewImages = [];

  private cleanupImageListeners: (() => void) | null = null;
  private closeTimer: ReturnType<typeof setTimeout> | null = null;
  private releaseBodyScrollLock: (() => void) | null = null;

  private t = getT(currentLocale);

  protected override renderShadowMarkup(): string {
    const m = this.t;
    return `
      <div class="image-zoom-wrapper"><slot></slot></div>
      <dialog class="image-zoom-overlay hidden">
        <button type="button" class="image-zoom-nav image-zoom-nav-prev" aria-label="${m("imageZoom.previous")}">‹</button>
        <button type="button" class="image-zoom-close" aria-label="${m("imageZoom.close")}">×</button>
        <img class="image-zoom-content" alt="" loading="eager" decoding="async" />
        <p class="image-zoom-caption"></p>
        <button type="button" class="image-zoom-nav image-zoom-nav-next" aria-label="${m("imageZoom.next")}">›</button>
      </dialog>
    `;
  }

  protected override shadowStyleCss(): string {
    return IMAGE_ZOOM_SHADOW_CSS;
  }

  protected override onShadowReady() {
    this.container = this.shadowRoot?.querySelector(".image-zoom-wrapper") ?? null;
    this.dialogElement = this.shadowRoot?.querySelector(".image-zoom-overlay") ?? null;

    this.bindImage();
    // 点击遮罩空白处关闭（dialog 占据全屏，省略 content/close/nav 外的命中即空白区域）
    this.dialogElement?.addEventListener("click", this.handleOverlayClick);
    window.addEventListener("keydown", this.handleWindowKeydown);
  }

  protected override onSlotChange() {
    this.bindImage();
  }

  protected override onDetach() {
    this.cleanupImageListeners?.();
    if (this.closeTimer) {
      clearTimeout(this.closeTimer);
      this.closeTimer = null;
    }
    this.dialogElement?.removeEventListener("click", this.handleOverlayClick);
    window.removeEventListener("keydown", this.handleWindowKeydown);
    this.restoreBodyScroll();
  }

  protected bindImage() {
    this.cleanupImageListeners?.();
    this.cleanupImageListeners = null;

    const slot = this.container?.querySelector("slot");
    if (!(slot instanceof HTMLSlotElement)) {
      return;
    }
    const assigned = slot.assignedElements({ flatten: true }) ?? [];
    const image = assigned.find((el): el is HTMLImageElement => el.tagName === "IMG");

    if (!image) {
      return;
    }

    image.classList.add("image-zoom-trigger");

    const hasRole = image.hasAttribute("role");
    const hasTabindex = image.hasAttribute("tabindex");

    if (!hasRole) {
      image.setAttribute("role", "button");
    }
    if (!hasTabindex) {
      image.setAttribute("tabindex", "0");
    }

    const onImageClick = (event: MouseEvent) => this.openPreview(image, event);
    const onImageKeydown = (event: KeyboardEvent) => {
      if (event.key === "Enter" || event.key === " ") {
        event.preventDefault();
        this.openPreview(image, event);
      }
    };

    image.addEventListener("click", onImageClick);
    image.addEventListener("keydown", onImageKeydown);

    this.cleanupImageListeners = () => {
      image.removeEventListener("click", onImageClick);
      image.removeEventListener("keydown", onImageKeydown);
      image.classList.remove("image-zoom-trigger");
      if (!hasRole) {
        image.removeAttribute("role");
      }
      if (!hasTabindex) {
        image.removeAttribute("tabindex");
      }
    };
  }

  private resolvePreviewImages(image: HTMLImageElement): PreviewImageCandidate[] {
    const galleryRoot = image.closest("[data-image-zoom-gallery]");
    const galleryImages = galleryRoot
      ? Array.from(galleryRoot.querySelectorAll<HTMLImageElement>("image-zoom img"))
      : [image];

    return galleryImages
      .map((galleryImage) => ({
        element: galleryImage,
        src: galleryImage.currentSrc || galleryImage.src,
        alt: galleryImage.alt || "",
      }))
      .filter((galleryImage) => Boolean(galleryImage.src));
  }

  private openPreview(image: HTMLImageElement, event?: Event) {
    event?.preventDefault();
    event?.stopPropagation();

    const galleryImages = this.resolvePreviewImages(image);
    if (galleryImages.length === 0) {
      return;
    }

    if (this.closeTimer) {
      clearTimeout(this.closeTimer);
      this.closeTimer = null;
    }

    this.isClosing = false;
    this.previewImages = galleryImages.map(({ src, alt }) => ({ src, alt }));
    this.previewIndex = Math.max(
      0,
      galleryImages.findIndex((g) => g.element === image),
    );
    this.syncPreviewWithIndex();
    this.isOpen = true;

    if (
      typeof document !== "undefined" &&
      typeof window !== "undefined" &&
      !this.releaseBodyScrollLock
    ) {
      this.releaseBodyScrollLock = lockBodyScroll(document, {
        innerWidth: window.innerWidth,
        getComputedPaddingInlineEnd: () => window.getComputedStyle(document.body).paddingInlineEnd,
      });
    }

    this.syncDialog();
  }

  private finalizeClosePreview() {
    this.isOpen = false;
    this.isClosing = false;
    this.previewImages = [];

    if (this.closeTimer) {
      clearTimeout(this.closeTimer);
      this.closeTimer = null;
    }

    this.syncDialog();
    this.restoreBodyScroll();
  }

  private requestClosePreview() {
    if (!this.isOpen || this.isClosing) {
      return;
    }

    const closeAnimationMs =
      typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches
        ? 0
        : CLOSE_ANIMATION_MS;

    if (closeAnimationMs === 0) {
      this.finalizeClosePreview();
      return;
    }

    this.isClosing = true;
    this.syncDialog();

    if (this.closeTimer) {
      clearTimeout(this.closeTimer);
    }

    this.closeTimer = setTimeout(() => {
      this.finalizeClosePreview();
    }, closeAnimationMs);
  }

  private syncPreviewWithIndex() {
    const currentImage = this.previewImages[this.previewIndex];
    if (!currentImage || !this.dialogElement) {
      return;
    }

    const img = this.dialogElement.querySelector(".image-zoom-content");
    const caption = this.dialogElement.querySelector(".image-zoom-caption");

    if (img instanceof HTMLImageElement) {
      img.src = currentImage.src;
      img.alt = currentImage.alt;
    }
    if (caption) {
      caption.textContent = currentImage.alt;
    }

    this.dialogElement.setAttribute("aria-label", currentImage.alt || this.t("imageZoom.dialog"));

    const navPrev = this.dialogElement.querySelector(".image-zoom-nav-prev");
    const navNext = this.dialogElement.querySelector(".image-zoom-nav-next");
    const multiple = this.previewImages.length > 1;
    if (navPrev instanceof HTMLElement) {
      navPrev.style.display = multiple ? "" : "none";
    }
    if (navNext instanceof HTMLElement) {
      navNext.style.display = multiple ? "" : "none";
    }
  }

  private syncDialog() {
    if (!this.dialogElement) {
      return;
    }

    this.dialogElement.classList.toggle("hidden", !this.isOpen);
    this.dialogElement.classList.toggle("closing", this.isClosing);

    if (this.isOpen && !this.dialogElement.open) {
      this.dialogElement.showModal();
    } else if (!this.isOpen && this.dialogElement.open) {
      this.dialogElement.close();
    }
  }

  private showPreviousPreview(event?: Event) {
    event?.preventDefault();
    event?.stopPropagation();

    if (this.previewImages.length <= 1) {
      return;
    }

    this.previewIndex =
      (this.previewIndex - 1 + this.previewImages.length) % this.previewImages.length;
    this.syncPreviewWithIndex();
  }

  private showNextPreview(event?: Event) {
    event?.preventDefault();
    event?.stopPropagation();

    if (this.previewImages.length <= 1) {
      return;
    }

    this.previewIndex = (this.previewIndex + 1) % this.previewImages.length;
    this.syncPreviewWithIndex();
  }

  private handleOverlayClick = (event: MouseEvent) => {
    const target = event.target;
    const clickable = target instanceof HTMLElement ? target : null;
    if (
      clickable?.closest(".image-zoom-content") ||
      clickable?.closest(".image-zoom-close") ||
      clickable?.closest(".image-zoom-nav")
    ) {
      return;
    }
    this.requestClosePreview();
  };

  private handleWindowKeydown = (event: KeyboardEvent) => {
    if (!this.isOpen) {
      return;
    }

    if (event.key === "Escape") {
      this.requestClosePreview();
    } else if (event.key === "ArrowLeft") {
      this.showPreviousPreview(event);
    } else if (event.key === "ArrowRight") {
      this.showNextPreview(event);
    }
  };

  private restoreBodyScroll() {
    this.releaseBodyScrollLock?.();
    this.releaseBodyScrollLock = null;
  }
}

export function registerImageZoom() {
  if (typeof customElements !== "undefined" && !customElements.get("image-zoom")) {
    customElements.define("image-zoom", ImageZoomElement);
  }
}

const IMAGE_ZOOM_SHADOW_CSS = `
  .image-zoom-overlay {
    position: fixed;
    inset: 0;
    z-index: var(--z-fullscreen);
    display: grid;
    place-items: center;
    gap: 0;
    width: 100%;
    max-width: none;
    height: 100%;
    max-height: none;
    border: 0;
    margin: 0;
    padding: 2rem 1rem;
    box-sizing: border-box;
    background: var(--codeblock-overlay-bg, rgba(8, 10, 16, 0.72));
    backdrop-filter: blur(0.35rem);
    animation: image-zoom-fade-in 220ms ease forwards;
  }

  .image-zoom-overlay.hidden { display: none; }

  .image-zoom-overlay::backdrop {
    background: var(--codeblock-overlay-bg, rgba(8, 10, 16, 0.72));
    backdrop-filter: blur(0.35rem);
  }

  .image-zoom-overlay.closing { animation: image-zoom-fade-out 220ms ease forwards; }

  .image-zoom-content {
    margin: 0;
    max-width: min(92vw, 1100px);
    max-height: 86vh;
    object-fit: contain;
    border-radius: 0.5rem;
    box-shadow: 0 0.75rem 2rem var(--grey-9-a15);
    cursor: zoom-out;
    animation: image-zoom-scale-in 220ms cubic-bezier(0.22, 0.61, 0.36, 1) forwards;
  }

  .image-zoom-overlay.closing .image-zoom-content {
    animation: image-zoom-scale-out 220ms cubic-bezier(0.4, 0, 0.2, 1) forwards;
  }

  .image-zoom-close {
    position: absolute;
    top: 1rem;
    right: 1rem;
    width: 2.4rem;
    height: 2.4rem;
    border: 0;
    border-radius: 50%;
    background: rgba(17, 25, 40, 0.58);
    color: #fff;
    font-size: 1.5rem;
    line-height: 1;
    cursor: pointer;
    transition: background-color 0.2s ease, transform 0.2s ease;
    animation: image-zoom-ui-in 220ms ease forwards;
  }

  .image-zoom-overlay.closing .image-zoom-close { animation: image-zoom-ui-out 220ms ease forwards; }
  .image-zoom-close:hover { background: rgba(17, 25, 40, 0.8); transform: scale(1.06); }

  .image-zoom-nav {
    position: absolute;
    top: 50%;
    width: 2.75rem;
    height: 2.75rem;
    border: 0;
    border-radius: 999px;
    background: rgba(17, 25, 40, 0.58);
    color: #fff;
    font-size: 2rem;
    line-height: 1;
    cursor: pointer;
    transform: translateY(-50%);
    transition: background-color 0.2s ease, transform 0.2s ease;
    animation: image-zoom-ui-in 220ms ease forwards;
  }

  .image-zoom-nav:hover { background: rgba(17, 25, 40, 0.8); transform: translateY(-50%) scale(1.06); }
  .image-zoom-nav-prev { left: max(1rem, calc(50vw - min(46vw, 550px) - 3.75rem)); }
  .image-zoom-nav-next { right: max(1rem, calc(50vw - min(46vw, 550px) - 3.75rem)); }

  .image-zoom-caption {
    margin: 0.8rem 0 0;
    font-size: 0.9rem;
    color: var(--grey-1);
    text-align: center;
    max-width: min(92vw, 1100px);
    line-height: 1.5;
    animation: image-zoom-ui-in 220ms ease forwards;
  }

  .image-zoom-overlay.closing .image-zoom-caption { animation: image-zoom-ui-out 220ms ease forwards; }
  .image-zoom-overlay.closing .image-zoom-nav { animation: image-zoom-ui-out 220ms ease forwards; }

  @keyframes image-zoom-fade-in { from { opacity: 0; } to { opacity: 1; } }
  @keyframes image-zoom-fade-out { from { opacity: 1; } to { opacity: 0; } }
  @keyframes image-zoom-scale-in {
    from { opacity: 0; transform: scale(0.94) translateY(10px); }
    to { opacity: 1; transform: scale(1) translateY(0); }
  }
  @keyframes image-zoom-scale-out {
    from { opacity: 1; transform: scale(1) translateY(0); }
    to { opacity: 0; transform: scale(0.94) translateY(10px); }
  }
  @keyframes image-zoom-ui-in {
    from { opacity: 0; transform: translateY(-6px); }
    to { opacity: 1; transform: translateY(0); }
  }
  @keyframes image-zoom-ui-out {
    from { opacity: 1; transform: translateY(0); }
    to { opacity: 0; transform: translateY(-6px); }
  }

  @media (prefers-reduced-motion: reduce) {
    .image-zoom-close, .image-zoom-nav { transition: none; }
    .image-zoom-overlay, .image-zoom-overlay.closing,
    .image-zoom-content, .image-zoom-overlay.closing .image-zoom-content,
    .image-zoom-caption, .image-zoom-overlay.closing .image-zoom-caption,
    .image-zoom-nav, .image-zoom-overlay.closing .image-zoom-nav,
    .image-zoom-overlay.closing .image-zoom-close { animation: none; }
  }
`;
