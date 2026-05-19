Step 1

You are a Senior SDET reviewer performing a professional-standards audit of a refactored Playwright/TypeScript test spec. You must NOT modify any files in this step. Your sole deliverable is a written audit: a numbered findings list followed by a prioritized fix plan.

INPUTS (read-only)

1. Refactored spec under review:
   - Path: tests/main.navigation.refactored.spec.ts
2. Context / rationale for the refactor:
   - Path: docs/refactoring-summary.md
   - Use this only to understand intent and prior decisions. Do not treat it as ground truth — if the spec contradicts the summary, flag it.

SCOPE

- Read both files end-to-end before writing anything.
- Audit ONLY tests/main.navigation.refactored.spec.ts.
- Do not propose code edits inline. Describe what should change, where, and why — implementation comes in a later step.

AUDIT CHECKLIST
Evaluate the spec against each of the six dimensions below. For every dimension, explicitly state: PASS / PARTIAL / FAIL, with reasoning.

1. Traceability
   - Are tests linked to requirements, test cases, or a test plan ID (e.g., TestRail/ADO Test Plan IDs, ticket refs)?
   - Are `test.describe` / `test()` titles unambiguous and matching the artifact they trace to?
   - Are tags (`@smoke`, `@regression`, `@nav`, severity, owner) present and consistent?

2. Coverage (positive / negative / edge)
   - Positive paths: are the happy paths for each navigation entry covered?
   - Negative paths: invalid routes, unauthorized access, broken links, 4xx/5xx handling?
   - Edge cases: deep links, back/forward, refresh mid-navigation, slow network, localization/RTL, viewport variations, auth state transitions?
   - Identify specific coverage gaps with the exact scenario missing.

3. Maintainability (POM, reuse, no duplication)
   - Is the Page Object Model applied correctly? Are selectors and actions encapsulated in page classes, not the spec?
   - Are setup/teardown using fixtures (`test.beforeEach`, custom fixtures) rather than copy-pasted boilerplate?
   - Any duplicated arrange/act sequences that should be helpers?
   - Any hardcoded URLs, timeouts, credentials, or test data that belong in config / `.env` / test data files?
   - Magic numbers, magic strings, dead code?

4. Clarity (names, comments)
   - Do test titles read as behavior statements ("should …" / "navigates to …")?
   - Are variable and method names self-documenting?
   - Are comments explaining _why_, not _what_? Any stale/misleading comments?
   - Is the AAA (Arrange / Act / Assert) structure visible at a glance?

5. Validation quality (assertions)
   - Is each test asserting the actual user-visible outcome (URL, heading, ARIA landmark, content) rather than incidental DOM state?
   - Are web-first/auto-retrying assertions used (`expect(locator).toHaveURL`, `toBeVisible`) instead of manual waits + `expect(boolean)`?
   - One logical assertion focus per test, or justified soft assertions where multiple checks belong together?
   - Any assertion-free tests, weak assertions (`toBeTruthy` on a locator), or assertions that can pass when the page is broken?

6. Accessibility / Compliance
   - Are role-based / accessible-name locators (`getByRole`, `getByLabel`) preferred over CSS/XPath?
   - Is there at least smoke-level a11y validation (e.g., axe scan, landmark presence, focus management on navigation)?
   - Keyboard navigation covered where the feature warrants it?
   - Any compliance-relevant checks missing (skip links, page titles, lang attribute, color-independent state)?

OUTPUT FORMAT
Produce exactly two sections, in this order. Use Markdown.

Section A — Numbered Findings
A flat, numbered list. One finding per item. Each finding MUST include:

- **ID**: F1, F2, …
- **Dimension**: one of the six checklist categories
- **Severity**: Critical / High / Medium / Low
- **Location**: file + line range and/or function/test name (e.g., `tests/main.navigation.refactored.spec.ts:42–58, test "navigates to Settings"`)
- **Observation**: what you saw (factual, no fix yet)
- **Risk**: what breaks or degrades if left as-is
- **Evidence**: short quoted snippet or precise reference

Section B — Prioritized Fix Plan
A separate ordered list sequencing the fixes. Each entry MUST include:

- **Step #**
- **Addresses**: finding IDs from Section A (e.g., "F2, F7")
- **Action**: a single concrete change described in prose (no code)
- **Rationale**: why this ordering — typically: unblockers first, then correctness, then maintainability, then polish
- **Estimated effort**: S / M / L
- **Dependencies**: any finding/step that must be done first, or "none"

Ordering rules for the fix plan:

1. Anything that masks real defects (false-pass assertions, missing negative coverage) before cosmetic issues.
2. Structural refactors (POM extraction, fixture consolidation) before per-test edits that would otherwise be rewritten.
3. Traceability/tagging and a11y additions last, unless they block CI gating.

CONSTRAINTS

- DO NOT modify tests/main.navigation.refactored.spec.ts or any other file in this step.
- DO NOT propose new test code. Describe the change in words.
- If something cannot be assessed without running the tests or seeing additional files (e.g., a page object class not shown), say so explicitly under a final short subsection "Open Questions / Cannot Assess Without".
- Be specific. "Improve assertions" is not a finding; "Test on line 73 asserts `expect(page).toBeTruthy()` which passes even on navigation failure" is.

Step 3
You are a Senior SDET writing a single additional edge-case navigation test for an existing Playwright/TypeScript spec.

CONTEXT

- Target file (already exists, do not rewrite it): tests/main.navigation.refactored.spec.ts
- The file already contains: imports, Page Object instances, fixtures, and earlier tests using TC-NAV-### identifiers and `@nav` / `@smoke` / `@regression` tags.
- A separate edge-case test for hidden/disabled link state was added in the previous step. Do NOT duplicate that scenario — pick a different edge case.

TASK
Produce exactly one Playwright `test(...)` function that I can paste into the existing `test.describe` block in the file above. Output the test function only — no imports, no describe wrapper, no fixtures, no page object class definitions, no prose, no Markdown fences.

EDGE CASE TO COVER
Choose ONE of the following, whichever is most realistic given typical navigation specs. Pick the first option unless it obviously doesn't fit the domain:

A) Wrong target URL — a nav link whose `href` or resulting navigation lands on a URL that does NOT match the expected destination (e.g., a marketing redirect, a trailing-slash mismatch, an outdated route still wired to a deprecated path). The test should fail loudly if the link silently points somewhere unexpected.

B) Link present in the DOM but not visible to the user — rendered off-screen, `visibility: hidden`, `display: none` on an ancestor, or covered by an overlay (e.g., a nav item that should appear only after a menu is opened, but is currently leaking into the DOM in a collapsed state).

C) Link visible but points to an external/third-party URL when it should be internal — verify the destination origin matches the application's origin, not a tracking redirector or stale CDN domain.

REQUIREMENTS FOR THE TEST

1. Identifier and tags
   - Title format: `TC-NAV-###: <behavior statement> @nav @regression`
   - Use `TC-NAV-099` as the placeholder ID (I will renumber on paste).
   - Behavior statement must describe the user-visible outcome, not the mechanism. Example: "surfaces a navigation error when the Help link resolves to an unexpected URL".

2. Selectors
   - Use ONLY role-based or label-based locators: `getByRole`, `getByLabel`, `getByText` with `exact: true` where ambiguity is possible.
   - No CSS selectors, no XPath, no `data-testid` unless absolutely unavoidable (and if so, add a short comment explaining why).
   - Access locators through the existing Page Object pattern visible in the spec. If you must reference a locator the page object doesn't appear to expose, call the closest existing accessor and add a single inline comment: `// TODO(page-object): expose <accessor> on <PageObjectName>`.

3. Assertions
   - Use web-first auto-retrying Playwright assertions only: `toHaveURL`, `toHaveAttribute`, `toBeVisible`, `toBeHidden`, `toHaveText`, `toHaveRole`, etc.
   - Do NOT use `expect(boolean)`, `toBeTruthy`, `toBeFalsy`, or manual `waitForTimeout`.
   - Include at least TWO assertions:
     a) One that pins down the specific defect condition (e.g., the actual href, the actual resolved URL, the visibility state).
     b) One that confirms the user-visible consequence (e.g., the wrong page heading appears, or the expected page heading does NOT appear).
   - For URL assertions, prefer a regex or exact string anchored to the expected origin/path, not a loose substring match.

4. Structure
   - Follow Arrange / Act / Assert with blank lines separating the phases.
   - Keep the test under ~25 lines of body code.
   - No try/catch. Let Playwright fail the test naturally.
   - No conditional assertions (`if (x) expect(...)`). The expected state must be deterministic.

5. Realism guard
   - Do not invent fixtures, page objects, or environment variables that wouldn't plausibly already exist in a navigation spec.
   - Use generic, plausible names (`navigationPage`, `mainMenu`, `homePage`) consistent with typical Page Object naming. I will adapt them on paste.

OUTPUT FORMAT

- Output the `test(...)` function and nothing else.
- No code fences, no language tag, no leading or trailing blank lines beyond what's natural inside the function.
- No comments outside the function body. Inline comments inside the function are allowed only where they explain _why_ something non-obvious is being checked.

Output test:

test('TC-NAV-099: surfaces a navigation error when the API link resolves to an unexpected URL @nav @regression', async ({ page }) => {
const expectedHref = '[https://playwright.dev/docs/api/class-playwright](vscode-file://vscode-app/c:/Program%20Files/Microsoft%20VS%20Code/034f571df5/resources/app/out/vs/code/electron-browser/workbench/workbench.html)';

// Arrange
await expect(mainNavPage.apiLink).toBeVisible();
await expect(mainNavPage.apiLink).toHaveAttribute('href', expectedHref);

// Act
await mainNavPage.apiLink.click();

// Assert
await expect(page).toHaveURL(expectedHref);
await expect(page.getByRole('heading', { name: 'Playwright Library' })).toBeVisible();
