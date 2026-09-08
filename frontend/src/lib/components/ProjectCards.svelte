<!--
	Selected work, drawn as a plan.

	The section is not a list with a grid behind it — the section *is* the
	grid. A ruled surface runs the full width of the page, and everything in
	the section, the heading included, is a block pinned to stated
	coordinates on it: start column, start row, span. Nothing flows and
	nothing reflows into tidy rows.

	The lattice is 50px squares — real squares, the same in both axes — and
	the layout grid uses those same squares as its tracks, with no gap. So a
	block's edges land on the lattice rather than near it: its footprint is a
	whole number of cells, stated in cells.

	The grid is drawn twice: a very faint continuous rule every cell, and a
	registration cross on every intersection it makes. The rules carry the
	structure at a whisper; the crosses are what you actually read. Both are
	quiet enough to stay behind the work — the surface should look like
	paper that has been ruled, not like a net thrown over the blocks.

	The crosses are a mask over a flat colour rather than an image, so they
	take the theme's ink like everything else, and they sit at the same
	origin as the rules, so a cross lands exactly where two rules meet.

	The surface's own padding is one cell, so the first track starts on the
	first line — that is what keeps the background and the layout in
	register.

	Footprint is the ranking: cmrlsim and OpenStore take the larger blocks
	and carry a spec row. They are deliberately not much more than a third of
	the surface each — most of the plan stays empty, and that emptiness is
	the composition rather than space waiting to be filled.

	The plan has three states. Above 1200px the blocks are pinned to stated
	coordinates on both axes. Between 700 and 1200px there is no room for a
	lead on each side, so the blocks take the full width in order at heights
	that keep the weighting, still landing on the lattice. Below that they
	are a single column on ruled paper — a plan needs width to be a plan.

	The blocks can be dragged, and they snap to the lattice: a drag moves a
	block in whole cells, never between them, so the plan can be rearranged
	but never knocked out of register. A drag has to travel a few pixels
	before it counts, and the click it would otherwise fire is swallowed, so
	dragging a block never opens it by accident. Inverting that, a block in
	itself is never a link — the only way off the plan is the tiny pill on
	it, "GitHub ↗" for source or "Run it ↗" for the live demo, which fills
	fluidly on hover. Touch is left alone — a
	block that dragged under a thumb would fight the page scroll — and the
	arrangement is not saved, so a reload puts the plan back as drawn.

	The only other thing that responds to the pointer is the block under it: it
	settles into a darker surface and takes an accent edge, on hover and on
	focus alike, so the keyboard sees what the mouse sees. Nothing follows
	the cursor across the surface — a crosshair tracking the pointer over a
	page like this is an instrument doing nothing, and it drags the eye away
	from the work.
-->
<script lang="ts">
	import SectionMark from './SectionMark.svelte';
	import type { WallLabel } from '$lib/resume-data';

	let { items }: { items: WallLabel[] } = $props();

	/** Where each block is pinned, in 50px cells: start line and span, on
	 *  both axes.
	 *
	 *  The right-hand blocks count from the end of the grid (-10 / -1) rather
	 *  than from a fixed column. The surface fits as many 50px cells as the
	 *  viewport allows, so a fixed right-hand column left the whole right
	 *  side of a wide screen empty; counting backwards pins those blocks to
	 *  the right edge at every width, and the plan spans the surface instead
	 *  of huddling on the left.
	 *
	 *  The two leads are staggered rather than aligned, and the pair below
	 *  them sits on the opposite sides, so no two edges line up. Five
	 *  projects, five coordinates — written down, not derived.
	 *
	 *  LegacyWeaver takes the middle: it sits in the band of rows between the
	 *  top pair and the bottom pair, centred across the lattice, so all four
	 *  of the others are arranged around it. Centre is its own anchor because
	 *  neither of the other two can express it — the surface fits as many
	 *  cells as the viewport allows, so the middle column is a different
	 *  number at every width and has to be read off the resolved grid. */
	interface Placement {
		/** Start column, counting from the left. Null while the block is still
		 *  anchored to the right edge or to the centre. */
		col: number | null;
		/** True until the block is dragged: hug the right edge instead. */
		end: boolean;
		/** True until the block is dragged: sit centred instead. */
		centre: boolean;
		w: number;
		row: number;
		h: number;
	}

	const PLAN: Placement[] = [
		{ col: 2, end: false, centre: false, w: 11, row: 5, h: 9 },
		{ col: null, end: true, centre: false, w: 11, row: 3, h: 9 },
		{ col: null, end: false, centre: true, w: 12, row: 15, h: 9 },
		{ col: 3, end: false, centre: false, w: 9, row: 25, h: 8 },
		{ col: null, end: true, centre: false, w: 10, row: 23, h: 8 }
	];

	const CELL = 50;

	let placements = $state(PLAN.map((p) => ({ ...p })));
	let plan: HTMLDivElement;
	let dragging = $state(-1);
	/** Resolved column count. auto-fill decides it, so a centred block can only
	 *  be placed once it has been measured. */
	let tracks = $state(0);

	/** First column of a centred block of width w. Falls back to the left edge
	 *  before the grid has been measured — one frame, and only on first
	 *  paint. */
	const centreCol = (w: number) => (tracks ? Math.max(Math.floor((tracks - w) / 2) + 1, 1) : 1);

	const styleFor = (p: Placement) => {
		const column = p.end
			? `${-(p.w + 1)} / -1`
			: `${p.centre ? centreCol(p.w) : p.col} / span ${p.w}`;
		return `--column: ${column}; --row: ${p.row} / span ${p.h}`;
	};

	$effect(() => {
		if (!plan) return;
		const measure = () => (tracks = trackCount());
		measure();
		const observer = new ResizeObserver(measure);
		observer.observe(plan);
		return () => observer.disconnect();
	});

	/** How many cells wide the plan currently is — auto-fill decides that, so
	 *  it has to be read off the resolved grid rather than assumed. */
	function trackCount() {
		return getComputedStyle(plan).gridTemplateColumns.split(' ').filter(Boolean).length;
	}

	function startDrag(event: PointerEvent, i: number) {
		// Touch drags the page, not the block.
		if (event.pointerType === 'touch' || event.button !== 0) return;

		// A press on an inner control (the GitHub / Run-it buttons) is a
		// click, never a drag — let it reach the control untouched.
		if ((event.target as HTMLElement).closest('a, button')) return;

		const el = event.currentTarget as HTMLElement;
		const startX = event.clientX;
		const startY = event.clientY;
		const p = placements[i];
		const columns = trackCount();
		// A right-anchored or centred block becomes an ordinary placed one the
		// moment it is moved by hand.
		const baseCol = p.end
			? Math.max(columns - p.w + 1, 1)
			: p.centre
				? centreCol(p.w)
				: (p.col ?? 1);
		let moved = false;

		el.setPointerCapture(event.pointerId);

		const onMove = (move: PointerEvent) => {
			if (!moved && Math.hypot(move.clientX - startX, move.clientY - startY) < 5) return;
			moved = true;
			dragging = i;

			const dx = Math.round((move.clientX - startX) / CELL);
			const dy = Math.round((move.clientY - startY) / CELL);
			placements[i] = {
				...p,
				end: false,
				centre: false,
				col: Math.min(Math.max(baseCol + dx, 1), Math.max(columns - p.w + 1, 1)),
				row: Math.max(p.row + dy, 1)
			};
		};

		const onUp = () => {
			el.removeEventListener('pointermove', onMove);
			el.removeEventListener('pointerup', onUp);
			el.removeEventListener('pointercancel', onUp);
			dragging = -1;
			// Swallow the click the drag would otherwise fire, so letting go of
			// a block never opens it.
			if (moved) {
				el.addEventListener('click', (click) => click.preventDefault(), {
					capture: true,
					once: true
				});
			}
		};

		el.addEventListener('pointermove', onMove);
		el.addEventListener('pointerup', onUp);
		el.addEventListener('pointercancel', onUp);
	}
</script>

{#snippet body(item: WallLabel)}
	<span class="medium">{item.medium}</span>
	<span class="title">{item.title}</span>
	<span class="blurb">{item.blurb}</span>
	{#if item.specs}
		<span class="specs" aria-hidden="true">
			{#each item.specs as spec (spec)}<span>{spec}</span>{/each}
		</span>
	{/if}
	<span class="action">
		{#if item.href}
			<a class="btn" href={item.href} rel="noreferrer" target="_blank">
				<span class="label">GitHub</span><span class="arrow" aria-hidden="true">&nearr;</span>
			</a>
		{/if}
	</span>
{/snippet}

<section class="work" aria-labelledby="selected-work">
	<div class="surface">
		<div class="plan" bind:this={plan}>
			<div class="head">
				<div class="block static plate">
					<span class="plate-top">
						<SectionMark glyph="work" />
						<h2 id="selected-work">Selected work</h2>
					</span>
				</div>
			</div>

			<ul>
				{#each items as item, i (item.title)}
					<li class:lead={i < 2} class:dragging={dragging === i} style={styleFor(placements[i])}>
						<div
							class="block"
							id={item.anchorId}
							role="group"
							onpointerdown={(event) => startDrag(event, i)}
						>
							{@render body(item)}
						</div>
					</li>
				{/each}
			</ul>
		</div>
	</div>
</section>

<style>
	.work {
		--cell: 50px;
		--cross: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='50' height='50'%3E%3Cpath d='M25 17v16M17 25h16' stroke='%23fff' stroke-width='1.5' stroke-linecap='square'/%3E%3C/svg%3E");
	}

	/* No padding on the band itself: the lattice is the section's floor, so it
	   has to reach the section's own edges. The breathing room lives inside
	   the surface, as whole cells, where it stays in register. */
	.work {
		padding-block: 0;
	}

	.surface {
		/* The square. Everything on this surface is a whole number of these:
		   the ruled lines, the track sizes, the padding, the footprints. */
		position: relative;
		isolation: isolate;
		/* One whole cell, so the first track starts on the first lattice
		   point and both the rules and the crosses stay in register with the
		   layout. Vertically it is two cells, which is the band's breathing
		   room now that the section itself has none — still a whole number of
		   cells, so the lattice stays square with the grid it carries. */
		padding: calc(var(--cell) * 2) var(--cell);
		/* The lattice runs the full width of the page. It is the section's
		   ground, not a panel on it, so capping it left the grid floating in
		   the middle of a band it was supposed to be the floor of. */
		width: 100%;
		overflow: hidden;
		/* The rules: one hairline per cell, each way, at a whisper. */
		background-image:
			linear-gradient(
				to right,
				color-mix(in srgb, var(--fg) 9%, transparent) var(--rule),
				transparent var(--rule)
			),
			linear-gradient(
				to bottom,
				color-mix(in srgb, var(--fg) 9%, transparent) var(--rule),
				transparent var(--rule)
			);
		background-size:
			var(--cell) 100%,
			100% var(--cell);
	}

	/* The crosses. A mask cut from one 50px tile — a plus centred in it,
	   shifted half a cell so the marks land on the intersections — over a
	   flat colour, so they follow the theme's ink instead of being baked
	   into an image. */
	.surface::before {
		content: '';
		position: absolute;
		inset: 0;
		z-index: -1;
		background-color: color-mix(in srgb, var(--fg) 34%, transparent);
		-webkit-mask-image: var(--cross);
		mask-image: var(--cross);
		-webkit-mask-size: var(--cell) var(--cell);
		mask-size: var(--cell) var(--cell);
		-webkit-mask-position: calc(var(--cell) / -2) calc(var(--cell) / -2);
		mask-position: calc(var(--cell) / -2) calc(var(--cell) / -2);
		-webkit-mask-repeat: repeat;
		mask-repeat: repeat;
		pointer-events: none;
	}

	.plan {
		position: relative;
		z-index: 2;
		display: grid;
		gap: 0.75rem;
	}

	/* The list is only semantics here — the blocks themselves are the grid
	   items, pinned individually. */
	ul {
		display: contents;
		margin: 0;
		padding: 0;
		list-style: none;
	}

	/* Tablet: there is no room for a lead on each side, but there is room for
	   a plan. The blocks take the full width in order, at heights that keep
	   the weighting — the leads are taller — and each one still starts and
	   ends on the lattice. The head sits above them as its own block. */
	@media (min-width: 700px) and (max-width: 1199px) {
		.plan {
			grid-template-columns: repeat(auto-fill, var(--cell));
			grid-auto-rows: var(--cell);
			justify-content: start;
			gap: 0;
		}

		.head {
			grid-column: 1 / -1;
			grid-row: 1 / span 3;
			display: flex;
		}

		li {
			display: flex;
			min-height: 100%;
		}

		/* Leads run the full width and stand taller; the pair below them share
		   a row, each stepping in from its own side. */
		li:nth-child(1) {
			grid-column: 1 / -1;
			grid-row: 5 / span 7;
		}

		li:nth-child(2) {
			grid-column: 1 / -1;
			grid-row: 13 / span 7;
		}

		/* No centre to sit in at this width — the block that leads the middle
		   of the plan takes the full measure instead, between the two pairs. */
		li:nth-child(3) {
			grid-column: 1 / -1;
			grid-row: 21 / span 8;
		}

		li:nth-child(4) {
			grid-column: 1 / span 8;
			grid-row: 30 / span 8;
		}

		li:nth-child(5) {
			grid-column: -9 / -1;
			grid-row: 39 / span 8;
		}
	}

	/* Phone: one column, in order, with the lattice still under it. A plan
	   needs width to be a plan; below this it would only be a list wearing
	   coordinates. */
	@media (max-width: 699px) {
		.surface {
			padding: calc(var(--cell) / 2);
		}

		.plan {
			gap: 0.75rem;
		}

		.block {
			padding: 1.25rem;
		}
	}

	/* The pinned plan needs room for a lead on each side with air between
	   them; under that the blocks stack in order and the lattice is just the
	   paper they sit on. */
	@media (min-width: 1200px) {
		.plan {
			grid-template-columns: repeat(auto-fill, var(--cell));
			grid-auto-rows: var(--cell);
			justify-content: start;
			gap: 0;
		}

		.head {
			grid-column: 1 / span 8;
			grid-row: 1 / span 3;
			display: flex;
			min-height: 100%;
		}

		li {
			grid-column: var(--column);
			grid-row: var(--row);
			/* min-height, not height: the block fills its footprint exactly,
			   and a long blurb overhangs into the empty cells below it rather
			   than being clipped by them. */
			display: flex;
			min-height: 100%;
		}
	}

	/* The heading is a block on the plan like everything else — same paper,
	   same corner marks, pinned to its own footprint. It is a title plate,
	   so it gets the room to be one rather than a label squeezed onto a
	   single line. */
	.plate {
		justify-content: center;
		gap: 0.6rem;
		cursor: default;
	}

	.plate-top {
		display: flex;
		align-items: center;
		gap: 0.6rem;
	}

	h2 {
		margin: 0;
		font-family: var(--font-display);
		font-size: var(--t-section);
		font-weight: 700;
		line-height: 1;
		letter-spacing: -0.015em;
	}

	/* Edges land on the lattice: the border is drawn inside the box, so it
	   sits on a rule rather than beside it. */
	.block {
		position: relative;
		box-sizing: border-box;
		display: flex;
		flex-direction: column;
		align-items: flex-start;
		gap: 0.5rem;
		width: 100%;
		min-height: 100%;
		padding: clamp(1.25rem, 2vw, 1.75rem);
		border: var(--rule) solid var(--line);
		border-radius: var(--radius);
		background: var(--bg-raised);
		font: inherit;
		color: inherit;
		text-align: left;
		text-decoration: none;
		cursor: grab;
		transition:
			background-color 180ms ease,
			border-color 180ms ease;
	}

	.block:active {
		cursor: grabbing;
	}

	/* A block covers the four intersections at its corners, which broke the
	   lattice wherever a block sat on it. So the block draws them back, from
	   the same mask at the same size: its corners are grid crosses, and the
	   card reads as something registered onto the plan rather than laid over
	   it. */
	.block::after {
		content: '';
		position: absolute;
		inset: 0;
		background-color: color-mix(in srgb, var(--fg) 34%, transparent);
		-webkit-mask-image: var(--cross), var(--cross), var(--cross), var(--cross);
		mask-image: var(--cross), var(--cross), var(--cross), var(--cross);
		-webkit-mask-size: var(--cell) var(--cell);
		mask-size: var(--cell) var(--cell);
		-webkit-mask-repeat: no-repeat;
		mask-repeat: no-repeat;
		-webkit-mask-position:
			calc(var(--cell) / -2) calc(var(--cell) / -2),
			calc(100% + var(--cell) / 2) calc(var(--cell) / -2),
			calc(var(--cell) / -2) calc(100% + var(--cell) / 2),
			calc(100% + var(--cell) / 2) calc(100% + var(--cell) / 2);
		mask-position:
			calc(var(--cell) / -2) calc(var(--cell) / -2),
			calc(100% + var(--cell) / 2) calc(var(--cell) / -2),
			calc(var(--cell) / -2) calc(100% + var(--cell) / 2),
			calc(100% + var(--cell) / 2) calc(100% + var(--cell) / 2);
		pointer-events: none;
	}

	/* While a block is being moved it leads the stack and stops the pointer
	   selecting the text it is dragging. */
	.dragging {
		z-index: 3;
		user-select: none;
	}

	.dragging .block {
		border-color: var(--accent);
		background: var(--bg-sunken);
	}

	/* Selected object on a plan: it settles into the surface a shade and
	   takes an accent edge. No inversion — the ink is spent elsewhere on the
	   page, and a block that size flipping black swallows the grid. */
	.block:hover,
	.block:focus-visible {
		background: var(--bg-sunken);
		border-color: var(--accent);
	}

	.lead .block {
		gap: 0.65rem;
		padding: clamp(1.5rem, 2.5vw, 2.25rem);
	}

	.medium {
		font-size: 0.92rem;
		font-weight: 500;
		line-height: 1.4;
		color: var(--muted);
	}

	.title {
		font-family: var(--font-display);
		font-size: clamp(1.35rem, 1.9vw, 1.65rem);
		font-weight: 700;
		line-height: 1.05;
		letter-spacing: -0.02em;
		text-wrap: balance;
	}

	.lead .title {
		font-size: clamp(1.75rem, 2.6vw, 2.25rem);
	}

	.blurb {
		font-size: 1rem;
		line-height: 1.55;
	}

	/* Only the leads carry a spec row: those facts are why they lead, and
	   repeating the device on every block would flatten it again. */
	.specs {
		display: flex;
		flex-wrap: wrap;
		gap: 0.35rem 1.1rem;
		margin-top: 0.3rem;
		font-family: var(--font-display);
		font-size: clamp(1.05rem, 1.5vw, 1.25rem);
	}

	.specs span + span::before {
		content: '*';
		color: var(--accent);
		margin-right: 1.1rem;
	}

	.action {
		margin-top: auto;
		padding-top: 0.9rem;
		display: flex;
		flex-wrap: wrap;
		gap: 0.5rem;
	}

	/* "GitHub ↗" / "Run it ↗". A ghost pill that, on hover, fills fluidly
	   from its centre — a circle swells past the pill and the ink inverts to
	   the block's surface, so the control reads as liquid welling up rather
	   than a flat colour swap. */
	.btn {
		position: relative;
		z-index: 0;
		isolation: isolate;
		display: inline-flex;
		align-items: center;
		gap: 0.4rem;
		padding: 0.5rem 1.1rem;
		border: 1.5px solid var(--accent);
		border-radius: 999px;
		background: transparent;
		font: inherit;
		font-size: 0.92rem;
		font-weight: 600;
		line-height: 1;
		color: var(--accent);
		text-decoration: none;
		cursor: pointer;
		overflow: hidden;
		transition: color 0.7s ease;
	}

	.btn .arrow {
		font-size: 1.1em;
		line-height: 0.8;
		transform: translateY(-0.02em);
	}

	.btn::before {
		content: '';
		position: absolute;
		left: 50%;
		top: 50%;
		z-index: -1;
		width: 190%;
		aspect-ratio: 1;
		border-radius: 50%;
		background: var(--accent);
		transform: translate(-50%, -50%) scale(0);
		transition: transform 0.7s cubic-bezier(0.22, 1.2, 0.36, 1);
	}

	.btn:hover::before,
	.btn:focus-visible::before {
		transform: translate(-50%, -50%) scale(1);
	}

	.btn:hover,
	.btn:focus-visible {
		color: var(--bg-sunken);
	}
</style>
