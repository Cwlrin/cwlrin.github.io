import { createSignal, For, onCleanup, onMount } from "solid-js";

import type { TocItem } from "./SidebarTypes";

interface SidebarContentsProps {
  toc?: TocItem[];
  isActive?: boolean;
}

function SidebarContents(props: SidebarContentsProps) {
  const [activeIndex, setActiveIndex] = createSignal(0);
  const [currentItems, setCurrentItems] = createSignal<Set<number>>(new Set());

  const toc = () => props.toc ?? [];

  const getTocItemClass = (index: number): string => {
    const classes = ["toc-item"];
    if (currentItems().has(index)) {
      classes.push("current");
    }
    if (activeIndex() === index) {
      classes.push("active");
    }
    return classes.join(" ");
  };

  const handleTocClick = (event: MouseEvent, id: string, index: number) => {
    event.preventDefault();
    const target = document.getElementById(id);
    if (target) {
      const scrollTop = target.offsetTop - 100;
      window.scrollTo({ top: scrollTop, behavior: "smooth" });
      setActiveIndex(index);
    }
  };

  const activateNavByIndex = (index: number): void => {
    if (index < 0 || index >= toc().length) {
      return;
    }

    setActiveIndex(index);
    const next = new Set<number>([index]);

    // 更新父级项（level 更小的祖先）
    let currentToc = toc()[index];
    for (let i = index - 1; i >= 0; i--) {
      if (toc()[i].level < currentToc.level) {
        next.add(i);
        currentToc = toc()[i];
      }
    }

    setCurrentItems(next);
  };

  onMount(() => {
    if (typeof window === "undefined" || toc().length === 0) {
      return;
    }

    // 获取所有 section 元素
    const sections: HTMLElement[] = toc()
      .map((item) => document.getElementById(item.id))
      .filter((el): el is HTMLElement => Boolean(el));

    if (sections.length === 0) {
      return;
    }

    const findIndex = (entries: IntersectionObserverEntry[]): number => {
      let above: HTMLElement | undefined;

      for (const e of entries) {
        if (e.boundingClientRect.top <= 0) {
          if (e.target instanceof HTMLElement) {
            above = e.target;
          }
        } else {
          break;
        }
      }

      if (above) {
        const si = sections.indexOf(above);
        return si >= 0 ? si : 0;
      }
      return 0;
    };

    const observer = new IntersectionObserver(
      (entries) => {
        // 原实现中 activeLock 恒为 null，等价于始终激活
        const index = findIndex(entries);
        activateNavByIndex(index);
      },
      { rootMargin: "0px 0px -100% 0px", threshold: 0 },
    );

    sections.forEach((element) => {
      observer.observe(element);
    });

    onCleanup(() => {
      observer.disconnect();
    });
  });

  return (
    <div class="contents">
      {toc().length > 0 ? (
        <ol class="toc">
          <For each={toc()}>
            {(item, i) => (
              <li
                class={getTocItemClass(i())}
                style={`padding-left: ${(item.level - 1) * 0.75}rem`}
              >
                <a
                  href={`#${item.id}`}
                  class="toc-link"
                  onclick={(e) => handleTocClick(e, item.id, i())}
                >
                  {item.text}
                </a>
                {item.children && item.children.length > 0 && (
                  <ol class="toc-child">
                    <For each={item.children}>
                      {(child) => (
                        <li class="toc-item">
                          <a href={`#${child.id}`} class="toc-link">
                            {child.text}
                          </a>
                        </li>
                      )}
                    </For>
                  </ol>
                )}
              </li>
            )}
          </For>
        </ol>
      ) : (
        <p class="no-toc">No contents available</p>
      )}
    </div>
  );
}

export default SidebarContents;
