# Phase 2: Registration Backend Migration - Context

**Gathered:** 2026-07-06
**Status:** Ready for planning

<domain>
## Phase Boundary

Replace the registration form's submission backend: stop POSTing to Formspree (`https://formspree.io/f/xvzjdkaj`, 50/mo cap) and instead POST to a **Google Apps Script Web App** that appends each submission as a row in a **Google Sheet** (free, unlimited, owned data). The existing inline form UX is unchanged — same fields (name optional, email required, consent checkbox), same "reveal downloads on success" behavior, same inline-error-on-failure behavior.

Covers requirements REG-01, REG-02, REG-03, REG-04.

**In scope:** the form submission wiring in `src/routes/+page.svelte` **and** `src/routes/new-12345/+page.svelte` (both currently call Formspree); the Apps Script endpoint URL added to the shared config module; documenting the Apps Script + Google Sheet provisioning steps.

**Out of scope:** changing the form fields/UI, the download-reveal mechanism, or the landing-page theme. Building the dark-theme "switch main page & merge" effort (see Deferred).

</domain>

<decisions>
## Implementation Decisions

### Backend Target (REG-02)
- **D-01:** Registration POSTs to a **Google Apps Script Web App URL**. The script appends a row to a Google Sheet. Formspree is removed entirely — no dual-write, no fallback (hard cutover, per roadmap).
- **D-02:** The site code only ever holds the **Web App URL**. Which Sheet is written to is encapsulated inside the Apps Script (container-bound via `SpreadsheetApp.getActiveSpreadsheet()`, or standalone via `SpreadsheetApp.openById(...)`). The frontend has **no** reference to the Sheet itself.

### Failure Detection (REG-04 — critical)
- **D-03:** Use **robust detection**, not fire-and-forget. POST as a CORS **"simple request"** — `Content-Type: text/plain;charset=utf-8` with a JSON string (or form-encoded) body — so **no preflight** is triggered and the browser **can read** the Apps Script response.
- **D-04:** Because the response is readable, both **network errors** (fetch throws) and **server/script errors** (non-OK / error payload) surface as an inline error, and the typed email is **preserved** (do not reset the form on failure). This satisfies success criterion #4. Do NOT use `mode: 'no-cors'` — it makes the response opaque and would force always-success, silently failing criterion #4.
- **Note:** The current handler already only calls `form.reset()` inside the `response.ok` branch, so the "keep the email on failure" behavior is preserved by keeping reset on the success path only.

### Google Sheet Columns (REG-02)
- **D-05:** Each submission writes a row with: **name**, **email**, **consent value**, **submission timestamp** (server-side, generated in the Apps Script), **source page** (which route/form the submission came from — distinguishes `/` vs `/new-12345`).

### Duplicates
- **D-06:** **No deduplication.** Every submission is appended as its own row, even if the same email registers multiple times.

### Spam Protection
- **D-07:** **None for launch.** No honeypot, no rate limiting. Accepted for launch; can be revisited later if junk rows become a problem.

### Scope: Both Routes
- **D-08:** Migrate **both** forms to the new endpoint — `src/routes/+page.svelte` (live landing page) **and** `src/routes/new-12345/+page.svelte` (dark-theme prototype). Since the dark theme is slated to become the primary page later, migrating it now means it already works at merge time and leaves **zero** Formspree calls anywhere.

### Endpoint Configuration
- **D-09:** The Apps Script Web App URL lives in the **shared config module** established in Phase 1 (the `src/lib/` config file), consistent with the config-driven pattern — not hardcoded in the submit handler. Both routes import it from there.

### Provisioning Dependency (for the plan to spell out)
- **D-10:** The Apps Script + Google Sheet must be **created and deployed** before wiring works:
  1. Create a Google Sheet (e.g. "SPC Registrations") with a header row: `name | email | consent | timestamp | source`.
  2. Add an Apps Script `doPost(e)` that parses the body and appends a row (with a server-side timestamp).
  3. Deploy as a **Web App** with access set to **"Anyone"** so the client-side `fetch` can reach it without auth.
  4. The resulting deployment URL is the placeholder value dropped into the config module (D-09).

### Claude's Discretion
- Exact request body encoding (JSON string vs URL-encoded form body) as long as it stays a preflight-free "simple request" (D-03) and the Apps Script parses it via `e.postData.contents` / `e.parameter`.
- Config module field name/shape for the endpoint URL, and the precise error-message copy.
- Whether the `source` value is a route path, a short label, or derived automatically — as long as `/` and `/new-12345` submissions are distinguishable in the Sheet.

</decisions>

<canonical_refs>
## Canonical References

**Downstream agents MUST read these before planning or implementing.**

### Requirements & Roadmap
- `.planning/REQUIREMENTS.md` §Registration — REG-01…REG-04 (v1); REG-05 (v2, deferred confirmation email)
- `.planning/ROADMAP.md` §"Phase 2: Registration Backend Migration" — goal + 4 success criteria
- `.planning/PROJECT.md` §Key Decisions — locks Registration → Apps Script → Google Sheet

### Codebase Map
- `.planning/codebase/INTEGRATIONS.md` §"Form Processing" — current Formspree integration (endpoint, method, both routes) being replaced
- `.planning/codebase/CONVENTIONS.md` — naming/style conventions to match in the config module and handler edits
- `.planning/codebase/CONCERNS.md` — external-integration risks

### Prior Phase
- `.planning/phases/01-download-wiring-release-config/01-CONTEXT.md` §decisions — establishes the shared `src/lib/` config module pattern the endpoint URL should extend (D-09)

No external ADRs/specs beyond the planning docs above — requirements are fully captured in the decisions here.

</canonical_refs>

<code_context>
## Existing Code Insights

### Reusable Assets
- `src/routes/+page.svelte:163-189` — `handleFormSubmit`: current Formspree `fetch` (POST, `FormData` body, `Accept: application/json`, checks `response.ok`, sets `formSubmitted`/`formError`). This is the primary edit site — swap the URL/body per D-01/D-03, keep the surrounding state machine.
- `src/routes/+page.svelte:65-67` — form state (`formSubmitted`, `formLoading`, `formError`); unchanged by this phase.
- `src/routes/+page.svelte:547-584` — form markup (fields `name`, `email`, `consent`); unchanged. Field names map directly onto the Sheet columns (D-05).
- `src/routes/new-12345/+page.svelte` — the prototype route's own Formspree submit handler + form; second edit site (D-08).
- The Phase-1 `src/lib/` config module — extend it with the endpoint URL (D-09).

### Established Patterns
- Existing handler uses `try/catch/finally` with `formLoading` toggling and `formError` string state — reuse this exact shape; only the URL, body encoding, and success/error branching change.
- `form.reset()` is called only on success — preserves the typed email on failure (D-04) without extra work.
- Tabs, single quotes, no trailing commas, 100-col (Prettier); camelCase functions, `handle`-prefixed handlers.

### Integration Points
- Two independent submit handlers (one per route) both currently target Formspree — both must point at the config-supplied Apps Script URL so no Formspree reference remains (D-08).
- Download reveal is gated on `formSubmitted` — this phase changes only what makes `formSubmitted` flip to true (the successful POST), not the reveal itself (that's Phase 1's territory).

</code_context>

<specifics>
## Specific Ideas

- Request must be a CORS "simple request" (`text/plain` content-type, no custom headers) to avoid a preflight and keep the Apps Script response readable — this is the crux of robust failure detection (D-03).
- Sheet header row: `name | email | consent | timestamp | source`.
- Apps Script Web App must be deployed with access = **"Anyone"** for the anonymous client-side POST to succeed.

</specifics>

<deferred>
## Deferred Ideas

- **Dark theme becomes the primary page** — the user intends to make `/new-12345` the main landing page and "switch & merge" the two. This is a separate future effort, explicitly out of scope for this launch-polish milestone (see PROJECT.md §Out of Scope). Captured here so it isn't lost. *(This phase still migrates the prototype's form backend now — D-08 — so the merge inherits a working endpoint.)*
- **Confirmation email to registrants** (REG-05) — deferred to v2 per REQUIREMENTS.md.
- **Spam protection / rate limiting** — declined for launch (D-07); revisit if junk rows appear.

</deferred>

---

*Phase: 2-Registration Backend Migration*
*Context gathered: 2026-07-06*
