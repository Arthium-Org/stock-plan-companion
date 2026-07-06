# Coding Conventions

**Analysis Date:** 2026-07-06

## Naming Patterns

**Files:**
- **Svelte components:** PascalCase (e.g., `BlurredScreenshot.svelte`)
- **SvelteKit routes:** Conventional kit structure: `+page.svelte`, `+layout.svelte`, `+layout.ts` for route files
- **TypeScript files:** camelCase for utilities and helpers (e.g., `app.d.ts`, `+layout.ts`)
- **Test files:** camelCase with `.test.ts`, `.spec.ts`, or `.svelte.test.ts` suffix

**Functions:**
- camelCase for all functions (e.g., `nextScreenshot()`, `prevScreenshot()`, `handleFormSubmit()`, `frame()`)
- Event handlers prefixed with `handle` (e.g., `handleFormSubmit`)
- Callback functions use explicit names reflecting their purpose (e.g., `pause`, `resume`)

**Variables:**
- camelCase for local variables and state (e.g., `formSubmitted`, `formLoading`, `formError`, `activeScreenshot`, `downloadLinks`)
- camelCase for reactive properties in Svelte (e.g., `let formError = ''`)
- Constants use camelCase (e.g., `features = [...]`, `screenshots = [...]`)

**Types and Interfaces:**
- PascalCase for type names (e.g., `HTMLElement`, `HTMLFormElement`)
- Svelte component props typed inline (e.g., `export let src: string`, `export let blurRegions: Array<{...}>`)

## Code Style

**Formatting:**
- Tool: Prettier v3.4.2
- Indent: **tabs** (4 spaces equivalent)
- Quotes: **single quotes** for strings and imports
- Trailing commas: **none**
- Line width: **100 characters**
- Plugins: `prettier-plugin-svelte`, `prettier-plugin-tailwindcss` (for class organization)

**Linting:**
- Tool: ESLint v9.18.0
- Config: `eslint.config.js` (flat config format)
- Plugins: `@eslint/js`, `typescript-eslint`, `eslint-plugin-svelte`
- Integration: Prettier via `eslint-config-prettier` to avoid formatting conflicts
- TypeScript strict mode enabled via `tsconfig.json` with `strict: true`

**Run Commands:**
```bash
npm run format          # Format all files with Prettier
npm run lint            # Check linting and formatting
npm run check           # Run TypeScript checks and svelte-check
npm run check:watch    # Watch mode for type checking
```

## Import Organization

**Order:**
1. Svelte imports (e.g., `import { onMount } from 'svelte'`)
2. External packages (e.g., `import { FileText, BarChart3 } from '@lucide/svelte'`)
3. Local components and utilities (e.g., `import BlurredScreenshot from '$lib/BlurredScreenshot.svelte'`)
4. Type imports (implicit in TypeScript)

**Path Aliases:**
- `$lib/` - Points to `src/lib/` (for shared components and utilities)
- Standard SvelteKit aliases: `$app`, `$env` for app and environment modules

**Example:**
```typescript
// ✓ Correct order
import { onMount } from 'svelte';
import { FileText, BarChart3 } from '@lucide/svelte';
import BlurredScreenshot from '$lib/BlurredScreenshot.svelte';
```

## Error Handling

**Patterns:**
- Try-catch blocks for async operations (e.g., fetch calls)
- User-friendly error messages stored in reactive variables
- Error state management via dedicated variables (e.g., `formError: ''`)
- Fallback behavior when operations fail

**Example from `src/routes/+page.svelte`:**
```typescript
let formError = '';

async function handleFormSubmit(e: Event) {
	formError = '';
	
	try {
		const response = await fetch('https://formspree.io/f/xvzjdkaj', {
			method: 'POST',
			body: formData,
			headers: { Accept: 'application/json' }
		});
		
		if (response.ok) {
			formSubmitted = true;
		} else {
			formError = 'Failed to submit form. Please try again.';
		}
	} catch (error) {
		formError = 'An error occurred. Please try again.';
	} finally {
		formLoading = false;
	}
}
```

## Logging

**Framework:** `console` (no external logging library configured)

**Patterns:**
- Not heavily used in current codebase
- Comments preferred over console logs for code documentation
- Errors are captured and displayed to users via UI state

## Comments

**When to Comment:**
- Complex logic requiring explanation (e.g., animation timing, scroll behavior calculations)
- Non-obvious implementation details (e.g., "one copy of the card set" for compliance ticker)
- TODO items for future work (e.g., "TODO: update these direct-download URLs on EVERY release")
- Accessibility and UX considerations

**Example from `src/routes/+page.svelte`:**
```typescript
// Auto-scrolling compliance ticker: native scroll so users can wheel/click;
// pauses on hover or keyboard focus, seamless loop via duplicated content.
let tickerEl: HTMLElement;

const half = el.scrollHeight / 2; // one copy of the card set
```

**JSDoc/TSDoc:** Not used in current codebase; rely on TypeScript type annotations for documentation.

## Function Design

**Size:** Functions are generally small and focused on a single responsibility
- Event handlers: 2-30 lines
- Utility functions: 1-10 lines

**Parameters:**
- Explicit typing required (e.g., `e: Event`)
- Type casting where necessary (e.g., `e.target as HTMLFormElement`)
- Default parameters used for optional values (e.g., `blurRegions: Array<{...}> = []`)

**Return Values:**
- Async functions return Promises implicitly via `async/await`
- Event handlers typically return void
- Pure functions return computed/transformed values

## Module Design

**Exports:**
- Named exports for components: `export let src: string` for props in Svelte
- Default exports for Svelte components
- SvelteKit special exports: `export const prerender = true`

**Barrel Files:** Not used; components imported directly from their locations

**File Organization:**
- Component + related styles colocated (Svelte files include `<style>` blocks)
- Route handlers and loaders in `+page.svelte` and `+layout.ts`
- Shared components in `src/lib/`

## CSS and Styling

**Approach:** Tailwind CSS with custom component classes

**Class Naming:** kebab-case (Tailwind convention)
- Components: `.btn-primary`, `.section-container`, `.compliance-ticker`
- Utilities: Inline Tailwind classes (e.g., `px-4 py-3 rounded-lg`)
- Custom CSS: Defined in `src/app.css` using `@layer components`

**Example from `src/app.css`:**
```css
@layer components {
	.btn-primary {
		@apply inline-flex items-center justify-center rounded-lg bg-blue-600 px-6 py-3 font-medium text-white transition-all hover:bg-blue-700 active:scale-95;
	}
}
```

**Dark Mode:** Scoped to specific routes (e.g., `.spc-v2.dark` for `/new-12345` route) using CSS custom properties (`--text`, `--bg`, `--accent`, etc.)

---

*Convention analysis: 2026-07-06*
