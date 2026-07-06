---
gsd_state_version: 1.0
milestone: v1.0
milestone_name: milestone
current_phase: 03
status: Milestone v1.0 shipped — main pushed to origin (838d914), GitHub Pages deploy triggered
stopped_at: Phase 03 plan 01 complete — links/CTA cleanup + Windows enablement + branding shipped, checkpoint approved
last_updated: "2026-07-06T21:45:42.546Z"
last_activity: 2026-07-07
progress:
  total_phases: 3
  completed_phases: 3
  total_plans: 4
  completed_plans: 4
  percent: 100
current_phase_name: Links, Contact & CTA Cleanup
---

# Project State

## Project Reference

See: .planning/PROJECT.md (updated 2026-07-06)

**Core value:** A visitor can understand what the app does and download the correct, working build after registering — with every registration reliably captured (no monthly submission cap).
**Current focus:** Phase 03 — Links, Contact & CTA Cleanup

## Current Position

Phase: 03
Plan: Not started
Status: Milestone v1.0 shipped — main pushed to origin (838d914), GitHub Pages deploy triggered
Last activity: 2026-07-07

Progress: [██████████] 100%

## Performance Metrics

**Velocity:**

- Total plans completed: 3
- Average duration: - min
- Total execution time: 0 hours

**By Phase:**

| Phase | Plans | Total | Avg/Plan |
|-------|-------|-------|----------|
| 02 | 2 | - | - |
| 03 | 1 | - | - |

**Recent Trend:**

- Last 5 plans: none yet
- Trend: -

*Updated after each plan completion*
| Phase 01 P01 | 15min | 2 tasks | 3 files |
| Phase 02 P02 | 20min | 2 tasks | 0 files |
| Phase 03 P01 | 45min | 3 tasks | 8 files |

## Accumulated Context

### Decisions

Decisions are logged in PROJECT.md Key Decisions table.
Recent decisions affecting current work:

- Roadmap: Registration → Google Apps Script → Google Sheet (free, unlimited, owned data)
- Roadmap: Keep one footer GitHub link; drop prominent CTA near hero/register
- Roadmap: macOS ships now (arm64 only); Windows shows "coming soon" until `.exe` is published
- Roadmap: Download URLs (tag + filename) move to a single config location
- [Phase 01]: macDownloadUrl composed from appRepo + macAssetName via GitHub latest-release URL (D-01, D-02) - zero-edit future releases
- [Phase 01]: Windows placeholder rendered as disabled button (not anchor) so it can never navigate or 404 (D-05)
- [Phase 01]: Intel-Mac expectation conveyed via title tooltip, not visible body text (D-06, D-07)
- [Phase ?]: Registration backend migration verified end-to-end on live deployment (REG-02, REG-04 proven); Assumption A2 confirmed
- [Phase 03]: repoUrl derived from appRepo (single source of truth for GitHub links)
- [Phase 03]: Contact mailto set to contact@arthium.org, personal Gmail removed
- [Phase 03]: Windows installer enabled via winDownloadUrl (latest/download pattern) - user-directed addition beyond original scope
- [Phase 03]: nav brand and favicon switched to project logo, exported as transparent circular PNGs - user-directed addition beyond original scope

### Pending Todos

None yet.

### Blockers/Concerns

None yet.

### Quick Tasks Completed

| # | Description | Date | Commit | Directory |
|---|-------------|------|--------|-----------|
| 260707-05y | Promote dark-themed landing page (with light/dark switch) to main / route; remove /new-12345; fix registration source to / and default consent checkbox on | 2026-07-07 | 43a8bdc | [260707-05y-promote-dark-themed-landing-page-with-li](./quick/260707-05y-promote-dark-themed-landing-page-with-li/) |
| fast | Resolve 11 pre-existing eslint errors on promoted landing page (each-block keys, optional-catch bindings, external-href disable) | 2026-07-07 | df247ff | — |

## Deferred Items

Items acknowledged and carried forward from previous milestone close:

| Category | Item | Status | Deferred At |
|----------|------|--------|-------------|
| *(none — first milestone)* | | | |

## Session Continuity

Last session: 2026-07-06T21:25:07.606Z
Stopped at: Phase 03 plan 01 complete — links/CTA cleanup + Windows enablement + branding shipped, checkpoint approved
Resume file: None
