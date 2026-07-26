<!--
	Looping GSAP animation simulating cmrlsim (a CMRL discrete-event train
	simulator) — styled like a Vignelli-era subway diagram (bold single-colour
	line, ring station bullets, uppercase running labels) drawn on an
	isometric-axis grid (30°/-30° instead of the usual 45°) for a bit of
	depth. Purely decorative; all colour comes from the active theme's CSS
	vars so it stays correct across theme swaps.
-->
<script lang="ts">
	import { onDestroy, onMount } from 'svelte';

	const STATIONS = [
		{ name: 'Wimco Nagar', x: 26, y: 40 },
		{ name: 'Washermanpet', x: 66, y: 63 },
		{ name: 'Central', x: 106, y: 63, interchange: true },
		{ name: 'Egmore', x: 146, y: 86 },
		{ name: 'Alandur', x: 186, y: 86 },
		{ name: 'Airport', x: 218, y: 67 }
	];

	const PATH_D = `M ${STATIONS.map((s) => `${s.x} ${s.y}`).join(' L ')}`;

	// Faint background isometric grid — two families of parallel lines at
	// ±30° from horizontal (true isometric axis angles), generated once.
	const GRID_SPAN_Y = 220;
	const GRID_DX = GRID_SPAN_Y * Math.tan(Math.PI / 6);
	const gridLines: { x1: number; y1: number; x2: number; y2: number }[] = [];
	for (let cx = -160; cx <= 420; cx += 26) {
		gridLines.push({ x1: cx, y1: -50, x2: cx + GRID_DX, y2: -50 + GRID_SPAN_Y });
		gridLines.push({ x1: cx, y1: -50, x2: cx - GRID_DX, y2: -50 + GRID_SPAN_Y });
	}

	const FARE_STEP = 18;

	let current = $state(STATIONS[0].name);
	let flashed = $state(-1);
	let fare = $state(0);
	let trainEl = $state<SVGGElement>();
	let pathEl = $state<SVGPathElement>();
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	let timeline: any;

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
	<svg viewBox="0 0 250 130" role="img" aria-label="cmrlsim isometric train simulation">
		<g class="iso-grid">
			{#each gridLines as line, i (i)}
				<line x1={line.x1} y1={line.y1} x2={line.x2} y2={line.y2} />
			{/each}
		</g>

		<!-- Decorative second line, evoking a wider transfer network — static. -->
		<path class="transfer-line" d="M 58 14 L 106 63 L 130 118" fill="none" />

		<path class="main-line" bind:this={pathEl} d={PATH_D} fill="none" />

		{#each STATIONS as station, i (station.name)}
			<g class="station">
				{#if station.interchange}
					<circle cx={station.x} cy={station.y} r="6.5" class="ring-outer" />
				{/if}
				<circle
					cx={station.x}
					cy={station.y}
					r={station.interchange ? 3.6 : 3.4}
					class="bullet"
					class:lit={flashed === i}
				/>
				<text
					x={station.x + 7}
					y={station.y - 4}
					class="label"
					transform={`rotate(-30 ${station.x + 7} ${station.y - 4})`}
				>
					{station.name}
				</text>
			</g>
		{/each}

		<g class="train" bind:this={trainEl}>
			<ellipse cx="0" cy="3.4" rx="5.5" ry="1.6" class="train-shadow" />
			<rect x="-5" y="-2.6" width="10" height="5.2" rx="1.4" class="train-body" />
			<rect x="-5" y="-2.6" width="10" height="2" rx="1" class="train-highlight" />
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

	.iso-grid line {
		stroke: color-mix(in srgb, var(--fg) 12%, transparent);
		stroke-width: 0.6;
	}

	.transfer-line {
		stroke: color-mix(in srgb, var(--fg) 35%, transparent);
		stroke-width: 2;
		stroke-linecap: round;
		stroke-linejoin: round;
	}

	.main-line {
		stroke: var(--accent);
		stroke-width: 3.2;
		stroke-linecap: round;
		stroke-linejoin: round;
	}

	.ring-outer {
		fill: none;
		stroke: var(--fg);
		stroke-width: 1.6;
	}

	.bullet {
		fill: var(--bg);
		stroke: var(--accent);
		stroke-width: 2;
		transition: fill 0.2s ease;
	}

	.bullet.lit {
		fill: var(--accent);
	}

	.label {
		font-family: var(--font-mono);
		font-size: 6.2px;
		letter-spacing: 0.02em;
		text-transform: uppercase;
		fill: var(--fg);
		opacity: 0.75;
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
