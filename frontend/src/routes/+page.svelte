<script lang="ts">
	import { onMount } from 'svelte';
	import { profile } from '$lib/resume';
	import HeroCard from '$lib/components/HeroCard.svelte';

	let scaler = $state<HTMLDivElement | undefined>();
	let scale = $state(1);

	// Desktop: scale the full-width layout down so it always fits one viewport
	// (never clips, never scrolls). Mobile: no scaling — it stacks and scrolls.
	const DESKTOP = '(min-width: 901px)';
	const MARGIN = 20; // breathing room around the layout, px

	function recompute() {
		if (!scaler) return;
		if (!window.matchMedia(DESKTOP).matches) {
			scale = 1;
			return;
		}
		const natW = scaler.offsetWidth;
		const natH = scaler.offsetHeight;
		if (!natW || !natH) return;
		const availW = window.innerWidth - MARGIN * 2;
		const availH = window.innerHeight - MARGIN * 2;
		// Fit both axes; cap at 1 so we only scale down (keeps text crisp).
		scale = Math.min(availW / natW, availH / natH, 1);
	}

	onMount(() => {
		recompute();
		const ro = new ResizeObserver(recompute);
		ro.observe(scaler!);
		window.addEventListener('resize', recompute);
		// Fonts change the natural height once they load — recompute then.
		document.fonts?.ready.then(recompute);
		return () => {
			ro.disconnect();
			window.removeEventListener('resize', recompute);
		};
	});
</script>

<svelte:head>
	<title>{profile.fullName} — {profile.eyebrow}</title>
	<meta name="description" content={profile.lead + ' ' + profile.intro} />
</svelte:head>

<main class="stage">
	<div class="scaler" bind:this={scaler} style="transform: scale({scale})">
		<HeroCard />
	</div>
</main>

<style>
	.stage {
		height: 100dvh;
		display: flex;
		align-items: center;
		justify-content: center;
		overflow: hidden;
	}

	.scaler {
		width: min(1760px, 96vw);
		transform-origin: center center;
		will-change: transform;
	}

	/* Mobile: no scaling — stack and scroll naturally. */
	@media (max-width: 900px) {
		.stage {
			height: auto;
			min-height: 100dvh;
			overflow: visible;
			align-items: stretch;
			padding: clamp(0.6rem, 3vw, 1.15rem);
		}
		.scaler {
			width: 100%;
			transform: none !important;
		}
	}
</style>
