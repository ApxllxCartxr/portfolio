<script lang="ts">
	import { browser } from '$app/environment';
	import Desktop from '$lib/components/Desktop.svelte';
	import Window from '$lib/components/Window.svelte';
	import WeatherCard from '$lib/components/WeatherCard.svelte';
	import ClockCard from '$lib/components/ClockCard.svelte';
	import CenterCard from '$lib/components/CenterCard.svelte';
	import LoadingScreen from '$lib/components/LoadingScreen.svelte';
	import ResumeSection from '$lib/components/ResumeSection.svelte';

	const WINDOW_IDS = ['weather', 'center', 'date'] as const;
	type WindowId = (typeof WINDOW_IDS)[number];

	const DESKTOP_QUERY = '(min-width: 701px)';
	// Wheel-distance (px-equivalent of accumulated deltaY) to go from compact
	// card to fully maximized.
	const MAXIMIZE_DISTANCE = 700;

	let loaded = $state(false);
	let desktopEl = $state<HTMLDivElement>();
	let weatherWindowEl = $state<HTMLElement>();
	let centerWindowEl = $state<HTMLElement>();
	let centerContentEl = $state<HTMLElement>();
	let dateWindowEl = $state<HTMLElement>();
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	let centerWindowInstance: any = $state();
	let maximized = $state(false);
	let openWindows = $state<Record<WindowId, boolean>>({
		weather: true,
		center: true,
		date: true
	});
	let zOrder = $state<WindowId[]>(['weather', 'center', 'date']);

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
	// window into a true fullscreen overlay (covering the whole viewport, not
	// just the desktop panel); wheeling up — once the window's own content is
	// scrolled back to its top — shrinks it back. The page itself never
	// scrolls; scrolling only ever drives this progress value or the center
	// window's own internal content once maximized.
	let progress = 0;
	let startRect: DOMRect | null = null;
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	let gsapRef: any;

	function clamp01(v: number) {
		return Math.max(0, Math.min(1, v));
	}

	function applyProgress(p: number) {
		if (!gsapRef || !centerWindowEl || !weatherWindowEl || !dateWindowEl) return;
		const anchorEl = centerWindowEl.parentElement as HTMLElement | null;

		if (p <= 0) {
			gsapRef.set(centerWindowEl, { clearProps: 'position,left,top,width,height,zIndex' });
			if (anchorEl) anchorEl.style.transform = '';
			centerWindowInstance?.setDraggable(true);
			startRect = null;
		} else {
			// The anchor's own `transform` (used to center it on x/y) would
			// otherwise become the containing block for a `position: fixed`
			// descendant, trapping the maximized window inside the desktop
			// panel instead of covering the viewport — neutralize it while
			// animating.
			if (!startRect) startRect = centerWindowEl.getBoundingClientRect();
			if (anchorEl) anchorEl.style.transform = 'none';
			const left = startRect.left * (1 - p);
			const top = startRect.top * (1 - p);
			const width = startRect.width + (window.innerWidth - startRect.width) * p;
			const height = startRect.height + (window.innerHeight - startRect.height) * p;
			gsapRef.set(centerWindowEl, {
				position: 'fixed',
				left,
				top,
				width,
				height,
				zIndex: 999
			});
			centerWindowInstance?.setDraggable(false);
		}

		gsapRef.set([weatherWindowEl, dateWindowEl], { autoAlpha: 1 - Math.min(p / 0.3, 1) });
		maximized = p >= 0.999;
	}

	$effect(() => {
		if (!browser || !loaded || !centerWindowEl || !weatherWindowEl || !dateWindowEl) return;

		let cancelled = false;

		function onWheel(event: WheelEvent) {
			if (!window.matchMedia(DESKTOP_QUERY).matches) return;

			const atTop = progress >= 1 && (!centerContentEl || centerContentEl.scrollTop <= 0);
			if (progress >= 1 && event.deltaY > 0) return;
			if (progress >= 1 && event.deltaY < 0 && !atTop) return;

			event.preventDefault();
			progress = clamp01(progress + event.deltaY / MAXIMIZE_DISTANCE);
			applyProgress(progress);
		}

		function onResize() {
			if (!window.matchMedia(DESKTOP_QUERY).matches && progress > 0) {
				progress = 0;
				applyProgress(0);
			}
		}

		(async () => {
			const { gsap } = await import('gsap');
			if (cancelled) return;
			gsapRef = gsap;

			const isDesktop = window.matchMedia(DESKTOP_QUERY).matches;
			const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
			if (isDesktop && reduceMotion) {
				// No motion: skip the wheel-jack entirely and land straight on
				// the maximized view so the resume content stays reachable.
				progress = 1;
				applyProgress(1);
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

<LoadingScreen onDone={() => (loaded = true)} />

<main class="page">
	<Desktop bind:desktopEl>
		{#if hasClosed}
			<button type="button" class="restore" onclick={restoreAll}>Restore windows</button>
		{/if}

		<!-- Gate window mounting on desktopEl (so each Window's onMount always
		     sees a real boundsEl) and on loaded, so the windows bloom in right
		     as the loading grid finishes drawing rather than sitting there
		     idle underneath it. -->
		{#if desktopEl && loaded}
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
					bind:this={centerWindowInstance}
				>
					<CenterCard {maximized} />
					<ResumeSection />
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
