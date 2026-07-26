<script lang="ts">
	import { resolve } from '$app/paths';
	import { renderMarkdown } from '$lib/markdown';
	import type { PageProps } from './$types';

	let { data }: PageProps = $props();
	let html = $derived(renderMarkdown(data.post.content));
</script>

<svelte:head>
	<title>{data.post.title} — Joseph Fernando</title>
</svelte:head>

<a class="back" href={resolve('/blog')}>&larr; All posts</a>

<h1>{data.post.title}</h1>
<time datetime={data.post.created_at}
	>{new Date(data.post.created_at).toLocaleDateString('en-US', {
		year: 'numeric',
		month: 'long',
		day: 'numeric'
	})}</time
>

<div class="content">
	<!-- eslint-disable-next-line svelte/no-at-html-tags -- html is DOMPurify-sanitized in renderMarkdown() -->
	{@html html}
</div>

<style>
	.back {
		display: inline-block;
		font-family: var(--font-mono);
		font-size: 0.8rem;
		color: inherit;
		text-decoration: underline;
		text-underline-offset: 3px;
		margin-bottom: 2rem;
	}

	.back:hover,
	.back:focus-visible {
		color: var(--accent);
	}

	h1 {
		font-family: var(--font-title);
		font-size: 2.4rem;
		font-weight: 700;
		margin: 0 0 0.5rem;
		line-height: 1.15;
	}

	time {
		display: block;
		font-family: var(--font-mono);
		font-size: 0.78rem;
		opacity: 0.6;
		margin-bottom: 2.5rem;
	}

	.content {
		font-family: var(--font-body);
		font-size: 1.1rem;
		line-height: 1.65;
	}

	.content :global(h1),
	.content :global(h2),
	.content :global(h3) {
		font-family: var(--font-title);
		font-weight: 600;
		margin: 2rem 0 1rem;
	}

	.content :global(p) {
		margin: 0 0 1.1rem;
	}

	.content :global(a) {
		color: var(--accent);
	}

	.content :global(pre) {
		overflow-x: auto;
		padding: 1rem;
		border: 1px solid var(--fg);
		font-family: var(--font-mono);
		font-size: 0.85rem;
	}

	.content :global(code) {
		font-family: var(--font-mono);
	}

	.content :global(ul),
	.content :global(ol) {
		margin: 0 0 1.1rem;
		padding-left: 1.4rem;
	}

	.content :global(blockquote) {
		border-left: 2px solid var(--fg);
		padding-left: 1rem;
		opacity: 0.85;
		margin: 0 0 1.1rem;
	}

	.content :global(img) {
		max-width: 100%;
	}
</style>
