# Testing Patterns

**Analysis Date:** 2026-07-03

## Test Framework

**Runner:**
- Vitest v3.2.3
- Config: `vite.config.ts` (configured within Vite config, not separate file)
- Dual-project setup: separate configurations for browser and server environments

**Assertion Library:**
- Vitest built-in `expect` API with matchers
- Browser-specific matchers via `@vitest/browser` (e.g., `toBeInTheDocument()`)

**Run Commands:**
```bash
npm run test:unit              # Run tests with watch
npm run test                   # Run tests once (CI mode)
npm run check                  # Type check via svelte-check
```

## Test File Organization

**Location:**
- Co-located with source files: tests live in `src/` directory next to implementation
- Example: `src/routes/page.svelte.test.ts` sits alongside `src/routes/+page.svelte`
- Example: `src/demo.spec.ts` in same directory as component under test

**Naming:**
- Svelte component tests: `{componentName}.svelte.test.ts` (e.g., `page.svelte.test.ts`)
- Unit tests: `{moduleName}.spec.ts` (e.g., `demo.spec.ts`)
- Both `.test.ts` and `.spec.ts` suffixes recognized by Vitest

**Structure:**
```
src/
├── demo.spec.ts                # Unit test for utilities/functions
├── routes/
│   ├── +page.svelte
│   ├── +layout.svelte
│   └── page.svelte.test.ts     # Browser test for component
└── lib/
    └── BlurredScreenshot.svelte
```

## Test Structure

**Suite Organization:**
```typescript
import { describe, it, expect } from 'vitest';

describe('component or feature name', () => {
	it('should do something specific', () => {
		// Arrange
		// Act
		// Assert
	});

	it('should handle edge case', () => {
		// test body
	});
});
```

**Patterns:**
- All tests wrapped in `describe` blocks for logical grouping
- Each test uses `it` for individual test cases
- Descriptive test names using "should" pattern (e.g., "should render h1")
- Single assertion or grouped related assertions per test preferred

## Browser Tests

**Framework:** Vitest Browser + Playwright

**Setup:**
- Provider: Playwright (chromium browser)
- Environment: browser
- Test file patterns: `**/*.svelte.{test,spec}.{js,ts}`
- Setup file: `vitest-setup-client.ts` (defines Vitest/Playwright type references)

**Example Pattern (from `src/routes/page.svelte.test.ts`):**
```typescript
import { page } from '@vitest/browser/context';
import { describe, expect, it } from 'vitest';
import { render } from 'vitest-browser-svelte';
import Page from './+page.svelte';

describe('/+page.svelte', () => {
	it('should render h1', async () => {
		render(Page);
		
		const heading = page.getByRole('heading', { level: 1 });
		await expect.element(heading).toBeInTheDocument();
	});
});
```

**Patterns:**
- `render()` from `vitest-browser-svelte` mounts Svelte component in test DOM
- `page` context from `@vitest/browser/context` provides DOM queries
- DOM queries use accessible selectors: `getByRole()` preferred
- Async/await for browser interactions and assertions
- Browser-specific matchers: `toBeInTheDocument()`, etc.

## Unit Tests

**Example Pattern (from `src/demo.spec.ts`):**
```typescript
import { describe, it, expect } from 'vitest';

describe('sum test', () => {
	it('adds 1 + 2 to equal 3', () => {
		expect(1 + 2).toBe(3);
	});
});
```

**Patterns:**
- No external dependencies or renders
- Direct function/module testing
- Synchronous assertions with `.toBe()`, `.toEqual()`, etc.

## Mocking

**Framework:** Vitest has built-in mocking via `vi` (not currently visible in test files)

**What to Mock (Recommended):**
- Network requests (fetch calls) - use `vi.mock()` or `msw` for API mocking
- External APIs (Lucide icons, Formspree endpoint)
- File operations if present
- Time-dependent functions (`setTimeout`, `setInterval`)

**What NOT to Mock:**
- Svelte components being tested - render them directly
- Core library components
- DOM APIs when using browser test environment
- Simple utility functions

**Current Patterns:**
- No explicit mocks visible in current test files
- Browser tests interact with actual DOM
- API calls in component (`handleFormSubmit`) could be mocked in future tests

## Test Configuration Details

**Project Configuration (from `vite.config.ts`):**

**Browser Tests (name: 'client'):**
- Environment: browser
- Browser provider: Playwright (chromium)
- Included files: `src/**/*.svelte.{test,spec}.{js,ts}`
- Excluded: `src/lib/server/**`
- Setup file: `./vitest-setup-client.ts`

**Server Tests (name: 'server'):**
- Environment: node
- Included files: `src/**/*.{test,spec}.{js,ts}`
- Excluded: `src/**/*.svelte.{test,spec}.{js,ts}`

**Access:** Run specific project:
```bash
npm run test:unit -- --project=client    # Browser tests only
npm run test:unit -- --project=server    # Server tests only
```

## Fixtures and Factories

**Test Data:**
- No fixtures or factory functions currently visible
- Test data defined inline within test functions
- Svelte 5.0 `$props()` can be used to test component props

**Example (from browser test):**
```typescript
render(Page);  // No fixture needed, component imports directly
```

**Recommended Structure for Future:**
```typescript
// fixtures/mockData.ts
export const mockScreenshot = {
	src: 'https://example.com/image.webp',
	alt: 'Test screenshot',
	blurRegions: [{ top: '1%', left: '8%', width: '35%', height: '8%' }]
};
```

## Coverage

**Requirements:** None enforced (no coverage thresholds observed)

**Viewing Coverage:**
```bash
npm run test:unit -- --coverage  # Generate coverage report (requires coverage config)
```

**Current Status:**
- 2 test files found: `demo.spec.ts` and `page.svelte.test.ts`
- No coverage configuration currently active
- Coverage thresholds could be added to `vite.config.ts` if desired

## Test Types

**Unit Tests:**
- Scope: Individual functions/utilities (e.g., `demo.spec.ts`)
- Approach: Direct function calls with input/output verification
- Example: Testing arithmetic, string manipulation, data transformation

**Component/Integration Tests:**
- Scope: Svelte components with their props and event handlers
- Approach: Render component, interact with DOM, assert visual/behavioral outcomes
- Example: Testing form submission, button clicks, text display
- Uses: `vitest-browser-svelte` for DOM access

**E2E Tests:**
- Framework: Not currently configured
- Note: Could be added using Playwright directly or other E2E frameworks
- Potential tools: Playwright Test, Cypress (both compatible with Vite setup)

## Async Testing

**Pattern:**
```typescript
it('should render h1', async () => {
	render(Page);
	const heading = page.getByRole('heading', { level: 1 });
	await expect.element(heading).toBeInTheDocument();
});
```

**Key Points:**
- Test function marked with `async`
- DOM queries may return Promises (via Playwright)
- `await` on expectations that interact with browser
- Component render is synchronous; DOM assertions are async

## Error Testing

**Pattern (Recommended):**
```typescript
it('should display error on fetch failure', async () => {
	// Mock fetch to reject
	vi.global.fetch = vi.fn().mockRejectedValue(new Error('Network error'));
	
	// Render and interact
	render(Component);
	// ... trigger error condition
	
	// Assert error message appears
	const errorMsg = page.getByText('An error occurred');
	await expect.element(errorMsg).toBeVisible();
});
```

**Current Implementation (from `+page.svelte`):**
- Component catches errors and sets `formError` state
- UI conditionally displays error message:
```svelte
{#if formError}
	<p class="text-sm text-red-600">{formError}</p>
{/if}
```

## Test Execution

**Local Development:**
```bash
npm run test:unit              # Run with file watch
npm run test:unit -- --ui      # Browser UI mode (with vitest UI)
```

**CI/CD:**
```bash
npm run test                   # Runs vitest with --run flag (no watch)
```

**Watch Mode:**
- Default behavior during development
- Re-runs affected tests on file changes
- Browser environment reloads between runs

---

*Testing analysis: 2026-07-03*
