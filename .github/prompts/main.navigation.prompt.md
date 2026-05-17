
Act as Senior SDET working in a Playwright TAF (Test Automation Framework) that already has:
- `tests/pages/basePage.ts` — abstract base class with `goto()`, `getPageTitle()`, `getPageUrl()`, `waitForPageLoad()`
- `tests/pages/playwrightHomePage.ts` — Page Object for `https://playwright.dev/`
- `tests/example.spec.ts` — example spec following POM pattern
- `playwright.config.ts` — configured for Chromium, `testDir: './tests'`, HTML reporter

The project follows the **Page Object Model (POM)** pattern: page objects live in `tests/pages/`, specs import them and never contain raw locators.

**Test Case to cover**
Test Suite: Main Page Navigation Test Case ID: TC-NAV-001 Title: The main page should display navigation links: Docs, API, Community Preconditions: Browser is open, no prior session URL Under Test: https://playwright.dev/
#	Step	Expected Result
1	Navigate to https://playwright.dev/
Page loads, title contains "Playwright"
2	Locate the "Docs" navigation link	Link is visible in the top navigation bar
3	Verify "Docs" has role="link" and is accessible	Element has correct ARIA role; label matches "Docs"
4	Locate the "API" navigation link	Link is visible in the top navigation bar
5	Verify "API" has role="link" and is accessible	Element has correct ARIA role; label matches "API"
6	Locate the "CLI" navigation link	Link is visible in the top navigation bar
7	Verify "CLI" has role="link" and is accessible	Element has correct ARIA role; label matches "CLI"
8	Click the "Docs" link	URL changes to contain /docs/intro
9	Navigate back; click the "API" link	URL changes to contain /docs/api/class-playwright
10	Navigate back; click the "CLI" link	URL changes to contain /agent-cli/introduction

## Explore the Site

Navigate to `https://playwright.dev/` and take a snapshot of the page. Inspect the top navigation bar to confirm:

- The exact text labels used (e.g. "Docs", "API", "CLI")
- The HTML roles (links vs buttons)
- Any `aria-label` attributes present
- The destination URLs for each nav item

Use `browser_navigate` then `browser_snapshot` to gather this information before writing any code.

 ## Create the Page Object

Create `tests/pages/mainNavigationPage.ts` extending `BasePage` from `./basePage`.

Requirements:

- Import `Page` and `expect` from `@playwright/test`
- Import `BasePage` from `./basePage`
- Define locators using **role-based selectors** (`getByRole('link', { name: '...' })`) — no CSS or XPath
- Expose these locators as `readonly` properties:
  - `docsLink` — the "Docs" navigation link
  - `apiLink` — the "API" navigation link
  - `cliLink` — the "CLI" navigation link
- Provide one method:
  - `navigateToHome()` — navigates to `https://playwright.dev/`
## Create the Spec File

Create `tests/main.navigation.spec.ts` with a **single test case**.

Requirements:

- Import `test`, `expect` from `@playwright/test`
- Import `MainNavigationPage` from `./pages/mainNavigationPage`
- Use `test.describe('Main Page Navigation', () => { ... })`
- One `test.beforeEach` that instantiates `MainNavigationPage` and calls `navigateToHome()`

### TC-NAV-001: should display Docs, API, and CLI navigation links

In a single test, assert all of the following in order:

1. **Visibility** — each link is visible.
2. **Accessibility** — each link is enabled and has the correct accessible name
3. **Navigation** — each link opens the correct page (navigate back between each).

**Code quality rules:**

- Use `await expect(locator).toBeVisible()` — never `expect(await locator.isVisible()).toBe(true)`
- No fixed `page.waitForTimeout()` calls
- No raw locators in the spec — all selectors stay in the Page Object
- Test title reads as a sentence

## Execute and Iterate

After writing both files:

1. Run the test: `npx playwright test tests/main.navigation.spec.ts --project=chromium`
2. If it fails, read the error, update the locator or assertion, and re-run
3. Once it passes, open the HTML report: `npx playwright show-report`

## Deliverables
- `tests/pages/mainNavigationPage.ts` created with POM pattern
- `tests/main.navigation.spec.ts` created with 1 passing test
-  Test covers: visibility, accessibility (role + label), navigation to correct URLs
-  Test passes on Chromium
