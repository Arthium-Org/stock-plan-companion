# Deferred Items — Phase 2

## Out-of-scope discoveries (not fixed, logged per scope boundary)

| Category | Item | Status |
|----------|------|--------|
| Tooling | `npm run lint` (`prettier --check .`) crashes with `TypeError: getVisitorKeys is not a function or its return value is not iterable` on every `.svelte` file (confirmed on `src/routes/+layout.svelte`, `src/lib/BlurredScreenshot.svelte`, and both edited routes — pre-existing on unmodified files, not introduced by plan 02-01). Likely a `prettier` / `prettier-plugin-svelte` version mismatch. `eslint` (run directly, bypassing the crashing `prettier --check`) shows zero new errors introduced by this plan's edits — confirmed identical pre-existing error counts/messages on HEAD vs. edited files (`src/routes/+page.svelte`: 6 errors both before/after; `src/routes/new-12345/+page.svelte`: 11 errors both before/after). | Deferred — pre-existing, unrelated to plan 02-01 scope |
