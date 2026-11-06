import { expect, test } from "@playwright/test";
import { ROUTES } from "../support/routes";

test("@critical 首页分页导航可进入 /page/2/ 且当前页标识正确", async ({ page }) => {
  const response = await page.goto(ROUTES.home);
  expect(response?.ok()).toBeTruthy();

  const pagination = page.locator("nav.pagination");
  await expect(pagination).toBeVisible();
  await expect(pagination.locator("[aria-current='page']")).toHaveText("1");

  await expect(pagination.locator("a[rel='prev']")).toHaveCount(0);

  const nextLink = pagination.locator("a[rel='next']");
  await expect(nextLink).toHaveAttribute("href", ROUTES.page2);

  await nextLink.click();
  await expect(page).toHaveURL(ROUTES.page2);
  await expect(page.locator("nav.pagination [aria-current='page']")).toHaveText("2");
});

test("@critical /page/2/ 的分页 prev/next 链接保持正确路由", async ({ page }) => {
  const response = await page.goto(ROUTES.page2);
  expect(response?.ok()).toBeTruthy();

  const pagination = page.locator("nav.pagination");
  await expect(pagination).toBeVisible();
  await expect(pagination.locator("[aria-current='page']")).toHaveText("2");

  const prevLink = pagination.locator("a[rel='prev']");
  await expect(prevLink).toHaveAttribute("href", ROUTES.home);

  const nextLink = pagination.locator("a[rel='next']");
  await expect(nextLink).toHaveAttribute("href", ROUTES.page3);

  await nextLink.click();
  await expect(page).toHaveURL(ROUTES.page3);
  await expect(page.locator("nav.pagination [aria-current='page']")).toHaveText("3");

  await expect(page.locator("nav.pagination a[rel='prev']")).toHaveAttribute("href", ROUTES.page2);
});
