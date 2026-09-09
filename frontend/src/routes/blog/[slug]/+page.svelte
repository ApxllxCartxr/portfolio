<script lang="ts">
	import { resolve } from '$app/paths';
	import Seo from '$lib/components/Seo.svelte';
	import type { PageProps } from './$types';

	let { data }: PageProps = $props();
</script>

<Seo
	title="{data.post.title} — Joseph Fernando"
	description={data.post.excerpt || `${data.post.title} — writing by Joseph Fernando.`}
	type="article"
/>

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
		<!-- eslint-disable-next-line svelte/no-at-html-tags -- html is xss-sanitized in renderMarkdown() on the server -->
		{@html data.html}
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
		font-size: 1rem;
		font-weight: 500;
		color: var(--muted);
		text-decoration: underline;
		text-underline-offset: 4px;
		text-decoration-thickness: 1px;
	}

	.back:hover,
	.back:focus-visible {
		color: var(--accent);
	}

	/* The post title takes the display face, like every other title on the
	   site — a post arrived at from the homepage should read as the same
	   publication. */
	h1 {
		font-family: var(--font-display);
		font-size: clamp(2.1rem, 4.5vw, 3rem);
		font-weight: 700;
		line-height: 1.03;
		letter-spacing: -0.025em;
		margin: 0 0 0.7rem;
		text-wrap: balance;
	}

	time {
		display: block;
		margin-bottom: 2.5rem;
		font-size: 1rem;
		font-weight: 500;
		color: var(--muted);
	}

	.content {
		max-width: var(--measure);
		font-family: var(--font-body);
		font-size: 1.05rem;
		line-height: 1.7;
		border-top: var(--rule) solid var(--line);
		padding-top: 2rem;
	}

	.content :global(h2),
	.content :global(h3) {
		font-family: var(--font-display);
		font-weight: 700;
		letter-spacing: -0.015em;
		margin: 2.25rem 0 0.9rem;
	}

	.content :global(h2) {
		font-size: 1.6rem;
	}

	.content :global(h3) {
		font-size: 1.3rem;
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
