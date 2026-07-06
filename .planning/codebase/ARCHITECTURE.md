<!-- refreshed: 2026-07-06 -->
# Architecture

**Analysis Date:** 2026-07-06

## System Overview

```text
┌─────────────────────────────────────────────────────────────────┐
│                    SvelteKit Router (Client)                     │
│         File-based routes → Prerendered HTML pages               │
│  `src/routes/+page.svelte`, `src/routes/+layout.svelte`          │
└────────────┬──────────────────────────┬────────────┬─────────────┘
             │                          │            │
             ▼                          ▼            ▼
┌──────────────────────┐  ┌──────────────────────┐  ┌─────────────┐
│  UI Components       │  │ Component Library    │  │  Static     │
│  (Svelte .svelte)    │  │  `src/lib/`          │  │  Assets     │
│  - Landing Page      │  │  - Blurred Screenshot│  │  CDN Images │
│  - Forms             │  │    Component         │  │  GitHub     │
│  - Galleries         │  └──────────────────────┘  │  Links      │
│  - Compliance Ticker │                            └─────────────┘
│  `src/routes/`       │
└──────────┬───────────┘
           │
           ▼
┌─────────────────────────────────────────────────────────────────┐
│              Styling Layer (Tailwind + Custom CSS)               │
│         `src/app.css` - Global styles, animations, themes        │
└──────────────────────┬──────────────────────────────────────────┘
                       │
                       ▼
┌─────────────────────────────────────────────────────────────────┐
│                   External Services                              │
│  - Formspree (form submissions)                                  │
│  - Builder.io CDN (screenshot images)                            │
│  - GitHub (links, downloads)                                     │
│  - Third-party news/docs (compliance info links)                 │
└─────────────────────────────────────────────────────────────────┘
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

**Overall:** Static Site Generation (SSG) with pre-rendered HTML pages deployed to GitHub Pages. Client-side interactivity via Svelte components.

**Key Characteristics:**
- **Framework**: SvelteKit 2.x with `adapter-static`
- **Build**: Vite → prerendered HTML/CSS/JS → `build/` directory
- **Rendering**: 100% static (all pages prerendered at build time)
- **Interactivity**: Client-side Svelte reactivity (forms, galleries, auto-scrolling ticker)
- **Styling**: Tailwind CSS with PostCSS + custom component classes
- **Deployment**: GitHub Pages (static hosting)

## Layers

**Route Layer (Pages):**
- Purpose: Define URL paths and entry points to the application
- Location: `src/routes/`
- Contains: Svelte page components (`+page.svelte`), layout wrappers (`+layout.svelte`), data loaders (`+layout.ts`)
- Depends on: Component library (`src/lib/`), styling (`src/app.css`)
- Used by: Browser — routes match file paths directly (SvelteKit convention)

**Component Layer:**
- Purpose: Reusable UI building blocks with encapsulated logic and styling
- Location: `src/lib/`
- Contains: Svelte components (`.svelte` files)
- Depends on: External libraries (Lucide icons), global styles
- Used by: Route components and other components

**Styling Layer:**
- Purpose: Define theme tokens, animations, utility classes, and reset styles
- Location: `src/app.css`
- Contains: Tailwind directives (@tailwind, @layer), CSS custom properties (--bg, --text, etc.), keyframe animations
- Depends on: Tailwind CSS
- Used by: All components via Tailwind class names and @apply directives

**Static Assets:**
- Purpose: Images, icons, downloadable files, externally hosted resources
- Location: `static/` (local assets), CDN (external images)
- Contains: Favicon, downloaded files
- Depends on: None (served as-is)
- Used by: Components and browser requests

## Data Flow

### Primary Request Path: Page Load → Render → Interact

1. Browser requests `/` (or any route)
2. SvelteKit serves prerendered HTML from `build/` directory
3. Browser parses HTML, loads CSS and JavaScript
4. JavaScript hydrates Svelte components with event listeners
5. Component mounts handlers: auto-scrolling ticker, form submission, gallery navigation

**Specific file involvement:**
- Browser → `build/index.html` (prerendered from `src/routes/+page.svelte`)
- Styles loaded: `build/_app/immutable/*.css`
- Scripts loaded: `build/_app/immutable/*.js`

### Secondary Flow: Form Submission

1. User fills registration form in `src/routes/+page.svelte` (lines 556–592)
2. Submit handler calls `handleFormSubmit()` → `fetch('https://formspree.io/f/xvzjdkaj')`
3. Formspree validates and sends email
4. On success: update `formSubmitted` state, show download links
5. Links point to GitHub releases (hardcoded URLs, requires manual update per release)

### Tertiary Flow: Screenshot Gallery Navigation

1. User clicks "Next"/"Previous" or thumbnail in gallery (`src/routes/+page.svelte` lines 343–367)
2. Click handler updates `activeScreenshot` reactive variable
3. Svelte reactively renders new image URL and metadata
4. `BlurredScreenshot` component blurs sensitive regions on mount

### Compliance Ticker: Auto-Scroll with User Pause

1. Component mounts, sets up `requestAnimationFrame` loop (`src/routes/+page.svelte` lines 22–62)
2. Loop increments scroll position by ~30px/second on desktop (not mobile)
3. On hover/focus: pause flag set, scroll position frozen
4. Content duplicated in DOM so ticker loops seamlessly

**State Management:**
- All state is local to components (reactive variables via `let` declarations)
- No global state management (Svelte stores not used)
- Form state: `formSubmitted`, `formLoading`, `formError`, `downloadLinks`
- Gallery state: `activeScreenshot`
- Ticker state: `paused`, `target`, internal RAF loop

## Key Abstractions

**Page Layout Architecture:**
- Purpose: Two-column responsive grid on desktop, single-column on mobile
- Examples: `src/routes/+page.svelte` lines 227–270 define grid with sidebar
- Pattern: CSS Grid with `lg:` breakpoints; sidebar sticky on desktop, stacks below hero on mobile

**Compliance Card System:**
- Purpose: Render multiple informational cards (news, warnings, solutions) in a scrollable ticker
- Examples: `src/routes/+page.svelte` lines 647–741 (snippet `complianceCards()`)
- Pattern: Svelte snippet (reusable template) duplicated in DOM for seamless loop

**Blurred Screenshot Component:**
- Purpose: Mask sensitive image regions using CSS `backdrop-filter: blur()`
- Examples: `src/lib/BlurredScreenshot.svelte`
- Pattern: Calculate overlay positions via component props; render `<div>` with absolute positioning

**Feature Cards with Highlight:**
- Purpose: Grid of feature boxes with one marked as "PRIMARY" (wider, distinct styling)
- Examples: `src/routes/+page.svelte` lines 282–306 (conditional styling based on `feature.highlight`)
- Pattern: Conditional CSS classes and z-index layering

**Button Component Styles:**
- Purpose: Reusable button appearances (primary, secondary, icon buttons)
- Examples: `.btn-primary`, `.btn-secondary` in `src/app.css` lines 16–22
- Pattern: Tailwind @apply directives for composable utility classes

## Entry Points

**Homepage (`/`):**
- Location: `src/routes/+page.svelte`
- Triggers: Browser navigation to `/`
- Responsibilities: Render full landing page with hero, features, gallery, registration form, compliance ticker

**Preview Route (`/new-12345`):**
- Location: `src/routes/new-12345/+page.svelte`
- Triggers: Browser navigation to `/new-12345`
- Responsibilities: Prototype dark-theme UI (scoped styling with CSS variables)

**Root Layout:**
- Location: `src/routes/+layout.svelte`
- Triggers: All page renders (wraps all routes)
- Responsibilities: Import global styles, render children slot

**Layout Data Loader:**
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

**What happens:** Download URLs are hardcoded in `handleFormSubmit()` response (lines 187–190 in `src/routes/+page.svelte`).

**Why it's wrong:** Requires manual code change and rebuild every release. Links point to specific GitHub release tags and filenames, so any version bump breaks the links unless code is updated.

**Do this instead:** 
- Move download links to a `src/lib/config.ts` file with version number
- OR fetch latest release metadata from GitHub API at build time via `svelte.config.js` preprocess hook
- OR store links in `src/routes/+layout.ts` as load data passed to all pages

### TODO Comment with Placeholder Link Updates

**What happens:** Form response shows download links via TODO comment (line 185): `// TODO: update these direct-download URLs on EVERY release`.

**Why it's wrong:** Manual reminder is error-prone. Release checklist item can be forgotten, leaving users with broken/stale download links.

**Do this instead:** Automate version/link updates via GitHub Actions workflow that updates config file or builds with environment variables from git tags.

### Responsive Ticker Only Works on Desktop

**What happens:** Compliance ticker disables auto-scroll on mobile (line 37: `!desktop.matches`), but content still duplicates and stacks visually, wasting vertical space.

**Why it's wrong:** Mobile users get static tall sidebar content but no scrolling benefit. The duplicate content in DOM (line 268, `hidden lg:contents`) is unnecessary bloat on small screens.

**Do this instead:** Remove ticker entirely on mobile via conditional rendering (`{#if desktop.matches}`), or render as carousel with swipe/button controls.

## Error Handling

**Strategy:** Try-catch around external API calls (Formspree). User-facing errors captured in component state.

**Patterns:**
- Form submission errors caught and stored in `formError` state (lines 193–197)
- User sees error message inline (line 581)
- No logging or error tracking (no Sentry/LogRocket)
- Unhandled errors fall through to browser console (no global error handler)

## Cross-Cutting Concerns

**Logging:** None. No logging framework. Browser console only for debugging.

**Validation:** Form validation via HTML5 `required` attribute on email field (line 567). No custom validation logic.

**Authentication:** None. Site is public. No login, API keys, or user state.

**Analytics:** Not configured. No Google Analytics, Plausible, or custom event tracking.

---

*Architecture analysis: 2026-07-06*
