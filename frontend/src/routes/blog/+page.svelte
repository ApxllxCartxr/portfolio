<script lang="ts">
	import { resolve } from '$app/paths';
	import type { PageProps } from './$types';

	let { data }: PageProps = $props();
</script>

<svelte:head>
	<title>Blog — Joseph Fernando</title>
</svelte:head>

<main class="wrap">
	<a class="back" href={resolve('/')}>&larr; Home</a>

	<h1>Blog</h1>

	{#if data.posts.length === 0}
		<p class="empty">No posts yet — check back soon.</p>
	{:else}
		<ul class="posts">
			{#each data.posts as post (post.id)}
				<li>
					<a href={resolve('/blog/[slug]', { slug: post.slug })}>
						<h2>{post.title}</h2>
						{#if post.excerpt}<p class="excerpt">{post.excerpt}</p>{/if}
						<time datetime={post.created_at}
							>{new Date(post.created_at).toLocaleDateString('en-US', {
								year: 'numeric',
								month: 'long',
								day: 'numeric'
							})}</time
						>
					</a>
				</li>
			{/each}
		</ul>
	{/if}
</main>

<style>
	.wrap {
		max-width: 720px;
		margin: 0 auto;
		padding: 3rem 1.25rem 5rem;
		color: var(--fg);
	}

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
		font-size: 2.5rem;
		font-weight: 700;
		margin: 0 0 2rem;
	}

	.empty {
		font-family: var(--font-body);
		opacity: 0.75;
	}

	.posts {
		list-style: none;
		margin: 0;
		padding: 0;
		display: flex;
		flex-direction: column;
	}

	.posts li {
		border-top: 1px solid var(--fg);
	}

	.posts li:last-child {
		border-bottom: 1px solid var(--fg);
	}

	.posts a {
		display: block;
		padding: 1.4rem 0;
		color: inherit;
		text-decoration: none;
	}

	.posts a:hover h2,
	.posts a:focus-visible h2 {
		color: var(--accent);
	}

	.posts h2 {
		font-family: var(--font-title);
		font-size: 1.4rem;
		font-weight: 600;
		margin: 0 0 0.4rem;
	}

	.excerpt {
		font-family: var(--font-body);
		opacity: 0.85;
		margin: 0 0 0.5rem;
	}

	time {
		font-family: var(--font-mono);
		font-size: 0.75rem;
		opacity: 0.6;
	}
</style>
