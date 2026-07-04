# Coding Conventions

**Analysis Date:** 2026-07-03

## Naming Patterns

**Files:**
- Component files: PascalCase for Svelte components (`BlurredScreenshot.svelte`)
- Route files: SvelteKit convention with `+` prefix (`+page.svelte`, `+layout.svelte`)
- Test files: Match source file with `.test.ts` or `.spec.ts` suffix (e.g., `page.svelte.test.ts`, `demo.spec.ts`)
- Type definition files: Ends with `.d.ts` (`app.d.ts`)

**Functions:**
- camelCase for all functions (`nextScreenshot`, `prevScreenshot`, `handleFormSubmit`)
- Event handlers: Prefix with `handle` or verb form (`handleFormSubmit`, `on:click`)
- Descriptive names that indicate purpose (not abbreviated)

**Variables:**
- camelCase for local and module-level variables (`formSubmitted`, `formLoading`, `formError`, `activeScreenshot`, `downloadLinks`)
- Boolean variables clearly indicate state (`show`, `formSubmitted`, `formLoading`)
- Constants in objects stored as camelCase properties

**Types:**
- Interface/type names: PascalCase (inferred from usage in `BlurredScreenshot` props)
- Object property names: camelCase (`blurRegions`, `top`, `left`, `width`, `height`)
- Generic type parameters: Single uppercase letters or descriptive PascalCase

**CSS Classes:**
- kebab-case for all CSS class names (`.screenshot-container`, `.blur-date-id`, `.btn-primary`, `.btn-secondary`)
- Tailwind utility classes used extensively (`.w-full`, `.h-auto`, `.flex`, `.grid`)
- Semantic class names when not using utilities (`.screenshot-container`, `.blur-date-id`)

## Code Style

**Formatting:**
- Tool: Prettier v3.4.2
- Tabs: Enabled (useTabs: true)
- Quote style: Single quotes (`'import...'`, `'string'`)
- Trailing commas: None (trailingComma: "none")
- Print width: 100 characters
- Svelte parser: prettier-plugin-svelte enabled
- Tailwind ordering: prettier-plugin-tailwindcss enabled for class sorting

**Linting:**
- Tool: ESLint v9.18.0
- Configs: `@eslint/js`, `typescript-eslint`, `eslint-plugin-svelte`
- Integration: ESLint config file is `eslint.config.js` (new flat config format)
- Rules override: `no-undef` disabled for TypeScript projects (handled by TypeScript)
- Prettier integration: eslint-config-prettier prevents conflicts

**TypeScript:**
- Version: 5.0+
- Strict mode: Enabled (strict: true)
- Target: ESM modules (type: "module" in package.json)
- Language features: forceConsistentCasingInFileNames, resolveJsonModule, esModuleInterop all enabled

## Import Organization

**Order:**
1. Svelte framework imports (`import { onMount } from 'svelte'`)
2. Third-party library imports (`import { describe, it, expect } from 'vitest'`)
3. Component imports (`import BlurredScreenshot from '$lib/BlurredScreenshot.svelte'`)
4. Utility imports (`import { page } from '@vitest/browser/context'`)

**Path Aliases:**
- `$lib`: Maps to `src/lib/` for shared components and utilities
- `$app`: Built-in SvelteKit paths for app-specific modules
- Relative imports used within same directory or clear hierarchy

**Style:**
- Named imports preferred over default imports
- Each import statement on separate line when multiple items
- Alphabetically organized when importing multiple items from same module

## Error Handling

**Patterns:**
- Try-catch blocks for async operations (fetch calls)
- Generic, user-friendly error messages shown in UI (`'An error occurred. Please try again.'`)
- State-based error display using variables (`formError` variable in component)
- Finally blocks ensure cleanup (setting loading state to false)
- No error swallowing - errors always communicated to user

**Example Pattern (from `+page.svelte:130-156`):**
```typescript
try {
	const response = await fetch('...');
	if (response.ok) {
		// Success handling
	} else {
		formError = 'Failed to submit form. Please try again.';
	}
} catch (error) {
	formError = 'An error occurred. Please try again.';
} finally {
	formLoading = false;
}
```

## Logging

**Framework:** Console (no dedicated logging library observed)

**Patterns:**
- No console logging in production code observed
- Recommended approach would be to avoid console statements in components
- When needed, use for development debugging only

## Comments

**When to Comment:**
- TypeScript comments used in config files to explain references (see `tsconfig.json` line 14-18)
- No inline code comments observed in source files
- Self-documenting code preferred through clear naming

**JSDoc/TSDoc:**
- Not currently used in observed source files
- Would be appropriate for exported functions and components in larger codebases

## Function Design

**Size:** 
- Most functions are short and focused (10-40 lines typical)
- Modular component functions with single responsibilities

**Parameters:**
- Exported Svelte component props are explicit and typed (`export let src: string`, `export let alt: string`)
- Event handlers receive appropriate event types (`e: Event`)
- Type annotations used throughout for clarity

**Return Values:**
- Functions return appropriate types (undefined for side effects, arrays/objects for data)
- Async functions marked with `async` keyword, returning Promises implicitly
- Component functions use Svelte's reactive assignments for return values

## Module Design

**Exports:**
- Svelte components exported as default (implicitly by component structure)
- Function exports use named exports when possible
- Type-only exports for type definitions

**Barrel Files:**
- `src/lib/index.ts` exists but currently empty (placeholder for future exports)
- Components imported directly by full path rather than through barrel file

**Component Props:**
- Props declared using `export let` in `<script>` block (Svelte 5.0 reactive declarations)
- Default values provided when appropriate (e.g., `blurRegions: Array<...> = []`)
- Props documented through TypeScript types

---

*Convention analysis: 2026-07-03*
