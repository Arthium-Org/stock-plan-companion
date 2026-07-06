# Project Retrospective

*A living document updated after each milestone. Lessons feed forward into future planning.*

## Milestone: v1.0 — Launch Polish

**Shipped:** 2026-07-07
**Phases:** 3 | **Plans:** 4 | **Tasks:** 10

### What Was Built
- Config-driven downloads (`src/lib/downloads.ts`): macOS arm64 DMG + Windows installer resolved via GitHub's version-less `releases/latest/download/` URLs — future releases need no code edit.
- Registration backend migrated from Formspree (50/mo cap) to a Google Apps Script → Google Sheet endpoint, posted as CORS "simple requests," gated on a readable `{ok:true}` body — verified capturing rows live end-to-end.
- Production link/contact sweep: shared `repoUrl` constant, `contact@arthium.org` mailto, competing GitHub CTAs removed down to one quiet footer link.
- Dark-themed landing page promoted to `/` (prototype `/new-12345` removed) and project logo/favicon branding.
- Shipped live to GitHub Pages (arthium.org) via `deploy.yml`.

### What Worked
- Single-config-location pattern for download URLs cleanly retired the "edit code every release" anti-pattern flagged in codebase CONCERNS — locked with a unit test on the exact URL string.
- Phase 2 insisted on *live* end-to-end verification (real Apps Script deployment), which proved Assumption A2 (readable `/exec` redirect body) against reality rather than in theory.
- Coarse 3-phase decomposition matched the scope; phases were sequenced to avoid conflicting edits on the same `+page.svelte` markup.

### What Was Inefficient
- Phase 01's acceptance criteria ("Windows coming soon") were superseded mid-milestone when Phase 03 enabled the Windows installer — leaving Phase 01 verification stuck at `human_needed` for checks that no longer described the shipped behavior. Scope creep during checkpoint review outran the original phase's verification contract.
- Branching strategy was `none`, so all 53 commits accumulated unpushed on `main` until ship time — a large, single push rather than incremental deploys.
- GSD tooling and a research fetch-cache leaked into the working tree and were briefly committed before being untracked/gitignored — the ignore rules should have existed from install.

### Patterns Established
- Download/release URLs belong in one typed config module with a stable-asset-name invariant comment, unit-tested against the exact string.
- Client-side third-party POST (Apps Script) as the "backend" for a static GitHub Pages site — success/failure gated on a readable JSON body, existing inline form UX preserved.
- Machine-generated tooling (`.claude/gsd-core`, `.planning/research/.cache`) is gitignored; `CLAUDE.md` and genuine planning docs stay tracked.

### Key Lessons
1. When scope expands during a checkpoint (Windows enabled beyond "coming soon"), update the affected phase's verification contract too — otherwise its status lingers as a false gap at milestone close.
2. Set `.gitignore` for tooling/caches at install time, not after they surface in `git status`.
3. For a solo, deploy-on-push repo, `branching_strategy: none` is workable but means "ship" is a direct push — decide push cadence deliberately rather than letting commits pile up.

### Cost Observations
- Model mix: predominantly Opus for planning/execution (adaptive profile).
- Notable: coarse granularity + mvp mode kept per-phase overhead low; the milestone's real cost was verification/iteration, not planning volume.

---

## Cross-Milestone Trends

### Process Evolution

| Milestone | Phases | Plans | Key Change |
|-----------|--------|-------|------------|
| v1.0 | 3 | 4 | First milestone — established GSD workflow, config-driven downloads, static-site third-party backend pattern |

### Top Lessons (Verified Across Milestones)

1. *(to be confirmed across future milestones)* — Keep phase verification contracts in sync with mid-milestone scope changes.
