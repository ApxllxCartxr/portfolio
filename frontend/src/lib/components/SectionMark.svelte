<!--
	The small end of the same mark: sits beside a section label at roughly
	cap height and strokes itself on once, when the label first comes into
	view, then sits still. Nothing about the section depends on it having
	run — it is aria-hidden and the label reads on its own.

	`pathLength="1"` normalises every path to a length of 1 regardless of its
	real geometry, so one dash offset drives all of them and the strokes land
	together instead of finishing in path-length order.
-->
<script lang="ts">
	import { browser } from '$app/environment';
	import { glyphs, type GlyphId } from './glyphs';

	let {
		glyph,
		size = 1
	}: {
		glyph: GlyphId;
		/** Mark size in rem. 1 = body text height; bump it where the mark
		 *  sits beside a display heading that would dwarf a caption-sized
		 *  glyph. */
		size?: number;
	} = $props();

	let svg: SVGSVGElement;
	let drawn = $state(false);

	$effect(() => {
		if (!browser) return;
		// The draw-in is the motion the preference is about — under reduce the
		// mark is simply already there.
		if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
			drawn = true;
			return;
		}

		const observer = new IntersectionObserver(
			([entry]) => {
				if (!entry.isIntersecting) return;
				drawn = true;
				observer.disconnect();
			},
			{ rootMargin: '0px 0px -12% 0px' }
		);
		observer.observe(svg);

		return () => observer.disconnect();
	});
</script>

<svg
	bind:this={svg}
	class="mark"
	class:drawn
	style="font-size: {size}rem"
	viewBox="0 0 24 24"
	aria-hidden="true"
	focusable="false"
>
	{#each glyphs[glyph] as d, i (d)}
		<path {d} pathLength="1" style="--i: {i}" />
	{/each}
</svg>

<style>
	.mark {
		width: 1em;
		height: 1em;
		flex: none;
		color: var(--accent);
		fill: none;
		stroke: currentColor;
		stroke-width: 1.8;
		stroke-linecap: round;
		stroke-linejoin: round;
	}

	.mark path {
		stroke-dasharray: 1;
		stroke-dashoffset: 1;
	}

	.mark.drawn path {
		stroke-dashoffset: 0;
		transition: stroke-dashoffset 0.6s ease-out;
		transition-delay: calc(var(--i) * 0.09s);
	}

	@media (prefers-reduced-motion: reduce) {
		.mark path {
			stroke-dashoffset: 0;
		}
	}
</style>
