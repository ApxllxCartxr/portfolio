<script lang="ts">
	import DotMatrix from '$lib/components/DotMatrix.svelte';
	import { creationOfAdam, worldMap } from '$lib/ascii/pieces';
	import { page } from '$app/state';

	let { children } = $props();

	/* The login screen is one small card over the fingertip gap, so the fresco
	   can run at full strength. The working pages carry panels of body copy on
	   top of the map and need it pulled back. */
	let login = $derived(page.url.pathname === '/admin');
</script>

<DotMatrix
	piece={login ? creationOfAdam : worldMap}
	opacity={login ? 0.75 : 0.35}
	offset={login ? 13 : 0}
/>
<div class="console">
	{@render children()}
</div>

<style>
	.console {
		position: relative;
		z-index: 1;
	}
</style>
