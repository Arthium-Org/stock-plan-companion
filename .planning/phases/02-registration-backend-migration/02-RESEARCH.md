# Phase 2: Registration Backend Migration - Research

**Researched:** 2026-07-06
**Domain:** Client-side form submission to a Google Apps Script Web App (CORS "simple request" mechanics, Apps Script `doPost` + Google Sheets)
**Confidence:** MEDIUM (no official Context7/MCP docs source available this session; findings cross-checked across multiple independent sources — see Sources)

<user_constraints>
## User Constraints (from CONTEXT.md)

### Locked Decisions

- **D-01:** Registration POSTs to a **Google Apps Script Web App URL**. The script appends a row to a Google Sheet. Formspree is removed entirely — no dual-write, no fallback (hard cutover, per roadmap).
- **D-02:** The site code only ever holds the **Web App URL**. Which Sheet is written to is encapsulated inside the Apps Script (container-bound via `SpreadsheetApp.getActiveSpreadsheet()`, or standalone via `SpreadsheetApp.openById(...)`). The frontend has **no** reference to the Sheet itself.
- **D-03:** Use **robust detection**, not fire-and-forget. POST as a CORS **"simple request"** — `Content-Type: text/plain;charset=utf-8` with a JSON string (or form-encoded) body — so **no preflight** is triggered and the browser **can read** the Apps Script response.
- **D-04:** Because the response is readable, both **network errors** (fetch throws) and **server/script errors** (non-OK / error payload) surface as an inline error, and the typed email is **preserved** (do not reset the form on failure). This satisfies success criterion #4. Do NOT use `mode: 'no-cors'` — it makes the response opaque and would force always-success, silently failing criterion #4.
- **Note:** The current handler already only calls `form.reset()` inside the `response.ok` branch, so the "keep the email on failure" behavior is preserved by keeping reset on the success path only.
- **D-05:** Each submission writes a row with: **name**, **email**, **consent value**, **submission timestamp** (server-side, generated in the Apps Script), **source page** (which route/form the submission came from — distinguishes `/` vs `/new-12345`).
- **D-06:** **No deduplication.** Every submission is appended as its own row, even if the same email registers multiple times.
- **D-07:** **None for launch.** No honeypot, no rate limiting. Accepted for launch; can be revisited later if junk rows become a problem.
- **D-08:** Migrate **both** forms to the new endpoint — `src/routes/+page.svelte` (live landing page) **and** `src/routes/new-12345/+page.svelte` (dark-theme prototype). Since the dark theme is slated to become the primary page later, migrating it now means it already works at merge time and leaves **zero** Formspree calls anywhere.
- **D-09:** The Apps Script Web App URL lives in the **shared config module** established in Phase 1 (the `src/lib/` config file), consistent with the config-driven pattern — not hardcoded in the submit handler. Both routes import it from there.
- **D-10:** The Apps Script + Google Sheet must be **created and deployed** before wiring works:
  1. Create a Google Sheet (e.g. "SPC Registrations") with a header row: `name | email | consent | timestamp | source`.
  2. Add an Apps Script `doPost(e)` that parses the body and appends a row (with a server-side timestamp).
  3. Deploy as a **Web App** with access set to **"Anyone"** so the client-side `fetch` can reach it without auth.
  4. The resulting deployment URL is the placeholder value dropped into the config module (D-09).

### Claude's Discretion

- Exact request body encoding (JSON string vs URL-encoded form body) as long as it stays a preflight-free "simple request" (D-03) and the Apps Script parses it via `e.postData.contents` / `e.parameter`.
- Config module field name/shape for the endpoint URL, and the precise error-message copy.
- Whether the `source` value is a route path, a short label, or derived automatically — as long as `/` and `/new-12345` submissions are distinguishable in the Sheet.

### Deferred Ideas (OUT OF SCOPE)

- **Dark theme becomes the primary page** — the user intends to make `/new-12345` the main landing page and "switch & merge" the two. This is a separate future effort, explicitly out of scope for this launch-polish milestone. Captured here so it isn't lost. *(This phase still migrates the prototype's form backend now — D-08 — so the merge inherits a working endpoint.)*
- **Confirmation email to registrants** (REG-05) — deferred to v2 per REQUIREMENTS.md.
- **Spam protection / rate limiting** — declined for launch (D-07); revisit if junk rows appear.
</user_constraints>

<phase_requirements>
## Phase Requirements

| ID | Description | Research Support |
|----|-------------|------------------|
| REG-01 | Visitor can submit their email through the existing inline registration form | Frontend edit is confined to the URL/body/headers inside the existing `handleFormSubmit` — form markup, field names, and state variables are untouched (see Code Context / Architecture Patterns). |
| REG-02 | Each submission is recorded to a Google Sheet via a Google Apps Script endpoint (no monthly submission cap) | `doPost(e)` + `SpreadsheetApp` + `sheet.appendRow(...)` pattern documented in Code Examples; deployment-as-Web-App-with-"Anyone"-access documented in Architecture Patterns / Common Pitfalls. |
| REG-03 | On successful submission, the download options are revealed (existing behavior preserved) | Unchanged — `formSubmitted = true` still gates the reveal; only what flips it (the fetch call) changes. |
| REG-04 | A failed submission shows an inline error without discarding the entered email (existing behavior preserved) | Depends entirely on the response being *readable* (not opaque) — this is the CORS "simple request" research in Common Pitfalls / Code Examples, plus the "response.ok is not enough" script-error-payload nuance. |
</phase_requirements>

## Project Constraints (from CLAUDE.md)

- **Static site, no server:** GitHub Pages has no backend — the form backend must remain a third-party HTTP endpoint called client-side (Google Apps Script). This phase does not and must not introduce a server-side route.
- **No `.env`/secrets required:** Configuration is compile-time via hardcoded constants in `src/lib/`; the Apps Script URL is not a secret and belongs in the same config module pattern as Phase 1's `downloads.ts`, not an environment variable.
- **Naming/style:** camelCase functions (`handleFormSubmit` stays as-is), `handle`-prefixed event handlers, tabs, single quotes, no trailing commas, 100-col width (Prettier), TypeScript strict mode — the edited handler must conform to `npm run format`/`npm run lint`/`npm run check`.
- **Error handling pattern:** Try/catch for async operations, user-facing errors stored in a reactive `formError` string, no console logging beyond browser default (project has no Sentry/logging library) — matches the existing handler shape being edited, no new pattern introduced.
- **No global state:** No Svelte stores; form state stays local `let` variables in each route file (unchanged by this phase).
- **Function size convention:** Event handlers 2-30 lines — the edited `handleFormSubmit` should stay within this range (current Formspree version is ~27 lines; the JSON-payload version is comparable).
- **GSD workflow enforcement:** File edits for this phase must go through `/gsd-execute-phase` (or an equivalent GSD entry point), not direct ad-hoc edits outside the workflow.

## Summary

The migration replaces a single `fetch()` call's destination and body encoding — it is a narrow, well-bounded frontend change plus a new piece of infrastructure (a Google Apps Script Web App) that does not live in this repo. The two things that make this phase deceptively tricky are both CORS-shaped: (1) Google Apps Script Web Apps do **not** implement CORS preflight (`OPTIONS`) handling at all, so any request that is not a CORS "simple request" (e.g. `Content-Type: application/json`) is silently blocked by the browser before it ever reaches Apps Script; and (2) the `/exec` endpoint responds with a `302` redirect to `script.googleusercontent.com/macros/echo?...`, which `fetch()` follows transparently and — as long as the *original* request stayed within the simple-request rules — yields a genuinely readable response. `mode: 'no-cors'` looks like a tempting shortcut past CORS errors but permanently blinds the code to failure (opaque response, status always `0`), directly defeating REG-04/D-04.

The second landmine is Apps Script-specific, not CORS-specific: `ContentService` output from a normally-completing `doPost` is always delivered with an effective `200`/`response.ok === true` — there is no API to set a custom HTTP status code from Apps Script. That means an application-level validation failure (e.g., a script-side check that rejects a malformed payload) must be signaled through the *JSON body* (`{ result: 'error', message: '...' }`), not through the HTTP status. A handler that only checks `response.ok` will treat a script-side rejection as success. The frontend must parse the body and check a success/error field in addition to `response.ok`.

**Primary recommendation:** Send the request body as a `JSON.stringify(...)` string with `headers: { 'Content-Type': 'text/plain;charset=utf-8' }` (default `fetch` options otherwise — do not set `mode`, do not add other headers), parse `e.postData.contents` with `JSON.parse` in `doPost`, wrap the Apps Script logic in try/catch, always return `ContentService.createTextOutput(JSON.stringify({ result: 'success' | 'error', ... }))`, and on the frontend treat only `response.ok && parsedBody.result === 'success'` as success — everything else (fetch throw, non-ok, or `result !== 'success'`) goes to the existing `formError` branch, which already avoids clearing the form.

## Architectural Responsibility Map

| Capability | Primary Tier | Secondary Tier | Rationale |
|------------|-------------|----------------|-----------|
| Form UI, validation (HTML5 `required`/`type=email`), state machine (`formSubmitted`/`formLoading`/`formError`) | Browser / Client | — | Unchanged; pure Svelte component state, no server involved (static site). |
| Request encoding (simple-request-safe `Content-Type`, JSON body) | Browser / Client | — | Must be decided client-side to control whether a preflight fires; this is the crux of the whole phase. |
| Endpoint URL storage | Browser / Client (config module) | — | `src/lib/` config module (Phase 1 pattern) — no server-side config exists in this static site. |
| Request parsing, row-append business logic, timestamp generation | API / Backend (Google Apps Script Web App) | — | Apps Script is the only "backend" this project has; it lives outside this repo (deployed via Google's IDE), but functionally it is the API tier. |
| Data persistence | Database / Storage (Google Sheet) | — | Sheet is opaque to the frontend (D-02); only Apps Script references it. |
| CORS response relay | CDN / Static (Google-operated `script.googleusercontent.com`) | — | Infrastructure Google controls; the frontend has no say over it beyond keeping the initial request "simple" so the browser is willing to follow the redirect and expose the body. |

## Standard Stack

No new npm packages are introduced by this phase. The implementation uses only:
- The browser's native `fetch()` API (already used by the existing Formspree handler — no new dependency).
- Google Apps Script's built-in `SpreadsheetApp` and `ContentService` global services (Apps Script runtime, not an npm package — there is nothing to `npm install` for the backend half of this phase).

### Alternatives Considered

| Instead of | Could Use | Tradeoff |
|------------|-----------|----------|
| Google Apps Script Web App | A serverless function (Cloudflare Worker / Vercel function) proxying to Sheets API | Requires a real backend/hosting account and OAuth service-account credentials — contradicts the project's "static site, no server, no secrets" constraint (CLAUDE.md) and the roadmap's explicit Apps Script decision (PROJECT.md). Not applicable here — locked by D-01. |
| `Content-Type: text/plain` simple request | A `doOptions(e)` handler returning CORS headers | Multiple sources confirm Apps Script Web Apps do not receive/handle preflight `OPTIONS` requests at the platform level regardless of what `doOptions` you write — the preflight simply never reaches your script. `text/plain` is the standard, documented workaround, not `doOptions`. [ASSUMED — cross-checked across 3 independent community sources, no official Google statement found confirming `doOptions` is unreachable; treat as MEDIUM confidence, see Assumptions Log A1] |
| JSON string body (`text/plain` Content-Type) | `application/x-www-form-urlencoded` body via `URLSearchParams` | Both are valid "simple request" encodings. Left to Claude's Discretion per CONTEXT.md. JSON is recommended because it round-trips cleanly through `JSON.parse(e.postData.contents)` without needing `e.parameter` string-coercion of the checkbox value. |

**Installation:** None required — no packages to install for this phase.

## Package Legitimacy Audit

**Not applicable.** This phase installs no new npm/PyPI/crates packages — it only edits existing frontend code (`fetch` calls already present) and adds a Google Apps Script project that is provisioned through Google's web IDE, not a package manager. No `package-legitimacy check` run was needed.

## Architecture Patterns

### System Architecture Diagram

```
┌─────────────────────────────┐
│  Browser (visitor)          │
│  src/routes/+page.svelte    │
│  src/routes/new-12345/...   │
│                              │
│  1. Fill form (name, email, │
│     consent checkbox)       │
│  2. submit → preventDefault │
│         │                   │
│         ▼                   │
│  handleFormSubmit(e)        │
│  - build JSON payload from  │
│    FormData                 │
│  - fetch(APPS_SCRIPT_URL, { │
│      method: 'POST',        │
│      headers: {             │
│        'Content-Type':      │
│         'text/plain;        │
│          charset=utf-8'     │  <- keeps request "simple" (no preflight)
│      },                     │
│      body: JSON.stringify() │
│    })                       │
└──────────┬───────────────────┘
           │ POST (CORS simple request — no OPTIONS preflight sent)
           ▼
┌─────────────────────────────────────────────┐
│ script.google.com/macros/s/<id>/exec         │
│ (Google-operated front-end; not in this repo)│
│ - Executes the deployed Apps Script          │
│ - Runs doPost(e) as the script owner         │
│         │                                    │
│         ▼                                    │
│  doPost(e):                                  │
│  - JSON.parse(e.postData.contents)           │
│  - try { append row } catch { error result } │
│  - Sheet.appendRow([name, email, consent,    │
│      new Date(), source])                    │
│  - return ContentService.createTextOutput(   │
│      JSON.stringify({result: 'success'|      │
│      'error', ...}))                         │
│         │                                    │
│         ▼                                    │
│  302 redirect →                              │
│  script.googleusercontent.com/macros/echo?...│  <- fetch follows this automatically
└──────────┬────────────────────────────────────┘
           │ GET (redirected; response carries the JSON body + CORS headers
           │      permissive enough for the browser to expose it to JS,
           │      PROVIDED the original request stayed "simple")
           ▼
┌─────────────────────────────┐
│  Browser: response readable │
│  - response.ok check        │
│  - AND parse JSON body,     │
│    check result === 'success'│
│  - on success: formSubmitted│
│    = true; form.reset()     │
│  - on failure (network throw,│
│    !response.ok, OR         │
│    result !== 'success'):   │
│    formError = '...'        │
│    (email NOT cleared)      │
└─────────────────────────────┘
           │
           ▼
┌─────────────────────────────┐
│ Google Sheet ("SPC          │
│ Registrations")             │
│ header: name|email|consent| │
│         timestamp|source    │
│ (opaque to frontend — D-02) │
└─────────────────────────────┘
```

### Recommended Project Structure

No new directories. Two edit sites plus one config addition:

```
src/
├── lib/
│   └── downloads.ts          # Phase 1 config module — add the Apps Script URL
│                              # here (or a sibling file in the same folder,
│                              # e.g. registration.ts, following the same
│                              # single-purpose-constants pattern) per D-09
├── routes/
│   ├── +page.svelte          # edit handleFormSubmit only (~lines 163-190)
│   └── new-12345/+page.svelte # edit handleFormSubmit only (~lines 191-224)
```

Outside the repo (documented in the plan, not committed as code):
```
Google Sheet: "SPC Registrations"
  header row: name | email | consent | timestamp | source
  Apps Script project (bound to the Sheet)
    Code.gs: doPost(e) { ... }
    Deployed as Web App, access = "Anyone"
```

### Pattern 1: Preflight-free POST to a Google Apps Script Web App

**What:** Send the request with `Content-Type: text/plain;charset=utf-8` and a JSON-stringified body so the browser classifies it as a CORS "simple request" and never sends an `OPTIONS` preflight.
**When to use:** Any time a browser `fetch()` targets a Google Apps Script Web App `/exec` URL directly (no server-side proxy).
**Example:**
```typescript
// Source: cross-checked community pattern (tanaikech GitHub, multiple blog posts) — see Sources
const response = await fetch(APPS_SCRIPT_URL, {
	method: 'POST',
	headers: {
		'Content-Type': 'text/plain;charset=utf-8'
	},
	body: JSON.stringify({ name, email, consent, source })
});
```
Do **not** add `Accept: application/json` or any other header beyond `Content-Type` — any header outside the CORS-safelisted set (`Accept`, `Accept-Language`, `Content-Language`, `Content-Type`, `Range`) forces a preflight. [CITED: developer.mozilla.org/en-US/docs/Glossary/CORS-safelisted_request_header]

### Pattern 2: Apps Script `doPost` — parse, append, always return a body

**What:** Parse the JSON body, wrap the Sheet write in try/catch, and always return a `ContentService` text output carrying an explicit success/error field — never rely on HTTP status alone.
**When to use:** Any Apps Script Web App endpoint meant to be called from client-side JS that needs to detect failure.
**Example:**
```javascript
// Source: Google Apps Script docs (doPost/ContentService) + community error-handling pattern — see Sources
function doPost(e) {
	try {
		var data = JSON.parse(e.postData.contents);
		if (!data.email) {
			return ContentService
				.createTextOutput(JSON.stringify({ result: 'error', message: 'Missing email' }))
				.setMimeType(ContentService.MimeType.JSON);
		}

		var sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('Registrations');
		sheet.appendRow([
			data.name || '',
			data.email,
			data.consent ? 'yes' : 'no',
			new Date(),           // server-side timestamp (D-05)
			data.source || ''
		]);

		return ContentService
			.createTextOutput(JSON.stringify({ result: 'success' }))
			.setMimeType(ContentService.MimeType.JSON);
	} catch (err) {
		return ContentService
			.createTextOutput(JSON.stringify({ result: 'error', message: err.message }))
			.setMimeType(ContentService.MimeType.JSON);
	}
}
```

### Anti-Patterns to Avoid

- **`mode: 'no-cors'`:** Produces an opaque response — `status` is always `0`, headers are empty, body is unreadable. Code cannot tell success from failure, so the handler would have to assume success unconditionally, which silently breaks REG-04/D-04. [CITED: developer.mozilla.org/en-US/docs/Web/API/Request/mode]
- **Checking only `response.ok`:** A normally-completing `doPost` (even one that decides to reject the payload) is delivered with an effective 200/ok status because `ContentService` cannot set a custom HTTP status code. A script-level validation failure must be caught by inspecting the JSON body (`result === 'error'`), not just `response.ok`.
- **`Content-Type: application/json`:** The single most common mistake in every source reviewed. This is *not* CORS-safelisted, so it forces a preflight `OPTIONS` request — which Apps Script Web Apps cannot answer — and the browser blocks the request outright with a CORS error, before Apps Script ever runs.
- **Assuming `FormData` → `Object.fromEntries(formData)` handles the consent checkbox:** An unchecked checkbox is *absent* from `FormData` entirely (not `false`/empty string). Read it explicitly as `formData.get('consent') === 'on'` (or check `element.checked` directly) rather than assuming a key will exist.

## Don't Hand-Roll

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| CORS preflight avoidance | A custom `doOptions(e)` handler that sets `Access-Control-Allow-*` headers | `Content-Type: text/plain;charset=utf-8` simple-request encoding | Apps Script Web Apps do not receive/process the preflight `OPTIONS` request at the platform level (confirmed across multiple independent sources); writing `doOptions` does not fix it because the browser never gets a chance to send the real request in the first place. |
| Success/failure signaling from Apps Script | A scheme that tries to set custom HTTP status codes from `doPost` | An explicit JSON `result` field in every returned body, checked on the frontend in addition to `response.ok` | `ContentService` has no API to set the HTTP status code of a normally-completing execution; status is effectively always 200/ok on success paths, so status alone can't distinguish "the script ran and thought this failed" from "it succeeded." |
| Deployment URL "stability" logic | Re-deploying (New Deployment) on every Apps Script code change | Editing the existing deployment ("Manage Deployments" → edit → select the new version) | Creating a brand-new deployment mints a new URL/deployment ID; the config module's URL would go stale on every future script edit unless the *same* deployment is updated in place. |

**Key insight:** Every pitfall in this domain traces back to one fact: Apps Script Web Apps are a thin HTTP-execution shim, not a general-purpose CORS-aware server. The client has to accommodate the platform's constraints (simple requests only, no custom status codes) rather than trying to configure the platform to behave like a normal API.

## Common Pitfalls

### Pitfall 1: `application/json` Content-Type silently breaks the whole flow

**What goes wrong:** The most natural way to POST JSON — `headers: { 'Content-Type': 'application/json' }` — triggers a CORS preflight. Apps Script Web Apps do not handle `OPTIONS` requests, so the preflight gets no valid CORS response, and the browser blocks the actual POST with a console CORS error. `doPost` never even runs.
**Why it happens:** `application/json` is not one of the three CORS-safelisted Content-Type values (`application/x-www-form-urlencoded`, `multipart/form-data`, `text/plain`).
**How to avoid:** Set `Content-Type: text/plain;charset=utf-8` and still send a JSON string as the body — Apps Script will happily `JSON.parse(e.postData.contents)` regardless of what Content-Type header labeled it.
**Warning signs:** Browser console shows a CORS error mentioning "No 'Access-Control-Allow-Origin' header is present" or "preflight response"; network tab shows an `OPTIONS` request that returns non-200 or is never answered.

### Pitfall 2: `mode: 'no-cors'` looks like a fix but defeats REG-04 entirely

**What goes wrong:** Adding `mode: 'no-cors'` to silence the CORS error in the console makes the request succeed at the network level, but the returned `Response` object is opaque: `status` is always `0`, `response.ok` is always `false`, and the body cannot be read. Any code branching on `response.ok` will now *always* take the error branch (or, if coded naively to assume success on no thrown exception, always take the success branch) — either way it can no longer distinguish real success from real failure.
**Why it happens:** `no-cors` is designed for fire-and-forget requests (e.g. analytics beacons) where the caller doesn't need to read the response — exactly the opposite of this phase's requirement.
**How to avoid:** Never set `mode` at all (default is `'cors'`); solve the preflight problem via Content-Type (Pitfall 1), not via `no-cors`.
**Warning signs:** `response.status === 0` in the success handler; success/failure appears to be random or inverted from what actually happened server-side.

### Pitfall 3: `response.ok` is true even when the script logically failed

**What goes wrong:** A `doPost` that catches an internal error and returns `ContentService.createTextOutput(JSON.stringify({result: 'error', ...}))` still arrives at the browser as an ordinary 200-family response. If the frontend only checks `response.ok`, it will treat this as success — `formSubmitted = true`, form reset — even though nothing was written to the Sheet (or a validation check rejected the payload).
**Why it happens:** `ContentService` cannot set a custom HTTP status code; a normal `return` (even one signaling an application-level error) is a normal completion from the platform's point of view.
**How to avoid:** Always `await response.json()` (or `.text()` then `JSON.parse`) and check a `result`/`success` field from the body in addition to `response.ok`. Treat `!response.ok || parsedBody.result !== 'success'` as failure.
**Warning signs:** Rows missing from the Sheet despite the UI showing the "thanks for registering" success state.

### Pitfall 4: Uncaught exceptions in `doPost` do return a real error status — but not a JSON body

**What goes wrong:** If `doPost` throws an exception that is *not* caught (no try/catch), Google's front-end may return a generic HTML error page (reported as a 500-family "Google Docs encountered an error" response) rather than the script's own JSON. `response.json()` on the frontend would then throw a parse error inside what should be the error-handling path.
**Why it happens:** This is a platform-level failure mode (e.g., quota exceeded, unhandled runtime exception), distinct from an application-level validation error the script code chooses to report.
**How to avoid:** Wrap all `doPost` logic in try/catch so the script itself always returns a parseable JSON body; on the frontend, wrap the `response.json()` parse in its own try/catch so a non-JSON error page is still caught and shown as `formError` (not an unhandled promise rejection).
**Warning signs:** Console shows `SyntaxError: Unexpected token < in JSON` — this is the tell-tale sign of Apps Script returning an HTML error page instead of your JSON.

### Pitfall 5: Redeploying the Apps Script mints a new URL unless you edit the existing deployment

**What goes wrong:** Using the Apps Script editor's "Deploy" → "New deployment" flow (rather than "Manage deployments" → edit existing) creates a brand-new deployment ID and therefore a brand-new `/exec` URL. If the config module's URL isn't updated, every future script fix silently orphans the live site (or vice versa — the site references a URL Apps Script no longer serves the latest code from).
**Why it happens:** Apps Script Web Apps support multiple simultaneous "deployments," each pinned to a specific saved "version" of the code; only editing an existing deployment to point at a new version keeps its URL stable.
**How to avoid:** Document (in the plan/README, not just tribal knowledge) that all future script edits go through "Manage deployments → Edit → select new version → Deploy" on the *same* deployment, never "New deployment."
**Warning signs:** Form submissions stop appearing in the Sheet after an Apps Script edit, with no error visible on the frontend (because the stale URL still resolves to the old, un-updated code — or a 404/error if the old deployment was deleted).

### Pitfall 6: Unchecked checkbox is absent from `FormData`, not `false`

**What goes wrong:** `new FormData(form).get('consent')` returns `null` when the checkbox is unchecked (it's simply not included), not `"false"` or `""`. Code that does `formData.get('consent') || false` works, but naive `Object.fromEntries(formData)` spreads will omit the key entirely if unchecked, which can produce a Sheet row silently missing the consent column value if the Apps Script code assumes the key is always present.
**Why it happens:** This is standard HTML form semantics, not specific to this phase, but it's easy to overlook when refactoring the existing `FormData`-based handler into a JSON payload.
**How to avoid:** Read the checkbox explicitly: `formData.get('consent') === 'on'` (Boolean) — this project's form field currently has no `checked` default on `new-12345` and `checked` (pre-checked) on the main page (per D-09's release-updates default-checked change), so both "checked by default" and "user unchecked it" must resolve correctly.
**Warning signs:** Consent column in the Sheet is blank or `undefined`-stringified for some rows.

## Code Examples

### Frontend: minimal edit to the existing handler (both routes)

```typescript
// Source: pattern derived from existing src/routes/+page.svelte:163-190 (Formspree handler)
// combined with the CORS "simple request" research above.
import { appsScriptUrl } from '$lib/downloads'; // or a sibling config module, per D-09

async function handleFormSubmit(e: Event) {
	const form = e.target as HTMLFormElement;
	const formData = new FormData(form);

	formLoading = true;
	formError = '';

	try {
		const payload = {
			name: (formData.get('name') as string) || '',
			email: formData.get('email') as string,
			consent: formData.get('consent') === 'on',
			source: '/' // or '/new-12345' — literal per-route value satisfies D-05
		};

		const response = await fetch(appsScriptUrl, {
			method: 'POST',
			headers: { 'Content-Type': 'text/plain;charset=utf-8' },
			body: JSON.stringify(payload)
		});

		let result: { result?: string; message?: string } = {};
		try {
			result = await response.json();
		} catch {
			// Non-JSON body (e.g. Apps Script platform error page) — treat as failure below.
		}

		if (response.ok && result.result === 'success') {
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

### Apps Script: `doPost` with explicit success/error signaling

See Pattern 2 above under Architecture Patterns — same code, reproduced there to keep this section focused on the frontend/backend split.

## State of the Art

| Old Approach | Current Approach | When Changed | Impact |
|--------------|------------------|---------------|--------|
| Formspree (`FormData` body, `Accept: application/json` header, 50 submissions/month free-tier cap) | Google Apps Script Web App + Google Sheet (JSON body, `text/plain` Content-Type, no submission cap) | This phase | Removes the monthly cap entirely (REG-02); the site now owns the data (a Sheet in the team's Google account) instead of a third party. |

**Deprecated/outdated:**
- Formspree endpoint `https://formspree.io/f/xvzjdkaj` — removed entirely per D-01, no fallback.

## Assumptions Log

| # | Claim | Section | Risk if Wrong |
|---|-------|---------|---------------|
| A1 | Apps Script Web Apps cannot be made to answer CORS preflight (`OPTIONS`) requests via any script-side handler (e.g. `doOptions`), regardless of code — the preflight is rejected/ignored at the Google front-end layer before reaching the script. | Standard Stack (Alternatives Considered), Don't Hand-Roll | If wrong, a `doOptions` handler could be a viable alternative to the `text/plain` workaround; low risk either way since `text/plain` is well-documented and sufficient — this assumption only affects whether an alternative approach is worth exploring, not whether the recommended approach works. |
| A2 | `script.googleusercontent.com` (the redirect target Apps Script's `/exec` sends the response through) returns permissive-enough CORS headers (or the redirected request is treated as same-enough to be read) that a `fetch()` following the redirect can read the body, provided the *original* request was a CORS simple request. | Summary, Architecture Patterns (Pattern 1), Architecture Diagram | If wrong, the response would come back as a network error (`TypeError: Failed to fetch`) rather than a readable body — this is still survivable under D-04 (it lands in the `catch` block as a generic network error, form is NOT cleared, criterion #4 still holds), but the planner should have the executor manually verify a real end-to-end submission (curl/browser devtools) before considering this phase done, since this exact mechanic could not be confirmed against Google's official documentation this session (only community sources). |
| A3 | `ContentService` output from Apps Script has no API to set a custom HTTP response status code, so a normally-completing (even error-signaling) `doPost` always yields an effective 200/`response.ok === true`. | Summary, Don't Hand-Roll, Pitfall 3 | If wrong (i.e. if there is an undocumented way to set status), the frontend's extra check on the JSON body's `result` field is still correct/safe (harmless redundancy) — no risk of regression from acting on this assumption. |

**Confirm A1 and A2 with a real end-to-end test (deploy the script, submit the form, inspect Network tab) before/during execution** — this is the single most execution-risk-bearing unknown in the phase.

## Open Questions

1. **Does `fetch()`'s default `redirect: 'follow'` actually complete the full round trip (POST to `/exec` → 302 → GET to `script.googleusercontent.com/macros/echo`) without the browser re-checking CORS in a way that blocks it, for a real deployed Apps Script (not just what blog posts report)?**
   - What we know: Multiple independent (non-official) sources describe this exact flow working when the original request is a CORS simple request; this is the standard, widely-used pattern for calling Apps Script Web Apps from client-side JS (used by numerous public tutorials/libraries).
   - What's unclear: No official Google documentation was found this session explicitly confirming the redirect-target's CORS behavior (vs. community reverse-engineering).
   - Recommendation: Treat as MEDIUM confidence (see Assumptions Log A2). The plan should include an explicit manual verification step — deploy the real script, submit the real form in a browser, and confirm `response.ok` and a readable JSON body appear in the Network tab — before marking REG-04 done. This is inherently a runtime/environment check, not something research can fully close out.

2. **Exact Apps Script project provisioning steps (D-10) are a one-time manual action outside this repo — should the plan capture them as a runbook/README, or as literal step-by-step task instructions for whoever executes the phase?**
   - What we know: D-10 already lists the four steps (create Sheet, add doPost, deploy as Web App with "Anyone" access, drop URL into config).
   - What's unclear: Whether the planner should treat "create the Apps Script project" as a task with a `checkpoint:human-verify` gate (since it requires a Google account and manual web-UI steps that cannot be scripted/automated from this repo) or whether it's assumed to already exist by the time code-editing tasks run.
   - Recommendation: Plan should include a `checkpoint:human-verify` (or equivalent manual step) for the Apps Script deployment itself, since it cannot be automated via CLI from this codebase — then proceed to the code-editing tasks once a real deployment URL exists to test against.

## Environment Availability

No external CLI tools, runtimes, or local services are required by this phase beyond what the project already depends on (Node 22+, npm — already verified as project prerequisites). The one true "external dependency" is a **Google Apps Script Web App deployment**, which is a manually-provisioned cloud resource created through Google's web-based IDE (script.google.com) — not something probeable via local shell commands, and not blocked by anything in this environment. This is captured as Open Question 2 / D-10 (a manual provisioning step) rather than an environment audit finding.

## Security Domain

### Applicable ASVS Categories

| ASVS Category | Applies | Standard Control |
|---------------|---------|-------------------|
| V2 Authentication | No | No user accounts; anonymous public form by design. |
| V3 Session Management | No | Stateless static site; no sessions. |
| V4 Access Control | No | Apps Script deployed with access = "Anyone" is an intentional, accepted design (D-10) — there is no access control to apply on a public registration form. |
| V5 Input Validation | Yes | Client-side: HTML5 `type="email"` + `required` (existing, unchanged). Server-side (Apps Script): validate `data.email` is present/non-empty before `appendRow` (see Pattern 2 / Pitfall 3) — the public endpoint must not throw an uncaught exception on malformed input (Pitfall 4). |
| V6 Cryptography | No | No secrets, tokens, or encrypted data involved; the Web App URL itself is not a secret credential (D-07 accepts this — it's public in client-side JS regardless, same as the current Formspree ID). |

### Known Threat Patterns for this stack

| Pattern | STRIDE | Standard Mitigation |
|---------|--------|----------------------|
| Arbitrary/spam POSTs to the public Apps Script URL (anyone who reads the deployed frontend bundle can extract and directly POST to it, bypassing the UI entirely) | Tampering / Denial of Service | **Accepted risk for launch per D-07** (no honeypot, no rate limiting). Note for the plan: this is the same trust boundary the current Formspree integration already has (public endpoint ID visible in source) — not a new regression, just a like-for-like carryover. Apps Script consumer-account quotas (20,000 URL Fetch calls/day, ~90 min/day total trigger runtime) provide an implicit ceiling but are not a deliberate defense. [ASSUMED — quota figures per community/aggregator sources, not the project's own testing; see Sources] |
| Malformed/garbage JSON body causing an uncaught exception in `doPost` | Denial of Service (of the *script*, not the site — site is static and unaffected) | Wrap `doPost` logic in try/catch (Pattern 2); always return a parseable JSON body regardless of input validity. |
| Injection into the Google Sheet (e.g. a submitted "name" value starting with `=` interpreted as a formula by Sheets) | Tampering | Not addressed by any locked decision in this phase (D-05/D-06/D-07 are silent on sanitization). Flagging as a planner discretion item: values are written via `appendRow`, which writes literal strings unless Sheets' auto-formula-detection kicks in on cells starting with `=`/`+`/`-`/`@`. Low severity (only the sheet owner views it), but cheap to mitigate (e.g., prefix a stray leading `=`/`+` with an apostrophe, or use `setValue` with explicit text formatting) if the planner wants to close it. Not required by any REG requirement — noting for awareness only. |

## Sources

### Primary (CITED — official documentation, MEDIUM confidence per this session's provider tier)
- MDN — [CORS-safelisted request header](https://developer.mozilla.org/en-US/docs/Glossary/CORS-safelisted_request_header) — Content-Type/header/method rules for a CORS "simple request."
- MDN — [Request: mode property](https://developer.mozilla.org/en-US/docs/Web/API/Request/mode) — `no-cors` opaque response behavior.
- Google for Developers — [Web Apps | Apps Script](https://developers.google.com/apps-script/guides/web) — `doPost(e)`, `e.postData.contents`/`e.parameter`, `ContentService`, deployment/versioning URL stability.
- Google for Developers — [Quotas for Google Services](https://developers.google.com/apps-script/guides/services/quotas) — consumer-account daily execution/URL-fetch limits.

### Secondary (WebSearch synthesis, cross-checked across independent sources — MEDIUM confidence)
- [tanaikech/taking-advantage-of-Web-Apps-with-google-apps-script](https://github.com/tanaikech/taking-advantage-of-Web-Apps-with-google-apps-script/blob/master/README.md) — `text/plain` preflight-avoidance pattern, redirect-following via `-L`.
- [Fixing CORS Errors in Google Apps Script | Lambda IITH](https://iith.dev/blog/app-script-cors/) — Apps Script's lack of `OPTIONS`/preflight support.
- [Struggling with CORS in Google Apps Script? Here's the Fix | Diya Vijay, Medium](https://diyavijay.medium.com/struggling-with-cors-in-google-apps-script-heres-the-fix-e3eec09f07dd) — same, plus workaround list.
- [Create and manage deployments | Apps Script | Google for Developers](https://developers.google.com/apps-script/concepts/deployments) — new deployment vs. new version distinction.
- [Apps Script Web App POST requests fail with 500 Docs error thread](https://discuss.google.dev/t/apps-script-web-app-post-requests-fail-with-500-docs-error-and-dopost-never-runs/292239) — 500/HTML-error-page failure mode, redirect-before-execution mechanics.
- [dwyl/learn-to-send-email-via-google-script-html-no-server, issue #154](https://github.com/dwyl/learn-to-send-email-via-google-script-html-no-server/issues/154) — real-world "No Access-Control-Allow-Origin" failure report corroborating Pitfall 1.

### Tertiary (LOW confidence — noted for completeness, not relied upon for recommendations)
- Aggregator/blog posts on Apps Script quota figures (ModelMonkey, FolderPal) — used only for the informational security-domain quota note, not a locked recommendation.

## Metadata

**Confidence breakdown:**
- Standard stack: HIGH — no new dependencies; this is a pure edit of existing, already-read code plus a documented Apps Script API surface.
- Architecture (CORS simple-request + Apps Script redirect mechanics): MEDIUM — the core mechanism (`text/plain` avoids preflight) is corroborated by official MDN docs; the redirect-readability claim (A2) rests on community sources only, no official Google confirmation found this session.
- Pitfalls: MEDIUM-HIGH — each pitfall is corroborated by at least one official doc (MDN or Google Apps Script docs) plus independent community reports describing the same failure mode.

**Research date:** 2026-07-06
**Valid until:** 2026-08-05 (30 days — CORS spec and Apps Script platform behavior are stable, slow-moving surfaces; re-verify if Google changes Apps Script Web App CORS handling, which would be a breaking platform change worth re-checking before extending this project's usage).
