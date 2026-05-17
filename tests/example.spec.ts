import { test, expect } from '@playwright/test';
import { PlaywrightHomePage } from './pages/playwrightHomePage';

test.describe('Playwright Home Page Tests', () => {
  let homePage: PlaywrightHomePage;

  test.beforeEach(async ({ page }) => {
    homePage = new PlaywrightHomePage(page);
    await homePage.navigateToPlaywrightHome();
  });

  test('should verify page title contains Playwright', async () => {
    await homePage.verifyPageTitle();
  });

  test('should verify Get Started link is visible and clickable', async ({ page }) => {
    const isVisible = await homePage.isGetStartedLinkVisible();
    expect(isVisible).toBeTruthy();

    await homePage.clickGetStartedLink();

    // Verify we navigated to a different page
    await expect(page).toHaveURL(/docs/);
  });
});

