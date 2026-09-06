<script lang="ts">
	import PostList from '$lib/components/PostList.svelte';
	import type { PageProps } from './$types';

	let { data }: PageProps = $props();
</script>

<svelte:head>
	<title>Blog — Joseph Fernando</title>
</svelte:head>

<main class="wrap">
	<h1>Writing</h1>

	<PostList posts={data.posts} unavailable={data.unavailable} showAllLink={false} />
</main>

<style>
	.wrap {
		width: 100%;
		max-width: 760px;
		margin-inline: auto;
		padding: clamp(1.5rem, 5vh, 3rem) clamp(1.25rem, 5vw, 2rem) 5rem;
		color: var(--fg);
	}

	h1 {
		font-family: var(--font-display);
		font-size: clamp(2.25rem, 6vw, 3rem);
		font-weight: 700;
		line-height: 1;
		margin: 0 0 2rem;
	}
</style>
