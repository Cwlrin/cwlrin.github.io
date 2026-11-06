import { expect, test } from "@playwright/test";
import { POSTS, ROUTES } from "../support/routes";

test("@regression 导航栏入口与随机文章按钮可用", async ({ page }) => {
  await page.goto(ROUTES.home);

  const mainNav = page.getByRole("navigation", { name: "主导航" });
  await expect(mainNav).toBeVisible();

  await mainNav.getByRole("link", { name: "友链" }).click();
  await expect(page).toHaveURL(/\/friends\/$/);

  await page.goto(ROUTES.home);
  await page.locator('#nav a[href="/random/"]').click();
  await expect(page).toHaveURL(/\/posts\/[^/]+\/$/);
});

test("@regression 移动端侧边栏可通过导航按钮与遮罩开关", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto(ROUTES.home);

  const sidebar = page.locator("#sidebar");
  await expect(sidebar).not.toHaveClass(/\bon\b/);

  await page.getByRole("button", { name: "Toggle sidebar" }).click();
  await expect(sidebar).toHaveClass(/\bon\b/);
  const closeOverlay = page.getByRole("button", { name: "Close sidebar" });
  await expect(closeOverlay).toBeVisible();
  await closeOverlay.focus();
  await closeOverlay.press("Enter");
  await expect(sidebar).not.toHaveClass(/\bon\b/);
});

test("@regression 侧边栏目录面板可切换并响应目录点击", async ({ page }) => {
  await page.goto(POSTS.postMigrationTest);

  const contentsTab = page.locator("#sidebar .tab button.contents");
  if ((await contentsTab.count()) > 0) {
    await contentsTab.first().click();
  }

  const contentsPanel = page.locator("#sidebar .panel.contents");
  await expect(contentsPanel).toBeVisible();

  const firstTocItem = contentsPanel.locator(".toc > .toc-item").first();
  await expect(firstTocItem).toBeVisible();

  const beforeScrollY = await page.evaluate(() => window.scrollY);
  const tocLink = firstTocItem.locator(".toc-link");
  const tocHref = await tocLink.getAttribute("href");
  expect(tocHref).toBeTruthy();

  if (!tocHref) {
    return;
  }

  await tocLink.click();

  await expect(firstTocItem).toHaveClass(/active|current/);
  await expect
    .poll(async () => {
      return page.evaluate(() => window.scrollY);
    })
    .not.toBe(beforeScrollY);
});

test("@regression 侧边栏切换面板时非激活面板隐藏（防 .contents 工具类覆盖 display）", async ({
  page,
}) => {
  await page.goto(POSTS.postMigrationTest);

  const contentsPanel = page.locator("#sidebar .panel.contents");
  await expect(contentsPanel).toBeVisible();

  // 切换到任意非目录面板（related/overview 均可）
  const otherTab = page.locator("#sidebar .tab button:not(.contents)").first();
  if ((await otherTab.count()) > 0) {
    await otherTab.click();

    // 回归:目录面板 class 名 contents 与 UnoCSS 工具类（display: contents）撞名,
    // 曾导致非激活面板仍参与布局显示在上方——必须真正隐藏
    await expect(contentsPanel).toBeHidden();

    const activePanel = page.locator("#sidebar .panel.active");
    await expect(activePanel).toBeVisible();
  }
});

test("@regression 浮动工具栏返回顶部与移动端切换侧栏可用", async ({ page }) => {
  await page.goto(POSTS.postMigrationTest);

  await page.evaluate(() => {
    window.scrollTo({ top: document.documentElement.scrollHeight, behavior: "instant" });
  });

  await expect
    .poll(async () => {
      return page.evaluate(() => window.scrollY);
    })
    .toBeGreaterThan(200);

  await page.getByRole("button", { name: "返回顶部" }).click();

  await expect
    .poll(async () => {
      return page.evaluate(() => window.scrollY);
    })
    .toBeLessThan(20);

  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto(ROUTES.home);

  const sidebar = page.locator("#sidebar");
  await expect(sidebar).not.toHaveClass(/\bon\b/);
  await page.getByRole("button", { name: "切换侧栏" }).click();
  await expect(sidebar).toHaveClass(/\bon\b/);
});
