# Suite Maintenance Summary

**Scope:** Files added in commit `c8ec466` — `old-smoke-tests.spec.ts`, `home-page-title.spec.ts`, `duplicate-get-started.spec.ts`

---

## Issues Found

### 1. Broken / Obsolete Selectors — `old-smoke-tests.spec.ts`

| Test | Problem |
|---|---|
| `should navigate through main sections` | Uses `page.click("text=Docs")` / `page.click("text=API")` — raw text selectors with no page-object abstraction; fragile and deprecated in favour of role-based locators |
| `old way: verify page is accessible` | `expect(pageUrl).toBeDefined()` always passes (strings are never `undefined`); zero signal |
| All 3 tests | No page-object usage; raw `page.goto()` directly in test body |

**Action:** All tests removed. Navigation coverage already exists in `main.navigation.professional.spec.ts` (TC-NAV-002, TC-NAV-003). Title coverage in `home-page-title.spec.ts`.

---

### 2. Redundant / Duplicate Scenarios — `home-page-title.spec.ts`

Four tests, all asserting the same fact ("title contains Playwright"):

| Test | Assertion | Problem |
|---|---|---|
| `should verify playwright website title is loaded` | `toHaveTitle(/Playwright/)` | **Kept** — canonical Playwright assertion |
| `should verify page title matches Playwright` | `page.title()` + `toContain` | Duplicate; weaker API |
| `should confirm Playwright appears in page title` | `title.toLowerCase().toContain` | Redundant — regex `/Playwright/` is case-sensitive by default, making this add no value |
| `should verify page loads without errors` | `pageTitle !== null && length > 0` | Meaningless guard; bypasses `beforeEach` page object; `not.toBeNull()` on a string always passes |

**Action:** Three redundant tests removed. One authoritative test retained.

---

### 3. Overlapping Tests — `duplicate-get-started.spec.ts`

All three tests duplicate scenarios already in `example.spec.ts`:

| Duplicate test | Covered by |
|---|---|
| `should click on get started link` | `example.spec.ts` → "should verify Get Started link is visible and clickable" (identical flow) |
| `should navigate to docs section when clicking get started` | Same — subset of the above |
| `should verify get started link exists on page` | Same — visibility-only subset |

The file itself contained the comment: `// The "should verify Get Started link is visible and clickable" test already covers this scenario`

**Action:** All tests removed. File retained as an empty placeholder with a redirect comment.

---

## Representative Diff — `home-page-title.spec.ts`

```diff
@@ -12,20 +12,4 @@ test.describe("Home Page Title Verification", () => {
   test("should verify playwright website title is loaded", async () => {
     await expect(homePage.page).toHaveTitle(/Playwright/);
   });
-
-  test("should verify page title matches Playwright", async () => {
-    const pageTitle = await homePage.page.title();
-    expect(pageTitle).toContain("Playwright");
-  });
-
-  test("should confirm Playwright appears in page title", async () => {
-    const title = await homePage.page.title();
-    expect(title.toLowerCase()).toContain("playwright");
-  });
-
-  test("should verify page loads without errors", async ({ page }) => {
-    const pageTitle = await page.title();
-    expect(pageTitle).not.toBeNull();
-    expect(pageTitle.length).toBeGreaterThan(0);
-  });
 });
```

---

## Consolidation Recommendations

| Area | Canonical file | Obsolete files |
|---|---|---|
| Home page title | `example.spec.ts` | `home-page-title.spec.ts` (now 1 test) |
| Get Started navigation | `example.spec.ts` | `duplicate-get-started.spec.ts` (emptied) |
| Nav link routing | `main.navigation.professional.spec.ts` | `old-smoke-tests.spec.ts` (emptied), `main.navigation.spec.ts`, `main.navigation.refactored.spec.ts` |

> **Note:** `main.navigation.spec.ts` and `main.navigation.refactored.spec.ts` both define `TC-NAV-001` covering identical visibility + accessibility + routing in one monolithic test. Consider consolidating into `main.navigation.professional.spec.ts` which already splits these into focused, tagged tests (TC-NAV-001 through TC-NAV-007).

---

## Net Change

| File | Tests before | Tests after | Removed |
|---|---|---|---|
| `old-smoke-tests.spec.ts` | 3 | 0 | 3 obsolete (raw selectors, trivial assertions) |
| `home-page-title.spec.ts` | 4 | 1 | 3 redundant title checks |
| `duplicate-get-started.spec.ts` | 3 | 0 | 3 exact duplicates of `example.spec.ts` |
| **Total** | **10** | **1** | **9** |
