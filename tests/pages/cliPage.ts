import { Page } from '@playwright/test';
import { BasePage } from './basePage';

export class CliPage extends BasePage {
  readonly mainHeading = this.page.getByRole('heading', { name: 'Playwright CLI', exact: true });

  constructor(page: Page) {
    super(page);
  }
}
