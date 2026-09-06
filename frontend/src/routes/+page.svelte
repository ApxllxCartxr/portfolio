<!--
	Single scrolling homepage: hero (name/bio/links) → resume
	(experience/projects/skills) → latest blog post. Full-bleed sections
	separated by hairline dividers; prose capped at a readable measure.
	Motion is page-level only — Lenis smooth scroll driven by the GSAP
	ticker, plus a load-in for the hero and scroll reveals below it.
-->
<script lang="ts">
	import { browser } from '$app/environment';
	import CenterCard from '$lib/components/CenterCard.svelte';
	import ResumeSection from '$lib/components/ResumeSection.svelte';
	import PostList from '$lib/components/PostList.svelte';
	import WidgetGrid from '$lib/components/WidgetGrid.svelte';
	import CmrlsimDemo from '$lib/components/CmrlsimDemo.svelte';
	import DemoWindow from '$lib/components/DemoWindow.svelte';
	import type { PageProps } from './$types';

	let { data }: PageProps = $props();

	const year = new Date().getFullYear();

	// One window for the whole page. Both the simulation tile and the Projects
	// entry open the same demo, so the open state can't live in either of them
	// — two local flags meant each could open its own copy on top of the other.
	let cmrlsimOpen = $state(false);

	$effect(() => {
		if (!browser) return;
		// Lenis replaces the page's native scroll with an eased virtual one —
		// that is itself the motion the preference is about, so under reduced
		// motion the page keeps native scroll and skips the reveals with it.
		// (Nothing below starts at opacity 0 in CSS, so skipping the tweens
		// leaves the page fully rendered rather than blank.)
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

			gsap.from('.hero .name, .hero .headline, .hero .bio, .hero .links, .hero .portrait', {
				opacity: 0,
				y: 28,
				duration: 0.75,
				ease: 'power3.out',
				stagger: 0.1
			});
			for (const el of gsap.utils.toArray<HTMLElement>(
				'.widgets .tile, .resume h2, .resume .entry, .blog-section, .footer'
			)) {
				gsap.from(el, {
					opacity: 0,
					y: 28,
					duration: 0.65,
					ease: 'power3.out',
					scrollTrigger: { trigger: el, start: 'top 88%' }
				});
			}
			ScrollTrigger.batch('.resume .pill', {
				start: 'top 94%',
				onEnter: (batch) =>
					gsap.fromTo(
						batch,
						{ opacity: 0, y: 10 },
						{ opacity: 1, y: 0, duration: 0.35, ease: 'power3.out', stagger: 0.03 }
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
</script>

<svelte:head>
	<title>Joseph Fernando</title>
	<meta
		name="description"
		content="Joseph Fernando — software developer. Experience, projects, skills, and blog."
	/>
</svelte:head>

<main class="page">
	<header class="hero section">
		<CenterCard />
	</header>

	<div class="section widgets">
		<WidgetGrid demoOpen={cmrlsimOpen} onOpenDemo={() => (cmrlsimOpen = true)} />
	</div>

	<div class="divider section" aria-hidden="true"></div>

	<div class="section resume-wrap">
		<ResumeSection onOpenDemo={() => (cmrlsimOpen = true)} />
	</div>

	<div class="divider section" aria-hidden="true"></div>

	<section class="blog-section section block" aria-labelledby="writing">
		<h2 id="writing">Writing</h2>
		<div class="block-body">
			<PostList posts={data.recentPosts} unavailable={data.unavailable} />
		</div>
	</section>

	<footer class="footer section">
		<span>© {year} Joseph Fernando</span>
		<button
			type="button"
			class="top"
			onclick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
		>
			Back to top &uarr;
		</button>
	</footer>
</main>

{#if cmrlsimOpen}
	<DemoWindow title="cmrlsim" onClose={() => (cmrlsimOpen = false)}>
		<CmrlsimDemo />
	</DemoWindow>
{/if}

<style>
	.page {
		min-height: 100dvh;
		background: var(--bg);
	}

	.section {
		width: 100%;
		max-width: 1120px;
		margin-inline: auto;
		padding-left: clamp(1.25rem, 5vw, 2rem);
		padding-right: clamp(1.25rem, 5vw, 2rem);
	}

	.hero {
		padding-top: clamp(1.5rem, 5vh, 3.5rem);
		padding-bottom: clamp(2rem, 5vh, 3rem);
	}

	.widgets {
		padding-bottom: clamp(2.5rem, 6vh, 4.5rem);
	}

	.divider {
		border-top: 1px solid var(--line);
	}

	.resume-wrap {
		padding-top: clamp(2.5rem, 6vh, 4.5rem);
		padding-bottom: clamp(2.5rem, 6vh, 4.5rem);
	}

	.blog-section {
		padding-top: clamp(2.5rem, 6vh, 4.5rem);
		padding-bottom: clamp(2.5rem, 6vh, 4.5rem);
	}

	.blog-section h2 {
		font-family: var(--font-mono);
		font-size: 0.7rem;
		font-weight: 400;
		letter-spacing: 0.12em;
		text-transform: uppercase;
		color: var(--muted);
		margin: 0 0 1.1rem;
	}

	/* Section label in a left rail, content in the main column — the same
	   two-column rhythm the resume uses, so the wider page doesn't read as a
	   narrow column with dead space beside it. */
	@media (min-width: 900px) {
		.block {
			display: grid;
			grid-template-columns: 13rem minmax(0, 1fr);
			column-gap: 2.5rem;
			align-items: start;
		}

		.blog-section h2 {
			margin: 0;
		}
	}

	.footer {
		display: flex;
		flex-wrap: wrap;
		align-items: baseline;
		justify-content: space-between;
		gap: 0.75rem;
		padding-top: 1.5rem;
		padding-bottom: 2rem;
		border-top: 1px solid var(--line);
		font-family: var(--font-mono);
		font-size: 0.75rem;
		color: var(--muted);
	}

	.top {
		background: none;
		border: none;
		padding: 0;
		font: inherit;
		color: var(--muted);
		text-decoration: underline;
		text-underline-offset: 3px;
		cursor: pointer;
	}

	.top:hover,
	.top:focus-visible {
		color: var(--fg);
	}
</style>
