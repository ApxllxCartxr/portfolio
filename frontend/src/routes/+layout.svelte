<script lang="ts">
	import '../app.css';
	import { onNavigate } from '$app/navigation';
	import { page } from '$app/state';
	import SiteNav from '$lib/components/SiteNav.svelte';
	import Shell from '$lib/components/Shell.svelte';
	import ClosingSlab from '$lib/components/ClosingSlab.svelte';

	let { children } = $props();

	// The resume is a document, not a surface: black on white whatever the
	// theme says, and no ink mat around it — the shell paints from the root
	// palette, so in dark mode it would frame a white sheet in Tokyo Night.
	// (Named `documentPage` so it doesn't shadow the DOM `document` used by
	// the view transition below.)
	let documentPage = $derived(page.url.pathname === '/resume');

	// The full board is the end of an argument the homepage spends the whole
	// scroll making; on a blog post the same greeting at 5rem would be louder
	// than the piece above it, so everywhere else gets the compact variant.
	let footerVariant = $derived<'full' | 'compact'>(page.url.pathname === '/' ? 'full' : 'compact');

	// The homepage's last section is a tinted bleed that runs straight into
	// the footer; everywhere else the footer meets plain page background. The
	// slab's concave edge is drawn in this colour, so it has to be told.
	let footerAbove = $derived(page.url.pathname === '/' ? 'var(--bg-sunken)' : 'var(--bg)');

	// Native View Transitions on every client-side navigation. onNavigate runs
	// after the new route's data has loaded but before its DOM is committed,
	// so the browser can snapshot the old page and crossfade to the new one.
	// Browsers without the API just get an ordinary swap. The transition is
	// skipped under reduced-motion, matching how the homepage treats the
	// scroll reveals.
	onNavigate((navigation) => {
		if (!document.startViewTransition) return;
		if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

		return new Promise((resolve) => {
			document.startViewTransition(async () => {
				resolve();
				await navigation.complete;
			});
		});
	});
</script>

<div class:document={documentPage}>
	{#if !documentPage}
		<Shell />
	{/if}
	<SiteNav />
	{@render children()}
	{#if !documentPage}
		<ClosingSlab variant={footerVariant} above={footerAbove} />
	{/if}
</div>

<style>
	/* Overriding the tokens rather than hard-coding colours keeps every rule
	   on the resume page written the same way as the rest of the site, and it
	   takes the theme toggle out of play for this one route. */
	.document {
		--bg: #fff;
		--bg-raised: #fff;
		--bg-sunken: #fff;
		--fg: #000;
		--muted: #333;
		--line: #c9c9c9;
		--accent: #000;
		--accent-2: #000;
		--comment: #666;

		min-height: 100dvh;
		background: #fff;
		color: #000;
	}
</style>
