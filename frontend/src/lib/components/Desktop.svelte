<!--
	The "desktop" — an inset, outlined panel that reads as a container within
	the page. Holds the drifting grid and the windows; also the drag `bounds`
	so windows can't be dragged past the outline.
-->
<script lang="ts">
	import GridLayer from './GridLayer.svelte';
	import ThemeSwatchMenu from './ThemeSwatchMenu.svelte';

	interface Props {
		desktopEl?: HTMLDivElement;
		children?: import('svelte').Snippet;
	}

	let { desktopEl = $bindable(), children }: Props = $props();
</script>

<div class="desktop" bind:this={desktopEl}>
	<GridLayer />
	<ThemeSwatchMenu boundsEl={desktopEl} />
	<div class="surface">
		{@render children?.()}
	</div>
</div>

<style>
	.desktop {
		position: relative;
		margin: clamp(0.5rem, 2.1vw, 1.75rem);
		border: 2px solid var(--fg);
		overflow: hidden;
		min-height: calc(100dvh - clamp(1rem, 4.2vw, 3.5rem));
	}

	.surface {
		position: relative;
		height: 100%;
		min-height: calc(100dvh - clamp(1rem, 4.2vw, 3.5rem) - 4px);
		padding: clamp(1rem, 3vw, 2rem);
	}
</style>
