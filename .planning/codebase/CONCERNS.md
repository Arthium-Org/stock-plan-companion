# Codebase Concerns

**Analysis Date:** 2026-07-03

## Tech Debt

**Package Configuration Mismatch:**
- Issue: `package.json` defines `"name": "fusion-svelte-vite-starter"` but project is actually "stock-plan-companion". Name should reflect the actual project.
- Files: `package.json`
- Impact: Confusion about project identity, incorrect package metadata if published, CI/CD tooling may reference wrong name
- Fix approach: Update `package.json` name field to `"stock-plan-companion"`

**Duplicate Icon Library Dependencies:**
- Issue: Both `@lucide/svelte` (1.23.0) and `lucide-svelte` (1.0.1) are installed in dependencies
- Files: `package.json`, `src/routes/+page.svelte` (only imports from `@lucide/svelte`)
- Impact: Bloated bundle size, maintenance burden, confusion about which package to use
- Fix approach: Remove `lucide-svelte` from `package.json` and ensure all imports use only `@lucide/svelte`

**Hardcoded Placeholder Values in Production Code:**
- Issue: Form handler contains hardcoded placeholder strings that should be environment variables:
  - Formspree form ID: `'https://formspree.io/f/YOUR_FORM_ID'` (line 131)
  - Release download URLs: `'https://github.com/yourusername/stock-plan-companion/releases'` (lines 144-146)
- Files: `src/routes/+page.svelte` (lines 131, 144-146)
- Impact: Form submissions will fail in production. Download links point to nonexistent URLs. Security risk if credentials embedded in URLs.
- Fix approach: Extract to environment variables (e.g., `VITE_FORMSPREE_ID`, `VITE_GITHUB_RELEASES_URL`). Create `.env.example` template with required variables.

**Placeholder README Documentation:**
- Issue: `README.md` is the default Svelte CLI template, not project-specific documentation
- Files: `README.md`
- Impact: No documentation for contributors or users about what this project actually does, how to contribute, or how to build/deploy
- Fix approach: Replace with real documentation covering: project purpose, features, getting started, architecture, contribution guide, license

**Navigation Links Point to Generic GitHub:**
- Issue: Multiple hardcoded href links point to `"https://github.com"` without specific repository
- Files: `src/routes/+page.svelte` (lines 172, 204, 610, 628)
- Impact: Users cannot navigate to the actual project repository. Breaks primary CTA for open source contribution
- Fix approach: Define repository URL in environment variable and reference throughout, e.g., `VITE_GITHUB_REPO_URL`

**Placeholder .env Example Missing:**
- Issue: `.gitignore` specifies `.env` files but no `.env.example` template exists
- Files: `.gitignore`, (missing) `.env.example`
- Impact: New developers don't know which environment variables are required or how to configure them
- Fix approach: Create `.env.example` with placeholders for: `VITE_FORMSPREE_ID`, `VITE_GITHUB_REPO_URL`, `VITE_GITHUB_RELEASES_URL`

## Known Bugs

**Form Submission Never Completes in Production:**
- Symptoms: Form shows "Registering..." indefinitely or shows error, download links never appear
- Files: `src/routes/+page.svelte` (lines 123-157)
- Trigger: User submits registration form when `VITE_FORMSPREE_ID` is not configured
- Root cause: `fetch()` call uses hardcoded `YOUR_FORM_ID` placeholder which is invalid endpoint
- Workaround: Configure proper Formspree form ID in environment before deployment

**Generic "Try Again" Error Messages:**
- Symptoms: User sees "An error occurred. Please try again." with no debugging information
- Files: `src/routes/+page.svelte` (lines 150-153)
- Trigger: Any network error, validation error, or API failure
- Root cause: Catch block swallows error details and shows generic message
- Impact: Users cannot understand why form failed, developers cannot debug production issues

## Security Considerations

**Unvalidated External Image CDN:**
- Risk: All screenshot images hardcoded to `cdn.builder.io` with specific asset IDs. If CDN is compromised or URLs change, images break and may expose builder.io infrastructure details.
- Files: `src/routes/+page.svelte` (lines 25-80, 220, 505)
- Current mitigation: CDN URLs are public/read-only, HTTPS used
- Recommendations: 
  - Consider self-hosting screenshots in `/static` directory for security and reliability
  - If using external CDN, use signed URLs or API keys in environment variables
  - Add fallback images for CDN failures

**No Content Security Policy:**
- Risk: Fetching from `formspree.io` and `cdn.builder.io` with no CSP headers to restrict external resource loading
- Files: `src/routes/+page.svelte` (lines 131)
- Current mitigation: None - relies on same-origin policy
- Recommendations: 
  - Add CSP headers in `svelte.config.js` to explicitly whitelist external domains
  - Document why each external domain is needed

**Untyped Error Catch:**
- Risk: Error object in catch block is not typed, could be non-Error object, leading to unsafe property access
- Files: `src/routes/+page.svelte` (line 152: `catch (error) { ... }`)
- Current mitigation: Generic message shown, error not logged
- Recommendations: Type the error as `unknown`, check type before accessing properties, log structured errors

**No Form Input Validation Beyond HTML:**
- Risk: Email field only has HTML5 `required` attribute. No custom validation, no sanitization before sending to Formspree
- Files: `src/routes/+page.svelte` (lines 541-555)
- Current mitigation: Browser HTML5 validation
- Recommendations:
  - Add client-side validation for email format before submission
  - Validate form data structure on server-side if moving to API route
  - Sanitize form fields to prevent XSS if data is ever displayed back to user

## Performance Bottlenecks

**No Image Lazy Loading:**
- Problem: All 6 screenshot images in gallery load at once, even if user only views 1-2. Each screenshot is large (800x1200 webp from CDN).
- Files: `src/routes/+page.svelte` (lines 24-79, 304-328)
- Cause: `<img>` tags lack `loading="lazy"` attribute, thumbnails have full-resolution images loaded
- Improvement path: 
  - Add `loading="lazy"` to all screenshot img tags
  - Generate thumbnail versions (200x300px) for gallery preview
  - Implement placeholder or skeleton loading for gallery

**Form Submission with No Timeout:**
- Problem: Form submission can hang indefinitely if Formspree endpoint is slow/unresponsive
- Files: `src/routes/+page.svelte` (lines 131-137)
- Cause: Fetch request has no timeout, no AbortController
- Improvement path:
  - Add 30-second timeout using AbortController
  - Show timeout error message distinct from submission errors
  - Allow user to retry after timeout

**Large Component (678 lines in single Svelte file):**
- Problem: `+page.svelte` is 678 lines containing entire landing page layout, logic, and styling in one component
- Files: `src/routes/+page.svelte`
- Cause: No component extraction for reusable sections (hero, features, gallery, form, footer)
- Improvement path:
  - Extract into separate components: `HeroSection.svelte`, `FeaturesGrid.svelte`, `ScreenshotGallery.svelte`, `RegistrationForm.svelte`, `Footer.svelte`
  - Reduces cognitive load, improves maintainability, enables code reuse

**Duplicate Screenshot Data:**
- Problem: Screenshot objects defined in array (lines 24-80) but same URLs duplicated in template (lines 220, 505)
- Files: `src/routes/+page.svelte`
- Cause: Manual copy-paste duplication
- Improvement path: Use single data array, reference in all template locations

## Fragile Areas

**Screenshot Gallery State Management:**
- Files: `src/routes/+page.svelte` (lines 17, 82-88, 262-328)
- Why fragile: `activeScreenshot` is number-only state tracking index. No bounds checking. If screenshots array changes length, navigation could go out of bounds. Modulo arithmetic is safe but tightly couples state to array length.
- Safe modification: Extract to separate component with local state. Add prop validation to ensure activeScreenshot < screenshots.length
- Test coverage: No tests for gallery navigation, edge cases (clicking next/prev at boundaries), or array mutation

**Form Error State:**
- Files: `src/routes/+page.svelte` (lines 14-16, 123-157)
- Why fragile: Three reactive variables (`formSubmitted`, `formLoading`, `formError`) manage complex state flow. No explicit state machine. Edge cases: what if response succeeds but downloadLinks never set? What if user submits twice rapidly?
- Safe modification: Create state machine enum (idle, loading, success, error) with single reactive variable instead of three booleans
- Test coverage: No tests for form states, error recovery, or rapid resubmissions

**BlurredScreenshot Component CSS Coupling:**
- Files: `src/lib/BlurredScreenshot.svelte`, `src/routes/+page.svelte` (blur regions defined twice)
- Why fragile: Blur region positioning is hardcoded in two places (hero screenshot has separate config, gallery has different config). If crop changes, both locations must update. No validation that regions fit image bounds.
- Safe modification: Consolidate blur region data into single source. Add component prop validation for region dimensions.
- Test coverage: Component has no tests; blur effects untested

## Test Coverage Gaps

**Untested Main Landing Page:**
- What's not tested: Hero section, feature grid, screenshot gallery navigation, registration form, all sections
- Files: `src/routes/+page.svelte` (678 lines, only 1 minimal test in `page.svelte.test.ts`)
- Risk: Any refactoring or bug fix risks breaking UI without detection. Screenshot navigation could silently break. Form could stop working.
- Priority: High - this is the entire public-facing interface

**Placeholder Test File:**
- What's not tested: `src/demo.spec.ts` is a placeholder "sum test" that should be deleted
- Files: `src/demo.spec.ts`
- Risk: CI/CD runs this meaningless test; wastes execution time
- Priority: Medium - remove before production deployment

**No Form Submission Tests:**
- What's not tested: Form validation, submission flow, error handling, success flow with download links, Formspree integration
- Files: `src/routes/+page.svelte` lines 123-157
- Risk: Form is core feature but untested. Formspree configuration changes could silently break user registration.
- Priority: High

**No Component Unit Tests:**
- What's not tested: BlurredScreenshot component renders correctly, blur regions apply correctly, lazy loading, image error handling
- Files: `src/lib/BlurredScreenshot.svelte`
- Risk: Visual regressions undetected. Blur regions could be positioned incorrectly (revealing sensitive data in screenshots).
- Priority: High

**No Error Boundary Tests:**
- What's not tested: App has no error boundary. No tests for what happens if Formspree returns 500, if CDN images fail to load, if fetch throws
- Files: Entire codebase
- Risk: Unhandled errors cause white screen of death with no graceful fallback
- Priority: Medium

**No Accessibility Tests:**
- What's not tested: Keyboard navigation through gallery, form accessibility, screen reader support for form fields, ARIA labels
- Files: `src/routes/+page.svelte` entire file
- Risk: Users with disabilities cannot use app
- Priority: Medium

## Dependencies at Risk

**Lucide Svelte Version Drift:**
- Risk: Two different lucide packages installed at different versions (`@lucide/svelte` 1.23.0 vs `lucide-svelte` 1.0.1). Unclear which is canonical. One will likely become unmaintained.
- Impact: Build size bloated, unclear upgrade path, package confusion
- Migration plan: Standardize on `@lucide/svelte` which appears to be maintained version. Remove `lucide-svelte` from package.json.

**Playwright Version at 1.53.0:**
- Risk: Playwright 1.53.0 is relatively new; less battle-tested than older LTS versions. May have undiscovered bugs.
- Impact: E2E test failures on CI, compatibility issues with specific browser versions
- Mitigation: Lock Playwright to known-stable version (e.g., 1.40.x), test on CI before updating

**Svelte 5.0 - Major Version Boundary:**
- Risk: Svelte 5.0 is very recent release. Ecosystem tooling may lag in compatibility (svelte-check 4.0.0, vite-plugin-svelte 6.0.0 are close)
- Impact: Potential breaking changes in minor Svelte updates, community libraries may not support Svelte 5 yet
- Mitigation: Document Svelte 5.0 as minimum version, test ecosystem compatibility monthly

## Missing Critical Features

**No Environment Configuration System:**
- Problem: Form ID, GitHub URLs, and other config are hardcoded strings. No `.env` loading. No validation that required vars are set before build.
- Blocks: Cannot configure app for different environments (dev, staging, prod). Cannot run in different GitHub orgs.
- Fix: Implement `env.example` pattern, use `import.meta.env` for Vite environment variables, add build-time validation

**No Error Logging or Monitoring:**
- Problem: Form submission errors logged only to browser console. No centralized error tracking for production failures.
- Blocks: Cannot diagnose why forms fail in production. Cannot track user issues.
- Fix: Integrate error tracking service (Sentry, LogRocket) or implement basic server-side error logging

**No Loading States for CDN Images:**
- Problem: If cdn.builder.io is slow, page appears blank for seconds. No skeleton loaders or placeholders.
- Blocks: Poor user experience on slow connections
- Fix: Add loading skeleton or blurred placeholder while images load

**No Analytics Tracking:**
- Problem: Cannot see which features users view, form conversion rate, or which CTAs are clicked
- Blocks: Cannot measure product performance or user engagement
- Fix: Add Plausible, Fathom, or Google Analytics integration

## Scaling Limits

**Formspree Form Integration Limitations:**
- Current capacity: Formspree free tier supports ~50 emails/month typically
- Limit: Once app reaches more than ~50 registrations/month, free tier quota exceeded
- Scaling path: Upgrade to Formspree paid plan OR migrate to custom form backend service

**CDN Asset Delivery:**
- Current capacity: builder.io CDN is designed for high-traffic sites
- Limit: If app becomes popular, builder.io may rate-limit or remove free tier access
- Scaling path: Self-host screenshots in `/static` or use S3/Netlify/Vercel CDN

## Code Quality Issues

**No TypeScript Strict Typing in Some Areas:**
- Issue: Form data not typed. Fetch response not typed. Error object in catch not typed.
- Files: `src/routes/+page.svelte` (lines 124-153)
- Impact: Runtime errors possible, IDE autocomplete limited
- Fix: Define FormData interface, response interfaces from Formspree API, type error as unknown

**Inconsistent Naming:**
- Issue: Variable names: `formSubmitted`, `formLoading`, `formError`, `activeScreenshot`, `downloadLinks`, `screenshots` - mix of past tense and present
- Files: `src/routes/+page.svelte`
- Impact: Confuses intent, harder to maintain
- Fix: Standardize to present tense (`isFormSubmitted`, `isFormLoading`, `formErrorMessage`, `currentScreenshotIndex`)

**Magic Numbers and Strings:**
- Issue: Hardcoded animation delays (1000ms), blur pixel values (10px, 6px), button classes, colors
- Files: `src/routes/+page.svelte` (multiple lines), `src/lib/BlurredScreenshot.svelte`
- Impact: Difficult to maintain, magic values scattered, no single source of truth for theme
- Fix: Extract to `src/lib/constants.ts` or Tailwind config

**Inlined Styles and Classes:**
- Issue: Blur region styles inlined in template: `style="top: {region.top}; left: {region.left}; width: {region.width}; height: {region.height};"`
- Files: `src/routes/+page.svelte` (line 322), `src/lib/BlurredScreenshot.svelte` (line 21)
- Impact: Cannot reuse blur region styling, difficult to test, hard to modify in one place
- Fix: Extract to component prop or Svelte store

**No Input Sanitization:**
- Issue: Form inputs (name, email) sent directly to Formspree with no sanitization
- Files: `src/routes/+page.svelte` (lines 541-555)
- Impact: If ever displayed back or used server-side, XSS risk
- Fix: Sanitize with DOMPurify or equivalent before submission/display

---

*Concerns audit: 2026-07-03*
