// 匹配 <img ...> 或 <img .../>：贪婪单量词 [^>] 无回溯风险（S8786）
const IMAGE_TAG_PATTERN = /<img\b[^>]*>/gi;

// 提取 title 属性（双引号或单引号，非空）
const TITLE_PATTERN = /\btitle=(?<quote>["'])(?<title>[^"']+)\k<quote>/i;

/**
 * 图片后处理：
 * - 带 title 的图片渲染为 <figure class="md-figure"><image-zoom><img/></image-zoom><figcaption>title</figcaption></figure>
 * - 无 title 的图片保持原有行为：<image-zoom><img/></image-zoom>
 *
 * title 来自 GFM 图片语法 `![alt](src "title")`，satteri 会输出为 <img title="...">。
 * alt 作为无障碍替代文本保留在 img 上，title 用作可见说明。
 */
export function wrapRenderedImages(html: string): string {
  return html.replace(IMAGE_TAG_PATTERN, (match) => {
    // 提取 <img 内部（不含尖括号与标签名），去掉尾部自闭合斜杠与空白保持与原输出一致
    const attributes = match.slice("<img".length, -1).replace(/[\s/]+$/, "");
    const img = `<img${attributes}>`;
    const titleMatch = attributes.match(TITLE_PATTERN);
    if (!titleMatch) {
      return `<image-zoom>${img}</image-zoom>`;
    }
    const title = titleMatch.groups!.title;
    return `<figure class="md-figure"><image-zoom>${img}</image-zoom><figcaption>${title}</figcaption></figure>`;
  });
}
