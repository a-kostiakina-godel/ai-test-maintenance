import { test, expect } from '@playwright/test';
import { GettingStartedPage } from './pages/gettingStartedPage';
import { ROUTES } from './constants/routes';

test.describe('Getting Started Page Tests', () => {
  let gettingStartedPage: GettingStartedPage;

  test.beforeEach(async ({ page }) => {
    gettingStartedPage = new GettingStartedPage(page);
    await gettingStartedPage.navigateToGettingStarted();
  });

  test('should verify Installation heading is visible', async () => {
    await expect(gettingStartedPage.installationHeading).toBeVisible();
  });

  test('should verify page URL contains docs/intro', async () => {
    await expect(gettingStartedPage.page).toHaveURL(ROUTES.docs);
  });
});
