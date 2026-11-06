import { expect, test } from "@playwright/test";
import { ROUTES } from "../support/routes";

test("@regression 超宽屏首页渲染三栏布局与右侧栏卡片", async ({ page }) => {
  await page.setViewportSize({ width: 1600, height: 900 });
  await page.goto(ROUTES.home);

  await expect(page.locator("body")).toHaveAttribute("data-layout-mode", "three-column");

  const leftSidebar = page.locator(".layout-three-column .layout-sidebar-column");
  const mainColumn = page.locator(".layout-three-column > #main");
  // 右栏为 client:visible 组件，被 astro-island 包装（非 grid 直接子级）
  const rightSidebar = page.locator(".layout-three-column .layout-extra-column");

  await expect(leftSidebar).toBeVisible();
  await expect(mainColumn).toBeVisible();
  await expect(rightSidebar).toBeVisible();
  // 日历不是 extraCard，不计入其中，所以总数是 5 个而不是 6 个
  await expect(rightSidebar.locator(".extra-card, .extra-empty-card")).toHaveCount(5);
  await expect(rightSidebar.getByRole("heading", { name: /公告/i })).toBeVisible();
  await expect(rightSidebar.getByRole("heading", { name: /搜索/i })).toBeVisible();
  await expect(rightSidebar.getByRole("heading", { name: /日历/i })).toBeVisible();
  await expect(rightSidebar.getByRole("heading", { name: /随机文章/i })).toBeVisible();

  const positions = await page.evaluate(() => {
    const left = document
      .querySelector(".layout-three-column .layout-sidebar-column")
      ?.getBoundingClientRect();
    const main = document.querySelector(".layout-three-column > #main")?.getBoundingClientRect();
    const right = document
      .querySelector(".layout-three-column .layout-extra-column")
      ?.getBoundingClientRect();

    return {
      leftX: left?.left ?? -1,
      mainX: main?.left ?? -1,
      rightX: right?.left ?? -1,
    };
  });

  expect(positions.leftX).toBeGreaterThanOrEqual(0);
  expect(positions.leftX).toBeLessThan(positions.mainX);
  expect(positions.mainX).toBeLessThan(positions.rightX);
});

test("@regression 三栏右侧栏搜索入口可打开面板且滚动容器可到达底部", async ({ page }) => {
  await page.setViewportSize({ width: 1600, height: 620 });
  await page.goto(ROUTES.home);

  const rightSidebarInner = page.locator(
    ".layout-three-column .layout-extra-column > .layout-extra-column__inner",
  );

  await expect(rightSidebarInner).toBeVisible();

  const beforeScroll = await rightSidebarInner.evaluate((node) => {
    return {
      clientHeight: node.clientHeight,
      scrollHeight: node.scrollHeight,
      scrollTop: node.scrollTop,
      overflowY: window.getComputedStyle(node).overflowY,
      position: window.getComputedStyle(node).position,
    };
  });

  expect(beforeScroll.overflowY).toBe("auto");
  expect(beforeScroll.position).toBe("sticky");
  expect(beforeScroll.scrollHeight).toBeGreaterThan(beforeScroll.clientHeight);
  expect(beforeScroll.scrollTop).toBe(0);

  await rightSidebarInner.evaluate((node) => {
    node.scrollTop = node.scrollHeight;
  });

  await expect
    .poll(async () => {
      return rightSidebarInner.evaluate((node) => {
        return Math.abs(node.scrollHeight - node.clientHeight - node.scrollTop);
      });
    })
    .toBeLessThan(2);

  await page.locator("[data-open-global-search]").click();
  await expect(page.getByRole("dialog", { name: "Search" })).toBeVisible();
});
