<script lang="ts">
	import type { ActionData } from './$types';

	let { form }: { form: ActionData } = $props();
</script>

<svelte:head>
	<title>Admin · Joseph Fernando</title>
</svelte:head>

<main class="wrap">
	<div class="card">
		<h1>Admin</h1>
		<form method="POST">
			<label for="password">Password</label>
			<input
				id="password"
				name="password"
				type="password"
				autocomplete="current-password"
				required
			/>
			{#if form?.error}<p class="error">{form.error}</p>{/if}
			<button type="submit">Log in</button>
		</form>
	</div>
</main>

<style>
	.wrap {
		min-height: calc(100dvh - 5rem);
		display: flex;
		align-items: center;
		justify-content: center;
		padding: 2rem 1.25rem;
	}

	.card {
		width: 100%;
		max-width: 320px;
		padding: 1.75rem;
		border: var(--rule) solid var(--line);
		border-radius: var(--radius-lg);
		background: var(--bg-raised);
		color: var(--fg);
	}

	h1 {
		font-family: var(--font-title);
		font-size: 1.2rem;
		font-weight: 600;
		margin: 0 0 1.25rem;
	}

	form {
		display: flex;
		flex-direction: column;
		gap: 0.6rem;
	}

	label {
		font-family: var(--font-mono);
		font-size: var(--t-caption);
		letter-spacing: var(--t-track);
		text-transform: uppercase;
		color: var(--muted);
	}

	input {
		font-family: var(--font-body);
		font-size: var(--t-body);
		padding: 0.55rem 0.65rem;
		border: var(--rule) solid var(--line);
		border-radius: var(--radius);
		background: var(--bg);
		color: var(--fg);
	}

	button {
		margin-top: 0.6rem;
		font-family: var(--font-mono);
		font-size: var(--t-caption);
		letter-spacing: var(--t-track);
		text-transform: uppercase;
		padding: 0.6rem;
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
		margin: 0;
	}
</style>
