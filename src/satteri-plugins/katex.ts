import katexLib from "katex";
import {
  defineMdastPlugin,
  type MdxJsxAttributeNode,
  type MdastPluginDefinition,
  type MdxJsxFlowElement,
  type MdxJsxTextElement,
} from "satteri";

/**
 * katex（satteri 版）：
 * 将 math/inlineMath 节点通过 KaTeX 渲染为 HTML。
 *
 * 等价于 remark 管线中的 remark-math + rehype-katex 组合，
 * 需要 features.math: true 在 satteri 配置中开启解析。
 *
 * 两条输出路径（由 ctx.sourceFormat 决定）：
 * - markdown（.md）：返回 `{ rawHtml }`，HTML 直接进 HAST 输出；
 * - mdx（.mdx）：MDX 不支持 raw HTML 节点（会被转义成纯文本），
 *   改为产出 `<Latex html="…" />`，由 src/components/mdx/Latex.astro
 *   用 Astro 的 set:html 注入，使 MDX 文章里的公式也能正常渲染。
 *
 * 注意：KaTeX 原先在 hook 内 `await import("katex")`，在 astro build 的静态
 * 构建阶段该动态导入会走已关闭的 Vite module runner，报
 * "Vite module runner has been closed"，导致含公式的文章构建失败；
 * 这里改为模块顶层静态导入。
 */
export interface KatexOptions {
  /** KaTeX 渲染出错时是否抛出异常（默认 false，渲染为错误提示） */
  throwOnError?: boolean;
}

/** @returns KaTeX 渲染出的 HTML 字符串 */
function renderMath(value: string, displayMode: boolean, throwOnError: boolean): string {
  try {
    return katexLib.renderToString(value, { displayMode, throwOnError });
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    return `<span class="katex-error">${message}</span>`;
  }
}

/** MDX 模式下把公式包装成 <Latex html="…" /> JSX 节点 */
function toJsxNode(html: string, displayMode: boolean): MdxJsxTextElement | MdxJsxFlowElement {
  const attributes: MdxJsxAttributeNode[] = [
    { type: "mdxJsxAttribute", name: "html", value: html },
  ];
  if (displayMode) {
    return { type: "mdxJsxFlowElement", name: "Latex", attributes, children: [] };
  }
  return { type: "mdxJsxTextElement", name: "Latex", attributes, children: [] };
}

export default function katex(options: KatexOptions = {}): MdastPluginDefinition {
  const throwOnError = options.throwOnError ?? false;

  return defineMdastPlugin({
    name: "katex",
    math(node, ctx) {
      const html = renderMath(node.value, true, throwOnError);
      return ctx.sourceFormat === "mdx" ? toJsxNode(html, true) : { rawHtml: html };
    },
    inlineMath(node, ctx) {
      const html = renderMath(node.value, false, throwOnError);
      return ctx.sourceFormat === "mdx" ? toJsxNode(html, false) : { rawHtml: html };
    },
  });
}
