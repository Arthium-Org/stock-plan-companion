# External Integrations

**Analysis Date:** 2026-07-03

## APIs & External Services

**Form Submission:**
- Formspree - Receives email signup/registration form submissions
  - Endpoint: `https://formspree.io/f/YOUR_FORM_ID`
  - Auth: None (client-side form submission)
  - Implementation: `src/routes/+page.svelte` (lines 131-137)
  - Note: Form ID placeholder needs to be configured

**Image CDN:**
- Builder.io - Hosts product screenshots and demonstration images
  - CDN URLs: `https://cdn.builder.io/api/v1/image/assets/...` 
  - Authentication: Public URLs (no auth required)
  - Usage: Screenshot display with blur overlays for sensitive data protection
  - Implementation: `src/routes/+page.svelte` (lines 25-79)
  - Image Assets:
    - Portfolio View screenshot
    - Tax Centre - Capital Gains screenshot
    - Tax Centre - Schedule FA screenshot
    - Tax Filing Assistant screenshot
    - Sell Advisor screenshot
    - Benefits History screenshot
    - Upload Interface screenshot

**Code Repository:**
- GitHub - Hosted repository and release downloads
  - Placeholder links in code point to `https://github.com` and `https://github.com/yourusername/stock-plan-companion/releases`
  - Implementation: `src/routes/+page.svelte` (lines 172-177, 609-616)
  - Note: URLs need to be configured with actual repository details

## Data Storage

**Databases:**
- Not detected - This is a frontend web application with no backend data persistence

**File Storage:**
- Builder.io CDN (for static images/screenshots)
- Local Browser Storage (Implied by SvelteKit for state management)

**Caching:**
- HTTP caching via CDN (Builder.io)
- Browser caching (handled by HTTP headers)

## Authentication & Identity

**Auth Provider:**
- None detected in codebase
- Note: Desktop application may have its own auth, but landing page has no authentication

**Form Data Handling:**
- Formspree handles email registration (client-side form submission)
- No persistent user identity in this web application

## Monitoring & Observability

**Error Tracking:**
- Not detected - No error tracking service integration (Sentry, LogRocket, etc.)

**Logs:**
- Browser console logs only
- No centralized logging service

## CI/CD & Deployment

**Hosting:**
- Svelte Kit's `@sveltejs/adapter-auto` supports multiple platforms:
  - Node.js (default)
  - Vercel
  - Netlify
  - AWS Lambda
  - Deno
  - Cloudflare Workers
  - Others
- Builder.io configuration suggests potential local/builder.io deployment

**CI Pipeline:**
- Not detected - No GitHub Actions, GitLab CI, or other CI/CD workflows present
- Builder.io CLI commands configured in `builder.config.json`

## Environment Configuration

**Required env vars:**
- None explicitly configured in code
- Note: Formspree form ID should be set as environment variable (currently hardcoded as `YOUR_FORM_ID`)
- Note: GitHub repository URLs should be configured (currently hardcoded)

**Secrets location:**
- No secrets management detected
- Formspree endpoint exposed in client-side code (acceptable for this service type)

## Webhooks & Callbacks

**Incoming:**
- None detected

**Outgoing:**
- Formspree receives POST requests from registration form
  - Endpoint: `https://formspree.io/f/{FORM_ID}`
  - Method: POST
  - Headers: `Accept: application/json`
  - Implementation: `src/routes/+page.svelte` (handleFormSubmit function)

## Content Delivery

**CDN:**
- Builder.io CDN for image assets
  - Format: WebP with quality optimization
  - Responsive images with width/height optimization
  - Used for all product demonstration screenshots

## Third-Party Scripts

**Icons:**
- Lucide SVelte Icon Library (@lucide/svelte) - No external script dependency
- lucide-svelte package - Bundled icon system (no runtime requests)

---

*Integration audit: 2026-07-03*
