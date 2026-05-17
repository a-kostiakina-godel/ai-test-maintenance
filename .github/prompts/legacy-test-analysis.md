# Legacy Test Analysis

**Spec under review:** `tests/main.navigation.spec.ts`
**Page object under review:** `tests/pages/mainNavigationPage.ts`
**Supporting files:** `tests/pages/basePage.ts`, `playwright.config.ts`
**Manual baseline:** TC-NAV-001 — Docs, API, CLI links must be visible, accessible by role + name, and navigate to correct URLs
**Status:** No code changes applied.

---

## Prioritized Issue Checklist

### P1 — Critical

1. **`mainNavigationPage.ts:5`** — `locator('#docs')` · _Selector quality_
   `id="docs"` does not exist on `playwright.dev` → locator never resolves, test times out.

2. **`mainNavigationPage.ts:7`** — `locator('#cli')` · _Selector quality_
   Same as above; all CLI assertions and the click will time out.

3. **`main.navigation.spec.ts:21`** — `expect(...).toHaveAccessibleName('Docs')` missing `await` · _Synchronization_
   Promise is discarded immediately → silent false positive on every run.

4. **`main.navigation.spec.ts:27`** — `expect(...).toHaveAccessibleName('CLI')` missing `await` · _Synchronization_
   Same as above; CLI accessibility check is silently skipped.

5. **`main.navigation.spec.ts:39`** — `cliLink.click()` missing `await` · _Synchronization_
   Click not awaited; `toHaveURL` on line 40 races against unresolved navigation → flaky.

---

### P2 — High

6. **`main.navigation.spec.ts:14`** — `waitForTimeout(300)` before visibility checks · _Synchronization_
   Fixed sleep violates TC-NAV-001 code rules; Playwright auto-waits make it redundant → flakiness on slow CI.

7. **`main.navigation.spec.ts:34`** — `waitForTimeout(2000)` after `goBack()` · _Synchronization_
   Unconditional 2 s delay masks real timing issues and wastes CI time.

8. **`main.navigation.spec.ts:38–40`** — No state-based wait after `goBack()` before CLI click · _Synchronization_
   DOM may still be hydrating when the click fires → intermittent failure.

---

### P3 — Medium

9. **`main.navigation.spec.ts:12`** — Single test bundles visibility, accessibility, and navigation · _Coverage_
   Failure in block 1 aborts blocks 2–3; root cause is obscured and retry cost is high.

10. **`main.navigation.spec.ts`** — No page-title assertion after `navigateToHome()` · _Coverage_
    TC-NAV-001 Step 1 (title contains "Playwright") is never verified.

11. **`main.navigation.spec.ts:20,23,26`** — Separate `toBeEnabled()` on each `<a>` link · _Redundancy_
    Visible standard links are implicitly enabled; adds noise with no signal.

12. **`mainNavigationPage.ts:5–7`** — Mixed locator strategies: `#id` for Docs/CLI, `getByRole` for API · _Selector quality_
    TC-NAV-001 prompt requires role-based selectors throughout; inconsistency raises maintenance cost.

---

### P4 — Low

13. **`mainNavigationPage.ts:1`** — Unused `expect` import · _Dead code_
    Confuses where assertion logic lives; page objects should not import `expect`.

14. **`main.navigation.spec.ts:5`** — `let mainNavPage` at `describe` scope, mutated in `beforeEach` · _Reuse_
    Fragile pattern; `fullyParallel: true` in config makes the isolation risk active today.

15. **`main.navigation.spec.ts:29–40`** — Navigation steps inline, no page-object helpers · _Readability / Reuse_
    Any change to the navigation strategy requires editing every inline step individually.

16. **`main.navigation.spec.ts:13,19,29`** — Section comments restate structure · _Readability_
    Prefer separate named tests or `test.step()` instead of inline comment blocks.

---

## Additional Findings (Beyond Typical AI Detection)

### No post-navigation page content check
The spec asserts URL changes but not that the destination page rendered content.
A 404 that preserves the URL slug would pass `toHaveURL`.
Affects `main.navigation.spec.ts` lines 31, 36, and 40.

### Accessibility assertions structurally broken for two of three links
Lines 21 and 27 appear to test accessibility but the missing `await` means both are silently skipped.
A reviewer reading the source would assume Docs and CLI are verified — they are not.
This is the highest-severity silent false positive in the file (overlaps P1-3 and P1-4).

### Inconsistent locator strategy in the same page object
`docsLink` (line 5) and `cliLink` (line 7) use `locator('#id')` while `apiLink` (line 6) uses `getByRole`.
The TC-NAV-001 prompt (`main.navigation.prompt.md` lines 44–47) explicitly requires role-based selectors for all three.
Signals that different parts were authored independently and will need a unified-strategy pass.

### `fullyParallel: true` makes the describe-scope variable risk active today
`playwright.config.ts:17` already enables fully parallel execution.
Combined with the `let mainNavPage` mutation pattern (P4-14), the isolation problem is a present configuration conflict, not a future hypothetical.

### `baseURL` commented out while page objects hardcode the URL
`playwright.config.ts:29` has `baseURL` disabled; both `mainNavigationPage.ts:14` and `playwrightHomePage.ts:13` hardcode `'https://playwright.dev/'`.
Changing the test target (staging, local mirror) requires updating every page object individually.

### `waitForPageLoad()` in `basePage.ts` is dead infrastructure
`basePage.ts:22–24` defines `waitForPageLoad()` with `networkidle`, but no spec or page object calls it.
Creates a false impression that network-idle waiting is applied; also means `navigateToHome()` does not wait for network idle, which contributes to the P2 synchronization issues.

---

## Summary

| Priority | Count | Categories affected |
|----------|-------|---------------------|
| P1 — Critical | 5 | Selector quality, Synchronization |
| P2 — High | 3 | Synchronization |
| P3 — Medium | 4 | Coverage, Redundancy, Selector quality |
| P4 — Low | 4 | Dead code, Reuse, Readability |
| Additional findings | 6 | Post-nav coverage, Accessibility, Config, Dead code |
| **Total** | **22** | |

**Recommended fix order for the next chapter:**

1. Replace `#docs` / `#cli` with `getByRole('link', { name: '...' })` — unblocks all downstream checks
2. Add `await` to lines 21, 27 (`toHaveAccessibleName`), and 39 (`cliLink.click()`)
3. Remove both `waitForTimeout` calls; replace with state-based assertions
4. Enable `baseURL` in `playwright.config.ts`; replace hardcoded URLs with `'/'`
5. Add page-title assertion to cover TC-NAV-001 Step 1
6. Split into three focused tests: visibility, accessibility, navigation
7. Extract click → goBack → URL-assert into a page-object helper method
8. Remove unused `expect` import from `mainNavigationPage.ts` and dead `waitForPageLoad` from `basePage.ts`
