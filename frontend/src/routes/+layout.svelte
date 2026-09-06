<script lang="ts">
	import '../app.css';
	import SiteNav from '$lib/components/SiteNav.svelte';

	let { children } = $props();
</script>

<SiteNav />
{@render children()}
