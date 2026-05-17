import { test, expect } from '@playwright/test';
import { MainNavigationPage } from './pages/mainNavigationPage';

test.describe('Main Page Navigation', () => {
  let mainNavPage: MainNavigationPage;

  test.beforeEach(async ({ page }) => {
    mainNavPage = new MainNavigationPage(page);
    await mainNavPage.navigateToHome();
  });

  test('TC-NAV-001: should display Docs, API, and CLI navigation links', async ({ page }) => {
    // Visibility - each link is visible
    await page.waitForTimeout(300);
    await expect(mainNavPage.docsLink).toBeVisible();
    await expect(mainNavPage.apiLink).toBeVisible();
    await expect(mainNavPage.cliLink).toBeVisible();

    // Accessibility - each link is enabled and has the correct accessible name
    await expect(mainNavPage.docsLink).toBeEnabled();
    expect(mainNavPage.docsLink).toHaveAccessibleName('Docs');

    await expect(mainNavPage.apiLink).toBeEnabled();
    await expect(mainNavPage.apiLink).toHaveAccessibleName('API');

    await expect(mainNavPage.cliLink).toBeEnabled();
    expect(mainNavPage.cliLink).toHaveAccessibleName('CLI');

    // Navigation - each link opens the correct page (navigate back between each)
    await mainNavPage.docsLink.click();
    await expect(page).toHaveURL(/\/docs\/intro/);

    await page.goBack();
    await page.waitForTimeout(2000);
    await mainNavPage.apiLink.click();
    await expect(page).toHaveURL(/\/docs\/api\/class-playwright/);

    await page.goBack();
    mainNavPage.cliLink.click();
    await expect(page).toHaveURL(/\/agent-cli\/introduction/);
  });
});
