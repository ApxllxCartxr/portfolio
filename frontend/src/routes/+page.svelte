<script lang="ts">
	import { browser } from '$app/environment';
	import Desktop from '$lib/components/Desktop.svelte';
	import Window from '$lib/components/Window.svelte';
	import WeatherCard from '$lib/components/WeatherCard.svelte';
	import ClockCard from '$lib/components/ClockCard.svelte';
	import CenterCard from '$lib/components/CenterCard.svelte';
	import ResumeSection from '$lib/components/ResumeSection.svelte';
	import NowPlayingCard from '$lib/components/NowPlayingCard.svelte';
	import { DESKTOP_QUERY } from '$lib/breakpoints';

	const WINDOW_IDS = ['weather', 'center', 'date', 'nowPlaying'] as const;
	type WindowId = (typeof WINDOW_IDS)[number];

	// Wheel-distance (px-equivalent of accumulated deltaY) to go from compact
	// card to fully maximized.
	const MAXIMIZE_DISTANCE = 700;

	let desktopEl = $state<HTMLDivElement>();
	let weatherWindowEl = $state<HTMLElement>();
	let centerWindowEl = $state<HTMLElement>();
	let centerContentEl = $state<HTMLElement>();
	let centerTitlebarEl = $state<HTMLElement>();
	let dateWindowEl = $state<HTMLElement>();
	let nowPlayingWindowEl = $state<HTMLElement>();
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	let centerWindowInstance: any = $state();
	let maximized = $state(false);
	let openWindows = $state<Record<WindowId, boolean>>({
		weather: true,
		center: true,
		date: true,
		nowPlaying: true
	});
	let zOrder = $state<WindowId[]>(['weather', 'center', 'date', 'nowPlaying']);

	function zIndexOf(id: WindowId) {
		return zOrder.indexOf(id) + 1;
	}

	function bringToFront(id: WindowId) {
		zOrder = [...zOrder.filter((w) => w !== id), id];
	}

	function closeWindow(id: WindowId) {
		openWindows[id] = false;
	}

	function restoreAll() {
		for (const id of WINDOW_IDS) openWindows[id] = true;
	}

	let hasClosed = $derived(WINDOW_IDS.some((id) => !openWindows[id]));

	// Wheel-driven maximize: wheeling down over the desktop grows the center
	// window into a centered portrait card (not edge-to-edge fullscreen);
	// wheeling up — once the window's own content is scrolled back to its
	// top — shrinks it back. The page itself never scrolls; scrolling only
	// ever drives a target progress value, which a GSAP tween eases into an
	// actual rendered value every frame (fluid motion instead of a per-tick
	// snap), or the center window's own internal content once maximized.
	let target = 0;
	const driver = { p: 0 };
	let startRect: DOMRect | null = null;
	let startX = 0;
	let startY = 0;
	let growEls: { el: HTMLElement; startPx: number }[] | null = null;
	let gridEl: HTMLElement | null = null;
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	let gsapRef: any;
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	let smoothTween: any;
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	let revealTween: any;
	let scrollCueEl: HTMLElement | null = null;

	function clamp01(v: number) {
		return Math.max(0, Math.min(1, v));
	}

	function render(p: number) {
		if (!gsapRef || !centerWindowEl || !weatherWindowEl || !dateWindowEl || !nowPlayingWindowEl)
			return;
		const anchorEl = centerWindowEl.parentElement as HTMLElement | null;
		const fade = 1 - Math.min(p / 0.3, 1);

		if (p <= 0) {
			gsapRef.set(centerWindowEl, { clearProps: 'position,left,top,width,height,zIndex' });
			if (anchorEl) anchorEl.style.transform = '';
			if (growEls) for (const { el } of growEls) el.style.fontSize = '';
			desktopEl?.style.removeProperty('--chrome');
			centerWindowEl.style.removeProperty('--win-chrome');
			centerWindowInstance?.setDraggable(true);
			startRect = null;
			growEls = null;
			gridEl = null;
			scrollCueEl = null;
		} else {
			// The anchor's own `transform` (used to center it on x/y) would
			// otherwise become the containing block for a `position: fixed`
			// descendant, trapping the maximized window inside the desktop
			// panel instead of escaping to the viewport — neutralize it while
			// animating.
			if (!startRect) {
				startRect = centerWindowEl.getBoundingClientRect();
				// Draggable applies drag offset as a `transform: translate(x,y)`,
				// entirely separate from the left/top we animate below — capture
				// it once and ease it back to (0,0) in lockstep with `p`, so the
				// card ends up exactly centered at p=1 regardless of wherever the
				// user last dragged it (otherwise it grows "in place", offset by
				// the drag amount).
				startX = gsapRef.getProperty(centerWindowEl, 'x') || 0;
				startY = gsapRef.getProperty(centerWindowEl, 'y') || 0;
			}
			if (!growEls) {
				const els = centerWindowEl.querySelectorAll<HTMLElement>('.name');
				growEls = Array.from(els).map((el) => ({
					el,
					startPx: parseFloat(getComputedStyle(el).fontSize)
				}));
			}
			if (!gridEl) gridEl = desktopEl?.querySelector<HTMLElement>('.grid-layer') ?? null;
			if (!scrollCueEl) scrollCueEl = centerWindowEl.querySelector<HTMLElement>('.scroll-cue');
			if (anchorEl) anchorEl.style.transform = 'none';

			// Target: a centered portrait card, not edge-to-edge fullscreen.
			const targetWidth = Math.min(1000, window.innerWidth * 0.94);
			const targetHeight = Math.min(window.innerHeight * 0.92, 1000);
			const targetLeft = (window.innerWidth - targetWidth) / 2;
			const targetTop = (window.innerHeight - targetHeight) / 2;

			const left = startRect.left + (targetLeft - startRect.left) * p;
			const top = startRect.top + (targetTop - startRect.top) * p;
			const width = startRect.width + (targetWidth - startRect.width) * p;
			const height = startRect.height + (targetHeight - startRect.height) * p;
			gsapRef.set(centerWindowEl, {
				position: 'fixed',
				left,
				top,
				width,
				height,
				x: startX * (1 - p),
				y: startY * (1 - p),
				zIndex: 999
			});

			for (const { el, startPx } of growEls) {
				el.style.fontSize = startPx * (1 + 0.5 * p) + 'px';
			}

			// Fade the desktop's grid + panel border, and the card's own
			// border, to flat --bg — nothing shows through around the card and
			// the card itself reads as part of the background.
			desktopEl?.style.setProperty('--chrome', String(fade));
			centerWindowEl.style.setProperty('--win-chrome', String(fade));
			centerWindowInstance?.setDraggable(false);
		}

		gsapRef.set(
			[weatherWindowEl, dateWindowEl, nowPlayingWindowEl, centerTitlebarEl, scrollCueEl],
			{
				autoAlpha: fade
			}
		);
		if (gridEl) gsapRef.set(gridEl, { autoAlpha: fade });

		// Drive `maximized` from the same per-frame call that renders the
		// card's actual size, so the CSS gated on it (bio/links/resume) can
		// never fall out of sync with what's on screen — setTarget() kills
		// in-flight tweens on every wheel tick (which skips onComplete), so
		// onComplete alone isn't a reliable place to flip this.
		maximized = p >= 0.999;
	}

	function setTarget(next: number) {
		target = clamp01(next);
		if (!gsapRef) return;
		smoothTween?.kill();
		smoothTween = gsapRef.to(driver, {
			p: target,
			duration: 0.5,
			ease: 'power3.out',
			overwrite: 'auto',
			onUpdate: () => render(driver.p)
		});
	}

	// Reveals the content that only exists once maximized: the bio/contact
	// copy just does a plain fade (it's simple stacked text now, no layout
	// change to animate), while the resume entries and skill pills still get
	// a staggered rise-and-fade for a bit more polish further down the card.
	$effect(() => {
		void maximized;
		revealTween?.kill();
		const reduceMotion = browser && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
		if (maximized && gsapRef && centerWindowEl && !reduceMotion) {
			const bioEls = centerWindowEl.querySelectorAll<HTMLElement>('.bio, .links');
			const resumeEls = centerWindowEl.querySelectorAll<HTMLElement>('.resume h2, .resume .entry');
			const pillEls = centerWindowEl.querySelectorAll<HTMLElement>('.resume .pill');

			const tl = gsapRef.timeline();
			if (bioEls.length) {
				tl.fromTo(bioEls, { opacity: 0 }, { opacity: 1, duration: 0.5, ease: 'power1.out' });
			}
			if (resumeEls.length) {
				tl.fromTo(
					resumeEls,
					{ opacity: 0, y: 26 },
					{ opacity: 1, y: 0, duration: 0.55, ease: 'power3.out', stagger: 0.07 },
					'-=0.2'
				);
			}
			if (pillEls.length) {
				tl.fromTo(
					pillEls,
					{ opacity: 0, y: 10 },
					{ opacity: 1, y: 0, duration: 0.35, ease: 'power3.out', stagger: 0.018 },
					'-=0.25'
				);
			}
			revealTween = tl;
		}
	});

	$effect(() => {
		if (!browser || !centerWindowEl || !weatherWindowEl || !dateWindowEl || !nowPlayingWindowEl)
			return;

		let cancelled = false;

		function onWheel(event: WheelEvent) {
			if (!window.matchMedia(DESKTOP_QUERY).matches) return;

			const atTop = target >= 1 && (!centerContentEl || centerContentEl.scrollTop <= 0);
			if (target >= 1 && event.deltaY > 0) return;
			if (target >= 1 && event.deltaY < 0 && !atTop) return;

			event.preventDefault();
			setTarget(target + event.deltaY / MAXIMIZE_DISTANCE);
		}

		function onResize() {
			if (!window.matchMedia(DESKTOP_QUERY).matches && target > 0) {
				setTarget(0);
			}
		}

		(async () => {
			const { gsap } = await import('gsap');
			if (cancelled) return;
			gsapRef = gsap;

			const isDesktop = window.matchMedia(DESKTOP_QUERY).matches;
			const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
			if (isDesktop && reduceMotion) {
				// No motion: skip the wheel-jack entirely and land straight on the
				// maximized view so the resume content stays reachable.
				target = 1;
				driver.p = 1;
				render(1);
				return;
			}

			window.addEventListener('wheel', onWheel, { passive: false });
			window.addEventListener('resize', onResize);
		})();

		return () => {
			cancelled = true;
			window.removeEventListener('wheel', onWheel);
			window.removeEventListener('resize', onResize);
		};
	});
</script>

<svelte:head>
	<title>Joseph Fernando</title>
	<meta name="description" content="Personal portfolio — a desktop-style homepage." />
</svelte:head>

<main class="page">
	<Desktop bind:desktopEl>
		{#if hasClosed}
			<button type="button" class="restore" onclick={restoreAll}>Restore windows</button>
		{/if}

		<!-- Gate window mounting on desktopEl so each Window's onMount always
		     sees a real boundsEl. -->
		{#if desktopEl}
			{#if openWindows.weather}
				<Window
					title="Weather"
					x={9}
					y={16}
					order={2}
					boundsEl={desktopEl}
					zIndex={zIndexOf('weather')}
					onClose={() => closeWindow('weather')}
					onFront={() => bringToFront('weather')}
					bind:windowEl={weatherWindowEl}
				>
					<WeatherCard />
				</Window>
			{/if}

			{#if openWindows.center}
				<Window
					title="Info"
					x={50}
					y={50}
					order={1}
					boundsEl={desktopEl}
					zIndex={zIndexOf('center')}
					onClose={() => closeWindow('center')}
					onFront={() => bringToFront('center')}
					size="primary"
					{maximized}
					bind:windowEl={centerWindowEl}
					bind:contentEl={centerContentEl}
					bind:titlebarEl={centerTitlebarEl}
					bind:this={centerWindowInstance}
				>
					<CenterCard {maximized} />
					<ResumeSection {maximized} />
				</Window>
			{/if}

			{#if openWindows.date}
				<Window
					title="Date"
					x={91}
					y={16}
					order={3}
					boundsEl={desktopEl}
					zIndex={zIndexOf('date')}
					onClose={() => closeWindow('date')}
					onFront={() => bringToFront('date')}
					bind:windowEl={dateWindowEl}
				>
					<ClockCard />
				</Window>
			{/if}

			{#if openWindows.nowPlaying}
				<Window
					title="Now Playing"
					x={91}
					y={84}
					order={4}
					boundsEl={desktopEl}
					zIndex={zIndexOf('nowPlaying')}
					onClose={() => closeWindow('nowPlaying')}
					onFront={() => bringToFront('nowPlaying')}
					bind:windowEl={nowPlayingWindowEl}
				>
					<NowPlayingCard />
				</Window>
			{/if}
		{/if}
	</Desktop>
</main>

<style>
	.page {
		min-height: 100dvh;
		background: var(--bg);
	}

	.restore {
		position: absolute;
		top: 0.75rem;
		right: 0.75rem;
		z-index: 50;
		font-family: var(--font-mono);
		font-size: 0.7rem;
		padding: 0.35rem 0.6rem;
		border: 1px solid var(--fg);
		background: var(--bg);
		color: var(--fg);
		cursor: pointer;
	}

	.restore:hover,
	.restore:focus-visible {
		background: var(--fg);
		color: var(--bg);
	}
</style>
