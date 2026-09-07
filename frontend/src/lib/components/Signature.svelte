<!--
	The signature. cmrlsim gets a section of its own — the strongest tile
	from the old bento was the only one carrying meaning, so promoting it
	out of the row lets it speak without three other widgets arguing back.

	Layout: a label rail on the left ("selected work" as a small PP Kyoto title),
	the demo on the right at full available width. The button that opens
	the simulation in a window is the action — not a card.
-->
<script lang="ts">
	import CmrlsimDemo from './CmrlsimDemo.svelte';

	interface Props {
		/** Set when the demo window is open so the inline copy doesn't run twice. */
		open: boolean;
		onOpen: () => void;
	}

	let { open, onOpen }: Props = $props();

	// Same network model the resume describes (resume-data.ts). Showing it as a
	// spec row on the left is the page's proof, not a widget filler.
	const SPEC = [
		['Network', 'CMRL Phase I'],
		['Stations', '41'],
		['Track', '54.1 km'],
		['Engine', 'Go · discrete-event']
	] as const;
</script>

<section class="feature" aria-labelledby="cmrlsim">
	<div class="rail">
		<p class="kicker">Selected work<span class="mark" aria-hidden="true">*</span></p>
		<h2 id="cmrlsim" class="title">
			cmrlsim<span class="punct">,</span> a Chennai metro simulator
		</h2>
		<p class="lede">
			A weighted directed graph of Phase I — 41 stations, 54.1 km — animated as a discrete-event
			simulation in a single Go binary. The map below is the real network; the train is the live
			scheduler.
		</p>
		<dl class="spec">
			{#each SPEC as [term, value] (term)}
				<div class="row">
					<dt>{term}</dt>
					<dd>{value}</dd>
				</div>
			{/each}
		</dl>
		<button type="button" class="open" onclick={onOpen}>Open the simulation &rarr;</button>
	</div>

	<div class="stage" class:off={open}>
		<div class="stage-label">
			<span class="dot" aria-hidden="true"></span>
			<span>live</span>
		</div>
		<CmrlsimDemo />
	</div>
</section>

<style>
	.feature {
		display: grid;
		gap: 2rem;
		align-items: start;
		padding-top: clamp(2.5rem, 6vh, 4rem);
		padding-bottom: clamp(2.5rem, 6vh, 4rem);
		border-top: var(--rule) solid var(--line);
	}

	.rail {
		display: flex;
		flex-direction: column;
		gap: 1rem;
		min-width: 0;
	}

	.kicker {
		margin: 0;
		font-family: var(--font-serif);
		font-size: var(--t-section);
		font-weight: 700;
		letter-spacing: -0.01em;
		color: var(--fg);
	}

	.kicker .mark {
		display: inline-block;
		margin-left: -0.05em;
		font-size: 0.8em;
		vertical-align: 0.32em;
		color: var(--accent);
	}

	.title {
		margin: 0;
		font-size: clamp(1.6rem, 3vw, 2.1rem);
		font-weight: 600;
		line-height: 1.15;
		text-wrap: balance;
		max-width: 22ch;
		/* The hero bio links straight here — keep the target clear of the
		   sticky nav pill. */
		scroll-margin-top: 6rem;
	}

	.punct {
		color: var(--accent);
	}

	.lede {
		margin: 0;
		max-width: 46ch;
		font-size: 1rem;
		line-height: 1.6;
		color: var(--fg);
	}

	.spec {
		margin: 0.4rem 0 0;
		padding-top: 1rem;
		border-top: var(--rule) solid var(--line);
		font-family: var(--font-mono);
		font-size: var(--t-caption);
	}

	.row {
		display: flex;
		justify-content: space-between;
		gap: 1rem;
		padding: 0.45rem 0;
		border-bottom: var(--rule) solid var(--line);
	}

	.row:last-child {
		border-bottom: none;
	}

	.row dt {
		color: var(--muted);
		letter-spacing: var(--t-track);
		text-transform: uppercase;
	}

	.row dd {
		margin: 0;
		text-align: right;
		font-variant-numeric: tabular-nums;
	}

	.open {
		align-self: flex-start;
		margin-top: 0.4rem;
		padding: 0;
		border: none;
		background: none;
		font-family: var(--font-mono);
		font-size: var(--t-caption);
		letter-spacing: var(--t-track);
		text-transform: uppercase;
		color: var(--muted);
		cursor: pointer;
	}

	.open:hover,
	.open:focus-visible {
		color: var(--accent);
	}

	.stage {
		position: relative;
		padding: 1.5rem;
		border: var(--rule) solid var(--line);
		border-radius: var(--radius-lg);
		background: var(--bg-raised);
		min-height: 18rem;
		display: flex;
		flex-direction: column;
		/* The signature is the lifted layer of the page — the soft shadow
		   (ink, not pure black) gives it room to breathe above the deep
		   band below without flattening into the resume section. */
		box-shadow:
			0 1px 0 color-mix(in srgb, var(--fg) 3%, transparent),
			0 14px 30px -18px color-mix(in srgb, var(--fg) 22%, transparent);
	}

	/* When the demo window is open, the inline copy still shows but the map
	   fades so the only thing animating is in the window. */
	.stage.off :global(.cmrlsim-demo) {
		opacity: 0.3;
		transition: opacity 200ms ease;
	}

	.stage-label {
		display: inline-flex;
		align-items: center;
		gap: 0.5rem;
		margin-bottom: 1rem;
		font-family: var(--font-mono);
		font-size: var(--t-h2);
		font-weight: 500;
		letter-spacing: var(--t-track);
		text-transform: uppercase;
		color: var(--muted);
	}

	.dot {
		width: 0.45rem;
		height: 0.45rem;
		border-radius: 50%;
		background: var(--accent);
	}

	@media (min-width: 900px) {
		.feature {
			grid-template-columns: minmax(0, 1fr) minmax(0, 1.15fr);
			gap: 3.5rem;
		}
	}
</style>
