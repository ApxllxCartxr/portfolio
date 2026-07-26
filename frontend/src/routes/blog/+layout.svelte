<script lang="ts">
	import PageWindow from '$lib/components/PageWindow.svelte';
	import type { LayoutProps } from './$types';

	let { children }: LayoutProps = $props();
</script>

<PageWindow title="blog">
	{@render children()}
</PageWindow>
