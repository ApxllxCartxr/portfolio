<!--
	Shell for the bento tiles: hairline card with a small chip label in the
	top-left naming what the tile is. Content is whatever the caller renders.
-->
<script lang="ts">
	import type { Snippet } from 'svelte';

	interface Props {
		label: string;
		glyph: string;
		/** Tile is flush to its edges — for tiles whose content is the artwork. */
		bleed?: boolean;
		children: Snippet;
	}

	let { label, glyph, bleed = false, children }: Props = $props();
</script>

<section class="tile" class:bleed>
	<span class="chip">
		<span class="glyph" aria-hidden="true">{glyph}</span>
		{label}
	</span>
	<div class="body">
		{@render children()}
	</div>
</section>

<style>
	.tile {
		position: relative;
		display: flex;
		flex-direction: column;
		min-height: 11rem;
		padding: 1rem;
		border: 1px solid var(--line);
		border-radius: var(--radius-lg);
		background: var(--bg-raised);
		overflow: hidden;
	}

	.chip {
		display: inline-flex;
		align-items: center;
		gap: 0.35rem;
		align-self: flex-start;
		padding: 0.25rem 0.6rem;
		border: 1px solid var(--line);
		border-radius: 999px;
		background: var(--bg);
		color: var(--muted);
		font-family: var(--font-mono);
		font-size: 0.65rem;
		letter-spacing: 0.06em;
		text-transform: uppercase;
		white-space: nowrap;
	}

	.glyph {
		font-size: 0.75rem;
		line-height: 1;
	}

	.body {
		display: flex;
		flex-direction: column;
		flex: 1;
		margin-top: 0.9rem;
	}

	/* The chip floats over flush content instead of sitting above it. */
	.bleed {
		padding: 0;
	}

	.bleed .chip {
		position: absolute;
		top: 0.75rem;
		left: 0.75rem;
		z-index: 1;
	}

	.bleed .body {
		margin-top: 0;
	}
</style>
