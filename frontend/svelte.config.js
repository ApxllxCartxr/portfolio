import adapter from '@sveltejs/adapter-vercel';
import { vitePreprocess } from '@sveltejs/vite-plugin-svelte';

/** @type {import('@sveltejs/kit').Config} */
const config = {
	preprocess: vitePreprocess(),
	kit: {
		// adapter-vercel can't infer a runtime from unreleased local Node versions,
		// so pin it explicitly rather than leaving it on auto-detect.
		adapter: adapter({ runtime: 'nodejs22.x' })
	}
};

export default config;
