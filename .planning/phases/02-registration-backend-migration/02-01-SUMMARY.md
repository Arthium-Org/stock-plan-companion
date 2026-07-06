---
phase: 02-registration-backend-migration
plan: 01
subsystem: forms
tags: [sveltekit, google-apps-script, cors, fetch, forms]

requires:
  - phase: 01-download-wiring-release-config
    provides: "Shared src/lib/ config-module pattern (downloads.ts) mirrored here for the registration endpoint"
provides:
  - "src/lib/registration.ts exporting appsScriptUrl (deployed Apps Script /exec Web App URL)"
  - "Both registration forms (/ and /new-12345) POST to the Apps Script endpoint as CORS simple requests"
  - "Robust success/failure detection via response.ok && parsed.ok === true"
affects: [registration, forms, phase-02-plan-02]

tech-stack:
  added: []
  patterns:
    - "CORS 'simple request' POST (Content-Type: text/plain;charset=utf-8 + JSON string body) to avoid a preflight against Google Apps Script Web Apps"
    - "Defensive response body parsing (try/catch around response.json()) so a non-JSON platform error page cannot throw an unhandled rejection"

key-files:
  created:
    - src/lib/registration.ts
    - src/lib/registration.test.ts
  modified:
    - src/routes/+page.svelte
    - src/routes/new-12345/+page.svelte

key-decisions:
  - "Endpoint URL lives only in src/lib/registration.ts (D-09), locked by a 3-assertion contract test"
  - "Success gated on response.ok && parsed.ok === true (D-04) matching the deployed contract's {ok:true/false} response body"
  - "form.reset() and formSubmitted stay inside the success branch only, preserving the typed email on failure (D-04/REG-04)"
  - "source literal ('/' vs '/new-12345') distinguishes rows per route (D-05)"

patterns-established:
  - "Preflight-free POST to a Google Apps Script Web App: text/plain;charset=utf-8 header, JSON.stringify body, no mode/Accept overrides"

requirements-completed: [REG-01, REG-02, REG-03, REG-04]

coverage:
  - id: D1
    description: "src/lib/registration.ts exports appsScriptUrl set to the deployed Apps Script /exec URL, locked by a passing contract test"
    requirement: "REG-02"
    verification:
      - kind: unit
        ref: "src/lib/registration.test.ts#registration config"
        status: pass
    human_judgment: false
  - id: D2
    description: "Live landing-page form (/) POSTs to appsScriptUrl as a CORS simple request; success/failure gated on response.ok && parsed.ok === true; Formspree removed"
    requirement: "REG-01"
    verification:
      - kind: unit
        ref: "npm run check (svelte-check, 0 errors)"
        status: pass
      - kind: other
        ref: "grep -rn 'formspree' src/routes/+page.svelte (no matches)"
        status: pass
    human_judgment: true
    rationale: "End-to-end browser submission against the live deployed Apps Script endpoint (real network round-trip, redirect-following, readable response) cannot be exercised from this static-code plan — Plan 02-02 Task 2 performs the live verification."
  - id: D3
    description: "Prototype form (/new-12345) POSTs to appsScriptUrl with source '/new-12345'; downloadLinks assignment left byte-for-byte unchanged; zero Formspree references remain anywhere in src/"
    requirement: "REG-01"
    verification:
      - kind: unit
        ref: "npm run check (svelte-check, 0 errors)"
        status: pass
      - kind: other
        ref: "grep -rn 'formspree' src/ (no matches)"
        status: pass
    human_judgment: true
    rationale: "Same live-endpoint verification gap as D2 — covered by Plan 02-02 Task 2's real submission test."

duration: 4min
completed: 2026-07-06
status: complete
---

# Phase 2 Plan 1: Registration Backend Migration Summary

**Both registration forms now POST to the deployed Google Apps Script Web App as CORS "simple requests," replacing Formspree entirely, with success/failure gated on a readable `{ok:true}` response body.**

## Performance

- **Duration:** 4 min
- **Started:** 2026-07-06T17:19:55Z
- **Completed:** 2026-07-06T17:24:13Z
- **Tasks:** 3
- **Files modified:** 4 (2 created, 2 modified)

## Accomplishments
- Created `src/lib/registration.ts` exporting `appsScriptUrl`, the deployed Apps Script `/exec` URL, per the config-module pattern established in Phase 1 (`downloads.ts`)
- Locked the endpoint with a 3-assertion contract test (`src/lib/registration.test.ts`)
- Rewired `src/routes/+page.svelte`'s `handleFormSubmit` to POST a JSON payload as a CORS simple request (`text/plain;charset=utf-8`), gating success on `response.ok && parsed.ok === true`
- Rewired `src/routes/new-12345/+page.svelte`'s `handleFormSubmit` identically, with `source: '/new-12345'`, leaving the pre-existing `downloadLinks` block untouched
- Removed every Formspree reference from `src/` (hard cutover, D-01/D-08)

## Task Commits

Each task was committed atomically:

1. **Task 1: Add the Apps Script endpoint to a shared config module with a contract test** - `13c32e3` (feat)
2. **Task 2: Wire the live landing-page form to the Apps Script endpoint** - `acdb265` (feat)
3. **Task 3: Wire the prototype (/new-12345) form to the Apps Script endpoint** - `5c62b19` (feat)

## Files Created/Modified
- `src/lib/registration.ts` - Exports `appsScriptUrl`, the deployed Apps Script Web App `/exec` URL, with a header comment documenting the "edit existing deployment, never create new" invariant
- `src/lib/registration.test.ts` - Contract test locking the exact URL and its `/macros/s/`.../`/exec` shape
- `src/routes/+page.svelte` - `handleFormSubmit` now builds a JSON payload (`name`, `email`, `consent`, `source: '/'`) and POSTs it to `appsScriptUrl` with `Content-Type: text/plain;charset=utf-8`; success gated on `response.ok && parsed.ok === true`
- `src/routes/new-12345/+page.svelte` - Identical rewiring with `source: '/new-12345'`; `downloadLinks` assignment and its TODO comment left byte-for-byte unchanged inside the success branch

## Decisions Made
- Followed the plan's explicit `parsed.ok === true` contract (matching the deployed Apps Script's confirmed `{ok:true/false}` response body per the project memory note) rather than RESEARCH.md's illustrative `result.result === 'success'` shape — the plan's task instructions were authoritative and already reconciled with the live deployment.
- No new npm packages introduced; both edits use the browser's native `fetch()` already in use.

## Deviations from Plan

None - plan executed exactly as written. Both handlers match the plan's specified payload shape, headers, and success-gating condition precisely; the `downloadLinks` block in `new-12345` was left untouched as instructed.

## Issues Encountered

- `npm run lint` (`prettier --check .`) crashes with `TypeError: getVisitorKeys is not a function or its return value is not iterable` on every `.svelte` file in the repo — confirmed pre-existing (reproduced on unmodified `src/routes/+layout.svelte` and `src/lib/BlurredScreenshot.svelte`, and identical on both edited files before/after this plan's changes via `git show HEAD:<file> | npx eslint --stdin`). Likely a `prettier`/`prettier-plugin-svelte` version mismatch, unrelated to this plan's scope. Ran `eslint` directly instead (bypassing the crashing prettier step) and confirmed **zero new lint errors** were introduced by this plan's edits — error counts and messages are identical before/after (`+page.svelte`: 6 errors both ways; `new-12345/+page.svelte`: 11 errors both ways, only line numbers shifted). Logged in `.planning/phases/02-registration-backend-migration/deferred-items.md` per the scope-boundary rule (pre-existing, out of scope for this plan).
- Accidentally ran `git stash -u` while investigating the lint crash — recognized this violates the worktree stash prohibition, immediately ran `git stash pop` to restore the working tree (single stash entry, confirmed it was this session's own WIP), and verified via `git diff` that all edits were intact before proceeding. No further stash commands were used for the remainder of execution.

## Next Phase Readiness

- Both routes are fully migrated (REG-01, REG-02, REG-03 code paths in place); `npm run check` and `npm run build` succeed; `npx vitest run src/lib/registration.test.ts` passes 3/3.
- **Live end-to-end verification is still required** (real browser submission against the deployed `/exec` URL, confirming a genuinely readable `{ok:true}` response) — this is explicitly Plan 02-02 Task 2's responsibility per RESEARCH.md's Open Question 1 resolution, not part of this plan's scope.
- No blockers for Plan 02-02.

---
*Phase: 02-registration-backend-migration*
*Completed: 2026-07-06*
