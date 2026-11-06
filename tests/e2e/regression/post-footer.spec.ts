import { expect, test } from "@playwright/test";
import { POSTS } from "../support/routes";

test("@regression 版权区超长 permalink 在移动视口折行且不撑破布局（issue #51）", async ({
  page,
}) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto(POSTS.postMigrationTest);

  const link = page.locator("#copyright .link a");
  await expect(link).toBeVisible();

  // 模拟中文标题文章的超长 percent-encoded URL（触发原 bug 的单字符令牌）
  await link.evaluate((el) => {
    el.textContent = `https://example.com/posts/${"abc%20".repeat(80)}/`;
  });
  // 同步化：等待链接折行（代替固定 wait）
  await expect.poll(async () => (await link.boundingBox())?.height ?? 0).toBeGreaterThan(20);

  // 文档无横向溢出
  const horizontalOverflow = await page.evaluate(
    () => document.documentElement.scrollWidth > window.innerWidth,
  );
  expect(horizontalOverflow).toBe(false);

  const linkBox = await link.boundingBox();

  // 链接右缘不超出版权容器

  // 链接右缘不超出版权容器
  const containerBox = await page.locator("#copyright").boundingBox();
  expect(linkBox?.x ?? 0).toBeGreaterThanOrEqual(containerBox?.x ?? 0);
  expect((linkBox?.x ?? 0) + (linkBox?.width ?? 0)).toBeLessThanOrEqual(
    (containerBox?.x ?? 0) + (containerBox?.width ?? 0) + 1,
  );
});
