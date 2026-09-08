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
		clockTimer = setInterval(readClock, 30_000);

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
				<FlapText text={clock || '  :  '} cells={5} />
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
</footer>

<style>
	.slab {
		--pad-block: clamp(3.5rem, 9vh, 5.5rem);
		--gap: clamp(2.25rem, 5vh, 3.25rem);

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
		display: flex;
		flex-direction: column;
		gap: var(--gap);
		width: 100%;
		max-width: 1080px;
		margin-inline: auto;
		padding-inline: clamp(1.25rem, 5vw, 2.5rem);
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
		font-size: clamp(2.6rem, 8vw, 5.25rem);
		font-weight: 700;
		line-height: 1;
		letter-spacing: 0.01em;
		--flap-w: 0.86em;
		--flap-gap: 0.08em;
		--flap-pad: 0.14em;
	}

	.compact .greeting {
		font-size: clamp(1.7rem, 4.5vw, 2.6rem);
	}

	/* The board breaks the column and runs the full width of the slab — the
	   only element on the page that does, which is the point: everything else
	   here is a caption to it. A boxed 46rem panel sitting inside a 1080
	   column read as an orphan, because the footer then had two widths
	   arguing. Edge to edge it has one, and the gate column lands where a
	   board's does: at the far right of the wall.

	   The chassis is a band, not a box — hairlines top and bottom, no radius,
	   because it has no corners on screen to round. */
	.chassis {
		width: 100%;
		padding-block: 0.2rem 0.35rem;
		border-block: var(--rule) solid color-mix(in srgb, currentColor 14%, transparent);
		background: color-mix(in srgb, currentColor 5%, transparent);
	}

	/* The rows keep a sane measure inside the bleed: past ~1280 the leader
	   stops being a board's leader and becomes a gap. */
	.rows {
		width: 100%;
		max-width: 1280px;
		margin-inline: auto;
		padding-inline: clamp(1.25rem, 5vw, 2.5rem);
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

	/* The colophon: not part of the board, printed under it. */
	.colophon {
		display: grid;
		gap: 0.4rem 2.5rem;
		margin: 0;
		padding-top: 1.25rem;
		border-top: var(--rule) solid color-mix(in srgb, currentColor 30%, transparent);
		font-family: var(--font-mono);
		font-size: 0.86rem;
		line-height: 1.65;
		opacity: 0.72;
	}

	@media (min-width: 720px) {
		.colophon {
			grid-template-columns: 1fr 1fr;
		}
	}

	.colophon div {
		display: flex;
		gap: 0.75rem;
	}

	dt {
		flex: none;
		min-width: 5rem;
		letter-spacing: 0.1em;
		text-transform: uppercase;
		opacity: 0.6;
	}

	dd {
		margin: 0;
	}

	@media (prefers-reduced-motion: reduce) {
		.row {
			transition: none;
		}
	}
</style>
