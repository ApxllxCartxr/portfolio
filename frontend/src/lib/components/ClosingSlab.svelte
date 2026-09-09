<!--
	The footer: a departure board, with the colophon printed along its bottom
	edge.

	The metaphor is doing work rather than decorating. A board's job is
	exactly a footer's job — here is everywhere you can go from here, in one
	scannable column — and it gives the two things a plain link list can't: a
	reason for the row to be uniform, and a reason for the hover to say
	something ("DEPART", "COPY") instead of just underlining itself.

	It lands once, when the footer scrolls into view: the greeting first, then
	the rows cascading down. Nothing re-flips on scroll. The clock is the only
	thing that flips afterwards, once a minute, which is what a board does.

	Below the rule it stops being a board and becomes a colophon — what this
	page is set in, built with, and where it was made. The back of the book.

	Contrast note: --accent is only ever a mark here, never text or a link. On
	the dark theme the slab is light (#c0caf5) and the accent does not carry
	against it.
-->
<script lang="ts">
	import { onDestroy } from 'svelte';
	import { browser } from '$app/environment';
	import { page } from '$app/state';
	import { resolve } from '$app/paths';
	import FlapText from './FlapText.svelte';

	let {
		variant = 'compact',
		above = 'var(--bg)'
	}: {
		variant?: 'full' | 'compact';
		/** The colour of whatever the slab's concave top edge bites into. The
		 *  arc is drawn in it, so it has to match or the curve shows a seam. */
		above?: string;
	} = $props();

	const EMAIL = 'josephfernando05@proton.me';

	// Every cell count on the board is fixed to the longest entry in its
	// column, so a row never changes width when its gate flips.
	const LABEL_CELLS = 8;
	const GATE_CELLS = 26;

	type Row = { label: string; gate: string; href?: string; copy?: boolean; external?: boolean };

	const rows: Row[] = [
		{ label: 'Email', gate: EMAIL, copy: true },
		{
			label: 'GitHub',
			gate: 'gh/apxllxcartxr',
			href: 'https://github.com/apxllxcartxr',
			external: true
		},
		{
			label: 'LinkedIn',
			gate: 'in/joseph-fernando05',
			href: 'https://www.linkedin.com/in/joseph-fernando05/',
			external: true
		},
		{
			label: 'LeetCode',
			gate: 'lc/apxllxcartxr',
			href: 'https://leetcode.com/u/apxllxcartxr/',
			external: true
		},
		{ label: 'Home', gate: '/', href: resolve('/') },
		{ label: 'Resume', gate: '/resume', href: resolve('/resume') },
		{ label: 'Writing', gate: '/blog', href: resolve('/blog') }
	];

	const year = new Date().getFullYear();

	let board: HTMLElement;
	/** Rows land one after another; `live` is how many have been released. */
	let live = $state(0);
	let hovered = $state(-1);
	let copied = $state(false);

	let cascade: ReturnType<typeof setInterval> | undefined;
	let copyTimer: ReturnType<typeof setTimeout> | undefined;
	let clockTimer: ReturnType<typeof setInterval> | undefined;

	// Blank until mounted: the server's clock isn't the reader's, and an empty
	// board is the honest first frame anyway.
	let clock = $state('');

	function readClock() {
		clock = new Intl.DateTimeFormat('en-GB', {
			timeZone: 'Asia/Kolkata',
			hour: '2-digit',
			minute: '2-digit',
			second: '2-digit',
			hour12: false
		}).format(new Date());
	}

	$effect(() => {
		// Re-arm on every navigation. The footer lives in the layout, so it is
		// never rebuilt between routes — without this dependency the effect
		// runs once for the whole session and the board keeps whatever state
		// the first page left it in: already landed (so it never flips again),
		// or still waiting on an observer that was armed against a scroll
		// position that no longer exists. Reloading "fixed" it because a
		// reload is the only thing that remounted the component.
		const route = page.url.pathname;
		if (!browser) return;
		void route;

		readClock();
		clockTimer = setInterval(readClock, 1000);

		clearInterval(cascade);
		live = 0;

		if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
			live = rows.length + 1;
			return () => clearInterval(clockTimer);
		}

		const observer = new IntersectionObserver(
			([entry]) => {
				if (!entry.isIntersecting) return;
				cascade = setInterval(() => {
					live += 1;
					if (live > rows.length) clearInterval(cascade);
				}, 130);
				observer.disconnect();
			},
			{ rootMargin: '0px 0px -15% 0px' }
		);
		observer.observe(board);

		return () => {
			observer.disconnect();
			clearInterval(cascade);
			clearInterval(clockTimer);
		};
	});

	// The address copies rather than opening a mail client — the dock already
	// carries the mailto. The gate flips to CONFIRMED and back.
	async function copyEmail() {
		if (!navigator.clipboard) return;
		try {
			await navigator.clipboard.writeText(EMAIL);
			copied = true;
			clearTimeout(copyTimer);
			copyTimer = setTimeout(() => (copied = false), 2000);
		} catch {
			// Clipboard denied — the address is still on the board, selectable.
		}
	}

	/** What the gate column reads: the destination at rest, the action when
	 *  the row is under the cursor or focused. */
	function gateFor(row: Row, i: number) {
		if (row.copy && copied) return 'confirmed ✓';
		if (hovered !== i) return row.gate;
		return row.copy ? 'copy ↗' : 'depart ↗';
	}

	onDestroy(() => {
		clearInterval(cascade);
		clearInterval(clockTimer);
		clearTimeout(copyTimer);
	});
</script>

<!-- The three columns of a row, shared by the link rows and the copy row. -->
{#snippet cells(row: Row, i: number, on: boolean)}
	<span class="no">{String(i + 1).padStart(2, '0')}</span>
	<span class="label"><FlapText text={row.label} cells={LABEL_CELLS} run={on} /></span>
	<span class="leader" aria-hidden="true"></span>
	<span class="gate" aria-live={row.copy ? 'polite' : undefined}>
		<FlapText text={gateFor(row, i)} cells={GATE_CELLS} align="end" run={on} stagger={22} />
	</span>
{/snippet}

<footer
	id="site-footer"
	class="slab"
	class:compact={variant === 'compact'}
	style:--above={above}
	aria-labelledby="contact"
>
	<div class="inner" bind:this={board}>
		<div class="head">
			<h2 id="contact">Contact</h2>
			<p class="clock">
				<FlapText text={clock || '  :  :  '} cells={8} />
				<span class="tz">IST · UTC+5:30</span>
			</p>
		</div>

		<p class="greeting"><FlapText text="Say hello" run={live > 0} stagger={55} /></p>
	</div>

	<div class="chassis">
		<div class="rows">
			<p class="captions" aria-hidden="true">
				<span class="no">No.</span>
				<span class="label">Destination</span>
				<span class="leader"></span>
				<span class="gate">Gate</span>
			</p>

			<ul class="board">
				{#each rows as row, i (row.label)}
					{@const on = live > i + 1}
					<li>
						{#if row.copy}
							<button
								class="row"
								type="button"
								aria-label="Copy email address, {EMAIL}"
								onclick={copyEmail}
								onmouseenter={() => (hovered = i)}
								onmouseleave={() => (hovered = -1)}
								onfocus={() => (hovered = i)}
								onblur={() => (hovered = -1)}
							>
								{@render cells(row, i, on)}
							</button>
						{:else}
							<a
								class="row"
								href={row.href}
								rel={row.external ? 'noreferrer' : undefined}
								onmouseenter={() => (hovered = i)}
								onmouseleave={() => (hovered = -1)}
								onfocus={() => (hovered = i)}
								onblur={() => (hovered = -1)}
							>
								{@render cells(row, i, on)}
							</a>
						{/if}
					</li>
				{/each}
			</ul>
		</div>
	</div>

	<div class="inner">
		<dl class="colophon">
			<div>
				<dt>Type</dt>
				<dd>EB Garamond · Open Sauce Sans · Iosevka SS08 · PP Kyoto</dd>
			</div>
			<div>
				<dt>Build</dt>
				<dd>SvelteKit · Vercel</dd>
			</div>
			<div>
				<dt>Station</dt>
				<dd>Chennai, India</dd>
			</div>
			<div>
				<dt>Edition</dt>
				<dd>© {year} Joseph Fernando</dd>
			</div>
		</dl>
	</div>

	<!-- Press-sheet registration marks. The colophon calls this the back of
	     the book; crop marks are what is actually printed in a sheet's
	     corners, and they tie the slab to the page's plate-and-mark hand. -->
	<div class="crop" aria-hidden="true">
		<span></span><span></span><span></span>
	</div>

	<div class="admin-corner">
		<a class="admin-mark" href={resolve('/admin')} aria-label="Admin login" title="Admin">*</a>
	</div>
</footer>

<style>
	.slab {
		--pad-block: clamp(3.5rem, 9vh, 5.5rem);
		--gap: clamp(2.25rem, 5vh, 3.25rem);
		/* The page gutter, owned in one place. Both the centred column and the
		   board box subtract exactly this, which is what puts the contact
		   rule, the greeting and the colophon on the box's own edges. */
		--gutter: clamp(1.25rem, 5vw, 2.5rem);

		position: relative;
		display: flex;
		flex-direction: column;
		gap: var(--gap);
		overflow: hidden;
		padding-block: var(--pad-block) clamp(1.5rem, 3vh, 2rem);
		background: var(--fg);
		color: var(--bg);
		--sag: 14px;
		/* The concave top edge: the corners meet the page flush and the middle
		   dips into the slab, so whatever sits above bulges down into the ink.

		   The depth is a constant rather than an SVG clip because a clipPath in
		   objectBoundingBox units scales its depth with the element — the
		   identical numbers gave the band a 9px pinch and this slab a 50px
		   droop, and they stopped reading as the same curve. --sag is a
		   constant, so they do.

		   Drawn as an arc of page-coloured background laid over the slab, not
		   as a mask: a mask ellipse only --sag tall stretched across the whole
		   viewport is so eccentric that its gradient stop can't resolve, and
		   the edge tears into a sawtooth. border-radius the browser
		   antialiases properly. The colour comes in as --above rather than
		   being assumed: the homepage runs a --bg-sunken band right up to the
		   footer, every other route meets it on plain --bg. */
	}

	.slab::before {
		content: '';
		position: absolute;
		inset-inline: 0;
		top: -1px;
		z-index: 1;
		height: var(--sag);
		background: var(--above);
		border-radius: 0 0 50% 50% / 0 0 100% 100%;
		pointer-events: none;
	}

	.slab.compact {
		--pad-block: clamp(2.5rem, 6vh, 3.5rem);
		--gap: clamp(1.5rem, 4vh, 2rem);
	}

	.inner {
		box-sizing: border-box;
		display: flex;
		flex-direction: column;
		gap: var(--gap);
		width: calc(100% - var(--gutter) * 2);
		max-width: 1080px;
		margin-inline: auto;
	}

	/* Board header: what this board is, and the time at the station. */
	.head {
		display: flex;
		align-items: baseline;
		justify-content: space-between;
		gap: 1rem 2rem;
		flex-wrap: wrap;
		padding-bottom: 0.75rem;
		border-bottom: var(--rule) solid color-mix(in srgb, currentColor 30%, transparent);
		font-family: var(--font-mono);
		font-size: 0.86rem;
		letter-spacing: 0.1em;
		text-transform: uppercase;
	}

	.head h2 {
		margin: 0;
		font: inherit;
		opacity: 0.7;
	}

	.clock {
		display: flex;
		align-items: center;
		gap: 0.6rem;
		margin: 0;
		--flap-w: 0.8em;
	}

	.tz {
		opacity: 0.6;
	}

	/* A board sets its own type. EB Garamond is the site's display face and it
	   is spent once, on the name — and a serif inside flap cells fights the
	   mechanism anyway, because the cells are sized on a monospaced advance
	   and the serif's aren't. The greeting is board type: Iosevka, heavy,
	   opened up. */
	.greeting {
		margin: 0;
		font-family: var(--font-mono);
		/* Was hero-scale (up to 5.25rem) and it outshouted the board it was
		   introducing. At announcement size the eye lands on the rows first,
		   which is the part that is actually useful. */
		font-size: clamp(1.85rem, 4.6vw, 2.9rem);
		font-weight: 700;
		line-height: 1;
		letter-spacing: 0.01em;
		--flap-w: 0.86em;
		--flap-gap: 0.08em;
		--flap-pad: 0.14em;
	}

	.compact .greeting {
		font-size: clamp(1.45rem, 3.4vw, 2rem);
	}

	/* The board is a contained box on the slab — same measure as the
	   column, not the full width of the page. The chassis carries the
	   box (border, radius, wash); the rows inside it are just content. */
	.chassis {
		position: relative;
		box-sizing: border-box;
		width: calc(100% - var(--gutter) * 2);
		max-width: 1080px;
		margin-inline: auto;
		padding-block: 0.2rem 0.35rem;
		padding-inline: var(--gutter);
		border: var(--rule) solid color-mix(in srgb, currentColor 22%, transparent);
		border-radius: var(--radius-lg);
		background: color-mix(in srgb, currentColor 5%, transparent);
	}

	/* Sprocket margin. The same punched-dot vocabulary as .leader below,
	   turned vertical and run down both gutters of the chassis — the
	   perforated edge of the printed schedule this board replaced. Drawn in
	   currentColor so it inverts with the slab. */
	.chassis::before,
	.chassis::after {
		content: '';
		position: absolute;
		top: 0.9rem;
		bottom: 0.9rem;
		width: 1px;
		background-image: radial-gradient(circle, currentColor 0.5px, transparent 0.6px);
		background-size: 1px 0.42rem;
		background-repeat: repeat-y;
		opacity: 0.28;
		pointer-events: none;
	}

	.chassis::before {
		left: calc(var(--gutter) * 0.42);
	}

	.chassis::after {
		right: calc(var(--gutter) * 0.42);
	}

	/* Below the caption breakpoint the gutters are too tight to spare the
	   rail without crowding the rows. */
	@media (max-width: 640px) {
		.chassis::before,
		.chassis::after {
			display: none;
		}
	}

	/* The rows fill the box: the measure and gutters live on the chassis
	   now, so the inner wrapper is only semantics. */
	.rows {
		width: 100%;
	}

	.board {
		margin: 0;
		padding: 0;
		list-style: none;
	}

	.board li:last-child .row {
		border-bottom: none;
	}

	/* Column captions, in the chassis rather than on a row — they name the
	   columns once and then get out of the way. */
	.captions {
		display: flex;
		align-items: center;
		gap: 0.7rem;
		margin: 0;
		padding-block: 0.5rem 0.4rem;
		border-bottom: var(--rule) solid color-mix(in srgb, currentColor 22%, transparent);
		font-family: var(--font-mono);
		/* Same size as a row so the em-based cell maths below line the
		   captions up with the columns they name; the caption reads as a
		   caption through case and weight, not size. */
		font-size: clamp(0.95rem, 1.5vw, 1.2rem);
		letter-spacing: 0.14em;
		text-transform: uppercase;
		opacity: 0.5;
	}

	/* One cell is --flap-w wide with --flap-gap between, so n cells run
	   n * (w + gap) - gap. */
	.captions .label {
		flex: none;
		width: calc(8 * 0.84em - 0.06em);
	}

	.captions .gate {
		flex: none;
		width: calc(26 * 0.84em - 0.06em);
		text-align: right;
	}

	@media (max-width: 640px) {
		.captions {
			display: none;
		}
	}

	/* One row = one destination. The columns are fixed-width flap runs, so the
	   board stays a grid without a grid — nothing shifts when a gate flips. */
	.row {
		display: flex;
		align-items: center;
		gap: 0.7rem;
		width: 100%;
		padding-block: 0.7rem;
		border: none;
		border-bottom: var(--rule) solid color-mix(in srgb, currentColor 14%, transparent);
		background: none;
		color: inherit;
		font-family: var(--font-mono);
		font-size: clamp(0.95rem, 1.5vw, 1.2rem);
		letter-spacing: 0.03em;
		text-align: left;
		text-decoration: none;
		cursor: pointer;
		transition: background-color 160ms ease;
	}

	.row:hover,
	.row:focus-visible {
		background: color-mix(in srgb, currentColor 8%, transparent);
	}

	.row:focus-visible {
		outline: var(--rule) solid currentColor;
		outline-offset: 2px;
	}

	.no {
		opacity: 0.55;
		font-variant-numeric: tabular-nums;
	}

	.label {
		font-weight: 600;
	}

	/* The dotted run between the columns — a board's leader, and the thing
	   that keeps the gate column reading as a destination rather than a
	   caption stuck to the label. */
	.leader {
		flex: 1;
		min-width: 1rem;
		height: 1px;
		background-image: radial-gradient(circle, currentColor 0.5px, transparent 0.6px);
		background-size: 0.3rem 1px;
		background-repeat: repeat-x;
		opacity: 0.3;
	}

	.gate {
		flex: none;
		text-align: right;
	}

	/* Below ~640px the gate can't share a line with the label at a legible
	   size, so the row stacks: destination over gate, leader retired. */
	@media (max-width: 640px) {
		.row {
			flex-wrap: wrap;
			gap: 0.25rem 0.7rem;
		}

		.leader {
			display: none;
		}

		.gate {
			flex-basis: 100%;
			padding-left: 2.1rem;
			opacity: 0.8;
		}
	}

	/* 26 cells is the longest column on the board; below ~480px it is wider
	   than the screen at row size, so it — and only it — steps down. */
	@media (max-width: 480px) {
		.gate {
			font-size: 0.82rem;
		}
	}

	/* The colophon: not part of the board, printed under it.

	   Set as a ledger strip rather than label-beside-value. The old 2x2 grid
	   put a four-font run next to a two-word one, so the columns never
	   resolved and the right half floated. Stacking the label over its value
	   makes every cell the same shape regardless of how long the value is,
	   and the four columns then read as one row of the board's own captions. */
	.colophon {
		display: grid;
		grid-template-columns: 1fr 1fr;
		gap: 1.4rem var(--gutter);
		margin: 0;
		padding-top: 1.25rem;
		border-top: var(--rule) solid color-mix(in srgb, currentColor 30%, transparent);
		font-family: var(--font-mono);
		font-size: 0.86rem;
		line-height: 1.55;
		opacity: 0.72;
	}

	@media (min-width: 720px) {
		.colophon {
			grid-template-columns: repeat(4, 1fr);
		}

		/* Column rules only once the strip is a clean four-up — under that it
		   wraps to 2x2 and the hairlines would land mid-strip. */
		.colophon div + div {
			padding-left: var(--gutter);
			border-left: var(--rule) solid color-mix(in srgb, currentColor 18%, transparent);
		}
	}

	.colophon div {
		display: flex;
		flex-direction: column;
		gap: 0.3rem;
		min-width: 0;
	}

	dt {
		letter-spacing: 0.1em;
		text-transform: uppercase;
		opacity: 0.55;
	}

	dd {
		margin: 0;
		/* The type line is the only long value; let it wrap inside its own
		   column instead of setting the column's width. */
		overflow-wrap: break-word;
	}

	/* Four corner crosses, inset rather than bled: the slab clips its own
	   overflow for the concave top edge, so a mark on the true corner would
	   be cut in half. Each is one span with two gradients — a horizontal arm
	   and a vertical one — so there is no extra DOM per arm. */
	.crop {
		position: absolute;
		inset: clamp(0.7rem, 2vw, 1.15rem);
		pointer-events: none;
	}

	.crop span {
		position: absolute;
		width: 11px;
		height: 11px;
		opacity: 0.32;
		background-image:
			linear-gradient(currentColor, currentColor), linear-gradient(currentColor, currentColor);
		background-repeat: no-repeat;
		background-size:
			11px 1px,
			1px 11px;
		background-position:
			center center,
			center center;
	}

	.crop span:nth-child(1) {
		top: 0;
		left: 0;
	}

	.crop span:nth-child(2) {
		top: 0;
		right: 0;
	}

	/* No bottom-left cross: that corner is the admin mark's. */
	.crop span:nth-child(3) {
		right: 0;
		bottom: 0;
	}

	@media (max-width: 640px) {
		.crop {
			display: none;
		}
	}

	/* Discreet owner entry to /admin: a mark pinned to the footer's
	   bottom-left corner, at the viewport edge rather than in the centred
	   column. Same voice as the asterisks elsewhere on the page — Garamond,
	   accent, larger than body copy. (The file's contrast note about accent
	   text applies to legibility-critical copy; this is a single large
	   decorative glyph.) */
	.admin-corner {
		position: absolute;
		left: clamp(0.75rem, 3vw, 1.5rem);
		bottom: 0.45rem;
	}

	.admin-mark {
		display: inline-block;
		font-family: var(--font-display);
		font-weight: 700;
		font-size: 1.6rem;
		line-height: 1;
		color: var(--accent);
		text-decoration: none;
	}

	.admin-mark:hover,
	.admin-mark:focus-visible {
		transform: scale(1.15);
	}

	@media (prefers-reduced-motion: reduce) {
		.row {
			transition: none;
		}
	}

	/* Tokyo Night: the slab itself is light, so the contained board goes
	   dark — ink box on a light wall. Rows, leaders, captions, hovers and
	   flap cells all derive from currentColor, so swapping the container's
	   background/color inverts the whole board with nothing per-row. */
	@media (prefers-color-scheme: dark) {
		:global(:root:not([data-theme='light'])) .chassis {
			background: var(--bg);
			color: var(--fg);
			border-color: color-mix(in srgb, var(--fg) 30%, transparent);
		}
	}

	:global(:root[data-theme='dark']) .chassis {
		background: var(--bg);
		color: var(--fg);
		border-color: color-mix(in srgb, var(--fg) 30%, transparent);
	}
</style>
