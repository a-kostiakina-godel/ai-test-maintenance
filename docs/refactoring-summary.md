# Refactoring Summary: `main.navigation.spec.ts`

## Overview

This document compares three versions of the navigation test for `https://playwright.dev/`:
the **degraded original**, the **AI-refactored** version, and the **manually improved** final version.

---

## 1. Degraded Version (`tests/main.navigation.spec.ts`)

### Issues Found

| # | Issue | Impact |
|---|-------|--------|
| 1 | `mainNavPage.docsLink` used CSS selector `#docs`; `cliLink` used `#cli` | Brittle — breaks if IDs change |
| 2 | `page.waitForTimeout(300)` before visibility checks | Fixed wait; hides real timing bugs |
| 3 | `page.waitForTimeout(2000)` after `goBack()` | Slows suite by 2 s unconditionally |
| 4 | `expect(mainNavPage.docsLink).toHaveAccessibleName('Docs')` — missing `await` | Silent false positive; assertion never actually ran |
| 5 | `expect(mainNavPage.cliLink).toHaveAccessibleName('CLI')` — missing `await` | Same as above |
| 6 | `mainNavPage.cliLink.click()` — missing `await` | Race condition; next assertion could run before navigation |
| 7 | No `test.step()` grouping | Failures give no hint which phase (visibility/a11y/nav) broke |

### Key Code Fragment

```typescript
// brittle locators
readonly docsLink = this.page.locator('#docs');
readonly cliLink  = this.page.locator('#cli');

// fixed waits
await page.waitForTimeout(300);
// ...
await page.waitForTimeout(2000);

// missing await — assertion silently skipped
expect(mainNavPage.docsLink).toHaveAccessibleName('Docs');

// missing await — race condition
mainNavPage.cliLink.click();
```

---

## 2. AI-Refactored Version (`tests/main.navigation.refactored.spec.ts` after first pass)

### Changes Made by AI

| # | Change | Rationale |
|---|--------|-----------|
| 1 | Replaced `#docs` / `#cli` with `getByRole('link', { name: ... })` | Role-based locators are resilient to DOM restructuring |
| 2 | Removed both `waitForTimeout()` calls | Playwright's built-in auto-waiting makes them redundant |
| 3 | Added `await` to all previously unawaited assertions and click | Prevents silent skips and race conditions |
| 4 | Wrapped phases in `test.step()` | Each phase (Visibility / Accessibility / Navigation) is named in the HTML report |

### Remaining Repetition

The accessibility step still had an inline 3×2 assertion block:

```typescript
await expect(mainNavPage.docsLink).toBeEnabled();
await expect(mainNavPage.docsLink).toHaveAccessibleName('Docs');

await expect(mainNavPage.apiLink).toBeEnabled();
await expect(mainNavPage.apiLink).toHaveAccessibleName('API');

await expect(mainNavPage.cliLink).toBeEnabled();
await expect(mainNavPage.cliLink).toHaveAccessibleName('CLI');
```

No explicit ARIA role assertion (`toHaveRole`) was present.

---

## 3. Manually Improved Version (current state)

### Change: `assertNavLinkAccessible()` Page Object Method

Added to `tests/pages/mainNavigationPage.ts`:

```typescript
async assertNavLinkAccessible(link: Locator, expectedName: string) {
  await expect(link).toHaveRole('link');      // explicit ARIA role check
  await expect(link).toBeEnabled();
  await expect(link).toHaveAccessibleName(expectedName);
}
```

Spec accessibility step becomes:

```typescript
await test.step('Accessibility: each link has role=link, is enabled, and has the correct accessible name', async () => {
  await mainNavPage.assertNavLinkAccessible(mainNavPage.docsLink, 'Docs');
  await mainNavPage.assertNavLinkAccessible(mainNavPage.apiLink, 'API');
  await mainNavPage.assertNavLinkAccessible(mainNavPage.cliLink, 'CLI');
});
```

Added `exact:true` for cliLink 
```typescript
  readonly cliLink = this.page.getByRole('link', { name: 'CLI', exact: true });
```

### Benefits

| Concern | Before | After |
|---------|--------|-------|
| ARIA role verified | No | Yes — `toHaveRole('link')` |
| Repeated assertion block | 6 lines × 3 links = 6 lines inline | 1 method call per link |
| Spec length (accessibility step) | 8 lines | 3 lines |
| Single place to change the a11y contract | No — edit 3 blocks | Yes — edit the method |

---

## Summary Comparison Table

| Criterion | Degraded | AI-Refactored | Manually Improved |
|-----------|----------|---------------|-------------------|
| Role-based locators | Partial (`apiLink` only) | All three links | All three links |
| Fixed waits removed | No | Yes | Yes |
| All assertions awaited | No (3 missing) | Yes | Yes |
| `test.step()` grouping | No | Yes | Yes |
| ARIA role asserted (`toHaveRole`) | No | No | Yes |
| Repeated a11y block extracted | No | No | Yes — POM method |
| Spec imports `expect` only where needed | N/A | Yes | Yes |
