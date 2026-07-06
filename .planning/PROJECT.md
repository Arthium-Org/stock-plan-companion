# Stock Plan Companion — Marketing Site

## What This Is

The public marketing/landing site (arthium.org) for **Stock Plan Companion**, a downloadable desktop app that helps E*TRADE users prepare foreign-asset tax disclosures (India Schedule FA / ITR compliance). The site explains what the app does, shows blurred screenshots, surfaces relevant compliance news, and lets visitors register (email) to download the signed installer. It is a static SvelteKit site prerendered to GitHub Pages.

This milestone is a **launch-polish cycle**: wire up the real download, replace the registration backend so it scales past the free tier, and fix stale contact/repo links before going live.

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

### Active

<!-- This launch-polish milestone. -->

- [ ] Publish the signed macOS (arm64 / Apple Silicon) DMG as a GitHub Release and wire the post-registration download button to it
- [ ] Show Windows download as "coming soon" until the `.exe` is published (build in progress)
- [ ] Make download URLs a single per-release config update (fix the hardcoded "edit code every release" anti-pattern)
- [ ] Migrate registration from Formspree (50/mo cap) to a Google Apps Script endpoint writing to a Google Sheet (free, unlimited, owned data), keeping the current inline form UX
- [ ] Update contact email to `contact@arthium.org` (currently `kvakatidev@gmail.com`)
- [ ] Point all repository links to `Arthium-Org/stock-plan-companion-app` (currently `stock-plan-companion`)
- [ ] Remove the prominent GitHub CTA near Register/hero; keep a single quiet footer link
- [ ] Label the macOS button "macOS (Apple Silicon)" so Intel-Mac users aren't misled

### Out of Scope

- Hard-gating downloads behind registration (private releases / signed URLs) — repo is public, so releases stay reachable; the friction-only footer-link approach is accepted for launch
- Replacing the light landing site with the `/new-12345` dark theme — separate effort, not part of launch polish
- Building the Windows `.exe` itself — handled outside this site work; the site only needs to accommodate it
- Intel macOS build — only an arm64 DMG exists
- Analytics / error tracking (Sentry, GA, Plausible) — not required for launch

## Context

- Stack: SvelteKit 2.x + Svelte 5, Tailwind 3, Vite 7, `adapter-static`; Node 22+; deployed to GitHub Pages (CNAME → arthium.org). See `.planning/codebase/` for the full map.
- Registration currently POSTs to Formspree endpoint `https://formspree.io/f/xvzjdkaj` (`src/routes/+page.svelte:174`).
- Download links are hardcoded to `v1.0.0` on the wrong repo (`stock-plan-companion`) with a TODO to update every release (`src/routes/+page.svelte:185-190`).
- GitHub links appear in the header/nav (`:214`), hero ("Register & Download" adjacency), and footer (`:751`); contact email in footer (`:761`).
- The arm64 DMG will not run on Intel Macs — button labeling must set that expectation.
- Known pre-launch loose ends were already tracked (placeholder links/email/form endpoints) — this milestone closes them.

## Constraints

- **Tech stack**: Must stay a static, prerendered SvelteKit site (no server) — GitHub Pages has no backend, so the form backend must be a third-party HTTP endpoint (Google Apps Script) called client-side.
- **Distribution**: Installers delivered via GitHub Releases on the public `stock-plan-companion-app` repo.
- **Platform**: macOS build is Apple Silicon (arm64) only at launch; Windows pending.
- **Node**: 22+ required for local build (Node 18 breaks installs).

## Key Decisions

| Decision | Rationale | Outcome |
|----------|-----------|---------|
| Registration → Google Apps Script → Google Sheet | Free, unlimited submissions, owned data; keeps existing inline form (only the POST URL changes) vs Formspree's 50/mo cap | — Pending |
| Keep one footer GitHub link; drop prominent CTA | Public repo means downloads can't be truly gated; nudge users through registration without hiding the open-source repo entirely | — Pending |
| macOS now, Windows "coming soon" | Signed arm64 DMG ready; Windows `.exe` still building — avoid a broken link | — Pending |
| Download URL as one-line config | Fixes the "edit code + rebuild every release" anti-pattern flagged in codebase CONCERNS | — Pending |

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
*Last updated: 2026-07-06 after initialization*
