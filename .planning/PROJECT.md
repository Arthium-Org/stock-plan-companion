# Stock Plan Companion — Marketing Site

## What This Is

The public marketing/landing site (arthium.org) for **Stock Plan Companion**, a downloadable desktop app that helps E*TRADE users prepare foreign-asset tax disclosures (India Schedule FA / ITR compliance). The site explains what the app does, shows blurred screenshots, surfaces relevant compliance news, and lets visitors register (email) to download the signed installer. It is a static SvelteKit site prerendered to GitHub Pages.

**Shipped v1.0 (Launch Polish, 2026-07-07):** the site is live at arthium.org with real config-driven downloads (macOS arm64 + Windows), an uncapped Google Apps Script → Google Sheet registration backend, and corrected production contact/repo links.

## Core Value

A visitor can understand what the app does and download the **correct, working build** after registering — with every registration **reliably captured** (no monthly submission cap).

## Business Context

- **Customer**: E*TRADE users with foreign stock/RSU holdings who must file India Schedule FA disclosures
- **Revenue model**: Free download; the site is lead-gen — registration email capture is the conversion event
- **Success metric**: Registrations captured and installer downloads at launch
- **Strategy notes**: App repo is public (`Arthium-Org/stock-plan-companion-app`); downloads are distributed via GitHub Releases

## Requirements

### Validated

<!-- Inferred from existing code (brownfield). Shipped and working. -->

- ✓ Static SvelteKit site prerendered to GitHub Pages at arthium.org — existing
- ✓ Landing page: hero, feature cards (with highlighted "Sell Advisor"), how-it-works — existing
- ✓ Screenshot gallery with blurred sensitive regions (`BlurredScreenshot`) — existing
- ✓ Compliance news ticker (auto-scroll on desktop, pause on hover) — existing
- ✓ Email registration form that reveals download links on submit — existing
- ✓ Dark-theme UI prototype at `/new-12345` — existing

- ✓ Config-driven macOS (Apple Silicon) download via GitHub's version-less latest-release URL — v1.0 (DL-01, DL-02, DL-04)
- ✓ macOS button labeled "macOS (Apple Silicon)" with Intel-unsupported tooltip — v1.0 (DL-01)
- ✓ Windows download wired to a live GitHub Release asset — v1.0 (enabled during Phase 03, superseding the original "coming soon" placeholder; DL-03 → DL-05)
- ✓ Registration migrated from Formspree to Google Apps Script → Google Sheet, uncapped, existing inline UX preserved — v1.0 (REG-01–04, verified live end-to-end)
- ✓ Contact email → `contact@arthium.org`; all repo links → `Arthium-Org/stock-plan-companion-app`; single quiet footer GitHub link (duplicate CTAs removed) — v1.0 (LINK-01–04)
- ✓ Dark-themed landing page promoted to `/`, `/new-12345` prototype removed — v1.0 (quick task)
- ✓ Project logo/favicon branding (transparent circular PNGs) replacing placeholder Svelte assets — v1.0 (Phase 03)

### Active

<!-- Next milestone — none committed yet. Candidates below (see v2 requirements in the archived REQUIREMENTS). -->

- [ ] Automated confirmation email to registrants (REG-05)

### Out of Scope

- Hard-gating downloads behind registration (private releases / signed URLs) — repo is public, so releases stay reachable; the friction-only footer-link approach is accepted
- Intel macOS build — only an arm64 DMG exists
- Analytics / error tracking (Sentry, GA, Plausible) — not required at launch

## Context

- Stack: SvelteKit 2.x + Svelte 5, Tailwind 3, Vite 7, `adapter-static`; Node 22+; deployed to GitHub Pages (CNAME → arthium.org) via `deploy.yml`. See `.planning/codebase/` for the full map.
- **Shipped v1.0 live** (2026-07-07): the dark-themed landing page at `/` is the production site; the `/new-12345` prototype was removed.
- Registration POSTs to the deployed Google Apps Script Web App (owned Google Sheet, uncapped), replacing Formspree — verified capturing rows live end-to-end.
- Download URLs live in a single config module (`src/lib/downloads.ts`): macOS arm64 DMG and the Windows installer both resolve via GitHub's version-less `releases/latest/download/` pattern on `Arthium-Org/stock-plan-companion-app`. New releases need only a stable asset filename — no code edit.
- Known tech debt: Phase 01's 3 human visual checks were deferred at close (superseded by Phase 03's Windows enablement — worth a one-time eyeball on the live site). The arm64 DMG still won't run on Intel Macs (conveyed via tooltip only).

## Constraints

- **Tech stack**: Must stay a static, prerendered SvelteKit site (no server) — GitHub Pages has no backend, so the form backend must be a third-party HTTP endpoint (Google Apps Script) called client-side.
- **Distribution**: Installers delivered via GitHub Releases on the public `stock-plan-companion-app` repo.
- **Platform**: macOS build is Apple Silicon (arm64) only; Windows installer is now wired (enabled during Phase 03). Intel macOS unsupported.
- **Node**: 22+ required for local build (Node 18 breaks installs).

## Key Decisions

| Decision | Rationale | Outcome |
|----------|-----------|---------|
| Registration → Google Apps Script → Google Sheet | Free, unlimited submissions, owned data; keeps existing inline form (only the POST URL changes) vs Formspree's 50/mo cap | ✓ Good — v1.0, verified capturing rows live |
| Keep one footer GitHub link; drop prominent CTA | Public repo means downloads can't be truly gated; nudge users through registration without hiding the open-source repo entirely | ✓ Good — v1.0 |
| macOS now, Windows "coming soon" | Signed arm64 DMG ready; Windows `.exe` still building — avoid a broken link | ⚠️ Superseded — Windows installer wired live during Phase 03; no longer "coming soon" |
| Download URL as one-line config | Fixes the "edit code + rebuild every release" anti-pattern flagged in codebase CONCERNS | ✓ Good — v1.0 (`src/lib/downloads.ts`) |
| Promote dark landing page to `/`; remove `/new-12345` | Ship the polished dark theme as production; drop the throwaway prototype route | ✓ Good — v1.0 (quick task) |

## Evolution

This document evolves at phase transitions and milestone boundaries.

**After each phase transition** (via `/gsd-transition`):
1. Requirements invalidated? → Move to Out of Scope with reason
2. Requirements validated? → Move to Validated with phase reference
3. New requirements emerged? → Add to Active
4. Decisions to log? → Add to Key Decisions
5. "What This Is" still accurate? → Update if drifted

**After each milestone** (via `/gsd-complete-milestone`):
1. Full review of all sections
2. Core Value check — still the right priority?
3. Audit Out of Scope — reasons still valid?
4. Update Context with current state

---
*Last updated: 2026-07-07 after v1.0 milestone*
