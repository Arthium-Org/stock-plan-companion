---
phase: 03-links-contact-cta-cleanup
plan: 01
subsystem: ui
tags: [sveltekit, svelte5, tailwind, links, branding, favicon]

# Dependency graph
requires:
  - phase: 01-download-wiring-release-config
    provides: appRepo/macDownloadUrl config pattern in src/lib/downloads.ts
  - phase: 02-registration-backend-migration
    provides: live registration form on the promoted `/` landing page
provides:
  - Shared repoUrl constant (derived from appRepo) as single source of truth for all GitHub links
  - Corrected footer Contact mailto and both GitHub links (nav icon, footer) on `-app` repo
  - Removal of the two competing GitHub CTAs (hero secondary button, Open Source section button)
  - Windows installer download enabled via winDownloadUrl (latest/download pattern)
  - Project logo used as nav brand + browser favicon, transparent circular PNGs
affects: [launch-readiness, branding, ui]

# Tech tracking
tech-stack:
  added: []
  patterns:
    - "All outbound GitHub hrefs derive from src/lib/downloads.ts constants (appRepo -> repoUrl / macDownloadUrl / winDownloadUrl); no hardcoded repo URL literals in +page.svelte"
    - "eslint-disable/eslint-enable svelte/no-navigation-without-resolve wraps anchors whose href is a non-literal expression sourced from $lib/downloads"

key-files:
  created:
    - static/logo.png
    - static/logo-mark.png
    - static/favicon.png
  modified:
    - src/lib/downloads.ts
    - src/lib/downloads.test.ts
    - src/routes/+page.svelte
    - src/app.html
  deleted:
    - static/favicon.svg

key-decisions:
  - "repoUrl is derived from the existing appRepo constant (template literal, same style as macDownloadUrl) rather than a new hardcoded string, per D-07 discretion option b."
  - "Windows installer enabled mid-plan (user-directed addition, not in original scope) using the same latest/download URL-composition pattern as macOS, since the .exe was published during the checkpoint."
  - "Nav brand and browser favicon switched from the placeholder Svelte icon/wordmark to the project logo; final assets are transparent circular PNGs to avoid a white box in either theme or the browser tab."

requirements-completed: [LINK-01, LINK-02, LINK-03, LINK-04]

coverage:
  - id: D1
    description: "Footer Contact mailto corrected to contact@arthium.org; personal Gmail removed from the page"
    requirement: "LINK-01"
    verification:
      - kind: unit
        ref: "grep -c 'kvakatidev' src/routes/+page.svelte == 0; grep -c 'mailto:contact@arthium.org' src/routes/+page.svelte == 1"
        status: pass
    human_judgment: false
  - id: D2
    description: "Nav + footer GitHub links bound to shared repoUrl constant, resolving to the correct -app repo"
    requirement: "LINK-02"
    verification:
      - kind: unit
        ref: "src/lib/downloads.test.ts — repoUrl exact-value and -app-suffix assertions (7/7 tests pass)"
        status: pass
      - kind: unit
        ref: "grep -c 'https://github.com/Arthium-Org' src/routes/+page.svelte == 0 (no hardcoded literal); grep -c 'repoUrl' src/routes/+page.svelte >= 2"
        status: pass
    human_judgment: false
  - id: D3
    description: "Hero secondary 'View on GitHub' CTA and Open Source 'Visit GitHub' button removed; Open Source heading/blurb retained; Register & Download remains the sole hero CTA"
    requirement: "LINK-03"
    verification:
      - kind: manual_procedural
        ref: "Task 3 checkpoint:human-verify — approved by user"
        status: pass
    human_judgment: true
    rationale: "Visual layout/spacing correctness (no leftover gaps, single hero CTA) requires human eyes on the rendered page."
  - id: D4
    description: "Exactly one quiet footer GitHub link plus the deliberately retained nav icon remain; no GitHub CTA competes with registration"
    requirement: "LINK-04"
    verification:
      - kind: manual_procedural
        ref: "Task 3 checkpoint:human-verify — approved by user"
        status: pass
    human_judgment: true
    rationale: "\"Competes with registration\" is a subjective visual-hierarchy judgment, not something a unit test can assert."
  - id: D5
    description: "Windows installer download enabled (winDownloadUrl, real download anchor) — user-directed addition beyond original plan scope"
    verification:
      - kind: unit
        ref: "src/lib/downloads.test.ts — winDownloadUrl exact-value and -app-suffix assertions (included in the 7/7 passing suite)"
        status: pass
      - kind: manual_procedural
        ref: "Task 3 checkpoint — visual confirmation of the real Windows download button"
        status: pass
    human_judgment: false
  - id: D6
    description: "Project logo used for nav brand + favicon, clipped to a transparent circle for both themes — user-directed addition beyond original plan scope"
    verification:
      - kind: manual_procedural
        ref: "Task 3 checkpoint — visual confirmation of logo/favicon in both light and dark themes and the browser tab"
        status: pass
    human_judgment: true
    rationale: "Branding/visual-polish correctness (no white background bleed in any theme) is a subjective rendering check that requires a human to view the page."

# Metrics
duration: 45min
completed: 2026-07-07
status: complete
---

# Phase 03 Plan 01: Links, Contact & CTA Cleanup Summary

**Corrected GitHub/Contact links via a shared repoUrl constant, removed two competing GitHub CTAs, and — as user-directed additions during checkpoint review — enabled the Windows installer download and replaced the placeholder Svelte branding with the project's transparent circular logo/favicon.**

## Performance

- **Duration:** 45 min
- **Started:** 2026-07-07T02:09:00Z (approx, first task commit)
- **Completed:** 2026-07-07T02:48:33Z (last commit)
- **Tasks:** 3 (2 auto + 1 checkpoint), plus 4 user-directed additions made during the checkpoint pause
- **Files modified:** 8 (3 original-scope + 5 across the additions, some overlapping)

## Accomplishments

- Added a `repoUrl` constant to `src/lib/downloads.ts`, derived from the existing `appRepo` constant (not a hardcoded literal), with test assertions for the exact value and the `-app` suffix.
- Rewired the nav GitHub icon and footer GitHub link in `+page.svelte` to `{repoUrl}`, eliminating the last hardcoded `https://github.com/Arthium-Org/...` literals on the page.
- Changed the footer Contact anchor to `mailto:contact@arthium.org`, removing the personal Gmail address entirely.
- Removed the hero's secondary "View on GitHub" button (Register & Download is now the sole hero CTA) and the Open Source section's "Visit GitHub" button (heading + blurb retained).
- Human visual verification (Task 3 checkpoint) approved: correct destinations, no leftover CTA gaps, both themes render correctly.
- **User-directed additions during the checkpoint pause** (beyond the original plan scope — see Deviations section): enabled the Windows installer download, replaced the Svelte placeholder logo/favicon with the project's branding, and made the nav/favicon assets transparent circular PNGs.

## Task Commits

Each task was committed atomically:

1. **Task 1: Add shared repoUrl constant + test to downloads.ts** - `d58def7` (feat, tdd)
2. **Task 2: Fix links/contact and remove competing GitHub CTAs in +page.svelte** - `f6e16ef` (fix)
3. **Task 3: Visual verification checkpoint** - approved (no code commit; gate only)

**User-directed additions (made during the Task 3 checkpoint, outside original plan scope):**

4. `5c2f4bd` — feat(03-01): enable Windows installer download
5. `2ee12cb` — feat(03-01): use project logo for nav brand and favicon
6. `bcf8b57` — fix(03-01): clip nav logo to circle with dark-mode backlight
7. `22f8428` — fix(03-01): make nav logo and favicon transparent circular PNGs

**Plan metadata:** (this commit) `docs(03-01): summary and tracking for links/CTA cleanup`

_Note: Task 1 followed the TDD RED→GREEN flow within a single commit per plan convention (test file extended alongside the constant, both verified together)._

## Files Created/Modified

- `src/lib/downloads.ts` - Added `repoUrl` (derived from `appRepo`) and, via the Windows addition, `winAssetName`/`winDownloadUrl`; flipped `windowsAvailable` to `true`.
- `src/lib/downloads.test.ts` - Added assertions for `repoUrl` and `winDownloadUrl` exact values and `-app`-suffix guards (7/7 tests pass).
- `src/routes/+page.svelte` - Bound nav/footer GitHub hrefs to `repoUrl`, changed Contact mailto, removed the two competing GitHub CTA buttons, added the real Windows download anchor, replaced the nav icon+wordmark with the logo `<img>` (rounded-full, dark-mode glow box-shadow).
- `src/app.html` - Pointed the favicon link at `/favicon.png`, removed a stray leftover debug `<div>`.
- `static/logo.png` (new) - Source project logo, moved from repo root `Logo.png`.
- `static/logo-mark.png` (new) - Cropped/transparent circular derivative of the logo used for the nav emblem and to regenerate the favicon.
- `static/favicon.png` (new) - Transparent circular favicon generated from the logo mark.
- `static/favicon.svg` (deleted) - Removed the default SvelteKit/Svelte favicon.

## Decisions Made

- `repoUrl` composed from `appRepo` via the same template-literal style as `macDownloadUrl`, keeping a single source of truth for the repo base URL (per D-07 discretion option b).
- Windows installer enabled using the same `latest/download` URL-composition pattern already established for macOS in Phase 1, rather than inventing a new pattern.
- Logo/favicon assets converted to transparent circular PNGs (not just CSS-clipped) so no white background artifact could appear under any theme or in the browser tab, since CSS `border-radius` alone left visible corners bleeding through on some backgrounds.

## Deviations from Plan

### User-Directed Scope Additions (approved live during the Task 3 checkpoint)

These four changes were requested by the user while the Task 3 human-verify checkpoint was open, and are **not** covered by the original plan's `<tasks>` or the phase's `LINK-01..04` requirements. They introduce new user-visible capability (Windows availability) and new branding assets (project logo/favicon) that the phase's roadmap entry and REQUIREMENTS.md did not anticipate.

**1. Enabled Windows installer download**
- **Found during:** Task 3 checkpoint (user request)
- **What:** Added `winAssetName`/`winDownloadUrl` to `downloads.ts` (mirrors the `macDownloadUrl` `latest/download` pattern), flipped `windowsAvailable` to `true`, added a real Windows download anchor in the post-registration panel, plus test coverage.
- **Files:** `src/lib/downloads.ts`, `src/lib/downloads.test.ts`, `src/routes/+page.svelte`
- **Verification:** New test assertions pass (part of the 7/7 suite); visually confirmed during the checkpoint.
- **Committed in:** `5c2f4bd`
- **Note:** This directly reverses Phase 1's "Windows shows coming-soon until `.exe` is published" state (D-05 in Phase 1's context) — appropriate now that the `.exe` has been published, but it is new functional scope, not a link/CTA cleanup. **Recommend a follow-up note in ROADMAP.md/REQUIREMENTS.md** acknowledging Windows availability, since Phase 1's `DL-03` success criterion ("Windows download appears as a coming-soon state") is now superseded.

**2. Replaced Svelte placeholder logo with project logo (nav brand + favicon)**
- **Found during:** Task 3 checkpoint (user request)
- **What:** Moved `Logo.png` → `static/logo.png`, replaced the nav's `BarChart3` icon + wordmark with an `<img>` using the logo, generated `static/favicon.png` from it, pointed `app.html` at the new favicon, deleted the old Svelte `favicon.svg`. Also removed a stray leftover debug `<div class="footer">This change should be visible</div>` found in `app.html` while editing (Rule 1 — dead debug artifact, no functional impact, removed inline).
- **Files:** `src/routes/+page.svelte`, `src/app.html`, `static/logo.png`, `static/favicon.png`, `static/favicon.svg` (removed)
- **Committed in:** `2ee12cb`

**3. Clipped nav logo to a circle with dark-mode backlight glow**
- **Found during:** Task 3 checkpoint (user request, follow-on to #2 — logo image had a visible white rectangular background)
- **What:** Cropped the logo to a tight square (`static/logo-mark.png`), applied `rounded-full` + `object-cover` in the nav `<img>`, added a `box-shadow` glow using the existing `--accent-glow` CSS variable for visibility in dark mode, regenerated the favicon from the cropped mark.
- **Files:** `src/routes/+page.svelte`, `static/logo-mark.png`, `static/favicon.png`
- **Committed in:** `bcf8b57`

**4. Made nav logo mark and favicon fully transparent circular PNGs**
- **Found during:** Task 3 checkpoint (user request, follow-on to #3 — CSS `rounded-full` clipping still showed white corners/background bleed under some theme/tab conditions)
- **What:** Regenerated `static/logo-mark.png` (512x512) and `static/favicon.png` (256x256) as transparent circles with alpha baked directly into the PNG, so no CSS-dependent clipping is required. No markup/CSS changes needed — existing `rounded-full` + glow styling remained correct.
- **Files:** `static/logo-mark.png`, `static/favicon.png`
- **Committed in:** `22f8428`

---

**Total deviations:** 4 user-directed scope additions (all approved live by the user during the Task 3 checkpoint), 0 auto-fixed bugs/blockers beyond one trivial dead-debug-artifact removal (folded into addition #2).
**Impact on plan:** The four additions are functionally sound, tested where testable (Windows URL composition), and visually approved. They expand the phase's delivered scope beyond `LINK-01..04` — see the recommendation above to log Windows availability and the branding change as a follow-up note against Phase 1's `DL-03` criterion and the project's asset inventory, since neither ROADMAP.md nor REQUIREMENTS.md currently reflects them.

## Issues Encountered

None beyond the deviations documented above.

## User Setup Required

None - no external service configuration required. (Windows installer asset itself is assumed already published to the `stock-plan-companion-app` GitHub Releases per the user's checkpoint request; no action needed in this repo beyond the code changes already committed.)

## Next Phase Readiness

- This was the final phase (03) of the launch-polish milestone. All three phases (Download Wiring, Registration Backend Migration, Links/Contact/CTA Cleanup) are now complete.
- **Recommended follow-up (not blocking):** update ROADMAP.md/REQUIREMENTS.md to acknowledge that Windows is now available (supersedes Phase 1 `DL-03`'s "coming soon" criterion) and that the site's branding now uses the project logo rather than a placeholder — both are functioning correctly but were decided live during this phase's checkpoint rather than planned upfront.
- Known pre-existing, out-of-scope issue: `npm run lint` (`prettier --check .`) crashes with `TypeError: getVisitorKeys is not a function` on every `.svelte` file, including files untouched by this plan. Logged in `.planning/phases/03-links-contact-cta-cleanup/deferred-items.md`; not introduced or worsened by this plan. `eslint` (run directly), `svelte-check`, and `vite build` all pass clean.

## Self-Check: PASSED

All claimed files found on disk (src/lib/downloads.ts, src/lib/downloads.test.ts, src/routes/+page.svelte, src/app.html, static/logo.png, static/logo-mark.png, static/favicon.png; static/favicon.svg confirmed removed). All claimed commits (d58def7, f6e16ef, 5c2f4bd, 2ee12cb, bcf8b57, 22f8428) found in git log. `npm test -- --project server src/lib/downloads.test.ts` re-verified 7/7 passing; `npm run check` re-verified 0 errors; `npm run build` re-verified success with build/logo-mark.png and build/favicon.png present in output.

---
*Phase: 03-links-contact-cta-cleanup*
*Completed: 2026-07-07*
