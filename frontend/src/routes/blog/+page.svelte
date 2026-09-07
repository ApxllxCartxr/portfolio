<script lang="ts">
	import PostList from '$lib/components/PostList.svelte';
	import type { PageProps } from './$types';

	let { data }: PageProps = $props();
</script>

<svelte:head>
	<title>Blog · Joseph Fernando</title>
</svelte:head>

<main class="wrap rail-rule">
	<div class="head">
		<h1>Writing<span class="mark" aria-hidden="true">*</span></h1>
	</div>
	<div class="body">
		<PostList posts={data.posts} unavailable={data.unavailable} verboseEmpty showAllLink={false} />
	</div>
</main>

<style>
	.wrap {
		width: 100%;
		max-width: 1080px;
		margin-inline: auto;
		padding: clamp(2rem, 6vh, 4rem) clamp(1.25rem, 5vw, 2.5rem) clamp(3rem, 8vh, 6rem);
		color: var(--fg);
	}

	/* Same left-rail mono caption / right-column shape as the homepage's
	   Experience, Projects, and Writing blocks — this page is that column
	   expanded to full length, not a different document. */
	h1 {
		margin: 0 0 1.1rem;
		font-family: var(--font-serif);
		font-size: var(--t-section);
		font-weight: 700;
		letter-spacing: -0.01em;
		line-height: 1.2;
		color: var(--fg);
	}

	h1 .mark {
		display: inline-block;
		margin-left: -0.05em;
		font-size: 0.8em;
		vertical-align: 0.32em;
		color: var(--accent);
	}

	.body {
		min-width: 0;
	}

	@media (min-width: 900px) {
		.wrap {
			display: grid;
			grid-template-columns: var(--col-label) minmax(0, 1fr);
			column-gap: 2rem;
			align-items: start;
		}

		h1 {
			position: sticky;
			top: 5rem;
			margin: 0;
		}
	}
</style>
