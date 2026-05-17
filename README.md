# AI Test Maintenance

A modern test automation framework built with [Playwright](https://playwright.dev/) and TypeScript, following the Page Object Model (POM) design pattern.

## Overview

This project provides a structured foundation for end-to-end testing using Playwright. It demonstrates best practices for test organization, maintainability, and scalability through the implementation of the Page Object Model pattern.

## Features

- **Playwright Testing**: Latest version of Playwright for cross-browser testing
- **TypeScript Support**: Full TypeScript support for type-safe tests
- **Page Object Model (POM)**: Organized test structure for improved maintainability
- **Chromium Browser**: Tests configured to run on Chromium browser
- **CI/CD Integration**: GitHub Actions workflow for automated test execution

## Prerequisites

- Node.js 18+ ([Download](https://nodejs.org/))
- npm (comes with Node.js)

## Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd ai-test-maintenance
```

2. Install dependencies:
```bash
npm install
```

3. Install Playwright browsers:
```bash
npx playwright install
```

## Project Structure

```
ai-test-maintenance/
├── tests/                      # Test files directory
│   ├── pages/                  # Page Object Model classes
│   │   └── *.ts               # Individual page objects
│   └── *.spec.ts              # Test cases
├── playwright.config.ts        # Playwright configuration
├── package.json               # Project dependencies
├── .gitignore                 # Git ignore rules
└── README.md                  # This file
```

## Running Tests

### Run all tests
```bash
npm test
```

### Run tests in UI mode
```bash
npm run test:ui
```

### Run tests in headed mode (browser visible)
```bash
npm run test:headed
```

### Run specific test file
```bash
npx playwright test tests/example.spec.ts
```

### Run tests with specific grep pattern
```bash
npx playwright test --grep "pattern"
```

### Debug tests
```bash
npx playwright test --debug
```

## Configuration

The project is configured in `playwright.config.ts` with the following settings:

- **Browser**: Chromium only
- **Base URL**: Can be configured in the config file
- **Timeout**: Configurable per test (default: 30 seconds)
- **Retry**: Tests can be configured to retry on failure
- **Reports**: HTML reports generated in `playwright-report/`

### Updating Configuration

Edit `playwright.config.ts` to modify:
- Test timeout
- Browser options
- Retry count
- Base URL
- Output directories

## Page Object Model (POM)

Pages are organized as classes in the `tests/pages/` directory. Each page class encapsulates:

- Selectors
- Navigation methods
- User actions
- Assertions

### Example Page Object

```typescript
import { Page } from '@playwright/test';

export class LoginPage {
  constructor(private page: Page) {}

  async goto() {
    await this.page.goto('/login');
  }

  async login(username: string, password: string) {
    await this.page.fill('[data-testid="username"]', username);
    await this.page.fill('[data-testid="password"]', password);
    await this.page.click('[data-testid="login-button"]');
  }

  async isErrorDisplayed() {
    return this.page.isVisible('[data-testid="error-message"]');
  }
}
```

### Using Page Objects in Tests

```typescript
import { test, expect } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage';

test('login with valid credentials', async ({ page }) => {
  const loginPage = new LoginPage(page);
  await loginPage.goto();
  await loginPage.login('user@example.com', 'password');
  await expect(page).toHaveURL('/dashboard');
});
```

## Writing Tests

1. Create a test file in `tests/` with `.spec.ts` extension
2. Import necessary page objects
3. Use `test()` function to define test cases
4. Use `expect()` for assertions

### Test Template

```typescript
import { test, expect } from '@playwright/test';
import { YourPage } from '../pages/YourPage';

test.describe('Feature name', () => {
  test('should perform action', async ({ page }) => {
    const yourPage = new YourPage(page);
    
    // Arrange
    await yourPage.goto();
    
    // Act
    await yourPage.performAction();
    
    // Assert
    await expect(yourPage.element).toBeVisible();
  });
});
```

## Test Reports

After running tests, view the HTML report:

```bash
npx playwright show-report
```

Test results are stored in the `test-results/` directory.

## CI/CD Integration

This project includes a GitHub Actions workflow (`.github/workflows/playwright.yml`) that runs tests automatically on:
- Push to main branch
- Pull requests

Tests are executed in headless mode using the configured Chromium browser.

## Debugging

### Using VS Code Debugger

Add breakpoints in your test file and run:
```bash
npx playwright test --debug
```

### Inspector Mode

Opens the Playwright Inspector to step through your test:
```bash
npx playwright test --debug
```

## Best Practices

1. **Use Page Objects**: Encapsulate page interactions in page object classes
2. **Wait for Elements**: Use Playwright's built-in waiting mechanisms
3. **Avoid Hard Waits**: Prefer explicit waits over `sleep()`
4. **Use Meaningful Assertions**: Clear, descriptive assertions make failures easier to diagnose
5. **Organize Tests**: Group related tests using `test.describe()`
6. **Keep Tests Independent**: Each test should be runnable in isolation

## Troubleshooting

### Tests timeout
- Check if the application is running (if testing locally)
- Increase timeout in `playwright.config.ts`
- Use `--headed` mode to see what's happening

### Browser won't install
```bash
npm install
npx playwright install chromium
```

### Port conflicts
- Ensure your application is running on the configured base URL
- Check for other processes using the same port

## Resources

- [Playwright Documentation](https://playwright.dev/docs/intro)
- [Playwright API Reference](https://playwright.dev/docs/api/class-playwright)
- [Best Practices](https://playwright.dev/docs/best-practices)
- [Debugging Guide](https://playwright.dev/docs/debug)

## Contributing

When contributing to this project:

1. Follow the Page Object Model pattern
2. Write descriptive test names
3. Add comments for complex logic
4. Ensure all tests pass before submitting
5. Update this README if adding new features

## License

This project is part of the AI course SDET training program.

## Support

For questions or issues, please refer to the [Playwright documentation](https://playwright.dev/) or create an issue in the repository.
