import { expect, test } from "@playwright/test";
import { POSTS } from "../support/routes";

test("@critical 加密文章具备 noindex 与 Pagefind 排除标记", async ({ page }) => {
  const response = await page.goto(POSTS.encryptedTest);
  expect(response?.ok()).toBeTruthy();

  await expect(page.locator('meta[name="robots"][content*="noindex"]')).toHaveCount(1);
  await expect(page.locator('div.article.wrap[data-pagefind-ignore="all"]')).toBeVisible();
  await expect(page.locator("article.post[data-pagefind-body='false']")).toBeVisible();
});

test("@critical 加密文章错误密码提示且正确密码可解锁", async ({ page }) => {
  await page.goto(POSTS.encryptedTest);

  const passwordInput = page.getByPlaceholder("请输入密码");
  await expect(passwordInput).toBeVisible();

  await passwordInput.fill("wrong-password");
  await page.getByRole("button", { name: "解密" }).click();
  await expect(page.locator(".encrypted-error")).toContainText("密码错误，请重试");

  await passwordInput.fill("test123");
  await page.getByRole("button", { name: "解密" }).click();

  await expect(page.locator(".encrypted-content")).toContainText("AES-GCM");
  await expect(page.locator(".encrypted-content")).toContainText("加密功能说明");
});
