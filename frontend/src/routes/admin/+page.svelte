<script lang="ts">
	import type { ActionData } from './$types';

	let { form }: { form: ActionData } = $props();
</script>

<svelte:head>
	<title>Admin — Joseph Fernando</title>
</svelte:head>

<main class="wrap">
	<h1>Admin</h1>
	<form method="POST">
		<label for="password">Password</label>
		<input id="password" name="password" type="password" autocomplete="current-password" required />
		{#if form?.error}<p class="error">{form.error}</p>{/if}
		<button type="submit">Log in</button>
	</form>
</main>

<style>
	.wrap {
		max-width: 320px;
		margin: 4rem auto;
		padding: 0 1.25rem;
		color: var(--fg);
	}

	h1 {
		font-family: var(--font-title);
		font-size: 1.6rem;
		margin: 0 0 1.5rem;
	}

	form {
		display: flex;
		flex-direction: column;
		gap: 0.6rem;
	}

	label {
		font-family: var(--font-mono);
		font-size: 0.78rem;
		opacity: 0.7;
	}

	input {
		font-family: var(--font-body);
		font-size: 1rem;
		padding: 0.5rem 0.6rem;
		border: 1px solid var(--fg);
		background: var(--bg);
		color: var(--fg);
	}

	button {
		margin-top: 0.6rem;
		font-family: var(--font-mono);
		font-size: 0.85rem;
		padding: 0.55rem;
		border: 1px solid var(--fg);
		background: var(--fg);
		color: var(--bg);
		cursor: pointer;
	}

	.error {
		font-family: var(--font-mono);
		font-size: 0.8rem;
		color: var(--accent);
		margin: 0;
	}
</style>
