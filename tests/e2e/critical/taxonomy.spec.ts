import { expect, test } from "@playwright/test";
import { POSTS, ROUTES } from "../support/routes";

test("@critical 标签与分类页可进入具体列表", async ({ page }) => {
  const tagsResponse = await page.goto(ROUTES.tags);
  expect(tagsResponse?.ok()).toBeTruthy();

  const firstTagLink = page.locator(".tag-cloud .tag-cloud-item").first();
  await expect(firstTagLink).toBeVisible();
  await firstTagLink.click();

  await expect(page).toHaveURL(/\/tags\/[^/]+\/?$/);
  await expect(page.locator(".timeline article.item.normal").first()).toBeVisible();

  const categoriesResponse = await page.goto(ROUTES.categories);
  expect(categoriesResponse?.ok()).toBeTruthy();

  const firstCategoryLink = page.locator(".timeline h2.item.header a").first();
  await expect(firstCategoryLink).toBeVisible();
  await firstCategoryLink.click();

  await expect(page).toHaveURL(/\/categories\/[^/]+\/?$/);
  await expect(
    page.locator(".timeline article.item.normal, .timeline .item.normal .title").first(),
  ).toBeVisible();
});

test("@critical 文章上下篇导航链接可用", async ({ page }) => {
  const postResponse = await page.goto(POSTS.postMigrationTest);
  expect(postResponse?.ok()).toBeTruthy();

  const nav = page.locator(".post-nav");
  await expect(nav).toBeVisible();

  const prevLink = page.locator('.post-nav a[rel="prev"]');
  const nextLink = page.locator('.post-nav a[rel="next"]');

  const prevCount = await prevLink.count();
  const nextCount = await nextLink.count();
  expect(prevCount + nextCount).toBeGreaterThan(0);

  const targetLink = prevCount > 0 ? prevLink.first() : nextLink.first();
  const targetHref = await targetLink.getAttribute("href");
  expect(targetHref).toBeTruthy();

  if (!targetHref) {
    return;
  }

  const targetResponse = await page.goto(targetHref);
  expect(targetResponse?.ok()).toBeTruthy();
  await expect(page).toHaveURL(targetHref);
});
