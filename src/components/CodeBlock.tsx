import { onMount } from "solid-js";

import ArrowDownSLine from "@/assets/icons/arrow-down-s-line.svg";
import ArrowUpSLine from "@/assets/icons/arrow-up-s-line.svg";
import CheckFill from "@/assets/icons/check-fill.svg";
import FileCopyFill from "@/assets/icons/file-copy-fill.svg";
import FullscreenExitLine from "@/assets/icons/fullscreen-exit-line.svg";
import FullscreenLine from "@/assets/icons/fullscreen-line.svg";
import type { CodeBlockIcons } from "./code-block-element";

/**
 * code-block 自定义元素注册器（P3 迁移自 CodeBlock.svelte）
 *
 * 在 Layout 中以 <CodeBlock client:idle /> 挂载以触发注册；
 * Markdown 内容中的 <code-block> 元素由 code-block-element.ts 中的
 * 原生自定义元素类接管（open shadow DOM + <slot> 分发）。
 * 动态 import：自定义元素类 extends HTMLElement，仅可在客户端加载。
 */
function CodeBlock() {
  onMount(async () => {
    const icons: CodeBlockIcons = {
      copy: FileCopyFill.src,
      copied: CheckFill.src,
      fullscreen: FullscreenLine.src,
      fullscreenExit: FullscreenExitLine.src,
      arrowDown: ArrowDownSLine.src,
      arrowUp: ArrowUpSLine.src,
    };
    const { registerCodeBlock } = await import("./code-block-element");
    registerCodeBlock(icons);
  });

  return null;
}

export default CodeBlock;
