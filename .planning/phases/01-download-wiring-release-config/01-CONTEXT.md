# Phase 1: Download Wiring & Release Config - Context

**Gathered:** 2026-07-06
**Status:** Ready for planning

<domain>
## Phase Boundary

Wire the post-registration download to the correct, versioned GitHub Release asset on the right repo (`Arthium-Org/stock-plan-companion-app`), move the release URL into a single config location, present the Windows download as a safe "coming soon" state, and label the macOS button so Intel-Mac users aren't misled.

Scope is limited to `src/routes/+page.svelte` and a new config module. No new routes, no backend, no framework changes. Covers requirements DL-01, DL-02, DL-03, DL-04.

</domain>

<decisions>
## Implementation Decisions

### Config Strategy (DL-02, DL-04)
- **D-01:** Use GitHub's "latest release" magic URL — `https://github.com/Arthium-Org/stock-plan-companion-app/releases/latest/download/<filename>` — which always resolves to the newest published release without a tag bump.
- **D-02:** The DMG asset is uploaded to each GitHub Release under a **stable, version-less filename** (e.g. `StockPlanCompanion.dmg`). Combined with D-01, this makes the download **truly zero-edit** — the config never changes between releases.
- **D-03:** Release URL(s) live in a **single config module** (e.g. `src/lib/config.ts` or `src/lib/downloads.ts`), holding the repo owner/name and the asset filename. `+page.svelte` imports from it — no download URLs hardcoded in the form handler. This replaces the current pattern where `downloadLinks` is set to hardcoded `v1.0.0` URLs inside `handleFormSubmit`.
- **D-04:** **Release-process requirement (for the app repo, not this site):** every release MUST attach the macOS DMG under the agreed stable version-less name. If a release ships a versioned filename instead, the download breaks. Capture this as an explicit note/README so the invariant survives.

### Windows "Coming Soon" (DL-03)
- **D-05:** Render a **disabled / greyed-out button** labeled "Windows (coming soon)" — visible but non-interactive (no `href`, no navigation, no 404). Replaces the currently commented-out Windows `<a>`. Wiring the real `.exe` is deferred to v2 (DL-05).

### macOS Button & Intel Expectation (DL-01)
- **D-06:** Button label is locked to **"macOS (Apple Silicon)"** (from ROADMAP.md / DL-01).
- **D-07:** Set the Intel expectation via a **tooltip** on the macOS button (e.g. a `title` attribute or hover tooltip) clarifying that Apple Silicon (M-series) is required and Intel Macs are not supported. No always-visible helper line — keeps the download area clean.

### Version Visibility
- **D-08:** Do **not** surface the version number to visitors. Keep the download area clean (consistent with the zero-edit, latest-release model where a pinned version number would be misleading anyway).

### Claude's Discretion
- Exact config module filename/location and its shape (object vs constants), and the precise Svelte markup/styling for the disabled Windows button and the tooltip, are left to research/planning — as long as the decisions above hold.

</decisions>

<canonical_refs>
## Canonical References

**Downstream agents MUST read these before planning or implementing.**

### Requirements & Roadmap
- `.planning/REQUIREMENTS.md` §Downloads — DL-01…DL-04 (v1), DL-05 (v2, deferred Windows wiring)
- `.planning/ROADMAP.md` §"Phase 1: Download Wiring & Release Config" — goal + 4 success criteria
- `.planning/PROJECT.md` §Key Decisions — locks config-driven URLs, macOS-now/Windows-soon, correct repo

### Codebase Map
- `.planning/codebase/CONCERNS.md` — documents the hardcoded-download-link anti-pattern this phase fixes
- `.planning/codebase/INTEGRATIONS.md` — external integration surface (GitHub Releases, form endpoint)
- `.planning/codebase/CONVENTIONS.md` — naming/style conventions to match in the new config module

No external ADRs/specs beyond the planning docs above — requirements are fully captured in the decisions here.

</canonical_refs>

<code_context>
## Existing Code Insights

### Reusable Assets
- `src/routes/+page.svelte:604` — existing macOS download `<a>` (currently `href={downloadLinks.mac}`, label "Download for macOS"). Relabel to "macOS (Apple Silicon)" and point at the config-derived URL.
- `src/routes/+page.svelte:607-611` — commented-out Windows `<a>` block; replace with the disabled "coming soon" button.
- `src/lib/index.ts` — existing barrel; new config module can live alongside `BlurredScreenshot.svelte` in `src/lib/`.

### Established Patterns
- `downloadLinks` reactive state initialized to `{ mac: '#', windows: '#' }` (`+page.svelte:68-71`) and reassigned on submit (`:187-190`). New approach: import URLs from config instead of assigning literals in the handler.
- Tailwind + `@apply` component classes (`.btn-secondary`) in `src/app.css` — the Windows disabled state and macOS button should reuse/extend these, not introduce new one-off styles.
- Tabs, single quotes, no trailing commas, 100-col (Prettier); camelCase functions, `handle`-prefixed handlers.

### Integration Points
- The download reveal is gated behind successful registration (`formSubmitted`), inside the success block at `+page.svelte:595-620`. This phase changes the *URLs/labels/Windows state* there, not the reveal mechanism (that's Phase 2's form backend).
- **Wrong-repo bug to fix:** current URLs point to `Arthium-Org/stock-plan-companion` (missing `-app`) at `:188-189`, `:214`, `:633`, `:751`. Phase 1 owns the download URL; the header/footer GitHub links are Phase 3's LINK-02 sweep — but note the shared repo-name correction so the phases stay consistent.

</code_context>

<specifics>
## Specific Ideas

- Canonical download URL shape: `https://github.com/Arthium-Org/stock-plan-companion-app/releases/latest/download/StockPlanCompanion.dmg` (exact asset filename to be confirmed against the first real release).
- Intel expectation delivered as a hover tooltip, not body text.

</specifics>

<deferred>
## Deferred Ideas

- **Windows `.exe` download wiring** — deferred to v2 (DL-05). Phase 1 only shows the disabled placeholder.
- **Surfacing version number / changelog** in the download area — explicitly declined for launch (D-08).

None of the discussion strayed outside phase scope beyond these already-deferred items.

</deferred>

---

*Phase: 1-Download Wiring & Release Config*
*Context gathered: 2026-07-06*
