# Phase 3: Links, Contact & CTA Cleanup - Context

**Gathered:** 2026-07-07
**Status:** Ready for planning

<domain>
## Phase Boundary

Correct every outbound link and contact detail on the live `/` landing page so they point to production destinations, and remove the GitHub call-to-action that competes with registration. No new routes, no backend, no content restructuring beyond removing/keeping the specified GitHub touchpoints.

**Critical context for downstream agents:** The ROADMAP.md and REQUIREMENTS.md for this phase were written against the *old* light landing page. Since then, quick task `260707-05y` **promoted the dark-themed page (formerly `/new-12345`) to `/` and deleted `/new-12345`**. All work in this phase targets the current `src/routes/+page.svelte` (the promoted dark page), which has a **larger GitHub footprint** than the roadmap assumed (nav icon + hero CTA + dedicated Open Source section + footer). The decisions below reconcile the requirements with this current page.

</domain>

<decisions>
## Implementation Decisions

### GitHub Link Footprint (LINK-02, LINK-03, LINK-04)

The current page has **4 GitHub touchpoints**. Final disposition:

- **D-01:** Nav bar GitHub icon (`src/routes/+page.svelte:250`) — **KEEP**. It's a subtle, conventional top-right affordance, not a competing CTA. Fix its repo URL.
- **D-02:** Hero "View on GitHub" secondary CTA next to "Register & Download" (`~:303-311`) — **REMOVE**. This is the prominent CTA that competes with registration (LINK-03). Removing it leaves "Register & Download" as the sole hero CTA.
- **D-03:** Dedicated "Open source" section — **KEEP the heading + blurb** ("Open source" / "Stock Plan Companion is hosted on GitHub. Community contributions are welcome!", `~:663-668`) as an open-source trust signal, but **REMOVE the "Visit GitHub" button** (`~:669-677`) so it's not a second prominent GitHub CTA.
- **D-04:** Footer "GitHub" link (`~:799-802`) — **KEEP**. This is the single quiet footer link the requirements call for. Fix its repo URL.

- **D-05 (intentional deviation from LINK-04):** This leaves **two** GitHub links (nav icon + footer), not the literal "exactly one, in the footer" of LINK-04 / Success Criterion 4. This is a **conscious decision** for the promoted page: the nav icon is a standard, non-competing affordance and the user chose to keep it. Downstream verification should treat "one *prominent CTA* removed, GitHub no longer competes with registration" as the satisfied intent — not the literal single-link count. LINK-03 (remove prominent CTA) is fully satisfied; LINK-04 is satisfied in spirit (one footer link) with a deliberate subtle nav icon retained.

### Contact Email (LINK-01)
- **D-06:** Change footer Contact `mailto:kvakatidev@gmail.com` (`~:810`) to `mailto:contact@arthium.org`. Keep it a plain `mailto:` anchor (matches Success Criterion 1).

### Repo URL Source (LINK-02)
- **D-07:** The two retained GitHub links (nav icon, footer) must point to `github.com/Arthium-Org/stock-plan-companion-app`. **Wire them from the existing `appRepo` constant** in `src/lib/downloads.ts` (`appRepo = 'Arthium-Org/stock-plan-companion-app'`) rather than hardcoding the URL string. Import `appRepo` into `+page.svelte` and build hrefs as `` `https://github.com/${appRepo}` ``.
  - **Rationale:** Single source of truth (same config-driven pattern Phase 1 established for downloads). On a static/prerendered site the constant is inlined into the built HTML at build time — the emitted `<a href>` is a plain literal URL, no runtime cost, works identically to hardcoding. A future repo rename edits one line in `downloads.ts` and updates both download URLs and all GitHub links together, preventing the exact URL-drift that left the wrong repo in place here.

### Claude's Discretion
- Exact JSX/markup mechanics of removing the hero CTA and the Open Source button (spacing, wrapper cleanup so no empty flex gaps remain) are left to the planner/executor.
- Whether to expose `appRepo` as-is or add a small derived `repoUrl` helper in `downloads.ts` — implementer's choice, as long as the page consumes a shared constant rather than a hardcoded string.

</decisions>

<canonical_refs>
## Canonical References

**Downstream agents MUST read these before planning or implementing.**

### Requirements & Roadmap
- `.planning/REQUIREMENTS.md` §"Links & Contact" — LINK-01..LINK-04 definitions (note: written against the pre-promotion page).
- `.planning/ROADMAP.md` §"Phase 3" — goal + Success Criteria 1-4.

### Code touched by this phase
- `src/routes/+page.svelte` — the only page; all link/contact/CTA edits happen here. Relevant lines (approximate, verify before editing): nav GitHub icon 250, hero "View on GitHub" CTA 303-311, Open Source section 663-679, footer GitHub 799-802, footer Contact mailto 810.
- `src/lib/downloads.ts` — source of the `appRepo` constant to reuse for GitHub hrefs (line 15).
- `src/lib/downloads.test.ts` — references `appRepo`; confirms the constant is the established source of truth.

### Prior context (patterns to follow)
- `.planning/phases/01-download-wiring-release-config/01-CONTEXT.md` — established the config-driven-URL pattern (`appRepo`, `macDownloadUrl`) that D-07 reuses.

No external ADRs/specs — requirements fully captured in decisions above.

</canonical_refs>

<code_context>
## Existing Code Insights

### Reusable Assets
- `appRepo` constant (`src/lib/downloads.ts:15`) = `'Arthium-Org/stock-plan-companion-app'` — reuse for all GitHub hrefs (D-07).

### Established Patterns
- Config-driven URLs from Phase 1: download URLs are composed from `appRepo` rather than hardcoded. This phase extends the same pattern to GitHub view-source links.
- Single-file page: the promoted dark page is one component (`src/routes/+page.svelte`); `/new-12345` no longer exists. All edits are localized to this file (plus one import from `downloads.ts`).

### Integration Points
- `+page.svelte` imports from `$lib/downloads` (already imports download URLs); adding `appRepo` to that import is the connection point.

</code_context>

<specifics>
## Specific Ideas

- Keep the Open Source section's *messaging* but strip its button — the user wants the open-source trust signal to survive even though the competing CTA goes.
- Nav GitHub icon is explicitly desired as a "quiet, conventional" affordance — do not remove it despite the literal one-link requirement.

</specifics>

<deferred>
## Deferred Ideas

None — discussion stayed within phase scope.

**Follow-up worth noting (not scope creep):** ROADMAP.md Success Criterion 4 and LINK-04 ("exactly one GitHub link, in the footer") no longer literally match the promoted page. Per D-05 this is an accepted deviation for launch; a future roadmap/requirements edit could reword LINK-04 to "one footer link + subtle nav affordance" to keep docs in sync. Not required for this phase to ship.

</deferred>

---

*Phase: 3-Links, Contact & CTA Cleanup*
*Context gathered: 2026-07-07*
