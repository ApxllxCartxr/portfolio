<script lang="ts">
	import { resolve } from '$app/paths';
	import { enhance } from '$app/forms';
	import type { PageProps } from './$types';

	let { data, form }: PageProps = $props();
</script>

<svelte:head>
	<title>Edit {data.post.title} · Joseph Fernando</title>
</svelte:head>

<main class="wrap">
	<a class="back" href={resolve('/admin/posts')}>&larr; Posts</a>
	<h1>Edit post</h1>

	<form method="POST" action="?/update">
		<label for="title">Title</label>
		<input id="title" name="title" type="text" value={data.post.title} required />

		<label for="slug">Slug</label>
		<input id="slug" name="slug" type="text" value={data.post.slug} required />

		<label for="excerpt">Excerpt</label>
		<input id="excerpt" name="excerpt" type="text" value={data.post.excerpt} />

		<label for="content">Content (Markdown)</label>
		<textarea id="content" name="content" rows="16" required>{data.post.content}</textarea>

		<label class="checkbox">
			<input type="checkbox" name="published" checked={data.post.published} />
			Published
		</label>

		{#if form?.error}<p class="error">{form.error}</p>{/if}
		{#if form?.success}<p class="success">Saved.</p>{/if}

		<div class="actions">
			<button type="submit">Save</button>
		</div>
	</form>

	<form
		method="POST"
		action="?/delete"
		use:enhance
		onsubmit={(e) => {
			if (!confirm(`Delete "${data.post.title}"? This can't be undone.`)) e.preventDefault();
		}}
	>
		<button type="submit" class="delete">Delete post</button>
	</form>
</main>

<style>
	.wrap {
		width: 100%;
		max-width: 720px;
		margin-inline: auto;
		padding: clamp(2rem, 6vh, 3rem) clamp(1.25rem, 5vw, 2rem) 5rem;
		color: var(--fg);
	}

	.back {
		display: inline-block;
		margin-bottom: 1.5rem;
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
		margin: 0 0 2rem;
	}

	form {
		display: flex;
		flex-direction: column;
		gap: 0.4rem;
	}

	label {
		margin-top: 0.9rem;
		font-family: var(--font-mono);
		font-size: var(--t-caption);
		letter-spacing: var(--t-track);
		text-transform: uppercase;
		color: var(--muted);
	}

	input[type='text'],
	textarea {
		font-family: var(--font-body);
		font-size: var(--t-body);
		padding: 0.55rem 0.65rem;
		border: var(--rule) solid var(--line);
		border-radius: var(--radius);
		background: var(--bg-raised);
		color: var(--fg);
		resize: vertical;
	}

	textarea {
		font-family: var(--font-mono);
		font-size: 0.9rem;
		line-height: 1.6;
	}

	.checkbox {
		flex-direction: row;
		align-items: center;
		gap: 0.5rem;
		font-family: var(--font-mono);
	}

	.actions {
		margin-top: 1.2rem;
	}

	button {
		font-family: var(--font-mono);
		font-size: var(--t-caption);
		letter-spacing: var(--t-track);
		text-transform: uppercase;
		padding: 0.6rem 1.1rem;
		border: var(--rule) solid var(--fg);
		border-radius: var(--radius);
		background: var(--fg);
		color: var(--bg);
		cursor: pointer;
	}

	button:hover,
	button:focus-visible {
		opacity: 0.85;
	}

	.delete {
		margin-top: 2.5rem;
		background: none;
		border-color: var(--accent);
		color: var(--accent);
		opacity: 1;
	}

	.delete:hover,
	.delete:focus-visible {
		background: var(--accent);
		color: var(--bg);
	}

	.error {
		font-family: var(--font-mono);
		font-size: var(--t-caption);
		letter-spacing: var(--t-track);
		text-transform: uppercase;
		color: var(--accent);
	}

	.success {
		font-family: var(--font-mono);
		font-size: var(--t-caption);
		letter-spacing: var(--t-track);
		text-transform: uppercase;
		color: var(--ok);
	}
</style>
