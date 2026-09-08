<!--
	One split-flap word.

	Each character is a cell that cycles forward through the board's charset
	and lands on its target — forward only, never backwards, because that is
	the one thing a real board cannot do. Cells are staggered left to right so
	the word settles as a sweep rather than all at once.

	The spin is a fixed number of steps per cell (not the true distance
	through the charset) so a word never takes longer to land because its
	letters happen to sit late in the alphabet. Bounded, and it reads the same
	every time.

	Accessibility: the cells are decoration — the text is exposed once, in a
	clipped span, so a screen reader gets "GITHUB" and not "G I T H U B" mid-
	flip. Under reduced motion the cells are simply already landed.
-->
<script lang="ts">
	import { onDestroy } from 'svelte';
	import { browser } from '$app/environment';

	const CHARSET = ' ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789.,:/@&-+_↗';

	let {
		text,
		cells,
		run = true,
		align = 'start',
		stagger = 45,
		step = 40
	}: {
		text: string;
		/** Pad/truncate to a fixed cell count so a column stays put when its
		 *  text changes length mid-flip. Defaults to the text's own length. */
		cells?: number;
		/** Which end the padding goes on. A board's gate column is flush
		 *  right, so its blanks lead. */
		align?: 'start' | 'end';
		/** Hold the row blank until this goes true — used to land the board
		 *  when the footer scrolls into view rather than on mount. */
		run?: boolean;
		stagger?: number;
		step?: number;
	} = $props();

	const width = $derived(cells ?? text.length);
	const target = $derived(
		(align === 'end'
			? text.toUpperCase().padStart(width, ' ').slice(-width)
			: text.toUpperCase().padEnd(width, ' ').slice(0, width)
		)
			.split('')
			.map((c) => (CHARSET.includes(c) ? c : ' '))
	);

	let shown = $state<string[]>([]);
	// A plain mirror of `shown` — the scheduler reads the current characters
	// without making the effect depend on its own writes.
	let current: string[] = [];
	let timers: ReturnType<typeof setTimeout>[] = [];

	function clear() {
		timers.forEach(clearTimeout);
		timers = [];
	}

	function set(i: number, char: string) {
		current[i] = char;
		shown[i] = char;
	}

	$effect(() => {
		const goal = target;
		const on = run;
		clear();

		const reduced = browser && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

		if (!on) {
			current = goal.map(() => ' ');
			shown = current.slice();
			return;
		}

		if (!browser || reduced) {
			current = goal.slice();
			shown = current.slice();
			return;
		}

		current = goal.map((_, i) => current[i] ?? ' ');
		shown = current.slice();

		goal.forEach((char, i) => {
			const to = CHARSET.indexOf(char);
			// 8–13 steps, varied per cell so the column doesn't tick in unison.
			const spin = 8 + ((i * 3) % 6);
			const from = (to - spin + CHARSET.length * 2) % CHARSET.length;

			for (let s = 0; s <= spin; s++) {
				timers.push(
					setTimeout(() => set(i, CHARSET[(from + s) % CHARSET.length]), i * stagger + s * step)
				);
			}
		});
	});

	onDestroy(clear);
</script>

<span class="flap">
	<span class="clipped">{text}</span>
	{#each shown as char, i (i)}
		<span class="cell" class:blank={char === ' '} aria-hidden="true">
			{#key char}
				<span class="face">{char === ' ' ? ' ' : char}</span>
			{/key}
		</span>
	{/each}
</span>

<style>
	.flap {
		display: inline-flex;
		gap: var(--flap-gap, 0.06em);
		white-space: nowrap;
	}

	/* Each cell is its own tiny stage: the split line across the middle is the
	   board's, not a border, so it survives the theme inversion. */
	.cell {
		position: relative;
		display: inline-block;
		width: var(--flap-w, 0.78em);
		padding-block: var(--flap-pad, 0.1em);
		overflow: hidden;
		border-radius: 0.08em;
		background: color-mix(in srgb, currentColor 13%, transparent);
		text-align: center;
		line-height: 1.15;
		font-variant-numeric: tabular-nums;
		perspective: 8em;
	}

	/* A blank is a blank, not an empty tile. Padding cells hold the column's
	   width without pretending to be flaps waiting to turn — that read as a
	   half-loaded board rather than a settled one. */
	.cell.blank {
		background: none;
	}

	.cell.blank::after {
		display: none;
	}

	.cell::after {
		content: '';
		position: absolute;
		inset-inline: 0;
		top: 50%;
		height: 1px;
		background: color-mix(in srgb, currentColor 22%, transparent);
	}

	.face {
		display: block;
		transform-origin: center top;
		animation: drop 90ms ease-out;
	}

	@keyframes drop {
		from {
			transform: rotateX(-82deg);
			opacity: 0.4;
		}
		to {
			transform: rotateX(0);
			opacity: 1;
		}
	}

	@media (prefers-reduced-motion: reduce) {
		.face {
			animation: none;
		}
	}

	.clipped {
		position: absolute;
		width: 1px;
		height: 1px;
		margin: -1px;
		padding: 0;
		overflow: hidden;
		clip-path: inset(50%);
		white-space: nowrap;
	}
</style>
