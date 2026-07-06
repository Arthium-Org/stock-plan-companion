# Phase 3: Links, Contact & CTA Cleanup - Pattern Map

**Mapped:** 2026-07-07
**Files analyzed:** 2 (1 modified page, 1 existing config source — no new files)
**Analogs found:** 1 / 1 (in-file self-analog; this is a cleanup phase, not new-file creation)

## Line Number Verification

CONTEXT.md line numbers verified against current `src/routes/+page.svelte` (all approximate references confirmed accurate, no drift):

| CONTEXT.md ref | Actual location | Status |
|----------------|------------------|--------|
| Nav GitHub icon `:250` | `:249-257` (`<a href="https://github.com/Arthium-Org/stock-plan-companion" ...>`) | confirmed |
| Hero "View on GitHub" CTA `:303-311` | `:303-311` exact | confirmed |
| Open Source section `:663-679` | `:663-679` exact (heading `:665`, blurb `:666-668`, button `:669-677`) | confirmed |
| Footer GitHub `:799-802` | `:799-802` exact | confirmed |
| Footer Contact mailto `:810` | `:810` exact | confirmed |
| `appRepo` in `downloads.ts` | `:15` exact | confirmed |

Note: all 4 GitHub hrefs currently hardcode `https://github.com/Arthium-Org/stock-plan-companion` (missing the `-app` suffix — this is the wrong/stale repo URL LINK-02 must fix). The correct target per CONTEXT.md D-07 is `https://github.com/${appRepo}` → `https://github.com/Arthium-Org/stock-plan-companion-app`.

## File Classification

| File | Role | Data Flow | Nature of Change | Closest Analog |
|------|------|-----------|-------------------|----------------|
| `src/routes/+page.svelte` | component (page) | request-response (static prerendered markup) | edit existing hrefs/markup, remove 2 CTA blocks | itself — `macDownloadUrl` import/usage pattern (same file, lines 21 & 629) |
| `src/lib/downloads.ts` | config/utility | transform (compose URL string from constant) | read-only reuse, no edit needed | itself — `macDownloadUrl` composition (lines 15-18) |

No brand-new files are created in this phase; it is a targeted edit/cleanup phase. The "pattern to copy" is the **existing config-driven-URL composition pattern** already used for `macDownloadUrl`, extended to GitHub links.

## Pattern Assignments

### `src/routes/+page.svelte` (component, static markup edit)

**Analog (same file):** the existing `macDownloadUrl` import + usage — this IS the pattern to replicate for GitHub links.

**Import pattern to extend** (`src/routes/+page.svelte:21`):
```typescript
import { macDownloadUrl, windowsAvailable } from '$lib/downloads';
```
Add `appRepo` to this same import:
```typescript
import { appRepo, macDownloadUrl, windowsAvailable } from '$lib/downloads';
```

**Existing config-driven usage precedent** (`src/routes/+page.svelte:629`, comment above the download link):
```svelte
<!-- eslint-disable svelte/no-navigation-without-resolve -- macDownloadUrl is an external GitHub release URL, not an internal SvelteKit route, so resolve() does not apply -->
```
This shows the established convention: external URLs sourced from `$lib/downloads` constants are used directly as `href` values, with an eslint-disable comment when SvelteKit's `resolve()` link-checking would otherwise flag them. The same eslint-disable pattern likely applies to the three GitHub `<a href>` template-literal usages once they stop being literal strings (verify at execution time whether `no-navigation-without-resolve` fires on `` href={`https://github.com/${appRepo}`} `` the same way it did for `macDownloadUrl`).

**Target edit sites — current hardcoded hrefs to convert to `` `https://github.com/${appRepo}` ``:**

1. Nav GitHub icon (`:249-257`), KEEP, fix URL:
```svelte
<a
	href="https://github.com/Arthium-Org/stock-plan-companion"
	target="_blank"
	rel="noopener noreferrer"
	class="icon-btn"
	aria-label="GitHub"
>
	<Code2 size={18} />
</a>
```

2. Hero "View on GitHub" CTA (`:298-312`), REMOVE entirely (D-02) — keep only the `#register` primary CTA:
```svelte
<div class="flex flex-col gap-3 sm:flex-row sm:gap-4">
	<a href="#register" class="btn-primary">
		Register & Download
		<ArrowRight size={18} />
	</a>
	<a
		href="https://github.com/Arthium-Org/stock-plan-companion"
		target="_blank"
		rel="noopener noreferrer"
		class="btn-secondary"
	>
		<Code2 size={18} />
		View on GitHub
	</a>
</div>
```
After removal, `Code2` import (`:15`) may become unused in this block but is still used by the nav icon (kept) and (if kept) Open Source heading icon — verify `Code2` remains referenced elsewhere before considering removing the import.

3. Open Source section (`:663-679`) — KEEP heading + blurb, REMOVE button only (D-03):
```svelte
<section>
	<div class="text-center">
		<h2 class="mb-4 text-3xl font-bold tracking-tight t-strong sm:text-4xl">Open source</h2>
		<p class="mx-auto mb-8 max-w-lg text-lg t-muted">
			Stock Plan Companion is hosted on GitHub. Community contributions are welcome!
		</p>
		<a
			href="https://github.com/Arthium-Org/stock-plan-companion"
			target="_blank"
			rel="noopener noreferrer"
			class="btn-primary"
		>
			<Code2 size={18} />
			Visit GitHub
		</a>
	</div>
</section>
```
Keep `<h2>` + `<p>`; delete the `<a>` button block (`:669-677`). Watch for the resulting empty vertical gap under the blurb — `mb-8` on the `<p>` was sized to separate it from the button; consider whether that margin should be reduced since nothing follows it now (Claude's Discretion per CONTEXT.md).

4. Footer GitHub link (`:799-803`), KEEP, fix URL:
```svelte
<li>
	<a
		href="https://github.com/Arthium-Org/stock-plan-companion"
		class="text-sm t-muted transition hover:t-accent">GitHub</a
	>
</li>
```

5. Footer Contact mailto (`:810`), change address only (D-06):
```svelte
<a href="mailto:kvakatidev@gmail.com" class="text-sm t-muted transition hover:t-accent"
	>Contact</a
>
```
→ becomes `mailto:contact@arthium.org` (same anchor structure, no other change).

**Error handling:** N/A — static markup edits, no runtime error paths. No form/fetch logic touched in this phase.

**Validation:** N/A — no user input on these elements.

---

### `src/lib/downloads.ts` (config, read-only reuse)

**Analog:** self — the file's own established pattern for composing derived URLs from `appRepo`.

**Core config pattern** (`src/lib/downloads.ts:15-18`):
```typescript
export const appRepo = 'Arthium-Org/stock-plan-companion-app';
export const macAssetName = 'StockPlanCompanion-arm64.dmg';

export const macDownloadUrl = `https://github.com/${appRepo}/releases/latest/download/${macAssetName}`;
```

This shows the exact template-literal composition style to replicate inline in `+page.svelte` for GitHub links: `` `https://github.com/${appRepo}` ``. Per CONTEXT.md "Claude's Discretion," the implementer may either:
- (a) build the href inline in the page template as `` href={`https://github.com/${appRepo}`} ``, or
- (b) add a derived `export const repoUrl = \`https://github.com/${appRepo}\`;` to `downloads.ts` and import `repoUrl` directly.

Option (b) more closely matches the file's existing single-responsibility style (all derived URLs live in `downloads.ts`, not composed ad hoc in the page) and avoids repeating the template literal 3 times in `+page.svelte`. No file edit to `downloads.ts` is strictly required by CONTEXT.md, but this is the natural analog if the implementer chooses to add `repoUrl`.

No changes needed to `macAssetName`, `macDownloadUrl`, or `windowsAvailable` — untouched by this phase.

---

## Shared Patterns

### Config-driven URL composition (Phase 1 pattern, extended here)
**Source:** `src/lib/downloads.ts:15-18`
**Apply to:** All GitHub href sites in `src/routes/+page.svelte` (nav icon, footer link, and the removed-but-verify-cleanup CTA sites)
```typescript
export const appRepo = 'Arthium-Org/stock-plan-companion-app';
// ...
export const macDownloadUrl = `https://github.com/${appRepo}/releases/latest/download/${macAssetName}`;
```
Rationale restated from CONTEXT.md D-07: single source of truth: a future repo rename only requires editing `downloads.ts`.

### External-link eslint-disable convention
**Source:** `src/routes/+page.svelte:629`
**Apply to:** Any GitHub `<a href>` built from a non-literal expression (template literal referencing `appRepo`), if `svelte/no-navigation-without-resolve` fires on it the same way it fires on `macDownloadUrl`.
```svelte
<!-- eslint-disable svelte/no-navigation-without-resolve -- external URL, not an internal SvelteKit route, so resolve() does not apply -->
```

## No Analog Found

None — this phase only touches one existing file plus reads one existing config file. No new files, no missing analogs.

## Metadata

**Analog search scope:** `src/routes/+page.svelte`, `src/lib/downloads.ts` (both already known from CONTEXT.md; no broader codebase search needed given phase's narrow, single-file-edit scope)
**Files scanned:** 2
**Pattern extraction date:** 2026-07-07
</content>
