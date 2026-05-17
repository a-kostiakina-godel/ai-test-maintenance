import { Page, Locator, expect } from '@playwright/test';
import { BasePage } from './basePage';

export class MainNavigationPage extends BasePage {
  readonly docsLink = this.page.getByRole('link', { name: 'Docs' });
  readonly apiLink = this.page.getByRole('link', { name: 'API' });
  readonly cliLink = this.page.getByRole('link', { name: 'CLI', exact: true });

  constructor(page: Page) {
    super(page);
  }

  async navigateToHome() {
    await this.goto('https://playwright.dev/');
  }

  async assertNavLinkAccessible(link: Locator, expectedName: string) {
    await expect(link).toHaveRole('link');
    await expect(link).toBeEnabled();
    await expect(link).toHaveAccessibleName(expectedName);
  }
}
