import { expect, test } from "@playwright/test";
import { POSTS } from "../support/routes";

test("@regression CodeBlock light DOM 代码块保留行号与等宽字体（shadow 样式迁移回归）", async ({
  page,
}) => {
  await page.goto(POSTS.postMigrationTest);

  const codeBlock = page.locator("code-block").first();
  await expect(codeBlock).toBeVisible();

  // 行号由 code .line::before 的 counter 生成——shadow 内样式无法命中 light DOM，
  // 必须由全局 code-block-light.css 提供
  const lineBefore = await codeBlock
    .locator("code .line")
    .first()
    .evaluate((el) => getComputedStyle(el, "::before").content);
  expect(lineBefore).not.toBe("none");

  const codeFont = await codeBlock
    .locator("code")
    .first()
    .evaluate((el) => getComputedStyle(el).fontFamily);
  expect(codeFont).toContain("Maple Mono");

  const codeDisplay = await codeBlock
    .locator("code")
    .first()
    .evaluate((el) => getComputedStyle(el).display);
  expect(codeDisplay).toBe("flex");
});

test("@regression CodeBlock 支持折叠与展开", async ({ page }) => {
  const response = await page.goto(POSTS.postMigrationTest);
  expect(response?.ok()).toBeTruthy();

  const codeBlock = page.locator("code-block").first();
  await expect(codeBlock).toBeVisible();

  const collapseButton = codeBlock.getByRole("button", { name: "Expand code" });
  await expect(collapseButton).toBeVisible();

  await collapseButton.dispatchEvent("click");
  await expect(codeBlock.getByRole("button", { name: "Collapse code" })).toBeVisible();
});

test("@regression CodeBlock 支持进入全屏并可通过 Escape 退出", async ({ page }) => {
  await page.goto(POSTS.postMigrationTest);

  const codeBlock = page.locator("code-block").first();
  await expect(codeBlock).toBeVisible();

  const fullscreenButton = codeBlock.getByRole("button", {
    name: "Enter fullscreen",
  });
  await fullscreenButton.click();

  await expect(codeBlock.getByRole("button", { name: "Exit fullscreen" })).toBeVisible();
  await expect
    .poll(async () => {
      return page.evaluate(() => {
        return document.body.style.overflow;
      });
    })
    .toBe("hidden");

  await page.keyboard.press("Escape");
  await expect(codeBlock.getByRole("button", { name: "Enter fullscreen" })).toBeVisible();
});
