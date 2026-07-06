# Phase 3: Links, Contact & CTA Cleanup - Discussion Log

> **Audit trail only.** Do not use as input to planning, research, or execution agents.
> Decisions are captured in CONTEXT.md — this log preserves the alternatives considered.

**Date:** 2026-07-07
**Phase:** 3-Links, Contact & CTA Cleanup
**Areas discussed:** GitHub footprint, Open Source section, Repo URL source

---

## GitHub Footprint

The promoted dark page has 4 GitHub touchpoints (nav icon, hero CTA, Open Source section, footer) — more than the roadmap ("exactly one, in the footer") assumed.

| Option | Description | Selected |
|--------|-------------|----------|
| Strict: footer only | Remove nav icon, hero CTA, and entire Open Source section; footer link only | |
| Footer + subtle nav icon | Remove the two prominent CTAs; keep small top-right nav icon + footer | ✓ |
| Drop only prominent CTAs | Remove hero button + Open Source button; keep nav icon, Open Source text, footer | |

**User's choice:** Footer + subtle nav icon.
**Notes:** Keep the conventional top-right GitHub icon; remove the hero "View on GitHub" CTA and the Open Source section's competing button. Accepted as a deliberate softening of LINK-04's literal single-link wording (see CONTEXT D-05).

---

## Open Source Section

| Option | Description | Selected |
|--------|-------------|----------|
| Remove the whole section | Delete heading, blurb, and button | |
| Keep text, drop button | Keep heading + "contributions welcome" blurb; remove "Visit GitHub" button | ✓ |
| Keep section as-is (fix repo only) | Leave intact, just correct the URL | |

**User's choice:** Keep text, drop button.
**Notes:** This refines the GitHub-footprint answer — the Open Source section's *messaging* survives as a trust signal, but its button (a competing GitHub CTA) is removed.

---

## Repo URL Source

| Option | Description | Selected |
|--------|-------------|----------|
| Reference appRepo config | Build hrefs from the existing `appRepo` constant in `downloads.ts` | ✓ (after Q&A) |
| Hardcode corrected URL | Replace the wrong URL string inline at each link | |

**User's choice:** Reference `appRepo` config (selected after clarification).
**Notes:** User asked whether referencing config "works all the time" and what maintenance it needs. Clarified: on a static/prerendered site the constant is inlined into the built HTML at build time (no runtime cost, works identically to a literal URL), and it lowers maintenance — a repo rename edits one line and updates both download URLs and GitHub links together, preventing URL drift. Recommendation accepted.

---

## Claude's Discretion

- Exact markup mechanics of removing the hero CTA and Open Source button (wrapper/spacing cleanup so no empty flex gaps remain).
- Whether to consume `appRepo` directly or add a small derived `repoUrl` helper in `downloads.ts`.

## Deferred Ideas

None — discussion stayed within phase scope. Noted follow-up (not scope creep): a future docs edit could reword LINK-04 / Success Criterion 4 to "one footer link + subtle nav affordance" to match the promoted page.
