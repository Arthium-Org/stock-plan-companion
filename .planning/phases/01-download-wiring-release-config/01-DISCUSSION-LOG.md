# Phase 1: Download Wiring & Release Config - Discussion Log

> **Audit trail only.** Do not use as input to planning, research, or execution agents.
> Decisions are captured in CONTEXT.md — this log preserves the alternatives considered.

**Date:** 2026-07-06
**Phase:** 1-Download Wiring & Release Config
**Areas discussed:** Config strategy, Windows "coming soon", Intel-Mac expectation, Version visibility

---

## Config Strategy

| Option | Description | Selected |
|--------|-------------|----------|
| A: tag + filename config | Config holds release tag + filename; code builds the URL. Edit one line per release. | |
| B: GitHub /releases/latest/download/ magic URL | Always resolves to newest release with no tag bump. Zero-edit IF the DMG filename is version-less. | ✓ |

**User's choice:** Option B — "If that is norm, i prefer that."
**Notes:** Follow-up on filename convention → user chose a **version-less** asset name (e.g. `StockPlanCompanion.dmg`), making the config truly zero-edit. Flagged as a release-process requirement for the app repo.

### Follow-up: DMG filename convention

| Option | Description | Selected |
|--------|-------------|----------|
| Version-less | Stable name every release (e.g. StockPlanCompanion.dmg) → truly zero-edit with /latest/. | ✓ |
| Versioned | Filename embeds version → still one filename edit per release. | |
| Not sure yet | Capture version-less as target, flag for researcher to verify. | |

**User's choice:** Version-less (recommended).

---

## Windows "Coming Soon"

| Option | Description | Selected |
|--------|-------------|----------|
| Disabled grey button | Visible but non-interactive "Windows (coming soon)" button. | ✓ |
| Text note | Small text line instead of a button. | |
| Badge | Badge/pill indicator. | |

**User's choice:** "Disabled grey button for now."
**Notes:** Real `.exe` wiring deferred to v2 (DL-05).

---

## Intel-Mac Expectation

| Option | Description | Selected |
|--------|-------------|----------|
| Label is enough | Rely on "macOS (Apple Silicon)" button label alone. | |
| Add a helper line | Always-visible line clarifying Apple Silicon required / Intel unsupported. | |
| Tooltip | Communicate the requirement via a hover tooltip on the button. | ✓ |

**User's choice:** "helper line as a tool tip?" → deliver the Intel expectation as a **tooltip** on the macOS button. Label stays locked to "macOS (Apple Silicon)".

---

## Version Visibility

| Option | Description | Selected |
|--------|-------------|----------|
| Show version | Surface version number near the download (e.g. "— v1.0.0"). | |
| Keep hidden | No version shown; keep the download area clean. | ✓ |

**User's choice:** "Let download area stay clean."

---

## Claude's Discretion

- Exact config module filename/location and shape (object vs constants).
- Precise Svelte markup/styling for the disabled Windows button and the tooltip, reusing existing `.btn-secondary` / Tailwind patterns.

## Deferred Ideas

- Windows `.exe` download wiring — v2 (DL-05).
- Surfacing version number / changelog in the download area — declined for launch.
