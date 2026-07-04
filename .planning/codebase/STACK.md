# Technology Stack

**Analysis Date:** 2026-07-03

## Languages

**Primary:**
- TypeScript 5.0 - All source code and configuration
- JavaScript - Build scripts and configuration files

**Runtime:**
- Node.js (ESM modules) - Development and build

## Runtime

**Environment:**
- Node.js (no specific version locked in `.nvmrc`)

**Package Manager:**
- npm (v10+) - Based on package-lock.json lockfileVersion 3
- Lockfile: `package-lock.json` (present)

## Frameworks

**Core:**
- Svelte 5.0 - Component framework
- Svelte Kit 2.22.0 - Full-stack web framework for routing, server-side rendering, and deployment
- `@sveltejs/adapter-auto` 6.0.0 - Auto-detection adapter for deployment targets

**Build/Dev:**
- Vite 7.0.4 - Lightning-fast build tool and dev server
- `@sveltejs/vite-plugin-svelte` 6.0.0 - Svelte integration for Vite

**Testing:**
- Vitest 3.2.3 - Unit test runner
- `@vitest/browser` 3.2.3 - Browser test environment
- `vitest-browser-svelte` 0.1.0 - Svelte component testing
- Playwright 1.53.0 - Headless browser automation for E2E tests

**Styling:**
- Tailwind CSS 3.4.11 - Utility-first CSS framework
- PostCSS - CSS transformation (via postcss.config.js)
- Autoprefixer 10.4.16 - CSS vendor prefixing

**Code Quality:**
- Prettier 3.4.2 - Code formatter
- `prettier-plugin-svelte` 3.3.3 - Svelte formatting support
- `prettier-plugin-tailwindcss` 0.6.11 - Tailwind class sorting
- ESLint 9.18.0 - Code linter
- `eslint-plugin-svelte` 3.0.0 - Svelte linting rules
- `typescript-eslint` 8.20.0 - TypeScript linting support
- `svelte-check` 4.0.0 - Static type checking for Svelte components

## Key Dependencies

**UI Components:**
- `@lucide/svelte` 1.23.0 - Lucide icon library for Svelte
- `lucide-svelte` 1.0.1 - Alternative Lucide icon package

**Development Tools:**
- `@eslint/js` 9.18.0 - ESLint base configuration
- `@eslint/compat` 1.2.5 - ESLint compatibility layer for older formats
- `globals` 16.0.0 - Global variable definitions for linting
- `eslint-config-prettier` 10.0.1 - Disables ESLint rules that conflict with Prettier

## Configuration Files

**Build & Bundling:**
- `vite.config.ts` - Vite build configuration with Svelte plugin and Vitest multi-project setup (client/browser and server/node environments)
- `svelte.config.js` - Svelte Kit configuration with auto adapter
- `tsconfig.json` - TypeScript compiler options extending `.svelte-kit/tsconfig.json`
- `postcss.config.js` - PostCSS plugins (Tailwind, Autoprefixer)
- `tailwind.config.js` - Tailwind CSS customization with custom animations (fade-in, slide-up)

**Code Quality:**
- `eslint.config.js` - ESLint configuration with TypeScript, Svelte, and Prettier integration
- `.prettierrc` (inferred from prettier usage) - Code formatter settings

**Build Orchestration:**
- `builder.config.json` - Builder.io configuration with dev server settings and allowed CLI commands for local development

## Platform Requirements

**Development:**
- Node.js (LTS or current recommended)
- npm with lockfile support
- Modern development OS (Windows, macOS, Linux)

**Production:**
- Auto-detected by Svelte Kit's `@sveltejs/adapter-auto` (supports Node.js, Vercel, Netlify, AWS Lambda, Deno, Cloudflare Workers, etc.)
- Browser: Modern browsers supporting ES modules and CSS Grid/Flexbox

---

*Stack analysis: 2026-07-03*
