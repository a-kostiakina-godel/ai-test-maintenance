import { Page } from '@playwright/test';
import { BasePage } from './basePage';
import { ROUTES } from '../constants/routes';

export class GettingStartedPage extends BasePage {
  readonly installationHeading = this.page.getByRole('heading', { name: 'Installation' });
  readonly getStartedSection = this.page.locator('text=Getting started with writing end-to-end tests');

  constructor(page: Page) {
    super(page);
  }

  async navigateToGettingStarted() {
    await this.goto(ROUTES.docs);
  }

  async isInstallationHeadingVisible() {
    return await this.installationHeading.isVisible();
  }
}
