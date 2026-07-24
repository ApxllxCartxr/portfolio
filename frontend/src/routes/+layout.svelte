<script lang="ts">
	import '../app.css';
	import GridBackground from '$lib/components/GridBackground.svelte';
	import ThemeToggle from '$lib/components/ThemeToggle.svelte';

	let { children } = $props();
</script>

<GridBackground />
<ThemeToggle />

{@render children()}
