<!--
	Looping GSAP animation simulating cmrlsim (a CMRL discrete-event train
	simulator) — styled after Mini Metro: flat bold single-colour line on
	strict 45°/90° segments, white-filled station icons (shape signals role —
	circle/square/triangle), no grid or text on the canvas itself. The one
	background feature is a wide pastel band standing in for Chennai's
	coastline/rivers, tinted from the active theme's accent so it stays
	correct across theme swaps — a "map", not a blank card.
-->
<script lang="ts">
	import { onDestroy, onMount } from 'svelte';

	const STATIONS = [
		{ name: 'Wimco Nagar', x: 24, y: 34, shape: 'circle' as const, terminus: true },
		{ name: 'Washermanpet', x: 64, y: 74, shape: 'circle' as const },
		{ name: 'Central', x: 104, y: 74, shape: 'square' as const },
		{ name: 'Egmore', x: 144, y: 114, shape: 'circle' as const },
		{ name: 'Alandur', x: 184, y: 114, shape: 'circle' as const },
		{ name: 'Airport', x: 216, y: 82, shape: 'triangle' as const, terminus: true }
	];

	const PATH_D = `M ${STATIONS.map((s) => `${s.x} ${s.y}`).join(' L ')}`;

	// Stand-in for Chennai's coastline + a river feeding into it — plain
	// 45°/90° elbows, same rule the rail line itself follows.
	const COAST_D = 'M -20 150 L 40 150 L 90 100 L 90 60 L 150 60 L 150 20 L 270 20';
	const RIVER_D = 'M 6 96 L 56 96 L 84 68';

	const FARE_STEP = 18;

	let current = $state(STATIONS[0].name);
	let flashed = $state(-1);
	let fare = $state(0);
	let trainEl = $state<SVGGElement>();
	let pathEl = $state<SVGPathElement>();
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	let timeline: any;

	function stationRadius(shape: 'circle' | 'square' | 'triangle') {
		return shape === 'circle' ? 3.6 : 4.2;
	}

	onMount(() => {
		let cancelled = false;

		(async () => {
			const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
			if (reduceMotion) {
				current = STATIONS[2].name;
				flashed = 2;
				fare = FARE_STEP * 2;
				if (trainEl)
					trainEl.setAttribute('transform', `translate(${STATIONS[2].x} ${STATIONS[2].y})`);
				return;
			}

			const [{ gsap }, { MotionPathPlugin }] = await Promise.all([
				import('gsap'),
				import('gsap/MotionPathPlugin')
			]);
			if (cancelled || !trainEl || !pathEl) return;

			gsap.registerPlugin(MotionPathPlugin);

			const legDuration = 1.15;
			const totalDuration = legDuration * (STATIONS.length - 1);

			const tl = gsap.timeline({ repeat: -1, yoyo: true, defaults: { ease: 'power1.inOut' } });
			tl.to(trainEl, {
				duration: totalDuration,
				motionPath: {
					path: pathEl,
					align: pathEl,
					alignOrigin: [0.5, 0.5],
					autoRotate: true
				}
			});

			STATIONS.forEach((station, i) => {
				tl.call(
					() => {
						current = station.name;
						flashed = i;
						fare = i === 0 ? 0 : FARE_STEP * i;
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
	<svg viewBox="0 0 250 150" role="img" aria-label="cmrlsim train simulation map">
		<path class="coast" d={COAST_D} fill="none" />
		<path class="river" d={RIVER_D} fill="none" />

		<path class="transfer-line" d="M 58 14 L 106 74 L 130 130" fill="none" />
		<path class="main-line" bind:this={pathEl} d={PATH_D} fill="none" />

		{#each STATIONS as station, i (station.name)}
			{#if station.terminus}
				<g class="flag">
					<line x1={station.x} y1={station.y} x2={station.x} y2={station.y - 10} />
					<path d={`M ${station.x} ${station.y - 10} l 6 2 l -6 2 z`} class="flag-pennant" />
				</g>
			{/if}

			{#if station.shape === 'square'}
				<rect
					x={station.x - stationRadius(station.shape)}
					y={station.y - stationRadius(station.shape)}
					width={stationRadius(station.shape) * 2}
					height={stationRadius(station.shape) * 2}
					rx="1.3"
					class="bullet"
					class:lit={flashed === i}
				/>
			{:else if station.shape === 'triangle'}
				{@const r = stationRadius(station.shape)}
				<polygon
					points={`${station.x} ${station.y - r}, ${station.x + r} ${station.y + r * 0.8}, ${station.x - r} ${station.y + r * 0.8}`}
					class="bullet"
					class:lit={flashed === i}
				/>
			{:else}
				<circle
					cx={station.x}
					cy={station.y}
					r={stationRadius(station.shape)}
					class="bullet"
					class:lit={flashed === i}
				/>
			{/if}
		{/each}

		<g class="train" bind:this={trainEl}>
			<ellipse cx="0" cy="3.6" rx="6" ry="1.7" class="train-shadow" />
			<rect x="-5.5" y="-2.8" width="11" height="5.6" rx="1.6" class="train-body" />
			<rect x="-5.5" y="-2.8" width="11" height="2.1" rx="1" class="train-highlight" />
		</g>
	</svg>
	<p class="status">
		<span class="bullet-dot"></span>
		<span class="station-name">{current}</span>
		<span class="fare">· ₹{fare} fare</span>
	</p>
</div>

<style>
	.cmrlsim-demo {
		display: flex;
		flex-direction: column;
		gap: 0.45rem;
		font-family: var(--font-mono);
	}

	svg {
		width: 100%;
		height: auto;
		overflow: hidden;
	}

	.coast {
		stroke: color-mix(in srgb, var(--accent) 16%, var(--bg));
		stroke-width: 26;
		stroke-linejoin: round;
		stroke-linecap: round;
	}

	.river {
		stroke: color-mix(in srgb, var(--accent) 16%, var(--bg));
		stroke-width: 13;
		stroke-linejoin: round;
		stroke-linecap: round;
	}

	.transfer-line {
		stroke: color-mix(in srgb, var(--fg) 30%, transparent);
		stroke-width: 2.6;
		stroke-linecap: round;
		stroke-linejoin: round;
	}

	.main-line {
		stroke: var(--accent);
		stroke-width: 4;
		stroke-linecap: round;
		stroke-linejoin: round;
	}

	.bullet {
		fill: var(--bg);
		stroke: var(--accent);
		stroke-width: 2.2;
		transition: fill 0.2s ease;
	}

	.bullet.lit {
		fill: var(--accent);
	}

	.flag line {
		stroke: var(--fg);
		stroke-width: 1.4;
	}

	.flag-pennant {
		fill: var(--accent);
	}

	.train-shadow {
		fill: var(--fg);
		opacity: 0.15;
	}

	.train-body {
		fill: var(--accent);
	}

	.train-highlight {
		fill: color-mix(in srgb, var(--accent) 55%, var(--bg));
	}

	.status {
		display: flex;
		align-items: baseline;
		gap: 0.35rem;
		font-size: 0.8rem;
		font-weight: 500;
		margin: 0;
	}

	.bullet-dot {
		width: 0.55em;
		height: 0.55em;
		border-radius: 50%;
		background: var(--accent);
		flex-shrink: 0;
		align-self: center;
	}

	.station-name {
		text-transform: uppercase;
		letter-spacing: 0.02em;
		opacity: 0.9;
	}

	.fare {
		opacity: 0.6;
	}
</style>
