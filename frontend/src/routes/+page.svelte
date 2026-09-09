<!--
	Single scrolling homepage, built on one spine — "plate & mark".

	Every section below the hero is anchored by a line glyph drawn in the same
	hand as the hero's stack icon, and each glyph appears twice: once blown up
	to plate scale behind the type (the way the Chennai map plate sits behind
	the name), once at cap height beside the section label, stroking itself on
	as it arrives.

	Hero → availability band → work → experience → stack → writing →
	ink slab. Two inversions carry the structure: the horizontal
	band near the top and the slab at the end, with the shell's ink frame
	holding both. No cards, no shadows, no pills — type, hairlines and
	inversion do all the structural work.
-->
<script lang="ts">
	import { browser } from '$app/environment';
	import MapPlate from '$lib/components/MapPlate.svelte';
	import AvailabilityBand from '$lib/components/AvailabilityBand.svelte';
	import CenterCard from '$lib/components/CenterCard.svelte';
	import ProjectCards from '$lib/components/ProjectCards.svelte';
	import ExperienceRecord from '$lib/components/ExperienceRecord.svelte';
	import StackSpecimen from '$lib/components/StackSpecimen.svelte';
	import WritingLead from '$lib/components/WritingLead.svelte';
	import Dock from '$lib/components/Dock.svelte';
	import Seo from '$lib/components/Seo.svelte';
	import { workLabels } from '$lib/resume-data';
	import type { PageProps } from './$types';

	let { data }: PageProps = $props();

	$effect(() => {
		if (!browser) return;
		// Lenis replaces the page's native scroll with an eased virtual one —
		// that is itself the motion the preference is about, so under reduced
		// motion the page keeps native scroll and skips the reveals with it.
		if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

		let cancelled = false;
		let cleanup: (() => void) | undefined;

		(async () => {
			const [{ default: Lenis }, { gsap }, { ScrollTrigger }] = await Promise.all([
				import('lenis'),
				import('gsap'),
				import('gsap/ScrollTrigger')
			]);
			if (cancelled) return;
			gsap.registerPlugin(ScrollTrigger);

			// eslint-disable-next-line @typescript-eslint/no-explicit-any
			const lenis: any = new Lenis({ duration: 1.1, smoothWheel: true });
			lenis.on('scroll', ScrollTrigger.update);
			const tick = (time: number) => lenis.raf(time * 1000);
			gsap.ticker.add(tick);
			gsap.ticker.lagSmoothing(0);

			gsap.from('.hero-copy', {
				opacity: 0,
				y: 24,
				duration: 0.75,
				ease: 'power3.out',
				stagger: 0.08
			});

			for (const el of gsap.utils.toArray<HTMLElement>('.labels, .specimen, .writing, .slab')) {
				gsap.from(el, {
					opacity: 0,
					y: 24,
					duration: 0.65,
					ease: 'power3.out',
					scrollTrigger: { trigger: el, start: 'top 88%' }
				});
			}

			// Wall labels and specimen groups come in as runs rather than one at
			// a time — they read as a list, so they should arrive as one.
			ScrollTrigger.batch('.work li, .labels li, .specimen .group', {
				start: 'top 92%',
				onEnter: (batch) =>
					gsap.fromTo(
						batch,
						{ opacity: 0, y: 16 },
						{ opacity: 1, y: 0, duration: 0.5, ease: 'power3.out', stagger: 0.06 }
					)
			});

			cleanup = () => {
				ScrollTrigger.getAll().forEach((st) => st.kill());
				gsap.ticker.remove(tick);
				lenis.destroy();
			};
		})();

		return () => {
			cancelled = true;
			cleanup?.();
		};
	});

	// The footer carries the same contact links at full size, so the floating
	// dock stands down once it is on screen rather than sitting on top of it.
	// The footer lives in the layout — it is on every page — so it is found by
	// id rather than bound: the layout's DOM exists by the time this runs.
	let dockHidden = $state(false);

	$effect(() => {
		if (!browser) return;

		const footer = document.getElementById('site-footer');
		if (!footer) return;

		const observer = new IntersectionObserver(([entry]) => (dockHidden = entry.isIntersecting), {
			rootMargin: '0px 0px -35% 0px'
		});
		observer.observe(footer);

		return () => observer.disconnect();
	});
</script>

<Seo
	title="Joseph Fernando — full-stack systems &amp; real-time software"
	description="Software developer working on backends, simulation and real-time systems. Selected work, experience, stack and writing."
/>

<main class="page">
	<section class="hero section">
		<MapPlate />
		<div class="hero-copy">
			<CenterCard />
		</div>
	</section>

	<AvailabilityBand />

	<div class="bleed work-bleed">
		<div class="full">
			<ProjectCards items={workLabels} />
		</div>
	</div>

	<div class="bleed sections-bleed">
		<div class="bleed-inner">
			<ExperienceRecord />
		</div>
		<div class="bleed-inner">
			<StackSpecimen />
		</div>
		<div class="bleed-inner">
			<WritingLead posts={data.recentPosts} unavailable={data.unavailable} />
		</div>
	</div>
</main>

<Dock hidden={dockHidden} />

<style>
	.page {
		min-height: 100dvh;
		background: var(--bg);
		/* The map plate is deliberately 100vw so it bleeds past the column —
		   but 100vw counts the scrollbar, which pushed the page ~15px wider
		   than the viewport and gave the whole site a horizontal scroll.
		   `clip` contains the bleed without creating a scroll container, so
		   Lenis and the fixed shell are untouched. */
		overflow-x: clip;
	}

	.section {
		width: 100%;
		max-width: 1080px;
		margin-inline: auto;
		padding-left: clamp(1.25rem, 5vw, 2.5rem);
		padding-right: clamp(1.25rem, 5vw, 2.5rem);
	}

	/* The stack ignores the 1080 column: a tinted band edge to edge, with a
	   wider measure inside it than anything else on the page. It is the one
	   section whose content is a sheet rather than a list, and it should
	   read as a different kind of page. */
	.bleed {
		margin-block: clamp(1.5rem, 4vh, 2.5rem);
		border-top: var(--rule) solid var(--line);
		border-bottom: var(--rule) solid var(--line);
		background: var(--bg-sunken);
	}

	/* When multiple sections share one bleed, collapse the spacing between
	   them — only the container gets the margin and borders. */
	.sections-bleed {
		margin-block: clamp(1.5rem, 4vh, 2.5rem) 0;
		/* No closing rule and no closing gap: the footer's own concave edge is
		   the break here. The margin left a band of plain --bg between the
		   tinted section and the slab — subtle, but a visible third colour in
		   a two-colour transition. The bleed now runs straight into the
		   footer, which is told to draw its arc in --bg-sunken to match. */
		border-bottom: none;
	}

	.sections-bleed .bleed-inner + .bleed-inner {
		margin-top: 0;
		border-top: none;
	}

	.bleed-inner {
		width: 100%;
		max-width: 1320px;
		margin-inline: auto;
		padding-inline: clamp(1.25rem, 5vw, 3.5rem);
	}

	/* Selected work takes the whole width — no column, no max and no padding
	   of its own. The ruled surface inside it pads by exactly one cell, which
	   is what keeps its lattice in register with its layout. */
	.full {
		width: 100%;
	}

	/* The work band carries its own grid as texture — that lattice is the
	   section's edge, so it needs neither the tint nor the rules the stack
	   band uses. The hairlines above and below it were drawing a box around
	   something already drawing its own. */
	.work-bleed {
		background: none;
		border-block: none;
	}

	.hero {
		position: relative;
		box-sizing: border-box;
		min-height: 100dvh;
		display: flex;
		flex-direction: column;
		justify-content: center;
		padding-top: clamp(0.75rem, 2vh, 1.5rem);
		/* Dock is fixed at bottom (clamp(1.25rem, 4vh, 2.5rem) offset + tile
		   height) — reserve enough room so the hero's content never sits
		   under it. */
		padding-bottom: clamp(6rem, 12vh, 8rem);
	}

	/* Sits above the ascii field. */
	.hero-copy {
		position: relative;
		z-index: 1;
	}
</style>
