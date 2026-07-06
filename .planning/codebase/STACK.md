# Technology Stack

**Analysis Date:** 2026-07-06

## Languages

**Primary:**
- TypeScript 5.0.0 - Frontend components and configuration
- Svelte 5.0.0 - UI framework and component logic

**Secondary:**
- JavaScript (ES modules) - Node.js scripts and configuration files

## Runtime

**Environment:**
- Node.js 22+ (specified in `.nvmrc`)

**Package Manager:**
- npm (version 3 lockfile format)
- Lockfile: `package-lock.json` (present, enforced)

## Frameworks

**Core:**
- SvelteKit 2.22.0 - Full-stack meta-framework with routing and SSR/SSG
- Vite 7.0.4 - Build tool and dev server

**UI & Styling:**
- Tailwind CSS 3.4.11 - Utility-first CSS framework
- @lucide/svelte 1.23.0 - Icon library (primary)
- lucide-svelte 1.0.1 - Icon library (secondary, legacy import)

**Testing:**
- Vitest 3.2.3 - Unit and integration test runner
- @vitest/browser 3.2.3 - Browser-based testing environment
- vitest-browser-svelte 0.1.0 - Svelte component testing adapter
- Playwright 1.53.0 - Browser automation for browser tests

**Build/Dev:**
- autoprefixer 10.4.16 - PostCSS plugin for vendor prefixes

## Key Dependencies

**Critical:**
- @sveltejs/kit 2.22.0 - Provides routing, SSG, and SvelteKit ecosystem
- @sveltejs/vite-plugin-svelte 6.0.0 - Integrates Svelte with Vite

**Infrastructure:**
- @sveltejs/adapter-static 3.0.10 - Static site generation adapter for GitHub Pages deployment
- svelte-check 4.0.0 - Type checking for Svelte components

## Configuration

**Environment:**
- No `.env` files required - static site with no backend secrets
- Configuration is compile-time via `svelte.config.js`
- External integrations hardcoded in components (static markdown-style site)

**Build:**
- `vite.config.ts` - Vite build configuration with SvelteKit plugin
- `svelte.config.js` - SvelteKit configuration with static adapter
- `tsconfig.json` - TypeScript strict mode enabled

**Code Quality:**
- `.prettierrc` - Prettier formatter (tabs, 100px width, Tailwind plugin enabled)
- `eslint.config.js` - ESLint with TypeScript, Svelte, and Prettier integration
- `vitest-setup-client.ts` - Browser test environment setup

## Platform Requirements

**Development:**
- Node.js 22 or higher
- npm v10+ (implied by Node 22)
- Modern browser for Vite dev server and browser-based tests

**Production:**
- Static hosting (GitHub Pages primary target)
- No runtime dependencies required beyond HTML/CSS/JS
- Prerendered at build time to plain HTML, CSS, and JavaScript files

**Build Output:**
- Directory: `build/`
- Format: Static HTML with inlined or bundled CSS/JS
- Compression: `precompress: false` in SvelteKit config (GitHub Pages handles gzip)

---

*Stack analysis: 2026-07-06*
