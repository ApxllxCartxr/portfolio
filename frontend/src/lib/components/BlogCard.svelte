<script lang="ts">
	import { resolve } from '$app/paths';
	import { renderMarkdown } from '$lib/markdown';
	import type { Post } from '$lib/types/post';

	interface Props {
		post: Post | null;
		maximized?: boolean;
	}

	let { post, maximized = false }: Props = $props();

	let html = $derived(post ? renderMarkdown(post.content) : '');

	function formatDate(iso: string) {
		return new Date(iso).toLocaleDateString('en-US', {
			year: 'numeric',
			month: 'long',
			day: 'numeric'
		});
	}
</script>

{#if !post}
	<p class="empty">No posts yet — check back soon.</p>
{:else}
	<div class="layout">
		<h2 class="title">{post.title}</h2>
		<time datetime={post.created_at}>{formatDate(post.created_at)}</time>

		{#if post.excerpt}
			<p class="excerpt">{post.excerpt}</p>
		{/if}

		<div class="content" class:maximized>
			<!-- eslint-disable-next-line svelte/no-at-html-tags -- html is DOMPurify-sanitized in renderMarkdown() -->
			{@html html}
		</div>

		<a class="all-posts" class:maximized href={resolve('/blog')}>Read all posts &rarr;</a>
	</div>
{/if}

<style>
	.layout {
		display: flex;
		flex-direction: column;
	}

	.empty {
		font-family: var(--font-body);
		opacity: 0.75;
	}

	.title {
		font-family: var(--font-title);
		font-size: 1.3rem;
		font-weight: 700;
		margin: 0 0 0.3rem;
		line-height: 1.2;
	}

	time {
		display: block;
		font-family: var(--font-mono);
		font-size: 0.72rem;
		opacity: 0.6;
		margin-bottom: 0.8rem;
	}

	.excerpt {
		font-family: var(--font-body);
		opacity: 0.85;
		margin: 0;
	}

	.content {
		font-family: var(--font-body);
		font-size: 1.05rem;
		line-height: 1.6;
	}

	.all-posts {
		display: inline-block;
		margin-top: 1.4rem;
		padding-top: 0.8rem;
		border-top: 1px solid var(--fg);
		font-family: var(--font-mono);
		font-size: 0.8rem;
		color: inherit;
		text-decoration: underline;
		text-underline-offset: 3px;
		width: fit-content;
	}

	.all-posts:hover,
	.all-posts:focus-visible {
		color: var(--accent);
	}

	.content :global(h1),
	.content :global(h2),
	.content :global(h3) {
		font-family: var(--font-title);
		font-weight: 600;
		margin: 1.6rem 0 0.8rem;
	}

	.content :global(p) {
		margin: 0 0 1rem;
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
		margin: 0 0 1rem;
		padding-left: 1.4rem;
	}

	.content :global(blockquote) {
		border-left: 2px solid var(--fg);
		padding-left: 1rem;
		opacity: 0.85;
		margin: 0 0 1rem;
	}

	.content :global(img) {
		max-width: 100%;
	}

	@media (min-width: 701px) {
		.content:not(.maximized),
		.all-posts:not(.maximized) {
			display: none;
		}
	}
</style>
