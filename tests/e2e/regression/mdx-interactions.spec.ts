import { expect, test } from "@playwright/test";
import { POSTS } from "../support/routes";

test("@regression MDX Tabs 初始化并可切换", async ({ page }) => {
  const response = await page.goto(POSTS.noteMdxDemo);
  expect(response?.ok()).toBeTruthy();

  const tabs = page.locator(".md .tabs").first();
  await expect(tabs).toBeVisible();

  const svelteTab = tabs.getByRole("tab", { name: "Svelte" });
  await expect(svelteTab).toHaveAttribute("aria-selected", "true");

  const astroTab = tabs.getByRole("tab", { name: "Astro" });
  await astroTab.click();
  await expect(astroTab).toHaveAttribute("aria-selected", "true");
  await expect(tabs.locator(".tab-item.active").first()).toContainText("Astro 适合做内容站点");
});

test("@regression MDX Quiz 交互可触发", async ({ page }) => {
  await page.goto(POSTS.noteMdxDemo);

  const singleQuiz = page.locator(".md .quiz-item.single").first();
  await expect(singleQuiz).toBeVisible();

  await singleQuiz.locator(".quiz-option").first().click();
  await expect(singleQuiz).toHaveClass(/show/);
  await expect(singleQuiz.locator(".quiz-check-btn")).toBeVisible();

  const multiQuiz = page.locator(".md .quiz-item.multi").first();
  await expect(multiQuiz).toBeVisible();

  const multiOption = multiQuiz.locator(".quiz-option").first();
  await multiOption.click();
  await expect(multiOption).toHaveClass(/selected/);

  const multiCheckButton = multiQuiz.locator(".quiz-check-btn");
  await multiCheckButton.click();
  await expect(multiQuiz).toHaveClass(/show/);
});
