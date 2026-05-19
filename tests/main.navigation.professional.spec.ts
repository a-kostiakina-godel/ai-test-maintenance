import { test, expect } from "./fixtures";
import { GettingStartedPage } from "./pages/gettingStartedPage";
import { ApiPage } from "./pages/apiPage";
import { CliPage } from "./pages/cliPage";
import { ROUTES } from "./constants/routes";

test.describe("Main Page Navigation", () => {
  test(
    "TC-NAV-001: shows all main navigation links and verifies accessibility",
    { tag: ["@smoke", "@nav"] },
    async ({ mainNavPage }) => {
      await test.step("Visibility: each link is visible", async () => {
        await expect(mainNavPage.docsLink).toBeVisible();
        await expect(mainNavPage.apiLink).toBeVisible();
        await expect(mainNavPage.cliLink).toBeVisible();
      });

      await test.step("Accessibility: each link has correct role, is enabled, and has accessible name", async () => {
        await expect(mainNavPage.docsLink).toHaveRole("link");
        await expect(mainNavPage.docsLink).toBeEnabled();
        await expect(mainNavPage.docsLink).toHaveAccessibleName("Docs");

        await expect(mainNavPage.apiLink).toHaveRole("link");
        await expect(mainNavPage.apiLink).toBeEnabled();
        await expect(mainNavPage.apiLink).toHaveAccessibleName("API");

        await expect(mainNavPage.cliLink).toHaveRole("link");
        await expect(mainNavPage.cliLink).toBeEnabled();
        await expect(mainNavPage.cliLink).toHaveAccessibleName("CLI");
      });
    },
  );

  test(
    "TC-NAV-002: Docs link navigates to the Getting Started page",
    { tag: ["@regression", "@nav"] },
    async ({ page, mainNavPage }) => {
      await mainNavPage.docsLink.click();
      const gettingStartedPage = new GettingStartedPage(page);
      await expect(page).toHaveURL(ROUTES.docs);
      await expect(gettingStartedPage.installationHeading).toBeVisible();
    },
  );

  test(
    "TC-NAV-003: API link navigates to the Playwright Library page",
    { tag: ["@regression", "@nav"] },
    async ({ page, mainNavPage }) => {
      await mainNavPage.apiLink.click();
      const apiPage = new ApiPage(page);
      await expect(page).toHaveURL(ROUTES.api);
      await expect(apiPage.mainHeading).toBeVisible();
    },
  );

  test(
    "TC-NAV-004: CLI link navigates to the Playwright CLI introduction page",
    { tag: ["@regression", "@nav"] },
    async ({ page, mainNavPage }) => {
      await mainNavPage.cliLink.click();
      const cliPage = new CliPage(page);
      await expect(page).toHaveURL(ROUTES.cli);
      await expect(cliPage.mainHeading).toBeVisible();
    },
  );

  test(
    "TC-NAV-006: API link href attribute points to the expected route",
    { tag: ["@regression", "@nav"] },
    async ({ page, mainNavPage }) => {
      await expect(mainNavPage.apiLink).toHaveAttribute("href", ROUTES.api);
      await mainNavPage.apiLink.click();
      const apiPage = new ApiPage(page);
      await expect(page).toHaveURL(ROUTES.api);
      await expect(apiPage.mainHeading).toBeVisible();
    },
  );

  test(
    "TC-NAV-007: surfaces a navigation error when the API link resolves to an unexpected URL",
    { tag: ["@nav", "@regression"] },
    async ({ page, mainNavPage }) => {
      const expectedHref = ROUTES.api;

      await expect(mainNavPage.apiLink).toBeVisible();
      await expect(mainNavPage.apiLink).toHaveAttribute("href", expectedHref);

      await mainNavPage.apiLink.click();

      await expect(page).toHaveURL(expectedHref);
      const apiPage = new ApiPage(page);
      await expect(apiPage.mainHeading).toBeVisible();
    },
  );
});
