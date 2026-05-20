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
});
