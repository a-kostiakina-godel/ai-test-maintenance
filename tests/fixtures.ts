import { test as base } from '@playwright/test';
import { MainNavigationPage } from './pages/mainNavigationPage';

type Fixtures = {
  mainNavPage: MainNavigationPage;
};

export const test = base.extend<Fixtures>({
  mainNavPage: async ({ page }, use) => {
    const mainNavPage = new MainNavigationPage(page);
    await mainNavPage.navigateToHome();
    await use(mainNavPage);
  },
});

export { expect } from '@playwright/test';
