import { Page, expect } from '@playwright/test';
import { BasePage } from './basePage';

export class GettingStartedPage extends BasePage {
  readonly installationHeading = this.page.getByRole('heading', { name: 'Installation' });
  readonly getStartedSection = this.page.locator('text=Getting started with writing end-to-end tests');

  constructor(page: Page) {
    super(page);
  }

  async navigateToGettingStarted() {
    await this.goto('https://playwright.dev/docs/intro');
  }

  async verifyInstallationHeadingIsVisible() {
    await expect(this.installationHeading).toBeVisible();
  }

  async verifyPageUrl() {
    expect(this.page.url()).toContain('docs/intro');
  }

  async isInstallationHeadingVisible() {
    return await this.installationHeading.isVisible();
  }
}
