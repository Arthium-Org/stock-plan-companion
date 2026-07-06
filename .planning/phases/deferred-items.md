# Deferred Items

## Quick task 260707-05y (promote dark-themed landing page)

- **Pre-existing ESLint errors in promoted `src/routes/+page.svelte`** (11 errors:
  `@typescript-eslint/no-unused-vars` on unused `e`/`error` catch bindings,
  `svelte/require-each-key` on several `{#each}` blocks without a key expression,
  and `svelte/no-navigation-without-resolve` on the `href={macDownloadUrl}` anchor).
  Confirmed via `git show HEAD~2:src/routes/+page.svelte | npx eslint --stdin` that
  the previous light-themed page already had 6 equivalent pre-existing errors
  (including the same `no-navigation-without-resolve` on that same anchor), and
  confirmed via `npx eslint src/routes/new-12345/+page.svelte` (pre-deletion) that
  10 of the 11 errors already existed in the prototype source being promoted. Out
  of scope for this promotion task per its own "promotion, not a redesign"
  constraint (no restyle/refactor beyond the 4 listed edits + the Rule 2 download-
  link preservation). Not fixed.
