// SolidJS 自定义元素（web components）类型增强
import "solid-js";

declare module "solid-js" {
  namespace JSX {
    interface PagefindComponentAttributes {
      class?: string;
      id?: string;
      children?: unknown;
      instance?: string;
      "bundle-path"?: string;
      debounce?: number;
      style?: string | Record<string, string | number>;
    }

    interface IntrinsicElements {
      "pagefind-config": PagefindComponentAttributes;
      "pagefind-input": PagefindComponentAttributes;
      "pagefind-summary": PagefindComponentAttributes;
      "pagefind-results": PagefindComponentAttributes;
      "pagefind-keyboard-hints": PagefindComponentAttributes;
    }
  }
}
