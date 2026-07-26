<script lang="ts">
	import { resolve } from '$app/paths';
	import type { ActionData } from './$types';

	let { form }: { form: ActionData } = $props();
</script>

<svelte:head>
	<title>New post — Joseph Fernando</title>
</svelte:head>

<main class="wrap">
	<a class="back" href={resolve('/admin/posts')}>&larr; Posts</a>
	<h1>New post</h1>

	<form method="POST">
		<label for="title">Title</label>
		<input id="title" name="title" type="text" value={form?.title ?? ''} required />

		<label for="slug"
			>Slug <span class="hint">(optional — derived from title if left blank)</span></label
		>
		<input id="slug" name="slug" type="text" value={form?.slug ?? ''} />

		<label for="excerpt">Excerpt</label>
		<input id="excerpt" name="excerpt" type="text" value={form?.excerpt ?? ''} />

		<label for="content">Content (Markdown)</label>
		<textarea id="content" name="content" rows="16" required>{form?.content ?? ''}</textarea>

		<label class="checkbox">
			<input type="checkbox" name="published" checked />
			Published
		</label>

		{#if form?.error}<p class="error">{form.error}</p>{/if}

		<button type="submit">Create post</button>
	</form>
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
		margin-bottom: 1.5rem;
	}

	h1 {
		font-family: var(--font-title);
		font-size: 2rem;
		font-weight: 700;
		margin: 0 0 2rem;
	}

	form {
		display: flex;
		flex-direction: column;
		gap: 0.4rem;
	}

	label {
		font-family: var(--font-mono);
		font-size: 0.78rem;
		opacity: 0.7;
		margin-top: 0.8rem;
	}

	.hint {
		opacity: 0.7;
	}

	input[type='text'],
	textarea {
		font-family: var(--font-body);
		font-size: 1rem;
		padding: 0.55rem 0.65rem;
		border: 1px solid var(--fg);
		background: var(--bg);
		color: var(--fg);
		resize: vertical;
	}

	textarea {
		font-family: var(--font-mono);
		font-size: 0.9rem;
		line-height: 1.5;
	}

	.checkbox {
		flex-direction: row;
		align-items: center;
		gap: 0.5rem;
		font-family: var(--font-mono);
	}

	button {
		margin-top: 1.2rem;
		align-self: flex-start;
		font-family: var(--font-mono);
		font-size: 0.85rem;
		padding: 0.6rem 1.1rem;
		border: 1px solid var(--fg);
		background: var(--fg);
		color: var(--bg);
		cursor: pointer;
	}

	.error {
		font-family: var(--font-mono);
		font-size: 0.8rem;
		color: var(--accent);
	}
</style>
