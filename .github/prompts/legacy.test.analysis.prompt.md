  You are a senior SDET performing a read-only audit of a Playwright test suite.
  Do NOT fix any code. Your only output is an analysis report.

  ## Context

  - Spec under review: tests/main.navigation.spec.ts
  - Page object under review: tests/pages/mainNavigationPage.ts
  - Supporting files: tests/pages/basePage.ts, playwright.config.ts
  - Manual test case baseline (TC-NAV-001): the Docs, API, and CLI
    navigation links must be (1) visible, (2) accessible by role and name,
    and (3) navigate to the correct URLs. stated in main.navigation.prompt.md

  ## Your task

  1. Read every file listed above in full before drawing any conclusions.

  2. Compare the spec against TC-NAV-001 and identify every deviation,
     gap, or assumption that differs from the manual baseline.

  3. List and classify ALL issues that increase flakiness or maintenance
     cost. Use these categories (add others if justified):
     - Selector quality
     - Synchronization
     - Accessibility
     - Coverage
     - Readability / Reuse
     - Configuration / Environment
     - Dead code

  4. For each issue record:
     - File and line number
     - A one-sentence description
     - The category
     - A short impact note (e.g. "fixed wait → flakiness on CI",
       "ID selector → breaks on any markup refactor")

  5. Prioritise issues on a P1–P4 scale:
     - P1 Critical  — breaks the test or produces a silent false positive
     - P2 High      — causes intermittent failures or masks real failures
     - P3 Medium    — coverage gap or significant maintenance cost
     - P4 Low       — readability or minor reuse concern

  6. After the AI-detected checklist, add a separate section called
     "Additional Findings" for issues that automated tools commonly miss:
     - Missing post-navigation page content checks (URL match ≠ page loaded)
     - Accessibility assertions that are present in source but never
       evaluated (e.g. missing await on async matchers)
     - Locator strategy inconsistencies within the same page object
     - Config-level risks that make test-level problems worse
       (e.g. fullyParallel interacting with shared variables)
     - Dead infrastructure in the page object hierarchy

  7. Close with a summary table (priority × count × categories) and a
     recommended fix order for the next refactor chapter.

  ## Output format

  Write the report to prompts/legacy-test-analysis.md using this structure:

  # Legacy Test Analysis

  **Spec under review:** …
  **Manual baseline:** TC-NAV-001
  **Status:** No code changes applied.

  ---

  ## Prioritized Issue Checklist

  ### P1 — Critical
  | # | File | Line | Issue | Category | Impact |
  …

  ### P2 — High
  …

  ### P3 — Medium
  …

  ### P4 — Low
  …

  ---

  ## Additional Findings (Beyond Typical AI Detection)

  ### <Finding title>
  <Two-to-three sentence explanation with file + line references>

  …

  ---

  ## Summary

  | Priority | Count | Categories affected |
  …

  **Recommended fix order for the next chapter:**
  1. …

  ---

  ## Constraints

  - Do not change any source file other than prompts/legacy-test-analysis.md.
  - Do not suggest or scaffold any fixes inside the report body.
  - Every claim must cite a specific file and line number.
  - Keep impact notes to one line each.