<!--
	Static, non-draggable window chrome for full-page routes (currently just
	/blog and /blog/[slug]) — same border/titlebar/grid visual language as the
	homepage's Window.svelte, but for a page that scrolls normally instead of
	one that lives inside the desktop's drag-bounded surface. Shares
	`view-transition-name: blog-window` with the homepage's maximized Blog
	Window (see Window.svelte's `transitionName` prop) so navigating here
	morphs rather than cuts.
-->
<script lang="ts">
	import { goto } from '$app/navigation';
	import { resolve } from '$app/paths';
	import type { Snippet } from 'svelte';
	import GridLayer from './GridLayer.svelte';
	import ThemeSwatchMenu from './ThemeSwatchMenu.svelte';
	import WindowControls from './WindowControls.svelte';

	interface Props {
		title: string;
		children?: Snippet;
	}

	let { title, children }: Props = $props();
	// Bounds the theme picker on the whole page (grid margin included), not
	// just the window — ThemeSwatchMenu already ignores right-clicks that
	// land inside a `.window`, so scoping it any tighter would leave nowhere
	// left to right-click at all, since the window fills the panel.
	let rootEl = $state<HTMLDivElement>();

	function close() {
		goto(resolve('/'));
	}
</script>

<div class="page-window" bind:this={rootEl}>
	<div class="backdrop" aria-hidden="true">
		<GridLayer />
	</div>
	<ThemeSwatchMenu boundsEl={rootEl} />

	<div class="panel">
		<section class="window" style="view-transition-name: blog-window">
			<header class="titlebar">
				<span class="title-label">{title}</span>
				<WindowControls {title} onClose={close} />
			</header>
			<div class="content">
				{@render children?.()}
			</div>
		</section>
	</div>
</div>

<style>
	.page-window {
		position: relative;
		min-height: 100dvh;
	}

	.backdrop {
		position: fixed;
		inset: 0;
		overflow: hidden;
	}

	.panel {
		position: relative;
		display: flex;
		flex-direction: column;
		margin: clamp(0.5rem, 2.1vw, 1.75rem);
		min-height: calc(100dvh - clamp(1rem, 4.2vw, 3.5rem));
	}

	.window {
		position: relative;
		flex: 1;
		display: flex;
		flex-direction: column;
		background: var(--bg);
		border: 1px solid var(--fg);
	}

	.titlebar {
		display: flex;
		align-items: center;
		gap: 0.6rem;
		padding: 0.5rem 0.6rem;
		background: var(--fg);
	}

	.title-label {
		font-family: var(--font-mono);
		font-size: 0.72rem;
		text-transform: uppercase;
		letter-spacing: 0.04em;
		color: var(--bg);
	}

	.content {
		flex: 1;
		max-width: 720px;
		width: 100%;
		margin: 0 auto;
		padding: 3rem 1.25rem 5rem;
		color: var(--fg);
	}

	@media (max-width: 700px) {
		.content {
			padding: 2rem 1rem 4rem;
		}
	}
</style>
