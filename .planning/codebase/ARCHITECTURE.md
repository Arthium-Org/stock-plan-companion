<!-- refreshed: 2026-07-03 -->
# Architecture

**Analysis Date:** 2026-07-03

## System Overview

This is a **marketing website landing page** for Stock Plan Companion, a desktop application for managing RSUs and ESPPs. The architecture is client-side only with no backend API layer.

```text
┌─────────────────────────────────────────────────────────────┐
│                      Browser (Client)                        │
├──────────────────┬──────────────────┬───────────────────────┤
│  Page Component  │  Components      │   Event Handlers      │
│  `+page.svelte`  │  `Blurred...`    │   Form submission     │
│                  │  `BlurredScreens.`│  Screenshot nav      │
└────────┬─────────┴────────┬─────────┴──────────────┬────────┘
         │                  │                        │
         ▼                  ▼                        ▼
┌─────────────────────────────────────────────────────────────┐
│                    SvelteKit Runtime                         │
│  `+layout.svelte` — Global CSS, children renderer           │
└────────┬─────────────────────────────────────────────────────┘
         │
         ▼
┌─────────────────────────────────────────────────────────────┐
│                    Styling & Assets                          │
│  Tailwind CSS    │   SVG Icons      │   Image CDN            │
│  `app.css`       │   `lucide-svelte`│   `cdn.builder.io`     │
└─────────────────────────────────────────────────────────────┘
         │
         ▼
┌─────────────────────────────────────────────────────────────┐
│              External Services (Client-Initiated)           │
│  CDN Images          │   Formspree (Email)                   │
│  `builder.io`        │   Form submission → email delivery    │
└─────────────────────────────────────────────────────────────┘
```

## Component Responsibilities

| Component | Responsibility | File |
|-----------|----------------|------|
| **Layout** | Wraps all pages with global CSS imports and provides children rendering context | `src/routes/+layout.svelte` |
| **Page** | Main marketing landing page; manages screenshot gallery, form state, and all content sections | `src/routes/+page.svelte` |
| **BlurredScreenshot** | Reusable component for displaying images with configurable blur regions for privacy | `src/lib/BlurredScreenshot.svelte` |

## Pattern Overview

**Overall:** Single-page landing site with client-only state management. This is a **static marketing website** pattern with interactive elements (screenshot carousel, contact form).

**Key Characteristics:**
- **No Backend:** All content is hardcoded in the page component; no API routes or server logic
- **Client State Only:** Component state managed with Svelte 5 reactive variables (no external state library needed)
- **External Service Integration:** Email form submission via Formspree; images served from CDN
- **Static Content:** Screenshots, features, and copy are all defined in `+page.svelte`

## Layers

**Client UI Layer:**
- Purpose: Render marketing page sections, handle user interactions (form, screenshot navigation)
- Location: `src/routes/`
- Contains: Svelte components and route files
- Depends on: Tailwind CSS, lucide-svelte icons, external APIs
- Used by: Browser

**Component Library:**
- Purpose: Reusable Svelte components shared across pages
- Location: `src/lib/`
- Contains: `BlurredScreenshot.svelte` component
- Depends on: Svelte reactivity, CSS
- Used by: Page components

**Styling Layer:**
- Purpose: Global styles, Tailwind configuration, custom CSS components
- Location: `src/app.css`, `tailwind.config.js`
- Contains: Tailwind directives, custom component classes (`.btn-primary`, `.section-container`)
- Depends on: Tailwind CSS processor, PostCSS
- Used by: All Svelte components

**Build & Runtime:**
- Purpose: Development server, bundling, type checking
- Location: Configuration files (`vite.config.ts`, `svelte.config.js`, `tsconfig.json`)
- Contains: Vite plugin configuration, SvelteKit adapter setup
- Depends on: Vite, SvelteKit, TypeScript
- Used by: Development and production builds

## Data Flow

### Primary Request Path (Page Load & Render)

1. Browser requests landing page → SvelteKit router matches `/` route
2. SvelteKit loads `src/routes/+layout.svelte` → imports global styles from `src/app.css`
3. SvelteKit loads `src/routes/+page.svelte` → component mounts with reactive state
4. Page renders 6 sections: Hero, Features, Screenshots, Status, Getting Started, Registration
5. Lucide icons loaded client-side from `@lucide/svelte`
6. BlurredScreenshot components render images from CDN with blur overlays

**File references:**
- Entry: `src/app.html` (renders `%sveltekit.body%`)
- Route: `src/routes/+page.svelte` (lines 24-80 define screenshot data)
- Styling: `src/app.css` (applied via `<script>` import in `+layout.svelte`)

### Form Submission Flow

1. User fills email/name form (lines 541-567 in `+page.svelte`)
2. `handleFormSubmit` function intercepts submit event
3. Fetches to Formspree endpoint with form data
4. On success: show confirmation UI, set download links
5. On error: display error message, allow retry

**State involved:**
- `formSubmitted`: Boolean tracking if form was sent
- `formLoading`: Boolean for disabled button state during submission
- `formError`: Error message display
- `downloadLinks`: Object with macOS/Windows/Linux URLs

### Screenshot Gallery Navigation

1. User clicks "Next" or "Previous" button
2. Event handlers update `activeScreenshot` index (reactive variable)
3. Svelte re-renders with new screenshot data from `screenshots` array
4. BlurredScreenshot component receives new `src` and `blurRegions` props
5. Blur regions reapply on new image

**File reference:** `src/routes/+page.svelte` lines 82-88 (navigation functions)

## Key Abstractions

**Screenshot Object:**
- Purpose: Encapsulate image URL, title, description, and blur region definitions
- Examples: `screenshots[0]` = Portfolio View screenshot
- Pattern: Array of objects with `src`, `title`, `description`, `blurRegions` properties
- Usage: Drives gallery navigation, info panel, thumbnail selection

**Feature Object:**
- Purpose: Represent a single feature for the Features section
- Examples: "Import E*TRADE Documents", "Track RSUs and ESPPs"
- Pattern: Objects with `icon` (Lucide component), `title`, `description`
- Usage: Iterated in template to render feature cards (lines 241-251)

**Button Component Classes:**
- Purpose: Consistent button styling across the page
- Examples: `.btn-primary`, `.btn-secondary`
- Pattern: Tailwind component classes defined in `src/app.css` (lines 16-22)
- Usage: Applied to CTA buttons, form buttons, navigation buttons

## Entry Points

**Web Server Entry:**
- Location: `src/app.html`
- Triggers: Any HTTP request to `/` (or subroutes handled by SvelteKit)
- Responsibilities: Render HTML skeleton, include SvelteKit body placeholder, load favicon

**Application Entry:**
- Location: `src/routes/+layout.svelte`
- Triggers: All route loads (runs for every page)
- Responsibilities: Import global CSS, render children slot

**Main Page Entry:**
- Location: `src/routes/+page.svelte`
- Triggers: Request to `/`
- Responsibilities: Initialize page state, render all marketing sections, handle interactions

## Architectural Constraints

- **No Backend API:** All content is static/hardcoded. External integrations are client-only (CDN fetch, Formspree POST).
- **Client-Side Only State:** No server-side session, auth, or data persistence. Form submission relies on external service.
- **Single Page:** Only one route defined (`/`). No multi-page navigation; all content on single page.
- **Static Content:** Screenshots, features, and text are baked into component. No CMS or dynamic content management.
- **External Dependencies:** Relies on cdn.builder.io for images and formspree.io for email delivery. If these fail, functionality degrades.

## Anti-Patterns

### Hardcoded Data in Component

**What happens:** Screenshot metadata, feature lists, and section text are all defined inline in `+page.svelte` (lines 18-80, 90-121)

**Why it's wrong:** Difficult to update content without editing component code; impossible to A/B test variations; not reusable; couples content to presentation

**Do this instead:** Extract static content to a separate config file or object (e.g., `src/lib/content.ts`) that the component imports. This separates concerns and makes future CMS integration easier.

### Unvalidated Form Submission

**What happens:** Form data sent directly to Formspree without client-side validation or format checking (lines 123-157)

**Why it's wrong:** Malformed data could reach Formspree; no graceful handling of network failures; error messages are generic

**Do this instead:** Validate form fields before submission; provide specific error feedback; consider retry logic or offline queuing

## Error Handling

**Strategy:** Minimal error handling; external service failures result in user-facing error messages.

**Patterns:**
- Form submission errors caught in try/catch; generic error message shown (line 153)
- Network requests assume success path; no retry logic
- No error logging or monitoring (errors are silent except form submission)

## Cross-Cutting Concerns

**Logging:** None implemented. No console logs, error reporting, or analytics.

**Validation:** Form validation happens in HTML only (required attributes on inputs); no TypeScript validation.

**Authentication:** None. This is a public landing page with no user authentication.

**Security:** 
- External image CDN (builder.io) — risk if CDN is compromised
- Formspree endpoint hardcoded as placeholder (`YOUR_FORM_ID`) — must be replaced for production
- No CSRF protection (Formspree provides built-in protection)

---

*Architecture analysis: 2026-07-03*
