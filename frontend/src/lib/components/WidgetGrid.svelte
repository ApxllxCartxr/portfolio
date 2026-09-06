<!--
	Bento row under the hero. Every tile shows something real: the cmrlsim
	simulation actually runs, the clock is Chennai's actual local time, and the
	weather is a live Open-Meteo reading for the same coordinates. Nothing here
	is a mock — if a tile can't get its data it says so rather than inventing a
	number.

	Layout is a pinwheel — feature(2)+place(1) over profiles(1)+status(2) — so
	the simulation gets the emphasis without any row running tall.
-->
<script lang="ts">
	import { onDestroy, onMount } from 'svelte';
	import Widget from './Widget.svelte';
	import CmrlsimDemo from './CmrlsimDemo.svelte';
	import { describeWeatherCode } from '$lib/weather';

	interface Props {
		/** The page's demo window is open — the tile drops its own copy of the
		 *  simulation while it is, so only one is ever animating. */
		demoOpen: boolean;
		onOpenDemo: () => void;
	}

	let { demoOpen, onOpenDemo }: Props = $props();

	// Chennai — where I actually am, so the clock and the weather agree.
	const CHENNAI = { lat: 13.0827, lon: 80.2707, timeZone: 'Asia/Kolkata' };

	// Straight from the simulator's own network model (see resume-data.ts).
	const NETWORK = [
		['Network', 'CMRL Phase I'],
		['Stations', '41'],
		['Track', '54.1 km'],
		['Engine', 'Go · discrete-event']
	];

	const ELSEWHERE = [
		{ label: 'GitHub', handle: '@apxllxcartxr', href: 'https://github.com/apxllxcartxr' },
		{
			label: 'LinkedIn',
			handle: 'joseph-fernando05',
			href: 'https://www.linkedin.com/in/joseph-fernando05/'
		},
		{ label: 'LeetCode', handle: '@apxllxcartxr', href: 'https://leetcode.com/u/apxllxcartxr/' }
	];

	let now = $state(new Date());
	let timer: ReturnType<typeof setInterval> | undefined;

	const timeFormatter = new Intl.DateTimeFormat('en-GB', {
		hour: '2-digit',
		minute: '2-digit',
		timeZone: CHENNAI.timeZone
	});
	const dayFormatter = new Intl.DateTimeFormat('en-GB', {
		weekday: 'long',
		timeZone: CHENNAI.timeZone
	});

	let time = $derived(timeFormatter.format(now));
	let day = $derived(dayFormatter.format(now));

	let weatherStatus = $state<'loading' | 'ready' | 'error'>('loading');
	let temp = $state<number | null>(null);
	let condition = $state('');

	onMount(() => {
		timer = setInterval(() => (now = new Date()), 30_000);

		(async () => {
			try {
				const url =
					`https://api.open-meteo.com/v1/forecast?latitude=${CHENNAI.lat}` +
					`&longitude=${CHENNAI.lon}&current=temperature_2m,weather_code&timezone=auto`;
				const res = await fetch(url);
				if (!res.ok) throw new Error('weather request failed');
				const data = await res.json();
				temp = Math.round(data.current.temperature_2m);
				condition = describeWeatherCode(data.current.weather_code);
				weatherStatus = 'ready';
			} catch {
				weatherStatus = 'error';
			}
		})();
	});

	onDestroy(() => {
		if (timer) clearInterval(timer);
	});
</script>

<div class="grid">
	<div class="cell cell--wide">
		<Widget label="Simulation" glyph="◎">
			<div class="map">
				<div class="map-meta">
					<span class="map-title">cmrlsim</span>
					<dl class="spec">
						{#each NETWORK as [term, value] (term)}
							<div class="spec-row">
								<dt>{term}</dt>
								<dd>{value}</dd>
							</div>
						{/each}
					</dl>
					<button type="button" class="map-cue" onclick={onOpenDemo}>
						Open the simulation &rarr;
					</button>
				</div>
				<div class="map-art">
					{#if !demoOpen}<CmrlsimDemo />{/if}
				</div>
			</div>
		</Widget>
	</div>

	<div class="cell">
		<Widget label="Chennai" glyph="⌖">
			<p class="time">{time}</p>
			<p class="sub">{day}</p>
			<div class="local">
				<span>
					{#if weatherStatus === 'ready'}
						{temp}° · {condition}
					{:else if weatherStatus === 'loading'}
						Loading weather…
					{:else}
						Weather unavailable
					{/if}
				</span>
				<span class="tz">UTC+5:30</span>
			</div>
		</Widget>
	</div>

	<div class="cell">
		<Widget label="Elsewhere" glyph="↗">
			<ul class="links">
				{#each ELSEWHERE as link (link.href)}
					<li>
						<a href={link.href} target="_blank" rel="noreferrer">
							<span class="link-label">{link.label}</span>
							<span class="handle">{link.handle}</span>
							<span class="arrow" aria-hidden="true">&rarr;</span>
						</a>
					</li>
				{/each}
			</ul>
		</Widget>
	</div>

	<div class="cell cell--wide">
		<Widget label="Status" glyph="●">
			<div class="status">
				<div class="status-copy">
					<p class="lead"><span class="dot" aria-hidden="true"></span> Available for work</p>
					<p class="sub">
						Open to software engineering roles and internships, remote or in Chennai.
					</p>
				</div>
				<a class="cta" href="mailto:josephfernando05@proton.me">
					Get in touch <span aria-hidden="true">&rarr;</span>
				</a>
			</div>
		</Widget>
	</div>
</div>

<style>
	.grid {
		display: grid;
		grid-template-columns: 1fr;
		gap: 0.9rem;
	}

	.cell {
		display: flex;
	}

	.cell > :global(.tile) {
		flex: 1;
	}

	/* Feature tile: spec on the left, live map on the right. Splitting it this
	   way is what keeps the row short — the artwork is 5:3, so letting it span
	   the full two columns would drive the row past 400px. */
	.map {
		display: grid;
		gap: 1.25rem;
		align-items: center;
		width: 100%;
		height: 100%;
	}

	.map-title {
		display: block;
		font-family: var(--font-title);
		font-size: 1.15rem;
		font-weight: 600;
	}

	.spec {
		margin: 0.7rem 0 0;
		font-family: var(--font-mono);
		font-size: 0.7rem;
	}

	.spec-row {
		display: flex;
		align-items: baseline;
		gap: 0.6rem;
		padding: 0.28rem 0;
		border-bottom: 1px solid var(--line);
	}

	.spec-row:last-child {
		border-bottom: none;
	}

	.spec dt {
		color: var(--muted);
		letter-spacing: 0.06em;
		text-transform: uppercase;
	}

	.spec dd {
		margin: 0 0 0 auto;
		font-variant-numeric: tabular-nums;
	}

	.map-art {
		min-width: 0;
	}

	/* The button is just the cue, so its accessible name is the action alone —
	   wrapping the whole tile in it (with an aria-label) hid the spec rows from
	   screen readers entirely. ::after stretches the hit area back over the
	   tile so the card still clicks anywhere. */
	.map-cue {
		display: block;
		margin-top: 0.85rem;
		padding: 0;
		border: none;
		background: none;
		font-family: var(--font-mono);
		font-size: 0.7rem;
		color: var(--muted);
		text-align: left;
		cursor: pointer;
	}

	.map-cue::after {
		content: '';
		position: absolute;
		inset: 0;
	}

	.map-cue:hover,
	.map-cue:focus-visible {
		color: var(--fg);
	}

	.time {
		font-family: var(--font-mono);
		font-size: 2.1rem;
		line-height: 1;
		margin: 0;
		font-variant-numeric: tabular-nums;
	}

	.lead {
		display: flex;
		align-items: center;
		gap: 0.55rem;
		font-family: var(--font-title);
		font-size: 1.15rem;
		font-weight: 600;
		line-height: 1.25;
		margin: 0;
	}

	.dot {
		width: 0.5rem;
		height: 0.5rem;
		border-radius: 50%;
		background: var(--ok);
		flex: none;
	}

	.sub {
		font-family: var(--font-body);
		font-size: 0.85rem;
		color: var(--muted);
		margin: 0.3rem 0 0;
		max-width: 34ch;
	}

	/* Pinned to the bottom of the tile with a hairline above it, echoing the
	   spec rows in the simulation tile — otherwise the tile matches the taller
	   feature tile and leaves a dead band under the day. */
	.local {
		display: flex;
		align-items: baseline;
		justify-content: space-between;
		gap: 0.75rem;
		margin: auto 0 0;
		padding-top: 0.6rem;
		border-top: 1px solid var(--line);
		font-family: var(--font-mono);
		font-size: 0.7rem;
		color: var(--muted);
	}

	.tz {
		font-variant-numeric: tabular-nums;
	}

	.status {
		display: flex;
		flex-wrap: wrap;
		align-items: center;
		justify-content: space-between;
		gap: 1rem;
		height: 100%;
	}

	.cta {
		display: inline-flex;
		align-items: center;
		gap: 0.4rem;
		padding: 0.5rem 1rem;
		border: 1px solid var(--fg);
		border-radius: 999px;
		background: var(--fg);
		color: var(--bg);
		font-family: var(--font-mono);
		font-size: 0.72rem;
		letter-spacing: 0.04em;
		text-decoration: none;
		white-space: nowrap;
	}

	.cta:hover,
	.cta:focus-visible {
		background: transparent;
		color: var(--fg);
	}

	.links {
		display: flex;
		flex: 1;
		flex-direction: column;
		justify-content: space-between;
		list-style: none;
		margin: 0;
		padding: 0;
	}

	.links a {
		display: flex;
		align-items: baseline;
		gap: 0.75rem;
		padding: 0.55rem 0;
		border-bottom: 1px solid var(--line);
		text-decoration: none;
	}

	.links li:last-child a {
		border-bottom: none;
	}

	.link-label {
		font-family: var(--font-body);
		font-size: 0.95rem;
	}

	.handle {
		font-family: var(--font-mono);
		font-size: 0.72rem;
		color: var(--muted);
	}

	.arrow {
		margin-left: auto;
		color: var(--muted);
	}

	.links a:hover .arrow,
	.links a:focus-visible .arrow {
		color: var(--fg);
	}

	@media (min-width: 700px) {
		.grid {
			grid-template-columns: repeat(3, minmax(0, 1fr));
		}

		.cell--wide {
			grid-column: span 2;
		}

		.map {
			grid-template-columns: minmax(0, 0.85fr) minmax(0, 1.15fr);
		}
	}
</style>
