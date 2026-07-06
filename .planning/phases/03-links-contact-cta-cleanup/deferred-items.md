# Deferred Items — Phase 3

## Out-of-scope discoveries (not fixed, logged per scope boundary)

| Category | Item | Status |
|----------|------|--------|
| Tooling | `npm run lint` (`prettier --check .`) crashes with `TypeError: getVisitorKeys is not a function or its return value is not iterable` on every `.svelte` file, including files untouched by this plan (`src/lib/BlurredScreenshot.svelte`, `src/routes/+layout.svelte`). Same pre-existing issue already documented in Phase 2's `deferred-items.md`; not introduced or worsened by plan 03-01's edits. Verified `eslint` (run directly, bypassing the crashing `prettier --check`) reports zero errors on `src/routes/+page.svelte`, `src/lib/downloads.ts`, and `src/lib/downloads.test.ts` after this plan's edits. `svelte-check` (`npm run check`) and `vite build` (`npm run build`) both pass clean. | Deferred — pre-existing, unrelated to plan 03-01 scope |
