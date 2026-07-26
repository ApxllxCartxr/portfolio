<script lang="ts">
	import Desktop from '$lib/components/Desktop.svelte';
	import Window from '$lib/components/Window.svelte';
	import WeatherCard from '$lib/components/WeatherCard.svelte';
	import ClockCard from '$lib/components/ClockCard.svelte';
	import CenterCard from '$lib/components/CenterCard.svelte';
	import LoadingScreen from '$lib/components/LoadingScreen.svelte';

	const WINDOW_IDS = ['weather', 'center', 'date'] as const;
	type WindowId = (typeof WINDOW_IDS)[number];

	let loaded = $state(false);
	let desktopEl = $state<HTMLDivElement>();
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
					scrollCue
				>
					<CenterCard />
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

	@media (min-width: 701px) {
		.page {
			height: 100dvh;
			overflow: hidden;
		}
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
