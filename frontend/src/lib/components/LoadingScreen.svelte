<!--
	Boot-time overlay: a finite grid draws itself in stroke-by-stroke, like a
	blueprint being drafted, then fades to reveal the real desktop. Sits above
	everything on a solid --bg fill so nothing beneath it is visible mid-draw.
	Calls onDone once it's fully gone so the caller can gate window entrances
	on it (see +page.svelte) and get the bloom-in for free.
-->
<script lang="ts">
	import { onMount } from 'svelte';
	import { browser } from '$app/environment';

	interface Props {
		onDone: () => void;
	}

	let { onDone }: Props = $props();

	const CELL = 72;

	let visible = $state(true);
	let overlayEl = $state<HTMLDivElement>();
	let vLines = $state<number[]>([]);
	let hLines = $state<number[]>([]);
	let width = $state(0);
	let height = $state(0);

	function finish() {
		visible = false;
		onDone();
	}

	onMount(() => {
		if (!browser) return;

		if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
			finish();
			return;
		}

		width = window.innerWidth;
		height = window.innerHeight;
		vLines = Array.from({ length: Math.ceil(width / CELL) + 1 }, (_, i) => i * CELL);
		hLines = Array.from({ length: Math.ceil(height / CELL) + 1 }, (_, i) => i * CELL);

		let cancelled = false;

		(async () => {
			const { gsap } = await import('gsap');
			if (cancelled || !overlayEl) return;
			const overlay = overlayEl;

			const verticals = overlay.querySelectorAll<SVGLineElement>('.v-line');
			const horizontals = overlay.querySelectorAll<SVGLineElement>('.h-line');
			gsap.set(verticals, { attr: { 'stroke-dashoffset': height } });
			gsap.set(horizontals, { attr: { 'stroke-dashoffset': width } });

			const tl = gsap.timeline({
				onComplete: () => {
					gsap.to(overlay, {
						opacity: 0,
						duration: 0.45,
						delay: 0.15,
						ease: 'power1.out',
						onComplete: finish
					});
				}
			});
			tl.to(
				verticals,
				{ attr: { 'stroke-dashoffset': 0 }, duration: 0.5, ease: 'power2.out', stagger: 0.015 },
				0
			);
			tl.to(
				horizontals,
				{ attr: { 'stroke-dashoffset': 0 }, duration: 0.5, ease: 'power2.out', stagger: 0.015 },
				0.1
			);
		})();

		return () => {
			cancelled = true;
		};
	});
</script>

{#if visible}
	<div class="overlay" bind:this={overlayEl} aria-hidden="true">
		{#if width && height}
			<svg {width} {height}>
				{#each vLines as x (x)}
					<line class="v-line" x1={x} y1="0" x2={x} y2={height} stroke-dasharray={height} />
				{/each}
				{#each hLines as y (y)}
					<line class="h-line" x1="0" y1={y} x2={width} y2={y} stroke-dasharray={width} />
				{/each}
			</svg>
		{/if}
	</div>
{/if}

<style>
	.overlay {
		position: fixed;
		inset: 0;
		z-index: 1000;
		background: var(--bg);
	}

	svg {
		display: block;
	}

	.v-line,
	.h-line {
		stroke: var(--grid-line);
		stroke-width: 1;
	}
</style>
