<!--
	The one place on the page where the value flips: a full-bleed bar in
	--fg with --bg ink, sitting between the hero and cmrlsim. After a
	viewport of cream that inversion is what makes it register, and setting
	it in the same Garamond as the name means it reads as the same voice
	speaking louder rather than a new element arriving.

	The detail that keeps it off the shelf: repetitions alternate roman and
	italic. It is a printer's habit, not a web one — the line breathes
	between two cuts of one face as it drifts instead of being a flat
	repeated string.

	The drift itself is a CSS animation, so it runs without JS. JS only
	reaches in to modulate its playbackRate from scroll velocity — see
	$lib/scroll-velocity, shared with the vertical ScrollRail.
-->
<script lang="ts">
	import { browser } from '$app/environment';
	import { driveWithScrollVelocity } from '$lib/scroll-velocity';

	// One repetition = phrase, mark, phrase, mark. Four of them fill a wide
	// viewport with room to spare; the track is rendered twice and shifted
	// -50% so the loop has no seam.
	const PHRASES = ['available for work', 'backends, simulation, real-time systems'];
	const REPEATS = 4;
	const track = Array.from({ length: REPEATS }, () => PHRASES).flat();

	let row: HTMLDivElement;

	$effect(() => {
		if (!browser) return;

		// Under prefers-reduced-motion the CSS sets animation: none, so there
		// is nothing to drive and nothing to listen for.
		const anim = row.getAnimations()[0];
		if (!anim) return;

		return driveWithScrollVelocity(anim);
	});
</script>

<aside class="band">
	<div class="row" bind:this={row} aria-hidden="true">
		{#each [0, 1] as copy (copy)}
			<span class="track">
				{#each track as phrase, i (i)}
					<span class="phrase">{phrase}</span>
					<span class="mark" style="--delay: {i * 0.4}s">*</span>
				{/each}
			</span>
		{/each}
	</div>

	<p class="clipped">available for work — backends, simulation, real-time systems.</p>
</aside>

<style>
	.band {
		background: var(--fg);
		color: var(--bg);
		overflow: hidden;
		/* Extra headroom over the type: the clip eats into the band at the far
		   left and right, and without it the deeper curve would crop the
		   marquee's cap heights at the corners. */
		padding-block: clamp(1.1rem, 2.8vh, 1.75rem);
		position: relative;
		/* Same constant-depth arc as the footer slab, shallower: the band is
		   at full height at its ends and pinched through the middle, so the
		   corners reach out to the shell's frame while the waist pulls away
		   from it. See ClosingSlab for why this is an overlaid arc and not a
		   clip-path. */
		--pinch: 9px;
	}

	/* See ClosingSlab: arcs of page colour, not a mask — a mask ellipse this
	   shallow and this wide tears along its edge. The band sits on plain --bg
	   both above and below (the sunken bleed under it carries its own top
	   margin), so one colour is correct for both. */
	.band::before,
	.band::after {
		content: '';
		position: absolute;
		inset-inline: 0;
		z-index: 1;
		height: var(--pinch);
		background: var(--bg);
		pointer-events: none;
	}

	.band::before {
		top: -1px;
		border-radius: 0 0 50% 50% / 0 0 100% 100%;
	}

	.band::after {
		bottom: -1px;
		border-radius: 50% 50% 0 0 / 100% 100% 0 0;
	}

	.row {
		display: flex;
		width: max-content;
		animation: drift 50s linear infinite;
		will-change: transform;
	}

	.track {
		display: flex;
		align-items: baseline;
		flex: none;
	}

	.phrase {
		font-family: var(--font-display);
		font-size: clamp(2rem, 4.5vw, 3.5rem);
		font-weight: 400;
		line-height: 1.1;
		letter-spacing: -0.01em;
		white-space: nowrap;
	}

	/* Every other repetition takes the italic cut. */
	.phrase:nth-child(4n + 3) {
		font-style: italic;
	}

	.mark {
		font-family: var(--font-display);
		font-size: clamp(1.4rem, 3vw, 2.4rem);
		line-height: 1;
		color: var(--accent);
		padding-inline: clamp(0.6rem, 1.6vw, 1.4rem);
		transform: translateY(-0.12em);
		/* A slow breath, staggered down the line — "available" reads as a live
		   pulse rather than decoration. Opacity only, so it never fights the
		   drift transform. */
		animation: heartbeat 3.6s ease-in-out var(--delay, 0s) infinite;
	}

	@keyframes heartbeat {
		0%,
		100% {
			opacity: 1;
		}
		50% {
			opacity: 0.42;
		}
	}

	@keyframes drift {
		to {
			transform: translateX(-50%);
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
		user-select: none;
	}

	@media (prefers-reduced-motion: reduce) {
		.row {
			animation: none;
			width: 100%;
			justify-content: center;
		}

		.mark {
			animation: none;
			opacity: 1;
		}

		/* One static repetition is enough when nothing moves. */
		.track:last-child {
			display: none;
		}

		.track:first-child .phrase:nth-child(n + 5),
		.track:first-child .mark:nth-child(n + 5) {
			display: none;
		}
	}
</style>
