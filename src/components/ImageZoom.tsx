import { onMount } from "solid-js";

/**
 * image-zoom 自定义元素注册器（P3 迁移自 ImageZoom.svelte）
 *
 * 在 Layout 中以 <ImageZoom client:idle /> 挂载以触发注册；
 * Markdown 内容中的 <image-zoom> 元素由 image-zoom-element.ts 接管
 * （open shadow DOM + <slot> 分发 + <dialog> 预览）。
 * 动态 import：自定义元素类 extends HTMLElement，仅可在客户端加载。
 */
function ImageZoom() {
  onMount(async () => {
    const { registerImageZoom } = await import("./image-zoom-element");
    registerImageZoom();
  });

  return null;
}

export default ImageZoom;
