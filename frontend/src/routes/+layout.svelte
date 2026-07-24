<script lang="ts">
	import '../app.css';
	import GridBackground from '$lib/components/GridBackground.svelte';

	let { children } = $props();
</script>

<GridBackground />

{@render children()}
