# Codebase Structure

**Analysis Date:** 2026-07-03

## Directory Layout

```
stock-plan-companion/
├── .claude/                    # Claude Code configuration & workflows
├── .git/                       # Git version control
├── .planning/                  # GSD planning documents
│   └── codebase/              # Codebase analysis (this directory)
├── node_modules/              # Dependencies (not committed)
├── src/                       # Source code
│   ├── lib/                   # Reusable components and utilities
│   │   ├── BlurredScreenshot.svelte
│   │   └── index.ts
│   ├── routes/                # SvelteKit route files
│   │   ├── +layout.svelte     # Root layout (global styles)
│   │   ├── +page.svelte       # Home page (landing page)
│   │   └── page.svelte.test.ts
│   ├── static/                # Static assets (favicon, etc)
│   │   └── favicon.svg
│   ├── app.css                # Global Tailwind directives
│   ├── app.d.ts               # TypeScript declarations
│   └── app.html               # Root HTML template
├── static/                    # Public static files served as-is
│   └── favicon.svg
├── .eslintrc.js               # ESLint configuration
├── eslint.config.js           # ESLint config (flat config)
├── package.json               # Project dependencies & scripts
├── package-lock.json          # Dependency lock file
├── postcss.config.js          # PostCSS configuration
├── README.md                  # Project readme (outdated starter template)
├── svelte.config.js           # SvelteKit configuration
├── tailwind.config.js         # Tailwind CSS configuration
├── tsconfig.json              # TypeScript configuration
├── vite.config.ts             # Vite build configuration
└── vitest-setup-client.ts     # Vitest browser test setup
```

## Directory Purposes

**`src/`:**
- Purpose: All source code for the application
- Contains: Svelte components, routes, utilities, styles, types
- Key files: `app.html`, `app.css`

**`src/routes/`:**
- Purpose: SvelteKit file-based routing
- Contains: Page components (`+page.svelte`), layouts (`+layout.svelte`), and route-specific tests
- Key files: `+layout.svelte` (global layout), `+page.svelte` (home page)

**`src/lib/`:**
- Purpose: Reusable components and utilities shared across routes
- Contains: Svelte components, utility functions, types
- Key files: `BlurredScreenshot.svelte` (component for rendering images with blur overlays)

**`static/`:**
- Purpose: Public static assets served directly by the web server
- Contains: Favicon, images, fonts, etc.
- Committed: Yes
- Generated: No

**`.claude/`:**
- Purpose: Claude Code configuration and AI workflows
- Contains: Agent definitions, skills, settings, hooks

**`.planning/`:**
- Purpose: GSD project planning and codebase analysis documents
- Contains: Phase plans, codebase structure docs, architecture analysis

## Key File Locations

**Entry Points:**
- `src/app.html`: Root HTML template — renders SvelteKit body placeholder
- `src/routes/+layout.svelte`: Root layout component — imports global styles, wraps all pages
- `src/routes/+page.svelte`: Home/landing page — main marketing website content

**Configuration:**
- `package.json`: Project dependencies, npm scripts
- `vite.config.ts`: Vite/SvelteKit build settings, test configuration
- `svelte.config.js`: SvelteKit adapter (auto), preprocessor setup
- `tailwind.config.js`: Tailwind theme, animations, plugins
- `tsconfig.json`: TypeScript strict mode, module resolution
- `eslint.config.js`: ESLint rules for TypeScript, Svelte
- `.eslintrc.js`: ESLint configuration file

**Core Styling:**
- `src/app.css`: Global Tailwind directives, custom component classes (`.btn-primary`, `.btn-secondary`, `.section-container`)
- `tailwind.config.js`: Theme extensions (colors, animations)

**Components:**
- `src/lib/BlurredScreenshot.svelte`: Reusable component for images with privacy blur regions
- `src/routes/+page.svelte`: Main page component (large, ~680 lines) with all marketing content

**Testing:**
- `src/demo.spec.ts`: Example unit test (basic math)
- `src/routes/page.svelte.test.ts`: Browser-based component test using vitest-browser-svelte
- `vitest-setup-client.ts`: Test setup file for browser environment
- `vite.config.ts`: Test configuration (browser and node test projects)

**Assets:**
- `static/favicon.svg`: Website favicon

## Naming Conventions

**Files:**
- Components: PascalCase (e.g., `BlurredScreenshot.svelte`)
- Route files: Leading `+` for special files (e.g., `+page.svelte`, `+layout.svelte`)
- Tests: `.test.ts` or `.spec.ts` suffix
- Config: `<name>.config.js` or `<name>.config.ts`

**Directories:**
- Lowercase, descriptive names (e.g., `routes`, `lib`, `static`)
- Grouped by purpose: `src/routes/` for routes, `src/lib/` for shared code

**Variables & Functions:**
- camelCase for variables and functions (e.g., `formSubmitted`, `handleFormSubmit`)
- PascalCase for exported types and components
- UPPER_SNAKE_CASE for constants (if any)

**CSS Classes:**
- kebab-case for Tailwind utility classes (built-in)
- Custom component classes: kebab-case in `@layer components` (e.g., `.btn-primary`, `.blur-date-id`)

**TypeScript:**
- Interfaces/Types: PascalCase (e.g., `Feature`, `Screenshot`)
- Props exported from components use TypeScript `export let` syntax

## Where to Add New Code

**New Marketing Section (Hero, Features, etc):**
- **Location:** `src/routes/+page.svelte`
- **Approach:** Add HTML section following existing pattern; add data to component script if needed
- **Example:** New section for testimonials would add `<section>` tags around line 232-600

**New Reusable Component:**
- **Location:** `src/lib/` (e.g., `src/lib/MyComponent.svelte`)
- **Approach:** Export props with `export let` syntax; use Svelte 5 reactive variables for state
- **Testing:** Create companion test file at `src/lib/MyComponent.svelte.test.ts`

**New Page/Route:**
- **Location:** `src/routes/[route-name]/+page.svelte`
- **Approach:** Create directory with route name, add `+page.svelte` file
- **Layout:** Can reuse root `+layout.svelte` or create route-specific layout

**Utility Functions:**
- **Location:** `src/lib/utils/` (create if doesn't exist)
- **Approach:** Export named functions; keep pure (no side effects)
- **Example:** Form validation, data formatting

**Global Styles:**
- **Location:** `src/app.css`
- **Approach:** Use `@layer` directives to organize (base, components, utilities)
- **Example:** New button variant goes in `@layer components`

**Tests:**
- **Unit Tests:** `src/**/*.test.ts` or `src/**/*.spec.ts` (Node environment by default)
- **Browser/Component Tests:** `src/**/*.svelte.test.ts` or `src/**/*.svelte.spec.ts` (browser environment)
- **Test Setup:** Leverage `vitest.config.ts` projects for browser/node environments

**Configuration Changes:**
- **Tailwind:** Edit `tailwind.config.js` (colors, spacing, animations)
- **Build/Runtime:** Edit `vite.config.ts` or `svelte.config.js`
- **Linting:** Edit `eslint.config.js`

## Special Directories

**`node_modules/`:**
- Purpose: Third-party dependencies installed by npm
- Generated: Yes (by npm install)
- Committed: No
- Do not edit or commit

**`.svelte-kit/`:**
- Purpose: SvelteKit generated artifacts, types, configuration
- Generated: Yes (by svelte-kit sync)
- Committed: No
- Do not edit manually

**`.git/`:**
- Purpose: Git version control metadata
- Generated: Yes (by git init)
- Committed: N/A (is version control)

**`.planning/codebase/`:**
- Purpose: Codebase analysis documents (ARCHITECTURE.md, STRUCTURE.md, etc)
- Generated: No (manually created by analysis tools)
- Committed: Yes

## Import Path Aliases

SvelteKit provides built-in path aliases:

- `$lib/` → `src/lib/` (for importing reusable components/utilities)
- `$app/` → SvelteKit app module
- `$env/` → Environment variables

**Examples:**
```typescript
import BlurredScreenshot from '$lib/BlurredScreenshot.svelte';
import { page } from '$app/stores';
```

## Build Output

**Development Build:**
- Command: `npm run dev`
- Output: In-memory virtual module served by Vite dev server (http://localhost:5173)

**Production Build:**
- Command: `npm run build`
- Output: `.svelte-kit/output/` directory (adapter-auto generates for target platform)
- Static files: `build/` directory can be deployed

**Preview Build:**
- Command: `npm run preview`
- Output: Local preview of production build (http://localhost:4173)

---

*Structure analysis: 2026-07-03*
