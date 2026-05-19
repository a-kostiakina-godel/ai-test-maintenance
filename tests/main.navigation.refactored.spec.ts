import { test, expect } from '@playwright/test';
import { MainNavigationPage } from './pages/mainNavigationPage';

test.describe('Main Page Navigation', () => {
  let mainNavPage: MainNavigationPage;

  test.beforeEach(async ({ page }) => {
    mainNavPage = new MainNavigationPage(page);
    await mainNavPage.navigateToHome();
  });

  test('TC-NAV-001: should display Docs, API, and CLI navigation links', async ({ page }) => {
    await test.step('Visibility: each link is visible', async () => {
      await expect(mainNavPage.docsLink).toBeVisible();
      await expect(mainNavPage.apiLink).toBeVisible();
      await expect(mainNavPage.cliLink).toBeVisible();
    });

    await test.step('Accessibility: each link has role=link, is enabled, and has the correct accessible name', async () => {
      await expect(mainNavPage.docsLink).toHaveRole('link');
      await expect(mainNavPage.docsLink).toBeEnabled();
      await expect(mainNavPage.docsLink).toHaveAccessibleName('Docs');

      await expect(mainNavPage.apiLink).toHaveRole('link');
      await expect(mainNavPage.apiLink).toBeEnabled();
      await expect(mainNavPage.apiLink).toHaveAccessibleName('API');

      await expect(mainNavPage.cliLink).toHaveRole('link');
      await expect(mainNavPage.cliLink).toBeEnabled();
      await expect(mainNavPage.cliLink).toHaveAccessibleName('CLI');
    });

    await test.step('Navigation: Docs link opens /docs/intro', async () => {
      await mainNavPage.docsLink.click();
      await expect(page).toHaveURL(/\/docs\/intro/);
    });

    await test.step('Navigation: API link opens /docs/api/class-playwright', async () => {
      await page.goBack();
      await mainNavPage.apiLink.click();
      await expect(page).toHaveURL(/\/docs\/api\/class-playwright/);
    });

    await test.step('Navigation: CLI link opens /agent-cli/introduction', async () => {
      await page.goBack();
      await mainNavPage.cliLink.click();
      await expect(page).toHaveURL(/\/agent-cli\/introduction/);
    });
  });
});
