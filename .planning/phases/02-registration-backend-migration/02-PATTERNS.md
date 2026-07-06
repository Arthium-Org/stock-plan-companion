# Phase 2: Registration Backend Migration - Pattern Map

**Mapped:** 2026-07-06
**Files analyzed:** 3 (2 modified route handlers, 1 modified/extended config module) + 1 optional test file
**Analogs found:** 3 / 3 (all analogs are in-repo siblings/predecessors of the files being edited — this phase is a self-referential edit, not a greenfield addition)

## File Classification

| New/Modified File | Role | Data Flow | Closest Analog | Match Quality |
|---|---|---|---|---|
| `src/routes/+page.svelte` (`handleFormSubmit`, lines 163-190) | component (event handler) | request-response | itself (pre-edit version) / `src/routes/new-12345/+page.svelte:191-223` | exact (identical shape, sibling route) |
| `src/routes/new-12345/+page.svelte` (`handleFormSubmit`, lines 191-223) | component (event handler) | request-response | `src/routes/+page.svelte:163-190` | exact (identical shape, sibling route) |
| `src/lib/downloads.ts` (extend, or new sibling `src/lib/registration.ts`) | config | transform (constant derivation) | `src/lib/downloads.ts` itself (Phase 1 pattern) | exact |
| `src/lib/registration.test.ts` (new, optional) | test | transform | `src/lib/downloads.test.ts` | exact |

Both route handlers are edited in place — there is no "new" role/data-flow category to search the broader codebase for; the two Formspree handlers are each other's best analog, confirming the pattern is already consistent project-wide. The config module is likewise best modeled on its own Phase-1 predecessor.

## Pattern Assignments

### `src/routes/+page.svelte` — `handleFormSubmit` (lines 163-190) (component event handler, request-response)

**Analog:** itself (current Formspree version) + `src/routes/new-12345/+page.svelte:191-223` (sibling, near-identical)

**Current state machine to preserve exactly** (lines 163-189):
```typescript
async function handleFormSubmit(e: Event) {
	const form = e.target as HTMLFormElement;
	const formData = new FormData(form);

	formLoading = true;
	formError = '';

	try {
		const response = await fetch('https://formspree.io/f/xvzjdkaj', {
			method: 'POST',
			body: formData,
			headers: {
				Accept: 'application/json'
			}
		});

		if (response.ok) {
			formSubmitted = true;
			form.reset();
		} else {
			formError = 'Failed to submit form. Please try again.';
		}
	} catch (error) {
		formError = 'An error occurred. Please try again.';
	} finally {
		formLoading = false;
	}
}
```

**What changes (per CONTEXT.md D-01/D-03/D-04/D-09, RESEARCH.md Code Examples):**
- URL: `'https://formspree.io/f/xvzjdkaj'` → imported `appsScriptUrl` (or equivalent name) from `$lib/downloads` (or a sibling config module).
- `headers`: `{ Accept: 'application/json' }` → `{ 'Content-Type': 'text/plain;charset=utf-8' }` (CORS simple-request requirement — do not add `Accept` back, do not use `application/json`).
- `body`: raw `formData` → `JSON.stringify({ name, email, consent, source })` built from `formData.get(...)` reads.
- Success check: `response.ok` alone → `response.ok && result.result === 'success'` where `result` comes from a `try { await response.json() } catch { result = {} }` guard (Pitfall 4 — a non-JSON error page must not throw an unhandled rejection).
- **Unchanged:** `formLoading`/`formError` toggling, `try/catch/finally` shape, `form.reset()` only on the success branch (preserves D-04's "don't clear email on failure"), the surrounding `{#if !formSubmitted}` / button markup at lines 546-582.

**Import pattern to add** (matches Phase-1 `$lib` import convention used elsewhere in this file — see `src/lib/downloads.ts` consumers):
```typescript
import { appsScriptUrl } from '$lib/downloads'; // or sibling module per D-09 discretion
```

**Route-specific value:** `source: '/'` (this route is the live landing page — distinguishes rows per D-05).

---

### `src/routes/new-12345/+page.svelte` — `handleFormSubmit` (lines 191-223) (component event handler, request-response)

**Analog:** `src/routes/+page.svelte:163-190` (near-identical sibling — same edit applies)

**Current state** (lines 191-222), note the extra `downloadLinks` assignment inside the success branch that is **out of scope** for this phase (Phase 1 territory, must remain untouched):
```typescript
async function handleFormSubmit(e: Event) {
	const form = e.target as HTMLFormElement;
	const formData = new FormData(form);

	formLoading = true;
	formError = '';

	try {
		const response = await fetch('https://formspree.io/f/xvzjdkaj', {
			method: 'POST',
			body: formData,
			headers: {
				Accept: 'application/json'
			}
		});

		if (response.ok) {
			formSubmitted = true;
			form.reset();
			// TODO: update these direct-download URLs on EVERY release (new tag + filename).
			downloadLinks = {
				mac: 'https://github.com/Arthium-Org/stock-plan-companion/releases/download/v1.0.0/StockPlanCompanion-1.0.0.dmg',
				windows: 'https://github.com/Arthium-Org/stock-plan-companion/releases/download/v1.0.0/StockPlanCompanion-1.0.0.exe'
			};
		} else {
			formError = 'Failed to submit form. Please try again.';
		}
	} catch (error) {
		formError = 'An error occurred. Please try again.';
	} finally {
		formLoading = false;
	}
}
```

**Same edit as `+page.svelte`** applies to the `fetch(...)` call, headers, body, and success/error branching. **Do not touch** the `downloadLinks = {...}` assignment — it stays inside the (now Apps-Script-driven) success branch exactly as-is; only the condition that gates entry into that branch changes (from `response.ok` alone to `response.ok && result.result === 'success'`).

**Route-specific value:** `source: '/new-12345'` (distinguishes prototype-route rows per D-05).

---

### `src/lib/downloads.ts` (or new sibling `src/lib/registration.ts`) (config, transform)

**Analog:** `src/lib/downloads.ts` (Phase 1's own pattern — single-purpose exported constants with an explanatory header comment)

**Full current file** (16 lines, reproduced in full — small enough for one read):
```typescript
// Single source of truth for the download links shown on the marketing site.
//
// Release-process invariant (D-04): every GitHub Release published to
// `appRepo` MUST attach the macOS DMG under the stable, version-less name
// below (`macAssetName`). GitHub's "latest release" URL only resolves to a
// fixed filename — if a release ships the asset under a versioned name
// instead (e.g. `StockPlanCompanion-1.2.0-arm64.dmg`), this link breaks for
// every visitor until the next release corrects it. Do not pin a version tag
// here; that reintroduces the "edit code every release" anti-pattern this
// module exists to remove.
//
// macDownloadUrl resolves to:
// https://github.com/Arthium-Org/stock-plan-companion-app/releases/latest/download/StockPlanCompanion-arm64.dmg

export const appRepo = 'Arthium-Org/stock-plan-companion-app';
export const macAssetName = 'StockPlanCompanion-arm64.dmg';

export const macDownloadUrl = `https://github.com/${appRepo}/releases/latest/download/${macAssetName}`;

export const windowsAvailable = false;
```

**Pattern to replicate for the new export:**
- A brief explanatory comment block above the constant(s) documenting *why* the value lives here and any invariant the deploying human must maintain (mirrors D-10's "edit existing deployment, don't create a new one" caveat — worth noting inline since it's a similarly easy-to-violate invariant).
- A single `export const` per concern, plain string values, no runtime logic, no framework imports — this file has zero dependencies, keep it that way.
- Naming convention: camelCase (`appRepo`, `macAssetName`, `macDownloadUrl`) — so the new export should follow suit, e.g. `export const appsScriptUrl = '...';`.
- Per D-09, either extend this file directly or add a sibling file in `src/lib/` (e.g. `registration.ts`) following the identical single-purpose-constants shape; both routes import from wherever it lands.

**`src/lib/index.ts` note:** currently a placeholder comment only (`// place files you want to import through the $lib alias in this folder.`) — no barrel-export pattern exists yet. Both `downloads.ts` and any new registration config module are imported directly by path (`$lib/downloads`), not through a barrel. Do not introduce a barrel export unless explicitly asked.

---

### `src/lib/registration.test.ts` (new, optional) (test, transform)

**Analog:** `src/lib/downloads.test.ts` (full file, 19 lines, reproduced below)

```typescript
import { describe, it, expect } from 'vitest';
import { macDownloadUrl, windowsAvailable } from '$lib/downloads';

describe('downloads config', () => {
	it('resolves the macOS download to the exact latest-release asset URL', () => {
		expect(macDownloadUrl).toBe(
			'https://github.com/Arthium-Org/stock-plan-companion-app/releases/latest/download/StockPlanCompanion-arm64.dmg'
		);
	});

	it('marks Windows as unavailable', () => {
		expect(windowsAvailable).toBe(false);
	});

	it('uses the version-less latest-release path on the app repo', () => {
		expect(macDownloadUrl).toContain('releases/latest/download/');
		expect(macDownloadUrl).toContain('stock-plan-companion-app');
	});
});
```

**Pattern to replicate:** `describe` block named after the config concern, `vitest` imports only (`describe`, `it`, `expect`), import the constant(s) via the `$lib/...` alias (matches project convention, not a relative path), one `it` per invariant being asserted (exact value match + substring/shape assertions) — e.g. for `appsScriptUrl`: assert it's a non-empty string, assert it matches the expected `https://script.google.com/macros/s/.../exec` shape (or whatever placeholder format D-10 dictates), assert it does NOT reference `formspree.io` anywhere in the codebase (regression guard for D-01's "Formspree removed entirely").

## Shared Patterns

### Form submission state machine (formLoading / formError / formSubmitted)
**Source:** `src/routes/+page.svelte:163-189` and `src/routes/new-12345/+page.svelte:191-223` (identical shape in both)
**Apply to:** Both edited `handleFormSubmit` functions — this shape is NOT changed by this phase, only what's inside the `try` block's `fetch` call and success condition.
```typescript
formLoading = true;
formError = '';
try {
	// ... fetch + response handling changes here ...
} catch (error) {
	formError = 'An error occurred. Please try again.';
} finally {
	formLoading = false;
}
```

### CORS-safe request construction (new pattern introduced this phase, not yet in codebase)
**Source:** RESEARCH.md Pattern 1 / Code Examples (no in-repo analog exists yet — this is genuinely new to the codebase)
**Apply to:** Both route handlers' `fetch(...)` call
```typescript
const response = await fetch(appsScriptUrl, {
	method: 'POST',
	headers: { 'Content-Type': 'text/plain;charset=utf-8' },
	body: JSON.stringify({ name, email, consent, source })
});
let result: { result?: string; message?: string } = {};
try {
	result = await response.json();
} catch {
	// non-JSON body (platform error page) — falls through to the error branch below
}
if (response.ok && result.result === 'success') {
	formSubmitted = true;
	form.reset();
} else {
	formError = 'Failed to submit form. Please try again.';
}
```

### `$lib/` config module import convention
**Source:** `src/lib/downloads.ts` + its usage pattern (Phase 1)
**Apply to:** Both route handlers, importing the new endpoint constant
```typescript
import { appsScriptUrl } from '$lib/downloads'; // or sibling module path
```

## No Analog Found

None — every file in scope has a strong in-repo analog (largely because two of the three files are direct edits of existing code, and the third extends its own immediate predecessor). The only genuinely new code is the CORS-safe fetch body/header construction, which has no in-repo precedent (documented above under Shared Patterns, sourced from RESEARCH.md instead).

## Metadata

**Analog search scope:** `src/routes/+page.svelte`, `src/routes/new-12345/+page.svelte`, `src/lib/downloads.ts`, `src/lib/downloads.test.ts`, `src/lib/index.ts`
**Files scanned:** 5
**Pattern extraction date:** 2026-07-06
