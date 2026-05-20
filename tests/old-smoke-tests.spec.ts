import { test, expect } from "@playwright/test";
import { PlaywrightHomePage } from "./pages/playwrightHomePage";
import { MainNavigationPage } from "./pages/mainNavigationPage";

test.describe("Old Smoke Tests", () => {
  test("should load playwright home page", async ({ page }) => {
    await page.goto("https://playwright.dev");
    const title = await page.title();
    expect(title).toContain("Playwright");
  });

  test("should navigate through main sections", async ({ page }) => {
    await page.goto("https://playwright.dev");

    await page.click("text=Docs");
    await expect(page).toHaveURL(/\/docs/);

    await page.goBack();

    await page.click("text=API");
    await expect(page).toHaveURL(/\/docs\/api/);
  });

  test("old way: verify page is accessible", async ({ page }) => {
    await page.goto("https://playwright.dev");
    const pageUrl = page.url();
    expect(pageUrl).toBeDefined();
    expect(pageUrl).toContain("playwright");
  });
});
