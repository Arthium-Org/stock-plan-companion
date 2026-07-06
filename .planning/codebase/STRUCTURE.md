# Codebase Structure

**Analysis Date:** 2026-07-06

## Directory Layout

```
stock-plan-companion/
├── src/
│   ├── routes/                    # SvelteKit file-based routes (each dir = URL path)
│   │   ├── +page.svelte           # Landing page (/) — main content, forms, galleries
│   │   ├── +layout.svelte         # Root layout wrapper (all routes inherit)
│   │   ├── +layout.ts             # Layout data loader — prerender config
│   │   ├── page.svelte.test.ts    # Tests for landing page (browser environment)
│   │   └── new-12345/
│   │       └── +page.svelte       # Preview route (/new-12345) — dark-theme prototype
│   │
│   ├── lib/                       # Shared components and utilities
│   │   ├── BlurredScreenshot.svelte # Reusable component for image blurring
│   │   └── index.ts               # Barrel export (empty; intended for exports)
│   │
│   ├── app.css                    # Global styles (Tailwind + custom)
│   ├── app.d.ts                   # TypeScript ambient declarations (currently empty)
│   ├── app.html                   # HTML template wrapper (SvelteKit auto-generates body)
│   └── demo.spec.ts               # Utility test file (server environment)
│
├── static/                        # Static assets (favicon, etc.)
│   └── favicon.svg
│
├── build/                         # Output directory (generated on build)
│   ├── index.html                 # Prerendered homepage
│   ├── _app/                      # Bundled JS and CSS
│   └── ...                        # Other prerendered pages
│
├── node_modules/                  # Dependencies (git-ignored)
│
├── .svelte-kit/                   # SvelteKit internal build artifacts (git-ignored)
│
├── .github/                       # GitHub Actions workflows
│   └── workflows/                 # CI/CD pipelines
│
├── .planning/                     # Project planning documents
│   └── codebase/                  # Codebase analysis (this directory)
│       ├── ARCHITECTURE.md        # System architecture and data flow
│       └── STRUCTURE.md           # This file
│
├── .claude/                       # Claude Code configuration and utilities
│   ├── agents/                    # Custom agents/skills
│   ├── hooks/                     # Custom hooks
│   ├── scripts/                   # Utility scripts
│   ├── commands/                  # Custom commands
│   ├── gsd-core/                  # GSD (Get Shit Done) framework
│   └── settings.json              # Claude Code settings
│
├── svelte.config.js               # SvelteKit configuration (adapter-static, prerender)
├── vite.config.ts                 # Vite + Vitest configuration
├── tsconfig.json                  # TypeScript compiler options
├── tailwind.config.js             # Tailwind CSS theme and content paths
├── postcss.config.js              # PostCSS plugins (Tailwind autoprefixer)
├── eslint.config.js               # ESLint configuration (Svelte + Prettier)
├── .prettierrc                    # Prettier formatter config
├── .prettierignore                # Prettier ignore rules
├── .npmrc                         # npm configuration
├── .nvmrc                         # Node version (22+)
├── .gitignore                     # Git ignore rules
│
├── package.json                   # Dependencies and scripts
├── package-lock.json              # Locked dependency versions
│
├── README.md                      # Project overview
├── AGENTS.md                      # Claude agents/skills documentation
├── builder.config.json            # Builder.io asset configuration
└── vitest-setup-client.ts         # Vitest browser test setup
```

## Directory Purposes

**`src/routes/`:**
- Purpose: SvelteKit file-based routing. Each `.svelte` file is a page route. Directories become URL paths.
- Contains: Page components (`+page.svelte`), layouts (`+layout.svelte`), data loaders (`+layout.ts`), tests (`*.test.ts`, `*.spec.ts`)
- Key files:
  - `+page.svelte`: Home page — main landing page with hero, features, galleries, forms
  - `+layout.svelte`: Root layout — wraps all routes, injects global styles
  - `+layout.ts`: Prerender configuration (sets `export const prerender = true`)
  - `new-12345/+page.svelte`: Alternative dark-theme UI prototype

**`src/lib/`:**
- Purpose: Shared components, utilities, and library code reused across routes
- Contains: Svelte components (`.svelte`), TypeScript utilities (`.ts`), barrel exports
- Key files:
  - `BlurredScreenshot.svelte`: Component for rendering images with blurred sensitive regions
  - `index.ts`: Barrel export file (currently empty; intended for re-exporting library code)

**`src/app.css`:**
- Purpose: Global styles, animations, theme system, utility component classes
- Contains: Tailwind directives (@tailwind, @layer), CSS custom properties (--bg, --text, etc.), keyframe animations, responsive media queries
- Patterns:
  - `@layer base`: Browser resets (scroll-behavior, body colors)
  - `@layer components`: Reusable utility classes (`.btn-primary`, `.section-container`, `.compliance-ticker`)
  - `.spc-v2` theme: Dark theme prototype scoped for `/new-12345` route (CSS variable system for light/dark modes)

**`static/`:**
- Purpose: Public static assets served as-is (not processed by Vite)
- Contains: Favicon, downloadable files, static images
- Note: External images loaded from CDN (Builder.io) rather than static directory

**`build/`:**
- Purpose: Output directory containing prerendered static site (generated on `npm run build`)
- Contains: HTML pages, CSS/JS bundles, assets
- Git-ignored (regenerated on each build)

**`.svelte-kit/`:**
- Purpose: SvelteKit internal artifacts and generated TypeScript config
- Git-ignored (auto-generated)

**`.github/workflows/`:**
- Purpose: GitHub Actions CI/CD pipelines
- Contains: Build and deploy workflows

**`.planning/codebase/`:**
- Purpose: Codebase analysis documents (generated by `/gsd-map-codebase`)
- Contains: ARCHITECTURE.md, STRUCTURE.md, and related analysis

**`.claude/`:**
- Purpose: Claude Code project configuration
- Contains: Agents, hooks, scripts, GSD framework, settings

## Key File Locations

**Entry Points:**
- `src/routes/+page.svelte`: Main landing page (/)
- `src/routes/new-12345/+page.svelte`: Preview/prototype route (/new-12345)
- `src/app.html`: HTML template wrapper (processed by SvelteKit)

**Configuration:**
- `svelte.config.js`: SvelteKit config (adapter-static, prerender settings)
- `vite.config.ts`: Vite build config and Vitest test runner settings
- `tsconfig.json`: TypeScript compiler options
- `tailwind.config.js`: Tailwind theme tokens and content paths
- `eslint.config.js`: ESLint linting rules
- `.prettierrc`: Prettier formatting rules

**Core Logic:**
- `src/routes/+page.svelte`: All landing page content, forms, galleries, ticker logic (~780 lines)
- `src/lib/BlurredScreenshot.svelte`: Image blur component
- `src/app.css`: Global styles and animations

**Testing:**
- `src/routes/page.svelte.test.ts`: Browser tests (Vitest + Playwright)
- `src/demo.spec.ts`: Example unit test (server environment)
- `vitest-setup-client.ts`: Vitest browser setup file

## Naming Conventions

**Files:**
- **Pages**: `+page.svelte` (SvelteKit convention)
- **Layouts**: `+layout.svelte` (SvelteKit convention)
- **Data loaders**: `+layout.ts` or `+page.ts` (SvelteKit convention)
- **Components**: PascalCase (e.g., `BlurredScreenshot.svelte`)
- **Tests**: Suffix with `.test.ts` or `.spec.ts` (Vitest convention)
- **Config files**: Flat names with extension (e.g., `svelte.config.js`, `tailwind.config.js`)

**Directories:**
- **Feature routes**: Lowercase, kebab-case (e.g., `new-12345/`) — becomes URL path
- **Library**: `lib/` (SvelteKit convention)
- **Static**: `static/` (SvelteKit convention)
- **Config**: Root level (e.g., `src/app.css`)

**CSS Classes:**
- **Tailwind utility**: Lowercase with hyphens (e.g., `flex`, `gap-2`, `text-gray-600`)
- **Component utilities**: Kebab-case (e.g., `.btn-primary`, `.section-container`, `.compliance-ticker`)
- **Theme system**: BEM-like (e.g., `.spc-v2`, `.spc-v2.dark`, `.spc-v2 .card`)

**Component Props (Svelte):**
- **Exports**: PascalCase or camelCase (e.g., `export let src: string`, `export let blurRegions`)
- **Reactive variables**: camelCase (e.g., `let formSubmitted = false`)
- **Event handlers**: camelCase verb prefix (e.g., `handleFormSubmit`, `nextScreenshot`)

## Where to Add New Code

**New Page/Route:**
1. Create directory under `src/routes/` (e.g., `src/routes/features/`)
2. Add `+page.svelte` in that directory — becomes `/features` route
3. Import components from `src/lib/`
4. Use Tailwind classes and `src/app.css` utilities
5. (Optional) Add `+layout.ts` in parent directory for route-specific data/prerender settings

**New Component/Module:**
1. Create `.svelte` file in `src/lib/` (e.g., `src/lib/FeatureCard.svelte`)
2. Export props via `export let` statements
3. Use Tailwind classes and global CSS utilities
4. Add scoped `<style>` for component-specific styling
5. Re-export in `src/lib/index.ts` for easier imports

**Utilities:**
- Shared TypeScript functions: `src/lib/utils.ts` or similar
- Use `$lib` path alias (auto-configured by SvelteKit) for imports: `import { foo } from '$lib/utils.ts'`

**Styles:**
- Global styles, animations, theme tokens: `src/app.css` (@layer directives)
- Component-scoped styles: `<style>` block in `.svelte` file
- Utility classes: Tailwind + custom classes in `src/app.css`
- Theme variations: Add CSS variable sections in `.spc-v2` block (or create new `.theme-name` block)

**Tests:**
- Browser tests (component rendering): `src/routes/page.svelte.test.ts` (or create `src/lib/Component.svelte.test.ts`)
- Server-side tests: `src/lib/utils.spec.ts`
- Use Vitest + Playwright for browser tests, standard Vitest for Node tests
- Run tests: `npm test`

**Build Configuration:**
- Add Vite plugins: Edit `vite.config.ts`
- Add Tailwind theme: Edit `tailwind.config.js` (extend theme or add plugins)
- Add ESLint rules: Edit `eslint.config.js`
- Add TypeScript strict modes: Edit `tsconfig.json`

## Special Directories

**`build/`:**
- Purpose: Prerendered static site output
- Generated: Yes (on `npm run build`)
- Committed: No (git-ignored; regenerated on deploy)
- Deployed to: GitHub Pages

**`.svelte-kit/`:**
- Purpose: SvelteKit internal build artifacts and generated types
- Generated: Yes (on `npm install` and build)
- Committed: No (git-ignored)

**`node_modules/`:**
- Purpose: Installed npm dependencies
- Generated: Yes (on `npm install`)
- Committed: No (git-ignored; use `package-lock.json` for reproducible installs)

**`static/`:**
- Purpose: Public assets served from root (not processed by build tool)
- Generated: No (manually created)
- Committed: Yes (source files)
- Deployed: Yes (copied to `build/` on deploy)

**`.claude/`:**
- Purpose: Claude Code project-specific configuration, agents, hooks
- Generated: Yes (scripts, build artifacts in subdirectories)
- Committed: Yes (source files, scripts, configuration)
- User-specific: `.claude/settings.json` can be overridden locally

**`.planning/`:**
- Purpose: Project planning and codebase analysis
- Generated: Yes (via `/gsd-map-codebase`, `/gsd-plan-phase` commands)
- Committed: Yes (planning documents)
- Contents: ARCHITECTURE.md, STRUCTURE.md, PLAN.md, analysis files

## Build Output

**Prerender Process:**
1. `npm run build` runs Vite
2. Vite compiles TypeScript, Svelte, CSS
3. SvelteKit prerender runs with `export const prerender = true` from `src/routes/+layout.ts`
4. All routes prerendered to static HTML files in `build/` directory
5. Assets bundled into `build/_app/immutable/`

**Output structure:**
- `build/index.html` — Prerendered homepage
- `build/_app/immutable/*.css` — Bundled CSS files
- `build/_app/immutable/*.js` — Bundled JavaScript (hydration code)
- `build/404.html` — Fallback for 404 errors

**Deployment:**
- `build/` directory pushed to GitHub Pages via GitHub Actions
- Static files served directly (no server required)

---

*Structure analysis: 2026-07-06*
