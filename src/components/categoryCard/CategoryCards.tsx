import { createSignal, For, onCleanup, onMount } from "solid-js";

import CategoryCard from "./CategoryCard.tsx";

interface PostInfo {
  title: string;
  url: string;
}

interface CategoryItem {
  name: string;
  url: string;
  cover?: string;
  topCategory?: {
    name: string;
    url: string;
  };
  postCount: number;
  childCount?: number;
  posts: PostInfo[];
}

interface CategoryCardsProps {
  categories?: CategoryItem[];
}

function CategoryCards(props: CategoryCardsProps) {
  const [activeIndex, setActiveIndex] = createSignal<number | null>(null);
  // show 集合同样由 Solid 状态驱动：避免 IO 直接改 DOM class 与 Solid 渲染
  // 的 class 拼接冲突（曾导致悬停激活时 .show 被覆盖、卡片 opacity:0 消失）
  const [visibleIndexes, setVisibleIndexes] = createSignal<Set<number>>(new Set());
  let container: HTMLDivElement | null = null;
  let io: IntersectionObserver | null = null;

  const handleMouseEnter = (index: number) => {
    if (activeIndex() !== null && activeIndex() !== index) {
      setActiveIndex(null);
    }
    setActiveIndex(index);
  };

  const handleMouseLeave = (index: number) => {
    if (activeIndex() === index) {
      setActiveIndex(null);
    }
  };

  onMount(() => {
    if (!container) return;

    const items = Array.from(container.querySelectorAll(".item"));
    if (items.length === 0) return;

    io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!(entry.target instanceof HTMLElement)) {
            return;
          }
          const index = Number(entry.target.dataset.index);
          if (!Number.isInteger(index)) {
            return;
          }
          if (entry.isIntersecting || entry.intersectionRatio > 0) {
            setVisibleIndexes((prev) => (prev.has(index) ? prev : new Set(prev).add(index)));
            io?.unobserve(entry.target);
          }
        });
      },
      { root: null, threshold: [0.3] },
    );

    items.forEach((item, index) => {
      if (!(item instanceof HTMLElement)) {
        return;
      }
      item.dataset.index = String(index);
      io?.observe(item);
    });
    // 前两张卡片首屏直接展开
    setVisibleIndexes(new Set([0, 1]));
  });

  onCleanup(() => {
    io?.disconnect();
    io = null;
  });

  return (
    <div ref={(el) => (container = el)} class="cards w-full">
      <For each={props.categories ?? []}>
        {(category, i) => (
          <CategoryCard
            name={category.name}
            url={category.url}
            cover={category.cover}
            topCategory={category.topCategory}
            postCount={category.postCount}
            childCount={category.childCount}
            posts={category.posts}
            show={visibleIndexes().has(i())}
            isActive={activeIndex() === i()}
            onMouseEnter={() => handleMouseEnter(i())}
            onMouseLeave={() => handleMouseLeave(i())}
          />
        )}
      </For>
    </div>
  );
}

export default CategoryCards;
