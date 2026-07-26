<script lang="ts">
	import { resolve } from '$app/paths';
	import { enhance } from '$app/forms';
	import type { PageProps } from './$types';

	let { data }: PageProps = $props();
</script>

<svelte:head>
	<title>Manage posts — Joseph Fernando</title>
</svelte:head>

<main class="wrap">
	<div class="header">
		<h1>Posts</h1>
		<a class="new" href={resolve('/admin/posts/new')}>New post</a>
	</div>

	{#if data.posts.length === 0}
		<p class="empty">No posts yet.</p>
	{:else}
		<ul class="posts">
			{#each data.posts as post (post.id)}
				<li>
					<div class="info">
						<a href={resolve('/admin/posts/[id]', { id: String(post.id) })}>{post.title}</a>
						<span class="status" class:draft={!post.published}
							>{post.published ? 'Published' : 'Draft'}</span
						>
					</div>
					<form
						method="POST"
						action="?/delete"
						use:enhance
						onsubmit={(e) => {
							if (!confirm(`Delete "${post.title}"?`)) e.preventDefault();
						}}
					>
						<input type="hidden" name="id" value={post.id} />
						<button type="submit">Delete</button>
					</form>
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

	.header {
		display: flex;
		align-items: baseline;
		justify-content: space-between;
		margin-bottom: 2rem;
	}

	h1 {
		font-family: var(--font-title);
		font-size: 2rem;
		font-weight: 700;
		margin: 0;
	}

	.new {
		font-family: var(--font-mono);
		font-size: 0.8rem;
		color: inherit;
		text-decoration: underline;
		text-underline-offset: 3px;
	}

	.empty {
		font-family: var(--font-body);
		opacity: 0.75;
	}

	.posts {
		list-style: none;
		margin: 0;
		padding: 0;
	}

	.posts li {
		display: flex;
		align-items: center;
		justify-content: space-between;
		gap: 1rem;
		padding: 0.9rem 0;
		border-top: 1px solid var(--fg);
	}

	.posts li:last-child {
		border-bottom: 1px solid var(--fg);
	}

	.info {
		display: flex;
		align-items: center;
		gap: 0.7rem;
	}

	.info a {
		font-family: var(--font-body);
		font-size: 1.05rem;
		color: inherit;
		text-decoration: none;
	}

	.info a:hover,
	.info a:focus-visible {
		color: var(--accent);
	}

	.status {
		font-family: var(--font-mono);
		font-size: 0.7rem;
		text-transform: uppercase;
		opacity: 0.6;
	}

	.status.draft {
		color: var(--accent);
		opacity: 1;
	}

	button {
		font-family: var(--font-mono);
		font-size: 0.75rem;
		padding: 0.35rem 0.6rem;
		border: 1px solid var(--fg);
		background: none;
		color: var(--fg);
		cursor: pointer;
	}

	button:hover,
	button:focus-visible {
		background: var(--fg);
		color: var(--bg);
	}
</style>
