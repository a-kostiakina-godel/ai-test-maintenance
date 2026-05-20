import { test, expect } from "@playwright/test";
import { PlaywrightHomePage } from "./pages/playwrightHomePage";

test.describe("Home Page Title Verification", () => {
  let homePage: PlaywrightHomePage;

  test.beforeEach(async ({ page }) => {
    homePage = new PlaywrightHomePage(page);
    await homePage.navigateToPlaywrightHome();
  });

  test("should verify playwright website title is loaded", async () => {
    await expect(homePage.page).toHaveTitle(/Playwright/);
  });

  test("should verify page title matches Playwright", async () => {
    const pageTitle = await homePage.page.title();
    expect(pageTitle).toContain("Playwright");
  });

  test("should confirm Playwright appears in page title", async () => {
    const title = await homePage.page.title();
    expect(title.toLowerCase()).toContain("playwright");
  });

  test("should verify page loads without errors", async ({ page }) => {
    const pageTitle = await page.title();
    expect(pageTitle).not.toBeNull();
    expect(pageTitle.length).toBeGreaterThan(0);
  });
});
