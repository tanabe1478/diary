import { test, expect } from "@playwright/test";

test.describe("Visual Regression Tests", () => {
  test("homepage - light mode", async ({ page }) => {
    await page.goto("/");
    await expect(page).toHaveScreenshot("homepage-light.png", {
      fullPage: true,
    });
  });

  test("homepage - dark mode", async ({ page }) => {
    await page.emulateMedia({ colorScheme: "dark" });
    await page.goto("/");
    await expect(page).toHaveScreenshot("homepage-dark.png", {
      fullPage: true,
    });
  });

  test("article page - light mode", async ({ page }) => {
    await page.goto("/articles/1");
    await expect(page).toHaveScreenshot("article-light.png", {
      fullPage: true,
    });
  });

  test("article page - dark mode", async ({ page }) => {
    await page.emulateMedia({ colorScheme: "dark" });
    await page.goto("/articles/1");
    await expect(page).toHaveScreenshot("article-dark.png", {
      fullPage: true,
    });
  });
});
