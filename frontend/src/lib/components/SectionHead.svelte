<!--
	One section heading, used by every section below the hero.

	In its default 'rail' variant, from 1000px up it is the left track of the
	section: it sticks under the nav and stays put while the content scrolls
	past it, so the reader always knows what they are looking at without the
	label repeating itself.

	The title is Garamond rather than a tracked mono label: the hero
	establishes Garamond as the page's voice, and mono is kept for data.
-->
<script lang="ts">
	import SectionMark from './SectionMark.svelte';
	import type { GlyphId } from './glyphs';

	let {
		title,
		glyph,
		id,
		variant = 'rail',
		markSize = 1.35
	}: {
		title: string;
		glyph: GlyphId;
		id: string;
		/** 'rail' sticks in the section's left track; 'inline' stays a
		 *  horizontal head above its content, for the full-width sections
		 *  where a rail would eat the left edge of the layout. */
		variant?: 'rail' | 'inline';
		/** The glyph sits beside a display heading, so it gets a larger
		 *  em than a body-sized icon would. */
		markSize?: number;
	} = $props();
</script>

<div class="head {variant}">
	<SectionMark {glyph} size={markSize} />
	<h2 {id}>{title}</h2>
</div>

<style>
	.head {
		display: flex;
		flex-wrap: wrap;
		align-items: center;
		gap: 0.7rem;
		margin-bottom: clamp(1.25rem, 3vh, 2rem);
	}

	h2 {
		margin: 0;
		font-family: var(--font-display);
		font-size: var(--t-section);
		font-weight: 700;
		line-height: 1;
		letter-spacing: -0.015em;
	}

	@media (min-width: 1000px) {
		.rail {
			position: sticky;
			top: var(--sticky-top);
			align-self: start;
			flex-direction: column;
			align-items: flex-start;
			gap: 0.85rem;
			margin-bottom: 0;
		}

		.rail h2 {
			line-height: 1.05;
			text-wrap: balance;
		}
	}
</style>
