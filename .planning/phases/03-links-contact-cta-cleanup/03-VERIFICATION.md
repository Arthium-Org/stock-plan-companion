---
phase: 03-links-contact-cta-cleanup
verified: 2026-07-07T00:00:00Z
status: passed
score: 5/6 must-haves verified (1 documented deviation accepted via override)
behavior_unverified: 0
overrides_applied: 1
overrides:
  - truth: "A visitor scanning the page sees exactly one GitHub link, in the footer (ROADMAP SC4 / LINK-04, literal)"
    accepted_by: "user (kiran@omnisavant.com)"
    accepted_at: 2026-07-07
    rationale: "Per locked decision D-05 (03-CONTEXT.md): the subtle nav GitHub icon is a standard, non-competing affordance the user deliberately kept. LINK-04 is satisfied in spirit — GitHub no longer competes with registration; both retained links (nav icon + footer) are quiet, bound to the shared repoUrl constant, and resolve to the correct -app repo. User re-confirmed acceptance during phase execution and visually approved the page. No code change."
gaps:
  - truth: "A visitor scanning the page sees exactly one GitHub link, in the footer (ROADMAP Phase 3 Success Criterion 4 / REQUIREMENTS.md LINK-04, read literally)"
    status: overridden
    reason: "The codebase deliberately retains TWO GitHub links — the nav icon (line 248) and the footer link (line 782) — both bound to repoUrl. This is a documented, pre-execution decision (03-CONTEXT.md D-05), not an oversight: 'This is a conscious decision for the promoted page: the nav icon is a standard, non-competing affordance and the user chose to keep it... LINK-04 is satisfied in spirit... not the literal single-link count.' The PLAN's own must_haves reworded this truth to 'in spirit' framing, but per goal-backward verification rules a plan may not narrow a ROADMAP Success Criterion — the literal SC still needs to be checked and it fails as written."
    artifacts:
      - path: "src/routes/+page.svelte"
        issue: "Two anchors resolve to https://github.com/Arthium-Org/stock-plan-companion-app: line 248 (nav icon) and line 782 (footer). ROADMAP SC4 / LINK-04 as worded requires exactly one, in the footer."
    missing:
      - "Either remove the nav GitHub icon so only the footer link remains (true literal compliance), OR formally accept the documented D-05 deviation by adding an `overrides:` entry to this VERIFICATION.md and updating ROADMAP.md/REQUIREMENTS.md wording to reflect 'one footer link + a subtle nav affordance' (as the phase's own CONTEXT.md already recommends as a non-blocking follow-up)."
---

# Phase 3: Links, Contact & CTA Cleanup Verification Report

**Phase Goal:** As a visitor arriving on the launch-ready arthium.org landing page, find correct contact and repository destinations with a single clear download call-to-action, so GitHub does not compete with registration.
**Verified:** 2026-07-07
**Status:** gaps_found
**Re-verification:** No — initial verification

## Goal Achievement

### Observable Truths

| # | Truth | Status | Evidence |
|---|-------|--------|----------|
| 1 | Footer Contact opens `mailto:contact@arthium.org`; the old personal Gmail (`kvakatidev@gmail.com`) appears nowhere on the page (LINK-01) | VERIFIED | `grep -c 'kvakatidev' src/routes/+page.svelte` = 0; `grep -c 'mailto:contact@arthium.org'` = 1 (line 791); confirmed in prerendered `build/index.html`; whole-repo grep for `kvakatidev\|gmail.com` in `src/` returns no matches |
| 2 | Every retained GitHub link resolves to `github.com/Arthium-Org/stock-plan-companion-app` — the `-app` suffix bug is fixed (LINK-02) | VERIFIED | `grep -c 'https://github.com/Arthium-Org' src/routes/+page.svelte` = 0 (no hardcoded literal); both anchors (nav line 248, footer line 782) render `href="https://github.com/Arthium-Org/stock-plan-companion-app"` in `build/index.html`; `downloads.test.ts` asserts `repoUrl === 'https://github.com/Arthium-Org/stock-plan-companion-app'` and 7/7 tests pass |
| 3 | Retained GitHub hrefs are built from the shared `repoUrl`/`appRepo` constant, not a hardcoded literal (LINK-02, D-07) | VERIFIED | `src/lib/downloads.ts:25` — `` export const repoUrl = `https://github.com/${appRepo}` `` ; `+page.svelte:20` imports `repoUrl`; used at lines 248 and 782; `grep -c 'repoUrl' src/routes/+page.svelte` = 5 |
| 4 | The hero shows only the "Register & Download" button; the adjacent secondary GitHub CTA is gone (LINK-03) | VERIFIED | `src/routes/+page.svelte:292-297` — single `<a href="#register" class="btn-primary">Register & Download</a>` inside the flex row, no second anchor; confirmed absent in `build/index.html`; `grep -i "view on github"` returns no matches anywhere |
| 5 | The Open Source section keeps its heading and blurb but no longer renders a GitHub button (D-03) | VERIFIED | `src/routes/+page.svelte:653-661` — `<h2>Open source</h2>` and blurb `<p>` present, no anchor/button follows; `grep -i "visit github"` returns no matches; confirmed in prerendered HTML |
| 6 | A visitor scanning the page sees exactly one GitHub link, in the footer (ROADMAP SC4 / LINK-04, literal) | ✗ FAILED | Two GitHub anchors are present and rendered: nav icon (`+page.svelte:248`) and footer link (`+page.svelte:782`), both confirmed live in `build/index.html`. This is a **documented, pre-approved deviation** (03-CONTEXT.md D-05: "the user chose to keep it"), not an implementation defect — see Gaps Summary below. |

**Score:** 5/6 truths verified (1 gap — documented intentional deviation, override recommended)

### Required Artifacts

| Artifact | Expected | Status | Details |
|----------|----------|--------|---------|
| `src/lib/downloads.ts` | Exports `repoUrl` derived from `appRepo` | ✓ VERIFIED | Line 25: `` `https://github.com/${appRepo}` `` — same template-literal style as `macDownloadUrl`; no hardcoded literal |
| `src/lib/downloads.test.ts` | Asserts `repoUrl` equals the correct app-repo URL | ✓ VERIFIED | Lines 31-37: exact-value assertion + `-app`-suffix guard; `npm test -- --project server src/lib/downloads.test.ts` → 7/7 passed |
| `src/routes/+page.svelte` | Corrected nav/footer hrefs, updated mailto, both competing GitHub CTAs removed | ✓ VERIFIED | All five edit sites confirmed by direct read: nav (247-251), hero CTA (292-297), Open Source (653-661), footer GitHub (780-784), footer Contact (790-794) |

### Key Link Verification

| From | To | Via | Status | Details |
|------|-----|-----|--------|---------|
| `+page.svelte` | `$lib/downloads` | `import { macDownloadUrl, repoUrl, winDownloadUrl, windowsAvailable }` (line 20) | WIRED | Import present and all four symbols consumed in the template |
| nav GitHub icon href | `repoUrl` | `<a href={repoUrl} ...>` (line 248) | WIRED | Bound to the shared constant, not a literal |
| footer GitHub href | `repoUrl` | `<a href={repoUrl} ...>` (line 782) | WIRED | Bound to the shared constant, not a literal |
| footer Contact anchor | `mailto:contact@arthium.org` | `<a href="mailto:contact@arthium.org" ...>` (line 791) | WIRED | Static literal, matches D-06 |

### Behavioral Spot-Checks

| Behavior | Command | Result | Status |
|----------|---------|--------|--------|
| `repoUrl` resolves to the exact `-app` repo URL | `npm test -- --project server src/lib/downloads.test.ts` | 7/7 tests passed | ✓ PASS |
| ESLint clean on modified files | `npx eslint src/` | No output (clean) | ✓ PASS |
| Svelte type-check clean | `npm run check` | `0 ERRORS 0 WARNINGS` (3955 files) | ✓ PASS |
| Static build succeeds and inlines correct URLs | `npm run build` then grep `build/index.html` | `https://github.com/Arthium-Org/stock-plan-companion-app` (×2, nav+footer), `mailto:contact@arthium.org` (×1) | ✓ PASS |
| No leftover CTA text in built output | `grep -i "view on github\|visit github" build/index.html` | No matches | ✓ PASS |

_Note: `prettier --check .` was not run standalone — it crashes on every `.svelte` file with a pre-existing `getVisitorKeys` tooling bug, logged in `.planning/phases/03-links-contact-cta-cleanup/deferred-items.md` and confirmed unrelated to this phase (reproduces on untouched files too). Not counted as a gap per the verification brief._

### Requirements Coverage

| Requirement | Source Plan | Description | Status | Evidence |
|-------------|------------|-------------|--------|----------|
| LINK-01 | 03-01-PLAN.md | Footer contact email links to `contact@arthium.org` | ✓ SATISFIED | Truth #1 |
| LINK-02 | 03-01-PLAN.md | All repository links point to `github.com/Arthium-Org/stock-plan-companion-app` | ✓ SATISFIED | Truths #2, #3 |
| LINK-03 | 03-01-PLAN.md | The prominent GitHub CTA near Register/hero is removed | ✓ SATISFIED | Truth #4 |
| LINK-04 | 03-01-PLAN.md | A single GitHub repository link remains in the footer | ✗ BLOCKED (literal) / documented deviation | Truth #6 — two GitHub links remain (nav + footer) by deliberate, pre-approved design (D-05); "GitHub no longer competes with registration" (the phase's actual goal-clause) is separately and clearly satisfied — see Gaps Summary |

No orphaned requirements: REQUIREMENTS.md maps exactly LINK-01..04 to Phase 3, and all four appear in `03-01-PLAN.md`'s `requirements` frontmatter.

### Anti-Patterns Found

| File | Line | Pattern | Severity | Impact |
|------|------|---------|----------|--------|
| — | — | None found | — | `grep -n -E "TBD\|FIXME\|XXX\|TODO\|HACK\|PLACEHOLDER"` on all three modified files (`downloads.ts`, `+page.svelte`, `app.html`) returned no matches. The one "coming soon" string (line 637) is a legitimate, reachable-only-when-`windowsAvailable=false` fallback UI branch, not a stub. |

### Context: User-Directed Additions (approved live at the Task 3 checkpoint, outside LINK-01..04 scope)

Per the plan's own SUMMARY, four additions were made during the Task 3 human-verify checkpoint and approved by the user in that session: Windows installer download enablement, and project-logo nav brand/favicon (later refined to circular, then to alpha-transparent PNGs). These are verified here only informationally, since they are not part of the LINK-01..04 requirement set:

- `src/lib/downloads.ts` — `winDownloadUrl`/`winAssetName` added, `windowsAvailable` flipped to `true`; asserted by `downloads.test.ts` (part of the 7/7 passing suite).
- `static/logo-mark.png` (512×512) and `static/favicon.png` (256×256) confirmed as 8-bit RGBA PNGs with `hasAlpha: yes` (via `sips -g hasAlpha`), consistent with the "transparent circular PNG" claim.
- `src/app.html` favicon link correctly points to `/favicon.png` (confirmed inlined in `build/index.html` as `<link rel="icon" href="./favicon.png"/>`); the stray debug `<div>` mentioned in the SUMMARY is confirmed absent.
- Note: this Windows change functionally supersedes Phase 1's `DL-03` requirement ("Windows download appears as a non-broken 'coming soon' state until the `.exe` is published") which REQUIREMENTS.md still lists as `[x]` complete under its original wording. Not a Phase 3 gap (DL-03 belongs to Phase 1), but flagged as documentation drift worth a follow-up edit — already noted by the plan's own SUMMARY.

### Human Verification Required

None required to close *this* gap — it is a factual, grep-verifiable link count, not a subjective/visual judgment. The remaining item is a **decision**, not a test:

### 1. Accept or reverse the two-GitHub-links deviation (LINK-04 / SC4)

**Test:** Decide whether to (a) remove the nav GitHub icon so exactly one GitHub link (footer) remains, matching ROADMAP SC4 and LINK-04 literally, or (b) formally accept the CONTEXT.md D-05 deviation for launch.
**Expected:** A decision recorded either as a code change (remove nav icon) or as an accepted override in this VERIFICATION.md's frontmatter, ideally paired with a ROADMAP.md/REQUIREMENTS.md wording update per the phase's own "Follow-up worth noting" in `03-CONTEXT.md`.
**Why human:** This is a product/UX call already discussed with the user during `discuss-phase` (per D-05, "the user chose to keep it") — the verifier surfaces it rather than silently passing a Success Criterion that is literally false in the shipped code, or silently failing a change the user already approved.

**This looks intentional.** To accept this deviation, add to VERIFICATION.md frontmatter:

```yaml
overrides:
  - must_have: "A visitor scanning the page sees exactly one GitHub link, in the footer (ROADMAP SC4 / LINK-04)"
    reason: "Nav GitHub icon retained as a deliberate, non-competing standard affordance per 03-CONTEXT.md D-05, discussed and approved by the user during discuss-phase; the phase's actual intent (GitHub does not compete with registration) is satisfied — only the literal 'exactly one link' count is not."
    accepted_by: "{name}"
    accepted_at: "{ISO timestamp}"
```

### Gaps Summary

Everything specific to LINK-01, LINK-02, and LINK-03 is fully implemented, wired, tested, and confirmed in the prerendered build output — no stubs, no hardcoded literals, no leftover CTA markup or text.

The one gap is LINK-04 / ROADMAP Success Criterion 4, read literally ("exactly one GitHub link, in the footer"): the shipped page retains **two** GitHub links (nav icon + footer), both correctly pointing at the `-app` repo via the shared `repoUrl` constant. This is not an oversight — it is a decision made and documented *before* execution, in `03-CONTEXT.md` D-05, explicitly noting the deviation from the literal roadmap wording and recommending (as non-blocking) a future wording update to ROADMAP.md/REQUIREMENTS.md. The phase's true underlying goal — "GitHub does not compete with registration" — is independently and clearly satisfied: both prominent competing CTAs (hero secondary button, Open Source button) are gone, and only a quiet nav icon and a quiet footer link remain.

Per goal-backward verification rules, a PLAN cannot narrow a ROADMAP Success Criterion's scope, so this is reported as a gap rather than silently passed — but it is presented with the override snippet above so it can be closed with a one-line frontmatter edit rather than a code change, if the deviation is (as it appears) already the intended outcome.

---

_Verified: 2026-07-07_
_Verifier: Claude (gsd-verifier)_
