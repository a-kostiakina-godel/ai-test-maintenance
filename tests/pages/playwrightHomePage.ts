import { Page, expect } from '@playwright/test';
import { BasePage } from './basePage';

export class PlaywrightHomePage extends BasePage {
  readonly getStartedLink = this.page.getByRole('link', { name: 'Get started' });
  readonly starGitHubLink = this.page.getByRole('link', { name: 'Star microsoft/playwright on GitHub' });

  constructor(page: Page) {
    super(page);
  }

  async navigateToPlaywrightHome() {
    await this.goto('https://playwright.dev/');
  }

  async verifyPageTitle() {
    await expect(this.page).toHaveTitle(/Playwright/);
  }

  async clickGetStartedLink() {
    await this.getStartedLink.click();
  }

  async clickStarGitHubLink() {
    await this.starGitHubLink.click();
  }

  async isGetStartedLinkVisible() {
    return await this.getStartedLink.isVisible();
  }
}
