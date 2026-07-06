# Roadmap: Stock Plan Companion — Marketing Site (Launch-Polish Milestone)

## Overview

This milestone takes the existing, already-built arthium.org marketing site from "demo-ready" to "launch-ready." Three coarse phases carry it there: first, the download experience is wired to a real, versioned GitHub Release asset (fixing the hardcoded-URL anti-pattern and giving Windows a safe "coming soon" state); second, the registration form's backend is swapped from Formspree (50/mo cap) to a Google Apps Script → Google Sheet endpoint so every signup is captured with no ceiling; third, a sweep of outbound links and contact info replaces stale placeholders (personal email, wrong repo, duplicate GitHub CTA) with the correct production destinations. All three phases edit the existing `src/routes/+page.svelte` and its supporting config — no new routes, no backend, no framework changes.

## Phases

**Phase Numbering:**

- Integer phases (1, 2, 3): Planned milestone work
- Decimal phases (2.1, 2.2): Urgent insertions (marked with INSERTED)

- [x] **Phase 1: Download Wiring & Release Config** - A registered visitor downloads the correct, signed macOS build from the right repo; Windows shows a safe placeholder; future releases need only a config edit (completed 2026-07-06)
- [x] **Phase 2: Registration Backend Migration** - Every registration is captured via Google Apps Script → Google Sheet with no monthly cap, preserving the existing form UX (completed 2026-07-06)
- [ ] **Phase 3: Links, Contact & CTA Cleanup** - All outbound links and contact info point to production destinations; the duplicate GitHub CTA is gone, leaving one quiet footer link

## Phase Details

### Phase 1: Download Wiring & Release Config

**Goal**: A visitor who registers downloads the correct, signed macOS build from the correct repo, Windows shows a non-broken placeholder, and future releases require only a config update — not a code edit.
**Mode:** mvp
**Depends on**: Nothing (first phase)
**Requirements**: DL-01, DL-02, DL-03, DL-04
**Success Criteria** (what must be TRUE):

  1. A visitor who completes registration can click the button labeled "macOS (Apple Silicon)" and receive the signed arm64 DMG.
  2. That DMG download resolves to an asset published in a GitHub Release of `Arthium-Org/stock-plan-companion-app` — not the old repo, not a stale hardcoded tag.
  3. The Windows download appears as a "coming soon" state that doesn't 404 or dead-link anywhere.
  4. Shipping a new release (new tag/filename) requires editing exactly one config location — no changes to page/form logic.

**Plans**: 1/1 plans complete

- [x] 01-01-PLAN.md — Config-driven download module + wired macOS/Windows buttons (test → implement → visual verify)

**UI hint**: yes

### Phase 2: Registration Backend Migration

**Goal**: Every visitor who registers has their email reliably captured — no monthly submission cap — while the existing inline form UX is unchanged.
**Mode:** mvp
**Depends on**: Nothing (independent of Phase 1; sequenced after it since both touch the same form)
**Requirements**: REG-01, REG-02, REG-03, REG-04
**Success Criteria** (what must be TRUE):

  1. A visitor can type an email into the existing inline registration form and submit it.
  2. The submission lands as a new row in the Google Sheet via the Google Apps Script endpoint (Formspree is no longer called), with no submission-count cap.
  3. On successful submission, the download options reveal in place exactly as before.
  4. If submission fails (network/script error), the form shows an inline error and keeps the typed email instead of clearing the field.

**Plans**: 2/2 plans complete
**Wave 1**

- [x] 02-01-PLAN.md — Endpoint config module + both registration forms wired to Apps Script (test → wire `/` → wire `/new-12345`)

**Wave 2** *(blocked on Wave 1 completion)*

- [x] 02-02-PLAN.md — Clean-cutover gate + live end-to-end verification of capture & failure handling

**UI hint**: yes

### Phase 3: Links, Contact & CTA Cleanup

**Goal**: Every outbound link and contact detail on the site points to the correct production destination, and the duplicate GitHub call-to-action no longer competes with registration.
**Mode:** mvp
**Depends on**: Phase 1, Phase 2 (touches the same header/hero/footer markup; sequenced last to avoid conflicting edits)
**Requirements**: LINK-01, LINK-02, LINK-03, LINK-04
**Success Criteria** (what must be TRUE):

  1. The footer contact link opens a mailto to `contact@arthium.org` (not the old personal Gmail).
  2. Every GitHub link on the page points to `github.com/Arthium-Org/stock-plan-companion-app`.
  3. The prominent GitHub CTA near the hero/register area is gone.
  4. A visitor scanning the page sees exactly one GitHub link, in the footer.

**Plans**: TBD
**UI hint**: yes

## Progress

**Execution Order:**
Phases execute in numeric order: 1 → 2 → 3

| Phase | Plans Complete | Status | Completed |
|-------|-----------------|--------|-----------|
| 1. Download Wiring & Release Config | 1/1 | Complete   | 2026-07-06 |
| 2. Registration Backend Migration | 2/2 | Complete   | 2026-07-06 |
| 3. Links, Contact & CTA Cleanup | 0/TBD | Not started | - |
