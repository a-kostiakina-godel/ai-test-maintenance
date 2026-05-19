import { Page } from '@playwright/test';
import { BasePage } from './basePage';

export class ApiPage extends BasePage {
  readonly mainHeading = this.page.getByRole('heading', { name: 'Playwright Library' });

  constructor(page: Page) {
    super(page);
  }
}
