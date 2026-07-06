---
phase: 01-download-wiring-release-config
verified: 2026-07-06T21:00:00Z
status: human_needed
score: 5/5 must-haves verified
behavior_unverified: 0
overrides_applied: 0
human_verification:
  - test: "Run `npm run dev`, submit the inline registration form (any email), and observe the post-registration reveal."
    expected: "Both a 'macOS (Apple Silicon)' button and a visibly greyed-out 'Windows (coming soon)' button appear."
    why_human: "Rendered layout/visual state (CSS opacity, greyed appearance) requires eyes on a running browser, not static grep."
  - test: "Hover the macOS button in the running dev server."
    expected: "A native tooltip appears reading 'Requires Apple Silicon (M-series). Intel Macs are not supported.'"
    why_human: "Tooltip legibility/visibility on hover is a runtime browser behavior that cannot be confirmed by reading source alone."
  - test: "Attempt to click the 'Windows (coming soon)' button."
    expected: "Nothing happens — no navigation, no '#' jump, no 404."
    why_human: "Confirms perceived non-interactivity in an actual browser session, even though the disabled attribute already guarantees this at the code level."
---

# Phase 1: Download Wiring & Release Config Verification Report

**Phase Goal:** A registered visitor downloads the correct, signed macOS (Apple Silicon) build from the Arthium-Org/stock-plan-companion-app repo's latest release via a single config-driven URL; Windows shows a safe disabled "coming soon" placeholder; future releases need only a one-line config edit.

**Mode:** mvp (User Story format confirmed in 01-01-PLAN.md: "As a visitor who has just registered, I want to download the correct signed macOS (Apple Silicon) build from a single clearly-labeled button — with Windows shown as a safe 'coming soon' — so that I install the right, working app, and the team can ship future releases without editing page code.")

**Verified:** 2026-07-06
**Status:** human_needed
**Re-verification:** No — initial verification

## User Flow Coverage (MVP Mode)

| Step | Expected | Evidence in Codebase | Status |
|------|----------|----------------------|--------|
| Visitor registers | Reveal panel shows after `formSubmitted = true` | `src/routes/+page.svelte:584-622` (`{:else}` branch of the form/reveal conditional, unchanged reveal mechanism per Phase 2 scope note) | ✓ VERIFIED |
| Visitor clicks "macOS (Apple Silicon)" | Anchor href points at config-composed URL | `src/routes/+page.svelte:595-601` — `href={macDownloadUrl}`, label text `macOS (Apple Silicon)` exactly | ✓ VERIFIED |
| Download resolves to correct repo/asset | URL is `https://github.com/Arthium-Org/stock-plan-companion-app/releases/latest/download/StockPlanCompanion-arm64.dmg`, version-less | `src/lib/downloads.ts:15-18`; confirmed in compiled bundle `build/_app/immutable/nodes/2.7jTcVQJh.js` (`releases/latest/download/${At}` + `StockPlanCompanion-arm64.dmg` + `stock-plan-companion-app` all present) | ✓ VERIFIED |
| Visitor sees Intel-unsupported expectation | `title` tooltip on macOS anchor | `src/routes/+page.svelte:598` — `title="Requires Apple Silicon (M-series). Intel Macs are not supported."` | ✓ VERIFIED (code); tooltip legibility on hover → human |
| Visitor sees Windows state | Disabled, non-interactive "Windows (coming soon)" control, no href | `src/routes/+page.svelte:603-612` — `<button type="button" disabled aria-disabled="true">`, no `href` attribute present anywhere on this element | ✓ VERIFIED |
| Team ships a new release | Only `src/lib/downloads.ts` needs editing | No download URL/tag literal remains in `+page.svelte`; `handleFormSubmit` (`+page.svelte:163-190`) only calls Formspree and contains zero download-URL logic | ✓ VERIFIED |

## Goal Achievement

### Observable Truths

| # | Truth | Status | Evidence |
|---|-------|--------|----------|
| 1 | Registered visitor clicking "macOS (Apple Silicon)" reaches the signed arm64 DMG from Arthium-Org/stock-plan-companion-app's latest release (DL-01, DL-02) | ✓ VERIFIED | `src/lib/downloads.ts:15-18` composes `macDownloadUrl`; `src/routes/+page.svelte:595-601` binds anchor `href` to it and labels it exactly `macOS (Apple Silicon)`. Unit test `src/lib/downloads.test.ts` (3/3 pass) locks the exact string. Actual DMG being signed and present at that URL on GitHub is an external release-process responsibility (explicitly noted in 01-01-SUMMARY.md "User Setup Required"), outside this repo's verification surface. |
| 2 | The macOS download resolves through GitHub's version-less latest-release magic URL — no pinned tag (DL-02) | ✓ VERIFIED | `macDownloadUrl` template contains `releases/latest/download/` with no version segment; `grep` confirms no `v1.0.0` / pinned-tag string remains in `src/routes/+page.svelte`. Unit test asserts `.toContain('releases/latest/download/')`. |
| 3 | Windows control renders "Windows (coming soon)", disabled/non-interactive, no href, never 404s or dead-links (DL-03) | ✓ VERIFIED | `src/routes/+page.svelte:604-611` — native `<button type="button" disabled aria-disabled="true">`, no `href` attribute exists on this element (not an anchor), so no navigation target is possible by construction. |
| 4 | macOS button conveys Apple Silicon required / Intel unsupported via hover tooltip (DL-01, D-06, D-07) | ✓ VERIFIED (code-level) | `title="Requires Apple Silicon (M-series). Intel Macs are not supported."` present at `+page.svelte:598`. Actual on-hover rendering/legibility deferred to human batch (Task 3, item 2 below). |
| 5 | Shipping a new release requires editing exactly one config location, `src/lib/downloads.ts` (DL-04) | ✓ VERIFIED | No `downloadLinks` state, no hardcoded URL/tag literal, and no download-URL logic remains in `handleFormSubmit` or anywhere else in `+page.svelte`. Only `src/lib/downloads.ts` holds `appRepo`/`macAssetName`/`macDownloadUrl`. |

**Score:** 5/5 truths verified at the code level (0 present-but-behavior-unverified). All 5 require no further code changes to satisfy the phase goal — remaining items are visual/UX confirmations only (see Human Verification below), not functional gaps.

### Required Artifacts

| Artifact | Expected | Status | Details |
|----------|----------|--------|---------|
| `src/lib/downloads.ts` | Single config module: `appRepo`, `macAssetName`, `macDownloadUrl`, `windowsAvailable`, D-04 invariant comment | ✓ VERIFIED | Exists, 20 lines, all four exports present exactly as specified. `windowsAvailable = false` (strict boolean, no falsy-truthy ambiguity). Header comment documents the stable-asset-name invariant per D-04. |
| `src/lib/downloads.test.ts` | Unit test asserting exact macOS URL + Windows-unavailable flag | ✓ VERIFIED | 3 tests, all pass (`npx vitest run src/lib/downloads.test.ts` → 3/3 passed in 2ms). |
| `src/routes/+page.svelte` | Imports config, relabeled macOS button + tooltip, disabled Windows placeholder, hardcoded URLs removed | ✓ VERIFIED | Line 16: `import { macDownloadUrl, windowsAvailable } from '$lib/downloads'`. `downloadLinks` state (previously at old lines 64-71/187-190) fully removed — confirmed via `grep -n "downloadLinks"` returning zero matches. |

### Key Link Verification

| From | To | Via | Status | Details |
|------|-----|-----|--------|---------|
| `src/routes/+page.svelte` | `$lib/downloads` | `import { macDownloadUrl, windowsAvailable }` at line 16; `href={macDownloadUrl}` at line 596; `{#if !windowsAvailable}` at line 603 | ✓ WIRED | Import present, both exported symbols consumed in the reveal markup (not just imported-and-unused). |
| `src/lib/downloads.ts` | Rendered DOM/build output | `appRepo` + `macAssetName` template literal → `macDownloadUrl` | ✓ WIRED | Confirmed by data-flow trace (Level 4) below — the composed value survives minification/bundling and reaches the production build artifact. |

### Data-Flow Trace (Level 4)

| Artifact | Data Variable | Source | Produces Real Data | Status |
|----------|---------------|--------|---------------------|--------|
| `src/routes/+page.svelte` anchor `href` | `macDownloadUrl` | `src/lib/downloads.ts` template literal composed from `appRepo` + `macAssetName` | Yes — not a static empty/hardcoded value | ✓ FLOWING |

Verified by inspecting the production build (`npm run build`) output at `build/_app/immutable/nodes/2.7jTcVQJh.js`: the minified bundle contains the literal path segment `releases/latest/download/${At}` (where `At` is the minified alias for `macAssetName`) plus the standalone strings `stock-plan-companion-app` and `StockPlanCompanion-arm64.dmg` — proving the config value is not tree-shaken or stubbed and reaches the shipped client bundle. Also confirmed `macOS (Apple Silicon)`, `Windows (coming soon)`, and the tooltip text `Requires Apple Silicon (M-series). Intel Macs are not supported.` are all present verbatim in the same compiled bundle.

### Behavioral Spot-Checks

| Behavior | Command | Result | Status |
|----------|---------|--------|--------|
| Downloads config unit tests pass (single named test file) | `npx vitest run src/lib/downloads.test.ts` | 3/3 tests passed in 2ms | ✓ PASS |
| Full test suite passes (run once) | `npm test` | 3 files / 5 tests passed, exit code 0 (an unrelated post-test SSR module-runner teardown warning appears in stderr but does not affect exit code or pass/fail) | ✓ PASS |
| Type-check / svelte-check clean | `npm run check` | `COMPLETED 3955 FILES 0 ERRORS 2 WARNINGS` — the 2 warnings are pre-existing self-closing-tag style warnings unrelated to this phase's files/lines touched | ✓ PASS |
| Static build succeeds and bakes config into output | `npm run build` | Exit code 0, `build/` produced; confirmed via Level-4 trace above | ✓ PASS |

### Probe Execution

Not applicable — this is a static marketing-site phase with no migration/tooling probes (`scripts/*/tests/probe-*.sh` not present in this repo, and neither PLAN nor SUMMARY reference any probe).

### Requirements Coverage

| Requirement | Source Plan | Description | Status | Evidence |
|-------------|-------------|-------------|--------|----------|
| DL-01 | 01-01-PLAN.md | Visitor can download signed macOS (arm64) DMG after registering, via button labeled "macOS (Apple Silicon)" | ✓ SATISFIED | `+page.svelte:595-601`; label text matches exactly. |
| DL-02 | 01-01-PLAN.md | macOS download resolves to the DMG published in a GitHub Release of `Arthium-Org/stock-plan-companion-app` | ✓ SATISFIED | `downloads.ts:15-18`; unit test locks exact URL. |
| DL-03 | 01-01-PLAN.md | Windows download appears as a non-broken "coming soon" state until `.exe` published | ✓ SATISFIED | `+page.svelte:603-611`; disabled button, no href. |
| DL-04 | 01-01-PLAN.md | Download URLs live in a single config location, updatable per release without editing page logic | ✓ SATISFIED | Only `downloads.ts` holds the URL; `+page.svelte` and `handleFormSubmit` contain zero download-URL literals. |

No orphaned requirements — REQUIREMENTS.md traceability table (lines 57-60) maps all four DL-01..DL-04 to Phase 1 as Complete, matching the plan's declared `requirements:` frontmatter exactly.

### Anti-Patterns Found

None. Scanned `src/lib/downloads.ts`, `src/lib/downloads.test.ts`, and the modified region of `src/routes/+page.svelte` (script block + reveal markup) for `TBD|FIXME|XXX|TODO|HACK|PLACEHOLDER`, empty-return stubs, and hardcoded-empty-data patterns — zero matches. The pre-existing wrong-repo GitHub link at `+page.svelte:634` (footer "Visit GitHub" → `Arthium-Org/stock-plan-companion` without `-app`) and the `new-12345/+page.svelte` prototype route's stale `v1.0.0` links remain, but these are explicitly out of scope for Phase 1 (owned by Phase 3's LINK-02 sweep per `01-CONTEXT.md` §Integration Points and `01-01-SUMMARY.md` "Next Phase Readiness") — not a gap in this phase.

### Human Verification Required

Harvested from 01-01-PLAN.md Task 3 (`checkpoint:human-verify`, deferred to end-of-phase per `workflow.human_verify_mode: end-of-phase`). All items below are visual/runtime confirmations that static analysis cannot fully replace, even though the underlying code is verified correct:

#### 1. Post-registration reveal renders both controls

**Test:** Run `npm run dev`, submit the inline registration form with any email.
**Expected:** The reveal panel shows a "macOS (Apple Silicon)" button and a "Windows (coming soon)" button side by side.
**Why human:** Layout rendering and visual confirmation of both controls appearing together requires a running browser.

#### 2. macOS tooltip is visible and legible on hover

**Test:** Hover the macOS button in the running dev server.
**Expected:** A tooltip reading "Requires Apple Silicon (M-series). Intel Macs are not supported." appears and is legible.
**Why human:** Native browser tooltip rendering/timing/legibility cannot be confirmed by reading the `title` attribute in source alone.

#### 3. Windows button visibly reads as disabled and is unclickable

**Test:** Look at and attempt to click the "Windows (coming soon)" button.
**Expected:** It appears greyed-out (per `opacity-60 cursor-not-allowed` classes) and clicking produces no navigation, no `#` jump, no 404.
**Why human:** Visual greyed-out appearance is a rendering concern; while the `disabled` attribute already gives a strong code-level guarantee against navigation, the plan's own acceptance criteria call for an eyes-on confirmation in a live browser.

### Gaps Summary

No gaps. All 5 must-have truths, all 3 required artifacts, and both key links are verified at the code, test, and build level. The only outstanding items are the three human-verification checks above, which the plan itself deferred to an end-of-phase batch (per `workflow.human_verify_mode: end-of-phase`) rather than blocking mid-execution — this phase cannot reach `passed` until those are confirmed by the developer, per the standard human_needed routing.

---

_Verified: 2026-07-06_
_Verifier: Claude (gsd-verifier)_
