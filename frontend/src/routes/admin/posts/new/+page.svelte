<script lang="ts">
	import { resolve } from '$app/paths';
	import type { ActionData } from './$types';

	let { form }: { form: ActionData } = $props();
</script>

<svelte:head>
	<title>New post · Joseph Fernando</title>
	<meta name="robots" content="noindex, nofollow" />
</svelte:head>

<main class="wrap">
	<a class="back" href={resolve('/admin/posts')}>&larr; Posts</a>
	<h1>New post</h1>

	<form method="POST">
		<label for="title">Title</label>
		<input id="title" name="title" type="text" value={form?.title ?? ''} required />

		<label for="slug"
			>Slug <span class="hint">(optional, derived from title if left blank)</span></label
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
	/* A ground for the copy: the ASCII field runs behind every admin route
	   and body text can't sit straight on it, so each page is a hairline
	   panel in the same material as the login card. */
	.wrap {
		position: relative;
		width: 100%;
		max-width: 720px;
		margin: clamp(1.5rem, 5vh, 3rem) auto clamp(3rem, 8vh, 5rem);
		padding: clamp(1.75rem, 5vh, 2.5rem) clamp(1.25rem, 5vw, 2rem) 2.5rem;
		border: var(--rule) solid var(--line);
		border-radius: var(--radius-lg);
		background: color-mix(in srgb, var(--bg-raised) 90%, transparent);
		backdrop-filter: blur(4px);
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

	.hint {
		text-transform: none;
		letter-spacing: normal;
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

	button {
		margin-top: 1.2rem;
		align-self: flex-start;
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

	.error {
		font-family: var(--font-mono);
		font-size: var(--t-caption);
		letter-spacing: var(--t-track);
		text-transform: uppercase;
		color: var(--accent);
	}
</style>
