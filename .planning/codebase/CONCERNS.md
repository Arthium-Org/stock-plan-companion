# Codebase Concerns

**Analysis Date:** 2026-07-06

## Tech Debt

**Manual release URL updates (Critical for release workflow):**
- Issue: Download links in `src/routes/+page.svelte` (lines 185-190) and `src/routes/new-12345/+page.svelte` (lines 210-215) are hard-coded with `v1.0.0` tag and exact filename — must be manually updated on every GitHub release
- Files: `src/routes/+page.svelte`, `src/routes/new-12345/+page.svelte`
- Impact: If release URLs aren't updated before deployment, users get links to wrong version. This is error-prone and blocks each release
- Fix approach: Automate via GitHub release template, or fetch release metadata from GitHub API client-side, or store URLs in a config file updated by CI/CD

**Code duplication across page routes:**
- Issue: `src/routes/+page.svelte` (786 lines) and `src/routes/new-12345/+page.svelte` (811 lines) are nearly identical, including:
  - Compliance ticker logic (lines 20-62 in both files)
  - Screenshot carousel logic (lines 119-150 in both files)
  - Form submission to Formspree (lines 166-199 in both files)
  - Feature definitions, screenshots arrays, and entire layout structure
- Files: `src/routes/+page.svelte`, `src/routes/new-12345/+page.svelte`
- Impact: Bug fixes and feature updates must be applied twice; maintenance burden increases; inconsistency risk
- Fix approach: Extract shared logic into reusable components (`TickerLogic.svelte`, `ScreenshotCarousel.svelte`, `RegistrationForm.svelte`); route files become thin wrappers that pass theme/styling variants

**Large monolithic Svelte components:**
- Issue: Both page routes are 786-811 lines in a single `.svelte` file, mixing layout, logic, form handling, and styling
- Files: `src/routes/+page.svelte` (786 lines), `src/routes/new-12345/+page.svelte` (811 lines)
- Impact: Difficult to test, reuse, or reason about; cognitive overhead; hard to maintain long-term
- Fix approach: Break into smaller components: `ComplianceTicker.svelte`, `ScreenshotViewer.svelte`, `FeatureGrid.svelte`, `RegistrationCard.svelte`, `StatusSection.svelte`

**Package metadata not updated:**
- Issue: `package.json` still contains default Vite starter values:
  - `"name": "fusion-svelte-vite-starter"` should be `"stock-plan-companion"`
  - `"version": "0.0.1"` doesn't match actual release version
- Files: `package.json`
- Impact: Confusing when publishing to npm or creating releases; build artifacts misleading
- Fix approach: Update package.json name/version in release CI/CD or manually before each release

**README not updated from template:**
- Issue: `README.md` still contains generic SvelteKit starter instructions (creating projects, development setup), not actual project documentation
- Files: `README.md`
- Impact: Users checking out the repo see irrelevant boilerplate; no guidance on contributions, building, or usage
- Fix approach: Replace with actual project README covering: what it is, how to build/run locally, how to contribute, deployment instructions

## Known Bugs

**Windows download button commented out indefinitely:**
- Symptoms: "Download for Windows" button permanently hidden in markup despite code being present
- Files: `src/routes/+page.svelte` (lines 607-611), `src/routes/new-12345/+page.svelte` (lines 628-632)
- Trigger: Form submission succeeds, but Windows link never shown — Windows users can only see macOS button
- Workaround: Uncomment lines 607-611 / 628-632 once .exe is built
- Impact: Windows users blocked from downloading; partial product launch

**Footer anchor links produce build warnings:**
- Symptoms: Build runs with warnings about missing `#privacy` and `#disclaimer` anchor targets
- Files: `svelte.config.js` (lines 20-24) sets `handleMissingId: 'warn'` as workaround for footer links
- Cause: Footer has `<a href="#privacy">Privacy</a>` and `<a href="#disclaimer">Disclaimer</a>` but no corresponding sections exist on the page
- Impact: Will break if `handleMissingId` is changed from 'warn' to 'error'; confusing for accessibility tools
- Fix approach: Either add real Privacy & Disclaimer sections to landing page, or remove the footer links entirely

## Security Considerations

**Formspree API key visible in source:**
- Risk: Formspree form ID `xvzjdkaj` is hard-coded in client-side code at `src/routes/+page.svelte` (line 174) and `src/routes/new-12345/+page.svelte` (line 199), visible in network requests
- Files: `src/routes/+page.svelte`, `src/routes/new-12345/+page.svelte`
- Current mitigation: Formspree is a form-submission-as-a-service, designed for this; submissions to a publicly-known form are expected
- Recommendations:
  - Monitor for spam submissions
  - Implement CAPTCHA or rate-limiting if spam occurs
  - Consider moving to server-side email collection (Svelte server action) for better control

**Contact email visible in footer:**
- Risk: `kvakatidev@gmail.com` appears in footer links at `src/routes/+page.svelte` (line 761) and `src/routes/new-12345/+page.svelte` (line 794)
- Files: `src/routes/+page.svelte`, `src/routes/new-12345/+page.svelte`
- Current mitigation: Email address is intentionally public for contact purposes
- Recommendations: Monitor inbox for spam; consider separate contact form instead of mailto: link

**No Privacy Policy or Terms of Service:**
- Risk: Site collects user emails via registration form but has no Privacy Policy. Site markets tax/financial record management, which is regulated in some jurisdictions
- Files: Landing page, no privacy docs
- Current mitigation: Footer has placeholder link `#privacy` but section missing
- Recommendations: Add Privacy Policy (email use, retention, third-party sharing), add Disclaimer (not tax/legal advice), add Terms of Service if user data is stored

## Performance Bottlenecks

**No optimizations for large screenshot assets:**
- Problem: Multiple screenshot images (up to 1200px height) loaded from Builder.io CDN via Query params; no lazy loading, srcset, or format hints
- Files: `src/routes/+page.svelte` (lines 73-117), `src/routes/new-12345/+page.svelte` (lines 98-142)
- Cause: Screenshots hardcoded as direct URLs; no adaptive image sizing
- Improvement path:
  - Add `loading="lazy"` to non-critical images
  - Use `srcset` with width variants (400, 600, 800, 1000)
  - Serve next-gen formats (AVIF, WebP) with fallback
  - Preload hero screenshot

**Compliance ticker animation runs on every frame:**
- Problem: `requestAnimationFrame` loop runs continuously in `onMount` at 60fps, even when ticker is off-screen on mobile
- Files: `src/routes/+page.svelte` (lines 33-45), `src/routes/new-12345/+page.svelte` (lines 58-70)
- Cause: No intersection observer to pause when not visible
- Improvement path: Use `IntersectionObserver` to disable RAF when ticker not in viewport; saves battery on mobile

## Fragile Areas

**Compliance ticker logic tightly coupled to DOM assumptions:**
- Files: `src/routes/+page.svelte` (lines 20-62), `src/routes/new-12345/+page.svelte` (lines 45-87)
- Why fragile:
  - Relies on exact DOM structure with `.contents` pseudo-element duplication for seamless scroll loop
  - Hard-coded `scrollHeight / 2` calculation assumes exactly 2 duplicate sets
  - Breaks if card heights change or more/fewer cards added
  - No error handling if `tickerEl` is null at unexpected times
- Safe modification:
  - Add assertions/guards: `if (!el || el.scrollHeight <= 0) return;`
  - Extract magic numbers (`30px/sec`, `half = scrollHeight / 2`) to constants
  - Add tests that verify scroll behavior with various card counts
- Test coverage: No tests for ticker logic; only basic H1 rendering test exists

**Form state management using local variables:**
- Files: `src/routes/+page.svelte` (lines 64-71), `src/routes/new-12345/+page.svelte` (lines 89-96)
- Why fragile: Form state (`formSubmitted`, `formError`, `formLoading`) managed with reactive variable declarations; no error handling for network failures; Formspree endpoint unreachable causes silent failure
- Safe modification:
  - Add fetch timeout
  - Log errors to console or error service
  - Add retry mechanism
  - Test with offline/slow network

**Hard-coded download links block release workflow:**
- Files: `src/routes/+page.svelte` (lines 188-189), `src/routes/new-12345/+page.svelte` (lines 213-214)
- Why fragile: Manual string edits prone to typos; easy to miss when releasing; version number changes break existing links
- Safe modification: See "Manual release URL updates" in Tech Debt section

## Scaling Limits

**Email capture via Formspree has no growth plan:**
- Current capacity: Formspree free tier typical limits (check their docs)
- Limit: If registration becomes popular, will hit Formspree rate limits or cost increases; no opt-in email backend
- Scaling path:
  - Switch to server-side email backend (nodemailer, SendGrid, AWS SES)
  - Implement database to store emails (SQLite, Postgres, Firebase)
  - Add unsubscribe link and list management
  - Track engagement metrics (open rates, click rates)

## Dependencies at Risk

**Lucide icon package duplication:**
- Risk: `package.json` depends on both `@lucide/svelte` (v1.23.0) and `lucide-svelte` (v1.0.1) — unclear why two versions
- Files: `package.json` lines 45-46
- Impact: Unnecessary bundle bloat; confusion about which to import
- Migration plan: Remove one (likely `lucide-svelte` is stale); audit code to confirm only one is used

**No lock file for reproducible builds (warning):**
- Risk: `package-lock.json` exists and should be committed, but verify it's in version control
- Files: `.gitignore`, `package-lock.json`
- Impact: If CI uses wrong Node/npm version or cache is cleared, builds may be non-reproducible
- Mitigation: Enforce `.nvmrc` (set to 22) in CI and locally

## Missing Critical Features

**Windows .exe not available:**
- Problem: Product marketed as desktop app but Windows version missing; download button commented out
- Blocks: Windows users from downloading; roadmap credibility questioned
- Status: Awaiting macOS Electron build; architecture TBD

**Privacy Policy and Terms not published:**
- Problem: Site collects emails but has no policy; tax/financial app with no disclaimers
- Blocks: Wide promotion; potential compliance issues depending on jurisdiction
- Status: Footer has placeholder link but page doesn't exist

## Test Coverage Gaps

**No integration tests for form submission:**
- What's not tested: `handleFormSubmit()` in both routes — form data validation, Formspree fetch, error handling, success state
- Files: `src/routes/+page.svelte` (lines 166-199), `src/routes/new-12345/+page.svelte` (lines 191-224)
- Risk: Silent failures; Formspree ID could be wrong and undetected until user tries to register
- Priority: High — form is critical feature

**No tests for compliance ticker animation:**
- What's not tested: Ticker scroll loop, pause/resume, reduce-motion respects, mobile breakpoint
- Files: `src/routes/+page.svelte` (lines 22-62), `src/routes/new-12345/+page.svelte` (lines 47-87)
- Risk: Animation could break silently; accessibility (prefers-reduced-motion) not validated
- Priority: Medium — visual feature, but affects UX

**No tests for screenshot carousel logic:**
- What's not tested: Next/previous navigation, wrapping at boundaries, thumbnail selection
- Files: `src/routes/+page.svelte` (lines 119-125), `src/routes/new-12345/+page.svelte` (lines 144-150)
- Risk: Off-by-one errors, broken carousel interaction undetected
- Priority: Medium — core UX feature

**No E2E tests:**
- What's not tested: Full user flow (view page → scroll → click register → submit form → see download links)
- Files: Entire site
- Risk: Regression in layout, navigation, or form flow not caught
- Priority: High — landing page is the whole product interface

**Existing tests are placeholder-level:**
- Files: `src/demo.spec.ts` (1+2=3 assertion), `src/routes/page.svelte.test.ts` (H1 exists)
- Risk: False confidence in test coverage; test infrastructure present but unused
- Priority: High — tests should provide real value

---

*Concerns audit: 2026-07-06*
