import { expect, type Page } from "@playwright/test";

/**
 * 打开搜索面板，兼容 client:idle 水合延迟。
 *
 * SearchPage 使用 client:idle 指令，点击监听器在 Svelte 水合后才挂载到 #search 按钮。
 * 若在水合完成前点击，对话框不会打开，因此需要重试直到对话框可见。
 */
export async function openSearchDialog(page: Page) {
  const openSearchButton = page.locator("#search");
  const searchDialog = page.getByRole("dialog", { name: "Search" });

  await expect(openSearchButton).toBeVisible();

  if (await searchDialog.isVisible()) {
    return searchDialog;
  }

  // SearchPage 使用 client:idle 水合：等待其完成注册 pagefind-input，
  // 确保键盘/点击监听器已挂载。
  await page
    .waitForFunction(
      () => typeof customElements !== "undefined" && Boolean(customElements.get("pagefind-input")),
      undefined,
      { timeout: 5000 },
    )
    .catch(() => {});

  // 优先使用 Ctrl/Cmd+K 快捷键打开（SearchPage 中是「打开」语义，单边触发，
  // 不会与 #search 按钮的 toggle 语义叠加导致开/关交替）。
  const shortcut = process.platform === "darwin" ? "Meta+K" : "Control+K";
  await page.keyboard.press(shortcut);

  try {
    await expect(searchDialog).toBeVisible({ timeout: 3000 });
  } catch {
    // fallback：快捷键未命中（如焦点在可编辑元素上）时改用点击，
    // 仅在对话框仍不可见时补一次，避免 toggle 翻转。
    await openSearchButton.click({ force: true });
    await expect(searchDialog).toBeVisible({ timeout: 5000 });
  }

  return searchDialog;
}
