<!--
	The "desktop" — an inset, outlined panel that reads as a container within
	the page. Holds the drifting grid and the windows; also the drag `bounds`
	so windows can't be dragged past the outline.
-->
<script lang="ts">
	import GridLayer from './GridLayer.svelte';

	interface Props {
		desktopEl?: HTMLDivElement;
		children?: import('svelte').Snippet;
	}

	let { desktopEl = $bindable(), children }: Props = $props();
</script>

<div class="desktop" bind:this={desktopEl}>
	<GridLayer />
	<div class="surface">
		{@render children?.()}
	</div>
</div>

<style>
	.desktop {
		position: relative;
		margin: clamp(0.75rem, 3vw, 2.5rem);
		border: 2px solid var(--fg);
		overflow: hidden;
		min-height: calc(100dvh - clamp(1.5rem, 6vw, 5rem));
	}

	.surface {
		position: relative;
		height: 100%;
		min-height: calc(100dvh - clamp(1.5rem, 6vw, 5rem) - 4px);
		padding: clamp(1rem, 3vw, 2rem);
	}
</style>
