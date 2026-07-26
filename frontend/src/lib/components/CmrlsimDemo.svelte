<!--
	Small looping GSAP animation simulating cmrlsim (a CMRL discrete-event
	train simulator) — a train marker travels a stylised metro line, station
	by station, using MotionPathPlugin. Purely decorative; all colour comes
	from the active theme's CSS vars so it stays correct across theme swaps.
-->
<script lang="ts">
	import { onDestroy, onMount } from 'svelte';

	const STATIONS = [
		{ name: 'Wimco Nagar', x: 14, y: 20 },
		{ name: 'Washermanpet', x: 58, y: 62 },
		{ name: 'Central', x: 104, y: 24 },
		{ name: 'Egmore', x: 150, y: 60 },
		{ name: 'Alandur', x: 196, y: 22 },
		{ name: 'Airport', x: 240, y: 58 }
	];

	const PATH_D = `M ${STATIONS.map((s) => `${s.x} ${s.y}`).join(' L ')}`;

	let current = $state(STATIONS[0].name);
	let flashed = $state(-1);
	let trainEl = $state<SVGRectElement>();
	let pathEl = $state<SVGPathElement>();
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	let timeline: any;

	onMount(() => {
		let cancelled = false;

		(async () => {
			const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
			if (reduceMotion) {
				current = STATIONS[2].name;
				return;
			}

			const [{ gsap }, { MotionPathPlugin }] = await Promise.all([
				import('gsap'),
				import('gsap/MotionPathPlugin')
			]);
			if (cancelled || !trainEl || !pathEl) return;

			gsap.registerPlugin(MotionPathPlugin);

			const legDuration = 1.1;
			const totalDuration = legDuration * (STATIONS.length - 1);

			const tl = gsap.timeline({ repeat: -1, yoyo: true, defaults: { ease: 'power1.inOut' } });
			tl.to(trainEl, {
				duration: totalDuration,
				motionPath: {
					path: pathEl,
					align: pathEl,
					alignOrigin: [0.5, 0.5]
				}
			});

			STATIONS.forEach((station, i) => {
				tl.call(
					() => {
						current = station.name;
						flashed = i;
					},
					[],
					i * legDuration
				);
			});

			timeline = tl;
		})();

		return () => {
			cancelled = true;
		};
	});

	onDestroy(() => {
		timeline?.kill();
	});
</script>

<div class="cmrlsim-demo">
	<svg viewBox="0 0 254 82" role="img" aria-label="cmrlsim train simulation">
		<path d={PATH_D} fill="none" stroke="var(--fg)" stroke-width="1.5" opacity="0.5" />
		{#each STATIONS as station, i (station.name)}
			<circle
				cx={station.x}
				cy={station.y}
				r="4"
				fill={flashed === i ? 'var(--accent)' : 'var(--bg)'}
				stroke="var(--fg)"
				stroke-width="1.5"
			/>
		{/each}
		<rect
			bind:this={trainEl}
			x={STATIONS[0].x - 4}
			y={STATIONS[0].y - 3}
			width="8"
			height="6"
			rx="1.5"
			fill="var(--accent)"
		/>
		<path bind:this={pathEl} d={PATH_D} fill="none" stroke="none" />
	</svg>
	<p class="status">▸ {current}</p>
</div>

<style>
	.cmrlsim-demo {
		display: flex;
		flex-direction: column;
		gap: 0.5rem;
		font-family: var(--font-mono);
	}

	svg {
		width: 100%;
		height: auto;
	}

	.status {
		font-size: 0.85rem;
		font-weight: 500;
		opacity: 0.75;
		margin: 0;
	}
</style>
