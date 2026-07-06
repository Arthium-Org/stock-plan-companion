<!-- GSD:project-start source:PROJECT.md -->

## Project

**Stock Plan Companion — Marketing Site**

The public marketing/landing site (arthium.org) for **Stock Plan Companion**, a downloadable desktop app that helps E*TRADE users prepare foreign-asset tax disclosures (India Schedule FA / ITR compliance). The site explains what the app does, shows blurred screenshots, surfaces relevant compliance news, and lets visitors register (email) to download the signed installer. It is a static SvelteKit site prerendered to GitHub Pages.

This milestone is a **launch-polish cycle**: wire up the real download, replace the registration backend so it scales past the free tier, and fix stale contact/repo links before going live.

**Core Value:** A visitor can understand what the app does and download the **correct, working build** after registering — with every registration **reliably captured** (no monthly submission cap).

### Constraints

- **Tech stack**: Must stay a static, prerendered SvelteKit site (no server) — GitHub Pages has no backend, so the form backend must be a third-party HTTP endpoint (Google Apps Script) called client-side.
- **Distribution**: Installers delivered via GitHub Releases on the public `stock-plan-companion-app` repo.
- **Platform**: macOS build is Apple Silicon (arm64) only at launch; Windows pending.
- **Node**: 22+ required for local build (Node 18 breaks installs).

<!-- GSD:project-end -->

<!-- GSD:stack-start source:codebase/STACK.md -->

## Technology Stack

## Languages

- TypeScript 5.0.0 - Frontend components and configuration
- Svelte 5.0.0 - UI framework and component logic
- JavaScript (ES modules) - Node.js scripts and configuration files

## Runtime

- Node.js 22+ (specified in `.nvmrc`)
- npm (version 3 lockfile format)
- Lockfile: `package-lock.json` (present, enforced)

## Frameworks

- SvelteKit 2.22.0 - Full-stack meta-framework with routing and SSR/SSG
- Vite 7.0.4 - Build tool and dev server
- Tailwind CSS 3.4.11 - Utility-first CSS framework
- @lucide/svelte 1.23.0 - Icon library (primary)
- lucide-svelte 1.0.1 - Icon library (secondary, legacy import)
- Vitest 3.2.3 - Unit and integration test runner
- @vitest/browser 3.2.3 - Browser-based testing environment
- vitest-browser-svelte 0.1.0 - Svelte component testing adapter
- Playwright 1.53.0 - Browser automation for browser tests
- autoprefixer 10.4.16 - PostCSS plugin for vendor prefixes

## Key Dependencies

- @sveltejs/kit 2.22.0 - Provides routing, SSG, and SvelteKit ecosystem
- @sveltejs/vite-plugin-svelte 6.0.0 - Integrates Svelte with Vite
- @sveltejs/adapter-static 3.0.10 - Static site generation adapter for GitHub Pages deployment
- svelte-check 4.0.0 - Type checking for Svelte components

## Configuration

- No `.env` files required - static site with no backend secrets
- Configuration is compile-time via `svelte.config.js`
- External integrations hardcoded in components (static markdown-style site)
- `vite.config.ts` - Vite build configuration with SvelteKit plugin
- `svelte.config.js` - SvelteKit configuration with static adapter
- `tsconfig.json` - TypeScript strict mode enabled
- `.prettierrc` - Prettier formatter (tabs, 100px width, Tailwind plugin enabled)
- `eslint.config.js` - ESLint with TypeScript, Svelte, and Prettier integration
- `vitest-setup-client.ts` - Browser test environment setup

## Platform Requirements

- Node.js 22 or higher
- npm v10+ (implied by Node 22)
- Modern browser for Vite dev server and browser-based tests
- Static hosting (GitHub Pages primary target)
- No runtime dependencies required beyond HTML/CSS/JS
- Prerendered at build time to plain HTML, CSS, and JavaScript files
- Directory: `build/`
- Format: Static HTML with inlined or bundled CSS/JS
- Compression: `precompress: false` in SvelteKit config (GitHub Pages handles gzip)

<!-- GSD:stack-end -->

<!-- GSD:conventions-start source:CONVENTIONS.md -->

## Conventions

## Naming Patterns

- **Svelte components:** PascalCase (e.g., `BlurredScreenshot.svelte`)
- **SvelteKit routes:** Conventional kit structure: `+page.svelte`, `+layout.svelte`, `+layout.ts` for route files
- **TypeScript files:** camelCase for utilities and helpers (e.g., `app.d.ts`, `+layout.ts`)
- **Test files:** camelCase with `.test.ts`, `.spec.ts`, or `.svelte.test.ts` suffix
- camelCase for all functions (e.g., `nextScreenshot()`, `prevScreenshot()`, `handleFormSubmit()`, `frame()`)
- Event handlers prefixed with `handle` (e.g., `handleFormSubmit`)
- Callback functions use explicit names reflecting their purpose (e.g., `pause`, `resume`)
- camelCase for local variables and state (e.g., `formSubmitted`, `formLoading`, `formError`, `activeScreenshot`, `downloadLinks`)
- camelCase for reactive properties in Svelte (e.g., `let formError = ''`)
- Constants use camelCase (e.g., `features = [...]`, `screenshots = [...]`)
- PascalCase for type names (e.g., `HTMLElement`, `HTMLFormElement`)
- Svelte component props typed inline (e.g., `export let src: string`, `export let blurRegions: Array<{...}>`)

## Code Style

- Tool: Prettier v3.4.2
- Indent: **tabs** (4 spaces equivalent)
- Quotes: **single quotes** for strings and imports
- Trailing commas: **none**
- Line width: **100 characters**
- Plugins: `prettier-plugin-svelte`, `prettier-plugin-tailwindcss` (for class organization)
- Tool: ESLint v9.18.0
- Config: `eslint.config.js` (flat config format)
- Plugins: `@eslint/js`, `typescript-eslint`, `eslint-plugin-svelte`
- Integration: Prettier via `eslint-config-prettier` to avoid formatting conflicts
- TypeScript strict mode enabled via `tsconfig.json` with `strict: true`

## Import Organization

- `$lib/` - Points to `src/lib/` (for shared components and utilities)
- Standard SvelteKit aliases: `$app`, `$env` for app and environment modules

## Error Handling

- Try-catch blocks for async operations (e.g., fetch calls)
- User-friendly error messages stored in reactive variables
- Error state management via dedicated variables (e.g., `formError: ''`)
- Fallback behavior when operations fail

## Logging

- Not heavily used in current codebase
- Comments preferred over console logs for code documentation
- Errors are captured and displayed to users via UI state

## Comments

- Complex logic requiring explanation (e.g., animation timing, scroll behavior calculations)
- Non-obvious implementation details (e.g., "one copy of the card set" for compliance ticker)
- TODO items for future work (e.g., "TODO: update these direct-download URLs on EVERY release")
- Accessibility and UX considerations

## Function Design

- Event handlers: 2-30 lines
- Utility functions: 1-10 lines
- Explicit typing required (e.g., `e: Event`)
- Type casting where necessary (e.g., `e.target as HTMLFormElement`)
- Default parameters used for optional values (e.g., `blurRegions: Array<{...}> = []`)
- Async functions return Promises implicitly via `async/await`
- Event handlers typically return void
- Pure functions return computed/transformed values

## Module Design

- Named exports for components: `export let src: string` for props in Svelte
- Default exports for Svelte components
- SvelteKit special exports: `export const prerender = true`
- Component + related styles colocated (Svelte files include `<style>` blocks)
- Route handlers and loaders in `+page.svelte` and `+layout.ts`
- Shared components in `src/lib/`

## CSS and Styling

- Components: `.btn-primary`, `.section-container`, `.compliance-ticker`
- Utilities: Inline Tailwind classes (e.g., `px-4 py-3 rounded-lg`)
- Custom CSS: Defined in `src/app.css` using `@layer components`

<!-- GSD:conventions-end -->

<!-- GSD:architecture-start source:ARCHITECTURE.md -->

## Architecture

## System Overview

```text

```

## Component Responsibilities

| Component | Responsibility | File |
|-----------|----------------|------|
| Root Layout | Inject global styles, render children via slot pattern | `src/routes/+layout.svelte` |
| Landing Page | Main content: hero, features, screenshots gallery, registration form | `src/routes/+page.svelte` |
| BlurredScreenshot | Render image with sensitive regions blurred via backdrop-filter | `src/lib/BlurredScreenshot.svelte` |
| Preview Route | Alternative dark-theme UI prototype (scoped CSS variables) | `src/routes/new-12345/+page.svelte` |
| Layout Config | Set prerender: true for static site generation | `src/routes/+layout.ts` |
| Global Styles | Tailwind directives, animations, utility classes, theme system | `src/app.css` |

## Pattern Overview

- **Framework**: SvelteKit 2.x with `adapter-static`
- **Build**: Vite → prerendered HTML/CSS/JS → `build/` directory
- **Rendering**: 100% static (all pages prerendered at build time)
- **Interactivity**: Client-side Svelte reactivity (forms, galleries, auto-scrolling ticker)
- **Styling**: Tailwind CSS with PostCSS + custom component classes
- **Deployment**: GitHub Pages (static hosting)

## Layers

- Purpose: Define URL paths and entry points to the application
- Location: `src/routes/`
- Contains: Svelte page components (`+page.svelte`), layout wrappers (`+layout.svelte`), data loaders (`+layout.ts`)
- Depends on: Component library (`src/lib/`), styling (`src/app.css`)
- Used by: Browser — routes match file paths directly (SvelteKit convention)
- Purpose: Reusable UI building blocks with encapsulated logic and styling
- Location: `src/lib/`
- Contains: Svelte components (`.svelte` files)
- Depends on: External libraries (Lucide icons), global styles
- Used by: Route components and other components
- Purpose: Define theme tokens, animations, utility classes, and reset styles
- Location: `src/app.css`
- Contains: Tailwind directives (@tailwind, @layer), CSS custom properties (--bg, --text, etc.), keyframe animations
- Depends on: Tailwind CSS
- Used by: All components via Tailwind class names and @apply directives
- Purpose: Images, icons, downloadable files, externally hosted resources
- Location: `static/` (local assets), CDN (external images)
- Contains: Favicon, downloaded files
- Depends on: None (served as-is)
- Used by: Components and browser requests

## Data Flow

### Primary Request Path: Page Load → Render → Interact

- Browser → `build/index.html` (prerendered from `src/routes/+page.svelte`)
- Styles loaded: `build/_app/immutable/*.css`
- Scripts loaded: `build/_app/immutable/*.js`

### Secondary Flow: Form Submission

### Tertiary Flow: Screenshot Gallery Navigation

### Compliance Ticker: Auto-Scroll with User Pause

- All state is local to components (reactive variables via `let` declarations)
- No global state management (Svelte stores not used)
- Form state: `formSubmitted`, `formLoading`, `formError`, `downloadLinks`
- Gallery state: `activeScreenshot`
- Ticker state: `paused`, `target`, internal RAF loop

## Key Abstractions

- Purpose: Two-column responsive grid on desktop, single-column on mobile
- Examples: `src/routes/+page.svelte` lines 227–270 define grid with sidebar
- Pattern: CSS Grid with `lg:` breakpoints; sidebar sticky on desktop, stacks below hero on mobile
- Purpose: Render multiple informational cards (news, warnings, solutions) in a scrollable ticker
- Examples: `src/routes/+page.svelte` lines 647–741 (snippet `complianceCards()`)
- Pattern: Svelte snippet (reusable template) duplicated in DOM for seamless loop
- Purpose: Mask sensitive image regions using CSS `backdrop-filter: blur()`
- Examples: `src/lib/BlurredScreenshot.svelte`
- Pattern: Calculate overlay positions via component props; render `<div>` with absolute positioning
- Purpose: Grid of feature boxes with one marked as "PRIMARY" (wider, distinct styling)
- Examples: `src/routes/+page.svelte` lines 282–306 (conditional styling based on `feature.highlight`)
- Pattern: Conditional CSS classes and z-index layering
- Purpose: Reusable button appearances (primary, secondary, icon buttons)
- Examples: `.btn-primary`, `.btn-secondary` in `src/app.css` lines 16–22
- Pattern: Tailwind @apply directives for composable utility classes

## Entry Points

- Location: `src/routes/+page.svelte`
- Triggers: Browser navigation to `/`
- Responsibilities: Render full landing page with hero, features, gallery, registration form, compliance ticker
- Location: `src/routes/new-12345/+page.svelte`
- Triggers: Browser navigation to `/new-12345`
- Responsibilities: Prototype dark-theme UI (scoped styling with CSS variables)
- Location: `src/routes/+layout.svelte`
- Triggers: All page renders (wraps all routes)
- Responsibilities: Import global styles, render children slot
- Location: `src/routes/+layout.ts`
- Triggers: On build (SvelteKit prerender)
- Responsibilities: Set `export const prerender = true` to enable static site generation

## Architectural Constraints

- **Static only**: No server-side logic. All pages prerendered at build time. External API calls (Formspree) happen client-side.
- **Global state**: None (no Svelte stores or shared reactive state). Each component manages its own local state.
- **Circular imports**: None detected. Imports flow: routes → lib → styles.
- **CSS scope**: Global styles in `src/app.css`. Component-scoped styles in `<style>` blocks. Preview route uses BEM-like naming (`.spc-v2`) to isolate theme.
- **Prerendering**: All pages prerendered (including root layout). External links must be hardcoded (no dynamic content).
- **Client-side only**: No server functions, API endpoints, or backend integration except form submission.
- **Event loop**: Single-threaded JavaScript execution. RAF loop for ticker animation pauses on user interaction to avoid janky scrolling.

## Anti-Patterns

### Hardcoded Download Links in Form Handler

- Move download links to a `src/lib/config.ts` file with version number
- OR fetch latest release metadata from GitHub API at build time via `svelte.config.js` preprocess hook
- OR store links in `src/routes/+layout.ts` as load data passed to all pages

### TODO Comment with Placeholder Link Updates

### Responsive Ticker Only Works on Desktop

## Error Handling

- Form submission errors caught and stored in `formError` state (lines 193–197)
- User sees error message inline (line 581)
- No logging or error tracking (no Sentry/LogRocket)
- Unhandled errors fall through to browser console (no global error handler)

## Cross-Cutting Concerns

<!-- GSD:architecture-end -->

<!-- GSD:skills-start source:skills/ -->

## Project Skills

No project skills found. Add skills to any of: `.claude/skills/`, `.agents/skills/`, `.cursor/skills/`, `.github/skills/`, or `.codex/skills/` with a `SKILL.md` index file.
<!-- GSD:skills-end -->

<!-- GSD:workflow-start source:GSD defaults -->

## GSD Workflow Enforcement

Before using Edit, Write, or other file-changing tools, start work through a GSD command so planning artifacts and execution context stay in sync.

Use these entry points:

- `/gsd-quick` for small fixes, doc updates, and ad-hoc tasks
- `/gsd-debug` for investigation and bug fixing
- `/gsd-execute-phase` for planned phase work

Do not make direct repo edits outside a GSD workflow unless the user explicitly asks to bypass it.
<!-- GSD:workflow-end -->

<!-- GSD:profile-start -->

## Developer Profile

> Profile not yet configured. Run `/gsd-profile-user` to generate your developer profile.
> This section is managed by `generate-claude-profile` -- do not edit manually.
<!-- GSD:profile-end -->
