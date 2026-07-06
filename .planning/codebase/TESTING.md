# Testing Patterns

**Analysis Date:** 2026-07-06

## Test Framework

**Runner:**
- Vitest v3.2.3
- Config: `vite.config.ts` with dual test projects
- Package: `npm run test:unit` for watch mode, `npm test` for single run

**Assertion Library:**
- Built-in Vitest assertions via `expect()`
- Browser-specific matchers: `@vitest/browser/matchers` (e.g., `toBeInTheDocument()`)

**Run Commands:**
```bash
npm run test:unit              # Run tests in watch mode
npm test                       # Run all tests once (CI mode)
npm run check                  # TypeScript + Svelte checks
npm run check:watch           # Watch mode for type checking
```

## Test File Organization

**Location:** Co-located with source code

**Naming Convention:**
- `.test.ts` - TypeScript unit tests
- `.spec.ts` - JavaScript/TypeScript tests
- `.svelte.test.ts` - Svelte component tests
- `.svelte.spec.ts` - Alternative Svelte component test naming

**Structure:**
```
src/
├── lib/
│   └── BlurredScreenshot.svelte
├── routes/
│   ├── +page.svelte
│   └── page.svelte.test.ts          ← Co-located test for +page.svelte
├── demo.spec.ts                      ← Standalone unit test
└── app.d.ts
```

## Test Projects Configuration

The `vite.config.ts` defines two separate test environments:

**1. Client Tests** (browser environment)
- **Environment:** Browser via Playwright (Chromium)
- **Provider:** `@vitest/browser` with Playwright backend
- **Include:** `src/**/*.svelte.{test,spec}.{js,ts}`
- **Exclude:** `src/lib/server/**`
- **Setup:** `vitest-setup-client.ts`
- **Purpose:** Test Svelte components in a DOM environment

**2. Server Tests** (Node environment)
- **Environment:** Node.js
- **Include:** `src/**/*.{test,spec}.{js,ts}`
- **Exclude:** `src/**/*.svelte.{test,spec}.{js,ts}`
- **Purpose:** Test utilities, helpers, and server-side logic

## Test Structure

**Suite Organization:**
```typescript
// From src/demo.spec.ts
import { describe, it, expect } from 'vitest';

describe('sum test', () => {
	it('adds 1 + 2 to equal 3', () => {
		expect(1 + 2).toBe(3);
	});
});
```

**Svelte Component Pattern:**
```typescript
// From src/routes/page.svelte.test.ts
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
- Use `describe()` to group related tests
- Use `it()` to define individual test cases
- Use `await expect.element()` for async DOM assertions in browser tests
- Use synchronous `expect()` for unit test assertions

## Browser Testing

**Framework:** `@vitest/browser` with Playwright provider

**Imports:**
```typescript
import { page } from '@vitest/browser/context';        // DOM context
import { render } from 'vitest-browser-svelte';        // Svelte component renderer
import { describe, expect, it } from 'vitest';         // Test framework
```

**Component Rendering:**
- `render(Component)` - Mounts a Svelte component into the DOM
- Supports component props passed as second argument

**DOM Queries:**
- `page.getByRole(role, options)` - Query by accessibility role
- `page.getByText(text)` - Query by text content
- Standard DOM APIs via `page` context

**Assertions:**
- `await expect.element(element).toBeInTheDocument()` - Check element presence
- Other matchers inherited from `@vitest/browser/matchers`

## Setup Files

**Client Setup:** `vitest-setup-client.ts`
```typescript
/// <reference types="@vitest/browser/matchers" />
/// <reference types="@vitest/browser/providers/playwright" />
```

**Purpose:**
- Configures TypeScript types for browser matchers
- Enables Playwright provider types
- Applied only to browser tests (`setupFiles: ['./vitest-setup-client.ts']`)

## Mocking

**Not extensively configured** in current codebase, but Vitest provides:
- `vi.mock()` - Mock modules
- `vi.spyOn()` - Spy on functions
- `vi.fn()` - Create mock functions

**Common patterns for this project would be:**
- Mock fetch for API testing: `vi.stubGlobal('fetch', ...)`
- Mock component props for isolated component tests
- Mock event listeners for behavior tests

## Fixtures and Factories

**Not used in current codebase.**

If needed, create in `src/__tests__/fixtures/` or inline within test files:

```typescript
// Example pattern for fixture data
const mockScreenshot = {
	src: 'https://example.com/image.png',
	title: 'Portfolio View',
	description: 'Your holdings overview'
};
```

## Coverage

**Requirements:** Not configured or enforced

**Coverage config:** No `coverage` block in `vite.config.ts`

**To enable coverage:**
```bash
npm install -D @vitest/coverage-v8
```

Then add to `vite.config.ts`:
```typescript
test: {
	coverage: {
		provider: 'v8',
		reporter: ['text', 'json', 'html']
	}
}
```

## Test Types

**Unit Tests:**
- Scope: Individual functions and logic
- Example: `src/demo.spec.ts` - Tests simple arithmetic
- Approach: Fast, isolated, synchronous assertions
- No external dependencies

**Component Tests:**
- Scope: Svelte components in isolation
- Example: `src/routes/page.svelte.test.ts` - Tests rendering
- Approach: Render component, query DOM, assert presence
- Uses browser environment and DOM APIs

**Integration Tests:**
- Not implemented
- Would test: Multiple components working together, data flow between modules
- Approach: Render multiple components, simulate user interactions, assert state changes

**E2E Tests:**
- Framework: Not configured (Playwright installed but not configured for E2E)
- Would test: Full user workflows in production-like environment
- Config needed: Separate Playwright config file

## Common Patterns

**Async Testing:**
```typescript
// Browser tests with DOM async operations
it('should render element', async () => {
	render(Page);
	const heading = page.getByRole('heading', { level: 1 });
	await expect.element(heading).toBeInTheDocument();  // await on assertions
});
```

**Error Testing:**
```typescript
// Pattern for testing error states
it('should show error message on failure', async () => {
	// Setup: mock failed response
	// Render: component that calls the API
	// Assert: error message appears in DOM
});
```

**Component Props Testing:**
```typescript
// Example pattern for testing props
import BlurredScreenshot from '$lib/BlurredScreenshot.svelte';

it('should blur specified regions', () => {
	render(BlurredScreenshot, {
		props: {
			src: 'test.png',
			alt: 'Test',
			blurRegions: [{ top: '10%', left: '10%', width: '50%', height: '50%' }]
		}
	});
	// Assert blur elements are rendered
});
```

## Test Execution Flow

1. **Watch mode** (`npm run test:unit`):
   - Runs both client and server test projects
   - Re-runs on file changes
   - Reports results in terminal

2. **CI mode** (`npm test`):
   - Single run of both projects
   - Exits with status code (0 for pass, 1 for fail)
   - Used in pre-commit hooks and CI/CD

3. **Type checking** (`npm run check`):
   - SvelteKit sync + `svelte-check` + TypeScript compilation
   - Runs before tests in development

---

*Testing analysis: 2026-07-06*
