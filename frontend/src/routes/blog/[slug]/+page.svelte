<script lang="ts">
	import { resolve } from '$app/paths';
	import { renderMarkdown } from '$lib/markdown';
	import type { PageProps } from './$types';

	let { data }: PageProps = $props();
	let html = $derived(renderMarkdown(data.post.content));
</script>

<svelte:head>
	<title>{data.post.title} · Joseph Fernando</title>
</svelte:head>

<main class="wrap">
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
</main>

<style>
	.wrap {
		width: 100%;
		max-width: 720px;
		margin-inline: auto;
		padding: clamp(2rem, 6vh, 4rem) clamp(1.25rem, 5vw, 2rem) clamp(3rem, 8vh, 6rem);
		color: var(--fg);
	}

	.back {
		display: inline-block;
		margin-bottom: 2rem;
		font-family: var(--font-mono);
		font-size: var(--t-caption);
		letter-spacing: var(--t-track);
		text-transform: uppercase;
		color: var(--muted);
		text-decoration: underline;
		text-underline-offset: 4px;
		text-decoration-thickness: 1px;
	}

	.back:hover,
	.back:focus-visible {
		color: var(--accent);
	}

	h1 {
		font-family: var(--font-title);
		font-size: var(--t-h1);
		font-weight: 600;
		line-height: 1.15;
		letter-spacing: -0.005em;
		margin: 0 0 0.6rem;
		text-wrap: balance;
	}

	time {
		display: block;
		margin-bottom: 2.5rem;
		font-family: var(--font-mono);
		font-size: var(--t-caption);
		letter-spacing: var(--t-track);
		text-transform: uppercase;
		color: var(--muted);
	}

	.content {
		max-width: var(--measure);
		font-family: var(--font-body);
		font-size: var(--t-body);
		line-height: 1.65;
		border-top: var(--rule) solid var(--line);
		padding-top: 2rem;
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
		border: var(--rule) solid var(--line);
		border-radius: var(--radius);
		background: var(--bg-raised);
		font-family: var(--font-mono);
		font-size: 0.9rem;
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
		margin: 0 0 1.1rem;
		padding-left: 1rem;
		border-left: 2px solid var(--accent);
		color: var(--muted);
	}

	.content :global(img) {
		max-width: 100%;
		border-radius: var(--radius);
	}
</style>
