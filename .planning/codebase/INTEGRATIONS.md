# External Integrations

**Analysis Date:** 2026-07-06

## APIs & External Services

**Form Processing:**
- Formspree - Email form backend for newsletter signups
  - Endpoint: `https://formspree.io/f/xvzjdkaj`
  - Method: POST (multipart/form-data)
  - No API key required (form ID embedded in frontend)
  - Used in: `src/routes/+page.svelte` (lines ~193-211), `src/routes/new-12345/+page.svelte`

**Image CDN:**
- Builder.io - Hosted image assets and optimization
  - Base URL: `https://cdn.builder.io/api/v1/image/assets%2F7d68e2c336764378935ec3f2f539f5e9%2F[assetId]`
  - Screenshots served via CDN with WebP format and responsive width parameters
  - Used in: `src/routes/+page.svelte` (screenshots array), `src/routes/new-12345/+page.svelte`
  - No authentication required (public CDN URLs)

**Release Distribution:**
- GitHub Releases - Binary downloads for desktop app
  - Endpoint pattern: `https://github.com/Arthium-Org/stock-plan-companion/releases/download/<tag>/<filename>`
  - macOS: `.dmg` files
  - Windows: `.exe` files
  - Used in: `src/routes/+page.svelte` (downloadLinks), `src/routes/new-12345/+page.svelte`
  - Current version hardcoded as v1.0.0 (TODO: requires manual update on release)

## Data Storage

**Databases:**
- None - Static site with no backend data persistence

**File Storage:**
- Local filesystem only - Users download files from their E*TRADE accounts locally
- No cloud storage integration
- Desktop app (built separately) handles local file parsing

**Caching:**
- HTTP browser cache via static assets
- No server-side caching (static site)

## Authentication & Identity

**Auth Provider:**
- None - Public marketing site with no user accounts

**Newsletter/Contact:**
- Email collected via Formspree form (`src/routes/+page.svelte`)
- No user database or authentication system

## Monitoring & Observability

**Error Tracking:**
- Not implemented
- No Sentry, Rollbar, or similar error monitoring

**Logs:**
- Browser console only (development)
- No server-side logging (static site)

## CI/CD & Deployment

**Hosting:**
- GitHub Pages
- Domain: arthium.org (via CNAME file)
- Static adapter: @sveltejs/adapter-static
- Built files output to `build/` directory

**CI Pipeline:**
- GitHub Actions (inferred from SvelteKit GitHub Pages documentation)
- Build command: `npm run build`
- Deploy to gh-pages branch or GitHub Pages settings

## Environment Configuration

**Required env vars:**
- None - No environment variables used in production

**Secrets location:**
- No secrets required
- Formspree endpoint ID is public (embedded in form action)

**Configuration locations:**
- Hardcoded URLs in components for:
  - Builder.io image CDN: `src/routes/+page.svelte` (lines 73-116)
  - Formspree endpoint: `src/routes/+page.svelte` (line ~194)
  - GitHub download links: `src/routes/+page.svelte` (line ~211)

## Webhooks & Callbacks

**Incoming:**
- None

**Outgoing:**
- Formspree callbacks: Form responses sent to email (via Formspree's backend)
- No custom webhook logic in this codebase

---

*Integration audit: 2026-07-06*
