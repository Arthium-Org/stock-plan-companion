# Phase 2: Registration Backend Migration - Discussion Log

> **Audit trail only.** Do not use as input to planning, research, or execution agents.
> Decisions are captured in CONTEXT.md — this log preserves the alternatives considered.

**Date:** 2026-07-06
**Phase:** 2-Registration Backend Migration
**Areas discussed:** Failure detection, Sheet columns, Duplicates & prototype route, Spam protection

---

## Gray Area Selection

| Option | Description | Selected |
|--------|-------------|----------|
| Failure detection | CORS trade-off: robust detection vs fire-and-forget | ✓ |
| Sheet columns | What lands in each Google Sheet row | ✓ |
| Spam protection | Honeypot vs nothing for launch | (answered inline) |
| Dupes & prototype | Dedupe behavior + whether to migrate /new-12345 | ✓ |

**User's choice:** Failure detection, Sheet columns, Dupes & prototype (plus inline answers to dupes and spam).
**Notes:** User answered several areas in one pass: "Not worried about dupes. dark-theme will be primary. We have to switch that to main page and merge. No spam protection required for now. Sheet columns can be same as mentioned."

---

## Failure Detection

| Option | Description | Selected |
|--------|-------------|----------|
| Robust detection | Simple request (text/plain, no preflight) → readable response → network + server errors surface, email preserved; satisfies criterion #4 | ✓ |
| Fire-and-forget | `mode:'no-cors'`, opaque response, always shows success; can't meet criterion #4 | |

**User's choice:** Robust detection.
**Notes:** Chosen because success criterion #4 (inline error on failure, keep the typed email) requires a readable response.

---

## Sheet Columns

**User's choice:** Same as proposed — name, email, consent value, submission timestamp, source page.
**Notes:** Confirmed with "Sheet columns can be same as mentioned."

---

## Duplicates

**User's choice:** No deduplication — append every submission.
**Notes:** "Not worried about dupes."

---

## Spam Protection

**User's choice:** None for launch.
**Notes:** "No spam protection required for now."

---

## Prototype Route (/new-12345)

| Option | Description | Selected |
|--------|-------------|----------|
| Migrate both routes now | Point both `/` and `/new-12345` at the new endpoint; no Formspree left anywhere | ✓ |
| Only migrate the live page | Leave `/new-12345` on Formspree, handle at merge time | |

**User's choice:** Migrate both routes now.
**Notes:** User noted the dark theme will become the primary page later ("switch that to main page and merge"), so migrating the prototype now means it already works at merge time.

---

## Which Google Sheet? (clarifying question)

**User asked:** "Which google sheet it will write to?"
**Resolution:** The site never references the Sheet directly — it only holds the Apps Script Web App URL. The Sheet identity is encapsulated inside the Apps Script (container-bound or `openById`). Captured in CONTEXT.md as a provisioning dependency (D-02, D-10).

---

## Claude's Discretion

- Request body encoding (JSON string vs URL-encoded), as long as it stays a preflight-free simple request.
- Config module field name/shape for the endpoint URL; error-message copy.
- How the `source` value is derived, as long as `/` vs `/new-12345` are distinguishable.

## Deferred Ideas

- Dark theme (`/new-12345`) becoming the primary page + "switch & merge" effort — future, out of scope for this milestone.
- Confirmation email to registrants (REG-05) — v2.
- Spam protection / rate limiting — declined for launch; revisit if junk rows appear.
