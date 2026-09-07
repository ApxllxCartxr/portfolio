<script lang="ts">
	import { resolve } from '$app/paths';
	import { enhance } from '$app/forms';
	import type { PageProps } from './$types';

	let { data }: PageProps = $props();
</script>

<svelte:head>
	<title>Manage posts · Joseph Fernando</title>
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
		width: 100%;
		max-width: 720px;
		margin-inline: auto;
		padding: clamp(2rem, 6vh, 3rem) clamp(1.25rem, 5vw, 2rem) 5rem;
		color: var(--fg);
	}

	.header {
		display: flex;
		align-items: baseline;
		justify-content: space-between;
		gap: 1rem;
		margin-bottom: 2rem;
	}

	h1 {
		font-family: var(--font-title);
		font-size: var(--t-h1);
		font-weight: 600;
		margin: 0;
	}

	.new {
		font-family: var(--font-mono);
		font-size: var(--t-caption);
		letter-spacing: var(--t-track);
		text-transform: uppercase;
		color: var(--muted);
		text-decoration: underline;
		text-underline-offset: 4px;
		text-decoration-thickness: 1px;
	}

	.new:hover,
	.new:focus-visible {
		color: var(--accent);
	}

	.empty {
		font-family: var(--font-mono);
		font-size: var(--t-caption);
		letter-spacing: var(--t-track);
		text-transform: uppercase;
		color: var(--muted);
	}

	.posts {
		list-style: none;
		margin: 0;
		padding: 0;
		border-top: var(--rule) solid var(--line);
	}

	.posts li {
		display: flex;
		align-items: center;
		justify-content: space-between;
		gap: 1rem;
		padding: 0.9rem 0;
		border-bottom: var(--rule) solid var(--line);
	}

	.info {
		display: flex;
		align-items: center;
		gap: 0.7rem;
		min-width: 0;
	}

	.info a {
		font-family: var(--font-body);
		font-size: var(--t-body);
		font-weight: 500;
		color: inherit;
		text-decoration: none;
	}

	.info a:hover,
	.info a:focus-visible {
		color: var(--accent);
	}

	.status {
		font-family: var(--font-mono);
		font-size: var(--t-caption);
		letter-spacing: var(--t-track);
		text-transform: uppercase;
		color: var(--muted);
	}

	.status.draft {
		color: var(--accent);
	}

	button {
		font-family: var(--font-mono);
		font-size: var(--t-caption);
		letter-spacing: var(--t-track);
		text-transform: uppercase;
		padding: 0.4rem 0.7rem;
		border: var(--rule) solid var(--line);
		border-radius: var(--radius);
		background: none;
		color: var(--muted);
		cursor: pointer;
	}

	button:hover,
	button:focus-visible {
		border-color: var(--accent);
		color: var(--accent);
	}
</style>
