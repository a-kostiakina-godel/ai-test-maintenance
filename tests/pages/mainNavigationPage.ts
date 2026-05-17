import { Page, expect } from '@playwright/test';
import { BasePage } from './basePage';

export class MainNavigationPage extends BasePage {
  readonly docsLink = this.page.locator('#docs');
  readonly apiLink = this.page.getByRole('link', { name: 'API' });
  readonly cliLink = this.page.locator('#cli');

  constructor(page: Page) {
    super(page);
  }

  async navigateToHome() {
    await this.goto('https://playwright.dev/');
  }
}
