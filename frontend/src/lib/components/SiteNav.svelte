<!--
	Floating pill nav — sticks to the top of every route. Routes on the left,
	theme toggle on the right, hairline border and nothing else: no shadow, no
	blur, no gradient.
-->
<script lang="ts">
	import { onMount } from 'svelte';
	import { page } from '$app/state';
	import { resolve } from '$app/paths';
	import { theme, toggleTheme } from '$lib/theme.svelte';

	let home = resolve('/');
	let blog = resolve('/blog');
	let resume = resolve('/resume');
	let onBlog = $derived(page.url.pathname.startsWith(blog));
	let onResume = $derived(page.url.pathname.startsWith(resume));
	let onHome = $derived(!onBlog && !onResume);

	// The active-route pill slides between items instead of re-rendering in
	// place — the same single-accent language as the SectionMark: one thing
	// moves, everything else keeps still. The indicator is aria-hidden; the
	// current item still carries aria-current for AT.
	let indicator: HTMLSpanElement;
	let homeEl: HTMLAnchorElement;
	let resumeEl: HTMLAnchorElement;
	let blogEl: HTMLAnchorElement;
	let links = $state<HTMLAnchorElement[]>([]);

	function activeIndex() {
		return onHome ? 0 : onResume ? 1 : 2;
	}

	/** Read each route item's actual box off the layout — the pill runs on
	 *  rem, so widths and offsets have to be measured, not assumed. */
	function position() {
		const el = links[activeIndex()];
		if (!el || !indicator) return;
		indicator.style.width = `${el.offsetWidth}px`;
		indicator.style.transform = `translateX(${el.offsetLeft}px)`;
	}

	// Only start animating once the indicator has been seated under its first
	// item — otherwise the transition plays from the left edge on first paint.
	onMount(() => {
		links = [homeEl!, resumeEl!, blogEl!];
		position();
		requestAnimationFrame(() => document.documentElement.classList.add('nav-anim'));

		const onResize = () => position();
		window.addEventListener('resize', onResize);
		document.fonts?.ready.then(() => position());

		return () => {
			window.removeEventListener('resize', onResize);
			document.documentElement.classList.remove('nav-anim');
		};
	});

	// Route changes (client-side or back/forward) re-seat the pill.
	$effect(() => {
		void activeIndex();
		position();
	});
</script>

<nav class="nav" aria-label="Site">
	<div class="pill">
		<span class="indicator" bind:this={indicator} aria-hidden="true"></span>
		<a bind:this={homeEl} href={home} class="item" class:current={onHome} aria-current={onHome ? 'page' : undefined}
			>Home</a
		>
		<a
			bind:this={resumeEl}
			href={resume}
			class="item"
			class:current={onResume}
			aria-current={onResume ? 'page' : undefined}>Resume</a
		>
		<a bind:this={blogEl} href={blog} class="item" class:current={onBlog} aria-current={onBlog ? 'page' : undefined}
			>Blog</a
		>
		<span class="sep" aria-hidden="true"></span>
		<button
			type="button"
			class="item toggle"
			onclick={toggleTheme}
			aria-label="Switch to {theme() === 'dark' ? 'light' : 'dark'} theme"
		>
			{theme() === 'dark' ? '☾' : '☀'}
		</button>
	</div>
</nav>

<style>
	/* The resume page prints; the site's chrome does not belong on paper. */
	@media print {
		.nav {
			display: none;
		}
	}

	.nav {
		position: sticky;
		/* Clears the ink shell rather than sticking flush against it — the
		   pill needs air on both sides of the frame, not just below it. */
		top: var(--shell-w);
		z-index: 20;
		display: flex;
		justify-content: center;
		padding: calc(var(--shell-w) + 0.75rem) 1rem 0.5rem;
		/* No background — the strip is transparent so the page scrolls
		   straight under the floating pill. */
		background: transparent;
	}

	.pill {
		position: relative;
		display: flex;
		align-items: center;
		gap: 0.35rem;
		padding: 0.3rem;
		border: 1px solid var(--line);
		border-radius: 999px;
		background: var(--bg-raised);
	}

	/* The moving current-item tint, seated by JS and animated with a CSS
	   transform/width transition — a compositor-only move, so the slide never
	   reflows or repaints the pill. */
	.indicator {
		position: absolute;
		top: 0.3rem;
		bottom: 0.3rem;
		left: 0;
		border-radius: 999px;
		background: color-mix(in srgb, var(--fg) 7%, transparent);
		pointer-events: none;
		will-change: transform, width;
		transition: none;
	}

	/* Animated only after first mount, once it's seated. */
	:global(html.nav-anim) .indicator {
		transition:
			transform 380ms cubic-bezier(0.2, 0.8, 0.2, 1),
			width 380ms cubic-bezier(0.2, 0.8, 0.2, 1);
	}

	.item {
		display: inline-flex;
		align-items: center;
		justify-content: center;
		padding: 0.3rem 0.85rem;
		border: none;
		border-radius: 999px;
		background: none;
		color: var(--muted);
		font-family: var(--font-body);
		font-size: 0.956rem;
		line-height: 1.4;
		text-decoration: none;
		cursor: pointer;
		/* Press feedback — a half-pixel squat is enough on a pill this small. */
		transition: transform 80ms ease;
	}

	.item:hover,
	.item:focus-visible {
		color: var(--fg);
	}

	.item:active {
		transform: translateY(1px);
	}

	.item.current {
		color: var(--fg);
		font-weight: 600;
	}

	.sep {
		width: 1px;
		height: 1.1rem;
		margin: 0 0.15rem;
		background: var(--line);
	}

	.toggle {
		font-size: 1.013rem;
		padding-inline: 0.6rem;
	}

	/* The resume prints from this route; site chrome is not part of the
	   document. (Shell.svelte hides itself the same way.) */
	@media print {
		.nav {
			display: none;
		}
	}

	@media (prefers-reduced-motion: reduce) {
		.item,
		.indicator {
			transition: none !important;
		}
	}
</style>
