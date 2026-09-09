<script lang="ts">
	/*
		A dot-matrix piece printed full-bleed behind a surface.

		The pieces are fixed character grids, so filling the viewport means
		picking a font size such that `cols` cells span exactly 100vw. That
		needs the font's advance width, which cannot be assumed: Iosevka Term
		sets at 0.5em per cell where most monospace faces are ~0.6em, and
		guessing 0.6 left the artwork 15% short of both edges. So it is
		measured off the font itself, again once the webfont has actually loaded,
		and on every viewport change. The SSR pass uses Iosevka's ratio,
		which is what ships.
	*/
	let {
		piece,
		opacity = 1,
		/* Nudges the piece off centre, in vh. The login card sits dead centre,
		   which is exactly where the fingertips meet — a small drop keeps the
		   gap between them clear of the card's lower edge. */
		offset = 0
	}: { piece: string; opacity?: number; offset?: number } = $props();

	let lines = $derived(piece.split('\n'));
	let cols = $derived(Math.max(...lines.map((l) => l.length)));

	let el: HTMLPreElement | undefined = $state();
	let measured = $state(0);

	$effect(() => {
		const node = el;
		if (!node) return;

		// Measured on a canvas rather than by resizing the element: writing to
		// node.style and clearing it again leaves the element with no font size
		// whenever the new measurement matches the old one — no state change,
		// so no re-render to put it back, and the piece jumps to the inherited
		// 16px.
		const ctx = document.createElement('canvas').getContext('2d');

		const fit = () => {
			if (!ctx) return;
			const probe = 100;
			const sample = '0'.repeat(64);
			ctx.font = `${probe}px ${getComputedStyle(node).fontFamily}`;
			const advance = ctx.measureText(sample).width / sample.length / probe;
			if (advance > 0) measured = window.innerWidth / (cols * advance);
		};

		fit();
		// Iosevka loads async with font-display: swap, so the first measurement
		// can land on the fallback face — which is wider, and sizes the piece
		// well short of both edges the moment the real font swaps in.
		document.fonts?.ready.then(fit);

		const ro = new ResizeObserver(fit);
		ro.observe(document.documentElement);
		return () => ro.disconnect();
	});
</script>

<div class="frame" aria-hidden="true" style="--dots: {opacity}; --offset: {offset}vh">
	<pre
		bind:this={el}
		style={measured
			? `font-size: ${measured}px`
			: `font-size: calc(100vw / ${cols * 0.5})`}>{piece}</pre>
</div>

<style>
	.frame {
		position: fixed;
		inset: 0;
		z-index: 0;
		display: grid;
		place-items: center;
		overflow: clip;
		pointer-events: none;
		user-select: none;
	}

	pre {
		margin: 0;
		/* Without this the grid's centring sizes the block as fit-content, which
		   clamps at the container width — so the probe below measures a capped
		   box and solves for a font size twice too large. */
		width: max-content;
		font-family: var(--font-mono);
		line-height: 1.02;
		white-space: pre;
		color: var(--fg);
		opacity: var(--dots);
		transform: translateY(var(--offset));
		animation: ink 1.6s cubic-bezier(0.16, 1, 0.3, 1) both;
	}

	@keyframes ink {
		from {
			opacity: 0;
		}
	}

	@media (prefers-reduced-motion: reduce) {
		pre {
			animation: none;
		}
	}
</style>
