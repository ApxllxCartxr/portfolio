<!--
	Single scrolling homepage: hero (name, role, links) → signature
	(cmrlsim) → resume (experience, projects, skills) → writing.

	One grid language repeated across the page: left rail with a mono
	caption, right column with content. Hairlines separate rows; no cards,
	no shadows, no per-section visual. Motion is page-level only — Lenis
	smooth scroll, plus a load-in for the hero and scroll reveals below.
-->
<script lang="ts">
	import { browser } from '$app/environment';
	import CenterCard from '$lib/components/CenterCard.svelte';
	import Signature from '$lib/components/Signature.svelte';
	import ResumeSection from '$lib/components/ResumeSection.svelte';
	import PostList from '$lib/components/PostList.svelte';
	import CmrlsimDemo from '$lib/components/CmrlsimDemo.svelte';
	import DemoWindow from '$lib/components/DemoWindow.svelte';
	import Dock from '$lib/components/Dock.svelte';
	import type { PageProps } from './$types';

	let { data }: PageProps = $props();

	const year = new Date().getFullYear();

	// One window for the whole page. The signature section and the Projects
	// entry open the same demo, so the open state lives on the page.
	let cmrlsimOpen = $state(false);

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

			gsap.from('.hero > *', {
				opacity: 0,
				y: 24,
				duration: 0.75,
				ease: 'power3.out',
				stagger: 0.08
			});

			for (const el of gsap.utils.toArray<HTMLElement>(
				'.feature, .resume > .block, .writing-block, .footer'
			)) {
				gsap.from(el, {
					opacity: 0,
					y: 24,
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
						{ opacity: 0, y: 8 },
						{ opacity: 1, y: 0, duration: 0.35, ease: 'power3.out', stagger: 0.02 }
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
	<section class="hero section">
		<CenterCard onOpenDemo={() => (cmrlsimOpen = true)} />
	</section>

	<div class="section feature-wrap">
		<Signature open={cmrlsimOpen} onOpen={() => (cmrlsimOpen = true)} />
	</div>

	<div class="resume-band">
		<div class="section resume-wrap">
			<ResumeSection onOpenDemo={() => (cmrlsimOpen = true)} />
		</div>
	</div>

	<section class="writing-block section rail-rule" aria-labelledby="writing">
		<h2 id="writing">Writing<span class="mark" aria-hidden="true">*</span></h2>
		<div class="writing-body">
			<PostList posts={data.recentPosts} unavailable={data.unavailable} />
		</div>
	</section>

	<footer class="footer section">
		<span>© {year} Joseph Fernando</span>
		<span class="place">Chennai, India · UTC+5:30</span>
	</footer>
</main>

{#if cmrlsimOpen}
	<DemoWindow title="cmrlsim" onClose={() => (cmrlsimOpen = false)}>
		<CmrlsimDemo />
	</DemoWindow>
{/if}

<Dock />

<style>
	.page {
		min-height: 100dvh;
		background: var(--bg);
	}

	.section {
		width: 100%;
		max-width: 1080px;
		margin-inline: auto;
		padding-left: clamp(1.25rem, 5vw, 2.5rem);
		padding-right: clamp(1.25rem, 5vw, 2.5rem);
	}

	.hero {
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

	.feature-wrap {
		padding-bottom: clamp(2.5rem, 6vh, 4rem);
	}

	/* Full-bleed band — same --bg as the hero, so Experience reads as a
	   continuation of it rather than a separate mid-tone section. Hairlines
	   still mark the boundary. */
	.resume-band {
		padding-block: clamp(2.5rem, 6vh, 4rem);
		border-top: var(--rule) solid var(--line);
		border-bottom: var(--rule) solid var(--line);
	}

	.resume-wrap {
		padding-top: clamp(1rem, 2vh, 1.5rem);
		padding-bottom: clamp(1rem, 2vh, 1.5rem);
	}

	.writing-block {
		padding-top: clamp(2.5rem, 5vh, 3.5rem);
		padding-bottom: clamp(3rem, 8vh, 5rem);
		border-top: var(--rule) solid var(--line);
	}

	@media (min-width: 900px) {
		.writing-block {
			display: grid;
			grid-template-columns: var(--col-label) minmax(0, 1fr);
			column-gap: 2rem;
			align-items: start;
		}
	}

	.writing-block h2 {
		margin: 0 0 1.1rem;
		font-family: var(--font-serif);
		font-size: var(--t-section);
		font-weight: 700;
		letter-spacing: -0.01em;
		line-height: 1.2;
		color: var(--fg);
	}

	.writing-block h2 .mark {
		display: inline-block;
		margin-left: -0.05em;
		font-size: 0.8em;
		vertical-align: 0.32em;
		color: var(--accent);
	}

	.writing-body {
		min-width: 0;
	}

	@media (min-width: 900px) {
		.writing-block h2 {
			position: sticky;
			top: 5rem;
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
		border-top: var(--rule) solid var(--line);
		font-family: var(--font-mono);
		font-size: var(--t-caption);
		letter-spacing: var(--t-track);
		text-transform: uppercase;
		color: var(--muted);
	}

	.place {
		color: var(--muted);
	}
</style>
