import { test, expect } from "@playwright/test";
import { PlaywrightHomePage } from "./pages/playwrightHomePage";

// The "should verify Get Started link is visible and clickable" test already covers this scenario
test.describe("Get Started Button Tests - Old Implementation", () => {
  let homePage: PlaywrightHomePage;

  test.beforeEach(async ({ page }) => {
    homePage = new PlaywrightHomePage(page);
    await homePage.navigateToPlaywrightHome();
  });

  test("should click on get started link", async ({ page }) => {
    const isVisible = await homePage.isGetStartedLinkVisible();
    expect(isVisible).toBeTruthy();

    await homePage.clickGetStartedLink();
    await expect(page).toHaveURL(/docs/);
  });

  test("should navigate to docs section when clicking get started", async ({
    page,
  }) => {
    await homePage.clickGetStartedLink();
    const pageUrl = page.url();
    expect(pageUrl).toContain("docs");
  });

  test("should verify get started link exists on page", async () => {
    const isVisible = await homePage.isGetStartedLinkVisible();
    expect(isVisible).toBe(true);
  });
});
