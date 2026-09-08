<!--
	Contact rail, fixed to the bottom-centre of the viewport. The
	magnification is macOS-style and so is the pill, but the chrome is not:
	a single hairline over flat paper — no backdrop blur, no gloss, no brand
	colours, monochrome glyphs.

	Architecture notes (why it's built this way):
	- Each `.tile` (the <a>, the actual hit target) stays a fixed size, so the
	  flex row never reflows or jumps as icons magnify — only the nested
	  `.tile-icon` grows, via `transform: scale()` with `transform-origin:
	  bottom center`, exactly like the native dock.
	- Pointer position is tracked as a plain variable and fed into a single
	  requestAnimationFrame loop that lerps each tile's scale toward its
	  target and writes `transform`/`z-index` straight to the DOM. None of
	  that touches Svelte state, so a fast pointer sweep across four icons
	  doesn't trigger four-icons-times-sixty-per-second component re-renders.
	- Tile centers are measured once (mount + resize/ResizeObserver) and
	  cached, never re-measured on pointermove — magnification itself can't
	  move a tile's center since tiles don't resize.
	- Svelte state is reserved for the few things that actually need
	  reactivity: which tile is hovered/focused (tooltip) and which is
	  pressed (click feedback), both low-frequency, discrete events.
-->
<script lang="ts">
	import { onMount } from 'svelte';

	// Hidden once the footer is on screen — the footer carries the same links
	// at full size, so the floating copy of them is just in the way there.
	let { hidden = false }: { hidden?: boolean } = $props();

	interface Item {
		label: string;
		href: string;
		path: string;
	}

	const items: Item[] = [
		{
			label: 'Email',
			href: 'mailto:josephfernando05@proton.me',
			path: 'm15.24 8.998 3.656-3.073v15.81H2.482C1.11 21.735 0 20.609 0 19.223V6.944l7.58 6.38a2.186 2.186 0 0 0 2.871-.042l4.792-4.284h-.003zm-5.456 3.538 1.809-1.616a2.438 2.438 0 0 1-1.178-.533L.905 2.395A.552.552 0 0 0 0 2.826v2.811l8.226 6.923a1.186 1.186 0 0 0 1.558-.024zM23.871 2.463a.551.551 0 0 0-.776-.068l-3.199 2.688v16.653h1.623c1.371 0 2.481-1.127 2.481-2.513V2.824a.551.551 0 0 0-.129-.36z'
		},
		{
			label: 'GitHub',
			href: 'https://github.com/apxllxcartxr',
			path: 'M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12'
		},
		{
			label: 'LinkedIn',
			href: 'https://www.linkedin.com/in/joseph-fernando05/',
			path: 'M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z'
		},
		{
			label: 'LeetCode',
			href: 'https://leetcode.com/u/apxllxcartxr/',
			path: 'M13.483 0a1.374 1.374 0 0 0-.961.438L7.116 6.226l-3.854 4.126a5.266 5.266 0 0 0-1.209 2.104 5.35 5.35 0 0 0-.125.513 5.527 5.527 0 0 0 .062 2.362 5.83 5.83 0 0 0 .349 1.017 5.938 5.938 0 0 0 1.271 1.818l4.277 4.193.039.038c2.248 2.165 5.852 2.133 8.063-.074l2.396-2.392c.54-.54.54-1.414.003-1.955a1.378 1.378 0 0 0-1.951-.003l-2.396 2.392a3.021 3.021 0 0 1-4.205.038l-.02-.019-4.276-4.193c-.652-.64-.972-1.469-.948-2.263a2.68 2.68 0 0 1 .066-.523 2.545 2.545 0 0 1 .619-1.164L9.13 8.114c1.058-1.134 3.204-1.27 4.43-.278l3.501 2.831c.593.48 1.461.387 1.94-.207a1.384 1.384 0 0 0-.207-1.943l-3.5-2.831c-.8-.647-1.766-1.045-2.774-1.202l2.015-2.158A1.384 1.384 0 0 0 13.483 0zm-2.866 12.815a1.38 1.38 0 0 0-1.38 1.382 1.38 1.38 0 0 0 1.38 1.382H20.79a1.38 1.38 0 0 0 1.38-1.382 1.38 1.38 0 0 0-1.38-1.382z'
		}
	];

	// Tune here. influenceRadius is in px; a tile beyond it sits at 1x.
	const MAX_SCALE = 1.75;
	const INFLUENCE_RADIUS = 140;
	// Per-frame lerp factor toward the target scale — higher tracks the
	// cursor more tightly, lower feels softer/laggier.
	const FOLLOW_EASE = 0.25;
	const SETTLE_EPSILON = 0.002;

	let dockEl: HTMLElement | undefined;
	let tileEls: (HTMLAnchorElement | undefined)[] = [];
	let iconEls: (HTMLSpanElement | undefined)[] = [];

	// Reactive only where reactivity is actually needed: which tile shows a
	// tooltip, which tile is mid-press, and the two device/preference checks
	// that gate the whole effect.
	let hoveredIndex = $state<number | null>(null);
	let pressedIndex = $state<number | null>(null);
	let tooltipLift = $state(0);
	let reduceMotion = $state(false);
	let coarsePointer = $state(false);

	// Everything below is plain (non-reactive) working state for the rAF
	// loop — mutating it doesn't touch the component's render output.
	let centers: number[] = [];
	let baseSize = 0;
	let pointerX = 0;
	let pointerActive = false;
	let currentScales: number[] = items.map(() => 1);
	let rafId: number | null = null;

	function measure() {
		baseSize = tileEls[0]?.getBoundingClientRect().height ?? 0;
		centers = tileEls.map((el) => {
			if (!el) return 0;
			const rect = el.getBoundingClientRect();
			return rect.left + rect.width / 2;
		});
	}

	function targetScaleFor(index: number): number {
		if (!pointerActive || reduceMotion || coarsePointer) return 1;
		const center = centers[index];
		const distance = Math.abs(pointerX - center);
		const normalized = Math.min(distance / INFLUENCE_RADIUS, 1);
		const influence = 1 - normalized;
		// Smoothstep: eases in/out around the cursor instead of a hard cone,
		// which is what makes neighbouring icons "wave" rather than just cut
		// off at the influence radius.
		const eased = influence * influence * (3 - 2 * influence);
		return 1 + eased * (MAX_SCALE - 1);
	}

	function step() {
		let animating = false;

		for (let i = 0; i < items.length; i++) {
			const target = targetScaleFor(i);
			const current = currentScales[i];
			const next = current + (target - current) * FOLLOW_EASE;
			const settled = Math.abs(target - next) < SETTLE_EPSILON;
			currentScales[i] = settled ? target : next;
			if (!settled || Math.abs(current - 1) > SETTLE_EPSILON) animating = true;
		}

		// A growing icon adds width symmetrically (transform-origin is
		// horizontally centered), so without compensation it visually spills
		// into its neighbours. Push each tile sideways by half the extra
		// width every *other* tile has grown, signed by which side it's on —
		// the same "dock line stretches" behaviour the real macOS dock has,
		// done with translateX so it's still a pure compositor transform.
		const extra = currentScales.map((s) => (s - 1) * baseSize);
		const total = extra.reduce((sum, e) => sum + e, 0);
		let leftSum = 0;
		for (let i = 0; i < items.length; i++) {
			const rightSum = total - leftSum - extra[i];
			const offset = 0.5 * (leftSum - rightSum);
			leftSum += extra[i];

			const iconEl = iconEls[i];
			if (iconEl) iconEl.style.transform = `translateX(${offset}px) scale(${currentScales[i]})`;

			const tileEl = tileEls[i];
			if (tileEl) tileEl.style.zIndex = String(Math.round(currentScales[i] * 100));
		}

		if (hoveredIndex !== null) {
			tooltipLift = (currentScales[hoveredIndex] - 1) * baseSize;
		}

		// The capsule itself needs to breathe too, or the outer icons spill
		// past its edge once they're pushed outward. The two outermost tiles
		// always end up displaced by exactly half the total growth (the
		// spread math above is symmetric), so that's exactly how much extra
		// padding each side needs — grown on the dock element itself, which
		// is fixed-position and self-centering, so it never reflows the page.
		if (dockEl) dockEl.style.setProperty('--dock-spread', `${(total / 2).toFixed(2)}px`);

		rafId = animating || pointerActive ? requestAnimationFrame(step) : null;
	}

	function ensureLoop() {
		if (rafId === null) rafId = requestAnimationFrame(step);
	}

	function handlePointerMove(event: PointerEvent) {
		if (event.pointerType !== 'mouse') return;
		pointerX = event.clientX;
		pointerActive = true;
		ensureLoop();
	}

	function handlePointerLeave() {
		pointerActive = false;
		ensureLoop();
	}

	function handleTilePointerEnter(index: number, event: PointerEvent) {
		if (event.pointerType !== 'mouse') return;
		hoveredIndex = index;
	}

	function handleTileFocus(index: number) {
		hoveredIndex = index;
	}

	function handleTileLeave(index: number) {
		if (hoveredIndex === index) hoveredIndex = null;
	}

	function handlePointerDown(index: number, event: PointerEvent) {
		if (event.pointerType !== 'mouse' && event.pointerType !== 'touch') return;
		pressedIndex = index;
	}

	function releasePress() {
		pressedIndex = null;
	}

	onMount(() => {
		measure();

		const media = window.matchMedia('(prefers-reduced-motion: reduce)');
		const pointerMedia = window.matchMedia('(pointer: coarse)');
		reduceMotion = media.matches;
		coarsePointer = pointerMedia.matches;
		const onMediaChange = () => (reduceMotion = media.matches);
		const onPointerMediaChange = () => (coarsePointer = pointerMedia.matches);
		media.addEventListener('change', onMediaChange);
		pointerMedia.addEventListener('change', onPointerMediaChange);

		const resizeObserver = new ResizeObserver(() => measure());
		if (dockEl) resizeObserver.observe(dockEl);
		window.addEventListener('resize', measure);

		return () => {
			media.removeEventListener('change', onMediaChange);
			pointerMedia.removeEventListener('change', onPointerMediaChange);
			resizeObserver.disconnect();
			window.removeEventListener('resize', measure);
			if (rafId !== null) cancelAnimationFrame(rafId);
		};
	});
</script>

<nav
	class="dock"
	class:hidden
	bind:this={dockEl}
	aria-label="Contact"
	aria-hidden={hidden}
	inert={hidden}
	onpointermove={handlePointerMove}
	onpointerleave={handlePointerLeave}
>
	{#each items as item, i (item.label)}
		<a
			bind:this={tileEls[i]}
			href={item.href}
			target={item.href.startsWith('mailto:') ? undefined : '_blank'}
			rel={item.href.startsWith('mailto:') ? undefined : 'noreferrer'}
			class="tile"
			aria-label={item.label}
			onpointerenter={(event) => handleTilePointerEnter(i, event)}
			onpointerleave={() => {
				handleTileLeave(i);
				releasePress();
			}}
			onfocus={() => handleTileFocus(i)}
			onblur={() => handleTileLeave(i)}
			onpointerdown={(event) => handlePointerDown(i, event)}
			onpointerup={releasePress}
			onpointercancel={releasePress}
		>
			<span class="tile-press" class:pressed={pressedIndex === i}>
				<span class="tile-icon" bind:this={iconEls[i]}>
					<svg viewBox="0 0 24 24" aria-hidden="true"><path d={item.path} /></svg>
				</span>
			</span>
			{#if hoveredIndex === i}
				<span class="tooltip" style="--lift: {tooltipLift}px" role="tooltip">{item.label}</span>
			{/if}
		</a>
	{/each}
</nav>

<style>
	.dock {
		--tile-size: 2.1rem;

		position: fixed;
		bottom: clamp(1.25rem, 4vh, 2.5rem);
		left: 50%;
		z-index: 40;
		display: flex;
		align-items: flex-end;
		gap: clamp(0.85rem, 2.2vw, 1.5rem);
		margin: 0;
		padding-block: 0.7rem;
		padding-inline: calc(1.1rem + var(--dock-spread, 0px));
		list-style: none;
		/* A pill, but a quiet one: one hairline and flat paper instead of the
		   OS treatment — no blur, no gloss — with a shadow soft enough to
		   read as paper above paper. */
		border: var(--rule) solid var(--line);
		border-radius: 999px;
		background: var(--bg-raised);
		box-shadow: 0 14px 30px -22px color-mix(in srgb, var(--fg) 55%, transparent);
		transform: translateX(-50%);
		transition:
			opacity 260ms ease,
			transform 260ms ease,
			visibility 0s linear 0s;
	}

	.dock.hidden {
		opacity: 0;
		visibility: hidden;
		transform: translateX(-50%) translateY(140%);
		pointer-events: none;
		transition-delay: 0s, 0s, 260ms;
	}

	/* Fixed-size hit target — this is what keeps the flex row from ever
	   reflowing while icons above it visually magnify. */
	.tile {
		position: relative;
		display: inline-flex;
		align-items: center;
		justify-content: center;
		width: var(--tile-size);
		height: var(--tile-size);
		flex-shrink: 0;
		/* Monochrome — the glyphs are set in the page's ink, not in four
		   competing brand colours. */
		color: var(--muted);
		transition: color 160ms ease;
	}

	.tile:hover,
	.tile:focus-visible {
		color: var(--fg);
	}

	/* Discrete click feedback — a CSS transition is fine here since it's a
	   one-shot state toggle, not a per-frame value; the back-out easing
	   gives the "spring recovery" without any JS physics. */
	.tile-press {
		display: flex;
		width: 100%;
		height: 100%;
		transition: transform 260ms cubic-bezier(0.34, 1.56, 0.64, 1);
		transform-origin: bottom center;
	}

	.tile-press.pressed {
		transform: scale(0.9);
		transition-duration: 90ms;
	}

	/* Continuous magnification lives here, driven every frame straight from
	   the rAF loop via el.style.transform — no CSS transition competing
	   with it, which is what keeps a fast pointer sweep jitter-free. */
	.tile-icon {
		display: flex;
		width: 100%;
		height: 100%;
		transform-origin: bottom center;
		will-change: transform;
	}

	.tile-icon svg {
		width: 100%;
		height: 100%;
		fill: currentColor;
	}

	/* The label is set as type, not as a chip: no box, no border, no fill —
	   the page's serif in italic, the way a caption sits under a plate. */
	.tooltip {
		position: absolute;
		bottom: calc(100% + 0.55rem + var(--lift, 0px));
		left: 50%;
		transform: translate(-50%, 4px);
		font-family: var(--font-serif);
		font-style: italic;
		font-size: 0.95rem;
		line-height: 1;
		color: var(--fg);
		white-space: nowrap;
		pointer-events: none;
		opacity: 0;
		animation: tooltip-in 140ms ease-out forwards;
	}

	@keyframes tooltip-in {
		from {
			opacity: 0;
			transform: translate(-50%, 4px);
		}
		to {
			opacity: 1;
			transform: translate(-50%, 0);
		}
	}

	@media (prefers-reduced-motion: reduce) {
		.tile-press,
		.tile-icon {
			transition: none;
		}

		.tooltip {
			animation: none;
			opacity: 1;
			transform: translate(-50%, 0);
		}
	}

	@media (max-width: 560px) {
		.dock {
			--tile-size: 1.6rem;
			gap: clamp(0.7rem, 4vw, 1.1rem);
			padding-block: 0.55rem;
			padding-inline: calc(0.85rem + var(--dock-spread, 0px));
		}
	}
</style>
