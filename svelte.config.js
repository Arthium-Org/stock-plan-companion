import adapter from '@sveltejs/adapter-static';
import { vitePreprocess } from '@sveltejs/vite-plugin-svelte';

/** @type {import('@sveltejs/kit').Config} */
const config = {
	// Consult https://svelte.dev/docs/kit/integrations
	// for more information about preprocessors
	preprocess: vitePreprocess(),

	kit: {
		// Static adapter: prerenders the whole site to plain HTML/CSS/JS for
		// hosting on GitHub Pages. See https://svelte.dev/docs/kit/adapter-static
		adapter: adapter({
			pages: 'build',
			assets: 'build',
			fallback: '404.html',
			precompress: false,
			strict: true
		}),
		prerender: {
			// Footer has placeholder anchor links (#privacy, #disclaimer) with no
			// target yet — warn instead of failing the build until real pages exist.
			handleMissingId: 'warn'
		}
	}
};

export default config;
