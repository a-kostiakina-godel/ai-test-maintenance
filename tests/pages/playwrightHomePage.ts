import { Page } from '@playwright/test';
import { BasePage } from './basePage';
import { ROUTES } from '../constants/routes';

export class PlaywrightHomePage extends BasePage {
  readonly getStartedLink = this.page.getByRole('link', { name: 'Get started' });
  readonly starGitHubLink = this.page.getByRole('link', { name: 'Star microsoft/playwright on GitHub' });

  constructor(page: Page) {
    super(page);
  }

  async navigateToPlaywrightHome() {
    await this.goto(ROUTES.home);
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
