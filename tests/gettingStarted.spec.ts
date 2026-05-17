import { test, expect } from '@playwright/test';
import { GettingStartedPage } from './pages/gettingStartedPage';

test.describe('Getting Started Page Tests', () => {
  let gettingStartedPage: GettingStartedPage;

  test.beforeEach(async ({ page }) => {
    gettingStartedPage = new GettingStartedPage(page);
    await gettingStartedPage.navigateToGettingStarted();
  });

  test('should verify Installation heading is visible', async () => {
    await gettingStartedPage.verifyInstallationHeadingIsVisible();
  });

  test('should verify page URL contains docs/intro', async () => {
    gettingStartedPage.verifyPageUrl();
    expect(gettingStartedPage.page.url()).toContain('docs/intro');
  });
});
