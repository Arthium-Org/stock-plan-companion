# Milestones

## v1.0 Launch Polish (Shipped: 2026-07-06)

**Phases completed:** 3 phases, 4 plans, 10 tasks

**Key accomplishments:**

- Config-driven macOS (Apple Silicon) download via GitHub's version-less latest-release URL, with a disabled non-navigating Windows "coming soon" button, replacing the hardcoded wrong-repo v1.0.0 links.
- Both registration forms now POST to the deployed Google Apps Script Web App as CORS "simple requests," replacing Formspree entirely, with success/failure gated on a readable `{ok:true}` response body.
- Live end-to-end verification confirms the Google Apps Script registration backend captures rows on both routes with no cap, and Assumption A2 (readable `/exec` redirect body) holds against the real deployment.
- Corrected GitHub/Contact links via a shared repoUrl constant, removed two competing GitHub CTAs, and — as user-directed additions during checkpoint review — enabled the Windows installer download and replaced the placeholder Svelte branding with the project's transparent circular logo/favicon.

**Closeout:** override_closeout — all 12 v1 requirements complete. Known verification overrides: 1 (Phase 01 human visual checks, superseded by Phase 03 Windows enablement; see STATE.md Deferred Items).

**Delivered:** Took the arthium.org marketing site from demo-ready to launch-ready — real config-driven downloads, an uncapped owned-data registration backend, and corrected production links — then shipped it live to GitHub Pages.

**Stats:** 3 phases · 4 plans · 10 tasks · 8 `feat(` commits · timeline 2026-07-03 → 2026-07-07.

---
