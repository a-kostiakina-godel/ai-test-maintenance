# Professional-Standards Audit — `tests/main.navigation.refactored.spec.ts`

_Audit date: 2026-05-18 | Reviewer role: Senior SDET_

---

## Section A — Numbered Findings

---

### Dimension 1: Traceability — **PARTIAL**

Reasoning: One test case ID (`TC-NAV-001`) is present in the test title, which is a positive signal. However, that single ID is mapped to five distinct behavioral phases (visibility, accessibility, and three independent navigation checks). No tags, no severity annotation, and no owner are recorded anywhere in the file.

---

**F1**

- **Dimension:** Traceability
- **Severity:** Medium
- **Location:** `tests/main.navigation.refactored.spec.ts:12`, `test('TC-NAV-001: should display Docs, API, and CLI navigation links', ...)`
- **Observation:** The test title contains `TC-NAV-001` as a single traceability anchor, but the body of the test exercises five distinct behavioral scenarios (visibility, ARIA accessibility, and three separate navigation outcomes). A single TC ID cannot be meaningfully cross-referenced against a test management system when it covers heterogeneous behaviors.
- **Risk:** If TC-NAV-001 fails in a CI run, the defect report cannot identify which requirement was violated. Triage time increases. Traceability matrix is inaccurate.
- **Evidence:** `'TC-NAV-001: should display Docs, API, and CLI navigation links'` — the title names "display" only, yet the test also asserts navigation to three distinct URLs.

---

**F2**

- **Dimension:** Traceability
- **Severity:** Low
- **Location:** `tests/main.navigation.refactored.spec.ts:4–41` (entire file)
- **Observation:** No Playwright tags (`@smoke`, `@regression`, `@nav`, etc.), no severity annotation, and no owner annotation appear anywhere in the spec — neither on `test.describe` nor on the individual `test()` call.
- **Risk:** Without tags, CI cannot selectively run smoke or regression suites. Ownership is unassigned, so no one is paged when the test goes red.
- **Evidence:** Neither `{ tag: ['@smoke', '@nav'] }` nor any equivalent annotation appears in the file.

---

### Dimension 2: Coverage — **PARTIAL / FAIL**

Reasoning: Three happy-path navigation entries are exercised (positive). No negative paths, no edge cases.

---

**F3**

- **Dimension:** Coverage
- **Severity:** High
- **Location:** `tests/main.navigation.refactored.spec.ts:12–41`
- **Observation:** The spec contains exactly one test function. There is zero coverage of negative paths: navigating to an invalid/non-existent route, server-side error responses (4xx/5xx), broken anchor `href` values, or unauthorized-access redirects.
- **Risk:** Navigation regressions that cause redirect loops, 404 pages, or error overlays go completely undetected.
- **Evidence:** No `test(` block with a negative-scenario title exists anywhere in the file.

---

**F4**

- **Dimension:** Coverage
- **Severity:** High
- **Location:** `tests/main.navigation.refactored.spec.ts:12–41`
- **Observation:** No edge-case scenarios are present: no viewport-variation tests (mobile, tablet), no keyboard-driven navigation (`Tab` + `Enter`), no slow-network simulation, no back/forward browser-button behavior tested _as a feature_, no refresh mid-navigation, no auth-state transition, and no RTL/localization scenario.
- **Risk:** Navigation failures on mobile viewports or after a network interruption are invisible to the suite.
- **Evidence:** The single `test()` never sets a viewport, intercepts a network request, or simulates a keyboard event.

---

**F5**

- **Dimension:** Coverage
- **Severity:** Medium
- **Location:** `tests/main.navigation.refactored.spec.ts:12–41`
- **Observation:** Only three navigation links (Docs, API, CLI) are exercised. Without seeing the rendered page or the full POM, it is not possible to confirm that these are the _only_ navigation items. If additional links exist (e.g., Community, Blog, Pricing), they are unrepresented.
- **Risk:** New nav items silently go untested after the feature ships.
- **Evidence:** Only `docsLink`, `apiLink`, `cliLink` are referenced. _(See also Open Questions section.)_

---

### Dimension 3: Maintainability — **PARTIAL**

Reasoning: POM is used and `test.beforeEach` handles setup. However, there are several patterns that reduce long-term maintainability.

---

**F6**

- **Dimension:** Maintainability
- **Severity:** High
- **Location:** `tests/main.navigation.refactored.spec.ts:12–41` (single `test()`)
- **Observation:** Five logically independent behaviors (visibility × 3, accessibility × 3, and three navigation outcomes) are bundled inside one test function. Playwright executes steps sequentially and stops the test on first failure. If the Docs navigation step fails at line 27, the API and CLI navigation steps at lines 31–40 never execute and report no result.
- **Risk:** A single infrastructure hiccup masks the status of all remaining behaviors. Defect isolation is impossible without rerunning each step manually.
- **Evidence:** Lines 25–40 are three `await test.step(...)` navigation blocks that are all siblings inside a single `test()`. There is no separate `test()` for each link.

---

**F7**

- **Dimension:** Maintainability
- **Severity:** Medium
- **Location:** `tests/main.navigation.refactored.spec.ts:5, 8`, `let mainNavPage: MainNavigationPage`
- **Observation:** `mainNavPage` is declared with `let` at `test.describe` scope and assigned inside `test.beforeEach`. This creates mutable shared state in the closure. While Playwright runs tests within a describe block serially by default, this pattern is fragile: enabling `fullyParallel` or re-ordering tests could introduce state-leakage bugs. Playwright's recommended idiomatic pattern is custom fixtures, which scope the object to the test automatically.
- **Risk:** If the suite is ever parallelized at the `test.describe` level, tests will share the same `mainNavPage` reference, causing non-deterministic failures.
- **Evidence:** `let mainNavPage: MainNavigationPage;` at line 5; `mainNavPage = new MainNavigationPage(page);` at line 8.

---

**F8**

- **Dimension:** Maintainability
- **Severity:** Medium
- **Location:** `tests/main.navigation.refactored.spec.ts:27, 33, 39`
- **Observation:** URL path patterns are hardcoded as inline regex literals directly in the test assertions (`/\/docs\/intro/`, `/\/docs\/api\/class-playwright/`, `/\/agent-cli\/introduction/`). There is no centralized route-constants file or config reference.
- **Risk:** If the target site restructures its URL paths, every assertion must be found and updated individually. The same strings likely appear in other future tests, creating duplication drift.
- **Evidence:**
  ```
  await expect(page).toHaveURL(/\/docs\/intro/);                  // line 27
  await expect(page).toHaveURL(/\/docs\/api\/class-playwright/);  // line 33
  await expect(page).toHaveURL(/\/agent-cli\/introduction/);      // line 39
  ```

---

**F9**

- **Dimension:** Maintainability
- **Severity:** Medium
- **Location:** `tests/main.navigation.refactored.spec.ts:31, 37`, `await page.goBack()`
- **Observation:** `page.goBack()` is called directly on the raw Playwright `page` object inside the spec rather than through a POM method. This breaks the abstraction boundary: the spec knows about browser history mechanics, which is implementation detail that should live in the page object.
- **Risk:** If the navigation reset strategy changes (e.g., switching from `goBack()` to `navigateToHome()` for reliability), every spec that calls `page.goBack()` must be updated rather than updating a single POM method.
- **Evidence:** `await page.goBack();` at lines 31 and 37, invoked on the `page` fixture directly, not via `mainNavPage`.

---

### Dimension 4: Clarity — **PARTIAL**

Reasoning: `test.step` descriptions are clear and behavior-focused. The test title is misleading. No harmful comments exist (there are no comments at all, which is appropriate for self-evident code).

---

**F10**

- **Dimension:** Clarity
- **Severity:** Medium
- **Location:** `tests/main.navigation.refactored.spec.ts:12`
- **Observation:** The test title states `'TC-NAV-001: should display Docs, API, and CLI navigation links'`. The word "display" implies a visibility check only. The test body additionally runs accessibility assertions and navigates to three different pages. A reader scanning test results or a test management system sees a misleading summary of what was verified.
- **Risk:** Developers triaging a failure may look only at visibility-related code and miss that a navigation regression caused the failure. Future contributors may add only display-related assertions, believing that is the correct scope.
- **Evidence:** Title says "display" at line 12; navigation happens at lines 26–40.

---

### Dimension 5: Validation Quality — **PARTIAL**

Reasoning: All assertions present use web-first Playwright APIs (`toBeVisible`, `toHaveURL`, `toHaveRole`, etc.) — correct. However, two significant assertion gaps exist that allow false-positive results.

---

**F11**

- **Dimension:** Validation quality
- **Severity:** High
- **Location:** `tests/main.navigation.refactored.spec.ts:25–28, 30–34, 36–40`
- **Observation:** After each navigation click, the test asserts only the page URL. There is no assertion on visible page content (e.g., the `<h1>` heading, a landmark region, or any content specific to the destination page). A page that resolves to the correct URL but renders a blank body, a spinner stuck indefinitely, or an error overlay will pass the assertion.
- **Risk:** A rendering regression (JS bundle fails, SSR error) is invisible to this test. The test reports green while users see a broken page.
- **Evidence:**
  ```
  await mainNavPage.docsLink.click();
  await expect(page).toHaveURL(/\/docs\/intro/);   // only URL checked — line 27
  ```
  No subsequent `toBeVisible` or `toHaveText` assertion on any page-specific element.

---

**F12**

- **Dimension:** Validation quality
- **Severity:** High
- **Location:** `tests/main.navigation.refactored.spec.ts:31, 37`, `await page.goBack()`
- **Observation:** After `page.goBack()` is called, there is no assertion confirming that the browser returned to the home page before the next link is clicked. If `goBack()` resolves to an intermediate or cached page that is not the home page, the next `mainNavPage.apiLink.click()` or `mainNavPage.cliLink.click()` may either not find the locator or click an element on the wrong page — and the test may still pass if the URL regex is loose enough.
- **Risk:** The navigation step for API or CLI could silently test the wrong page or silently succeed because the locator matches on an unexpected intermediate page. The test gives a false green.
- **Evidence:**
  ```
  await page.goBack();               // line 31 — no assertion follows
  await mainNavPage.apiLink.click(); // assumes home page, unverified
  ```

---

**F13**

- **Dimension:** Validation quality
- **Severity:** Low
- **Location:** `tests/main.navigation.refactored.spec.ts:27, 33, 39`
- **Observation:** The URL regex patterns (`/\/docs\/intro/`, `/\/docs\/api\/class-playwright/`, `/\/agent-cli\/introduction/`) are partial matches. They would pass for any URL that _contains_ the path segment, including `/something/docs/intro-extended` or URLs with an unexpected prefix.
- **Risk:** A misconfigured redirect that appends a suffix or changes the URL structure slightly could still satisfy the regex, masking a navigation defect.
- **Evidence:** `/\/docs\/intro/` matches `playwright.dev/docs/intro` but also `playwright.dev/docs/intro-advanced-usage`.

---

### Dimension 6: Accessibility / Compliance — **PARTIAL**

Reasoning: The POM method `assertNavLinkAccessible` verifies ARIA role, enabled state, and accessible name — a solid baseline for link-level a11y. However, no page-level or suite-level a11y scanning is present, and keyboard navigation is not covered.

---

**F14**

- **Dimension:** Accessibility / Compliance
- **Severity:** Medium
- **Location:** `tests/main.navigation.refactored.spec.ts:19–23`
- **Observation:** The accessibility step calls `assertNavLinkAccessible` (which checks role, enabled state, and accessible name) but no axe-based or automated a11y scan is run against the page. Issues such as missing skip-navigation links, insufficient color contrast, missing `lang` attribute, broken focus management after navigation, and WCAG failures in the navigation region are all outside the current test coverage.
- **Risk:** Accessibility regressions that do not touch role or accessible name go undetected. This is a compliance risk for WCAG 2.1 AA obligations.
- **Evidence:** Lines 19–23 show `assertNavLinkAccessible` calls only. No `@axe-core/playwright` or equivalent import exists in the file.

---

**F15**

- **Dimension:** Accessibility / Compliance
- **Severity:** Medium
- **Location:** `tests/main.navigation.refactored.spec.ts:25–40`
- **Observation:** No keyboard navigation scenario is present. The tests click navigation links using mouse simulation. There is no test that uses `page.keyboard.press('Tab')` to reach each link and `Enter` to activate it, nor is there a test that verifies focus is correctly placed after navigating to a new page.
- **Risk:** Keyboard-only users (and screen reader users) may find the navigation completely inaccessible if focus management is broken — this will not be caught by the current suite.
- **Evidence:** All link interactions in lines 26, 32, 38 use `.click()`, no keyboard simulation present.

---

**F16**

- **Dimension:** Accessibility / Compliance
- **Severity:** Low
- **Location:** `tests/main.navigation.refactored.spec.ts:25–40`
- **Observation:** After navigating to each destination page, there is no assertion on the page `<title>` element or the document `lang` attribute. For compliance-relevant navigation, the page title should update to reflect the new page context (WCAG 2.4.2 — Page Titled).
- **Risk:** A misconfigured routing setup that preserves the home page title across navigation goes undetected. Screen reader users hear a stale title.
- **Evidence:** No `toHaveTitle(...)` assertion appears anywhere in the file.

---

## Section B — Prioritized Fix Plan

---

**Step 1**

- **Addresses:** F11, F12
- **Action:** For each of the three navigation steps, add a web-first assertion on a page-specific visible element (e.g., the main heading or a landmark unique to that page) immediately after the URL assertion. Additionally, immediately after each `page.goBack()` call, add a `toHaveURL` assertion confirming the browser has returned to the home page before the next interaction.
- **Rationale:** These are false-pass risks — the test currently reports green even when a page fails to render or when `goBack()` lands on an unexpected page. Fixing assertion gaps that mask real defects takes absolute priority over all other changes.
- **Estimated effort:** S
- **Dependencies:** None.

---

**Step 2**

- **Addresses:** F6, F1, F10
- **Action:** Split the single monolithic `test()` (TC-NAV-001) into separate, independently runnable test functions — one per behavior group or one per navigation target. Assign a distinct TC ID to each. Update each title to be a precise behavior statement that matches its scope exactly (e.g., `'TC-NAV-001: should navigate to Docs page and display Docs heading'`).
- **Rationale:** This is a structural change. Any per-test assertion additions or title fixes done before this split will be rewritten when the tests are separated. Structural refactors must precede per-test edits.
- **Estimated effort:** M
- **Dependencies:** Step 1 (know which assertions belong to which test before splitting).

---

**Step 3**

- **Addresses:** F9, F7
- **Action:** Add a `resetToHome()` or `goBack()` method to `MainNavigationPage` that encapsulates the state-reset logic. Replace the two raw `page.goBack()` calls in the spec with calls to this POM method. Separately, evaluate migrating `mainNavPage` instantiation to a custom Playwright fixture to eliminate the `let` at describe scope.
- **Rationale:** POM abstraction belongs after the test structure is finalized (Step 2) so the method is wired to the correct individual tests. This is a structural/maintainability fix that should precede per-test content edits.
- **Estimated effort:** M
- **Dependencies:** Step 2 (tests are split before POM changes are targeted).

---

**Step 4**

- **Addresses:** F3
- **Action:** Add at minimum one negative-path test: a test that navigates to a non-existent route (e.g., `/this-does-not-exist`) and asserts that the page returns a 404 status or renders a "page not found" indicator rather than silently redirecting to home. If the application enforces authentication, add a test that navigates to a protected route while unauthenticated and asserts a redirect to the login page.
- **Rationale:** Missing negative coverage is the second-highest category of defect masking (after false-pass assertions). These are new tests that do not depend on the structural split but benefit from it being complete.
- **Estimated effort:** M
- **Dependencies:** Step 2.

---

**Step 5**

- **Addresses:** F8
- **Action:** Extract the three URL path patterns into named constants (e.g., in a `constants/routes.ts` or similar config file) and replace the inline regex literals in assertions with references to those constants.
- **Rationale:** Eliminates magic strings before edge-case tests (Step 6) are written using the same routes, preventing duplication from the start.
- **Estimated effort:** S
- **Dependencies:** Step 2 (tests are split, so constants are referenced in the correct locations).

---

**Step 6**

- **Addresses:** F4, F5
- **Action:** Add edge-case tests covering at minimum: (a) mobile viewport — assert that navigation links are accessible (visible or in a hamburger menu) at a narrow viewport width; (b) keyboard navigation — `Tab` through nav links and activate one with `Enter`, asserting the correct URL results. Add these as separate `test()` entries within the describe block or a new describe block.
- **Rationale:** Edge cases extend coverage after negative paths. Viewport and keyboard tests are the highest-value edge cases given the navigation context.
- **Estimated effort:** L
- **Dependencies:** Step 2, Step 3.

---

**Step 7**

- **Addresses:** F13
- **Action:** Tighten each URL regex assertion to include an end-of-path anchor or more specific pattern that excludes suffix matches. For example, replace `/\/docs\/intro/` with a pattern that anchors after the path segment (e.g., `/\/docs\/intro(\?|#|$)/`) so that pages like `/docs/intro-advanced` do not satisfy the assertion.
- **Rationale:** Low severity; correctness polish. Done after the structural refactor so the tighter regex is written once per split test, not rewritten.
- **Estimated effort:** S
- **Dependencies:** Step 2.

---

**Step 8**

- **Addresses:** F2
- **Action:** Add Playwright tags to each test — at minimum `@smoke` on the primary happy-path visibility test, `@regression` on the navigation and negative-path tests, `@nav` on all tests in this file. Add an `owner` annotation (using Playwright's `test.info().annotations` or a tag convention) and a severity level to each test.
- **Rationale:** Tagging and annotation come after structure is finalized (Step 2) so tags are applied to the correct individual tests rather than the monolith.
- **Estimated effort:** S
- **Dependencies:** Step 2.

---

**Step 9**

- **Addresses:** F14, F15, F16
- **Action:** Add one page-level axe accessibility scan to the smoke-level test (after navigation to the home page, run an axe scan scoped to the navigation landmark and assert zero violations). Add at least one keyboard navigation test covering Tab-to-link and Enter-to-navigate. Add a `toHaveTitle()` assertion to each navigation test that confirms the document title updates correctly on the destination page.
- **Rationale:** Accessibility/compliance additions are last per the ordering rules, as they do not gate logic correctness but do gate compliance requirements. Grouped into one step because they are independent additions to existing tests.
- **Estimated effort:** M
- **Dependencies:** Step 2 (tests are split, so a11y checks land in the correct test scope), Step 6 (keyboard test may build on the structure established there).

Task 2

You are a Senior SDET applying targeted fixes to a Playwright/TypeScript test spec based on the audit findings produced in the previous step.

INPUTS

1. File to modify: tests/main.navigation.refactored.spec.ts
2. Audit output from the previous step (numbered findings F1..Fn and the prioritized fix plan).
3. Context: docs/refactoring-summary.md (for intent only — do not echo it into the spec).

TASK
Produce a single unified diff against tests/main.navigation.refactored.spec.ts that implements the changes below. Do not output any prose, explanation, preamble, or postamble. The entire response must be the diff and nothing else.

REQUIRED CHANGES (all must appear in the diff)

1. Traceability
   - Add a stable test case identifier to every `test(...)` and, where appropriate, every `test.describe(...)` block.
   - Use the format `TC-NAV-###` (e.g., TC-NAV-001, TC-NAV-002, …), numbered sequentially in source order.
   - Place the ID at the start of the test title, e.g., `test('TC-NAV-001: navigates to Settings from the main menu', …)`.
   - Add Playwright tags where applicable: `@nav` for all tests, plus `@smoke` for happy paths and `@regression` for negative/edge cases. Use Playwright's tag syntax: `test('TC-NAV-001: … @nav @smoke', …)`.
   - If the project uses `test.info().annotations`, additionally attach `{ type: 'test_case', description: 'TC-NAV-001' }` inside each test. If unclear from the existing file, prefer the title-prefix approach only.

2. Naming and comment clarity
   - Rewrite ambiguous test titles to behavior statements ("navigates to …", "shows … when …", "disables … while …").
   - Rename any variable or helper whose name does not convey intent (e.g., `el`, `tmp`, `doStuff`).
   - Replace comments that restate code ("// click the button") with comments that explain _why_ a non-obvious step exists. Delete stale or redundant comments.
   - Keep edits minimal — do not rename anything whose current name is already clear.

3. Replace weak assertions with explicit behavior checks
   - Replace any of the following patterns:
     - `expect(locator).toBeTruthy()` on a Playwright locator → `await expect(locator).toBeVisible()`
     - `expect(await locator.count()).toBeGreaterThan(0)` → `await expect(locator).toHaveCount(n)` or `toBeVisible()`
     - Manual `waitForTimeout` followed by a boolean assertion → web-first auto-retrying assertion (`toHaveURL`, `toHaveText`, `toBeVisible`, `toBeEnabled`)
     - Asserting only that navigation happened without checking the destination → assert both URL (`toHaveURL`) and a landmark on the destination page (e.g., `getByRole('heading', { name: … })`).
   - Every test must end with at least one assertion that would fail if the user-visible outcome were broken.

4. Introduce at least one edge case
   - Add one new test covering a hidden/disabled link state. Choose the most realistic scenario from the existing spec — examples:
     - A nav link that is hidden when the user is unauthenticated.
     - A nav link that is disabled (aria-disabled="true" or `[disabled]`) when a feature flag is off or the user lacks permission.
     - A nav link that is visible but not clickable during an in-flight transition.
   - The new test must:
     - Use the existing Page Object(s) — do not introduce new selectors in the spec itself.
     - Assert the state explicitly using `toBeHidden()`, `toBeDisabled()`, or `toHaveAttribute('aria-disabled', 'true')` as appropriate.
     - Also assert that attempting to navigate does not change the URL (negative confirmation).
     - Carry its own `TC-NAV-###` ID and `@nav @regression` tags.
   - If the spec lacks an obvious trigger for the disabled/hidden state (e.g., no auth fixture visible), use a test-level state setup that matches patterns already present in the file. Do not invent fixtures that aren't referenced elsewhere.

5. Keep Page Object usage consistent
   - All selector access in the modified or added code must go through the existing Page Object(s) already imported in the file.
   - Do not introduce raw `page.locator(...)`, `page.getByRole(...)`, etc. directly in the spec if an equivalent accessor exists or could naturally be added to the page object.
   - If a needed accessor genuinely does not exist on the page object, do NOT add it via the diff to the spec; instead, in the diff, use the closest existing page-object method and add a single `// TODO(page-object): expose <accessor> on <PageObjectName>` comment at that call site. (This step modifies only the spec file.)

DIFF REQUIREMENTS

- Output a single unified diff in standard `diff -u` format.
- Use the exact headers:
  --- a/tests/main.navigation.refactored.spec.ts
  +++ b/tests/main.navigation.refactored.spec.ts
- Include accurate `@@` hunk headers with line numbers.
- Include 3 lines of context around each hunk where available.
- Do not include diffs for any other file.
- Do not wrap the diff in Markdown code fences, backticks, or any surrounding text.
- Do not include a commit message, summary, or trailing notes.

CONSTRAINTS

- Modify only tests/main.navigation.refactored.spec.ts.
- Preserve existing import ordering and style conventions visible in the file.
- Do not reformat untouched lines.
- Do not remove existing tests; only add the new edge-case test and modify the targeted lines.
- If a required change conflicts with an existing finding's stated location, follow the finding.
