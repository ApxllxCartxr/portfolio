<!--
	The gate, set as a page rather than a dialogue box.

	The old login was a floating card with its own chrome — the one surface on
	the site that looked like an app. Everything else here is type, hairlines
	and inversion, so the gate is too: a mono section label over a rule, a
	display-set title, one ruled entry line, and an inverted bar to pass
	through. The fresco behind it (see +layout.svelte) is the only decoration.
-->
<script lang="ts">
	import { enhance } from '$app/forms';
	import { resolve } from '$app/paths';
	import type { ActionData } from './$types';

	let { form }: { form: ActionData } = $props();

	let showPassword = $state(false);
	let capsOn = $state(false);
	let submitting = $state(false);

	function trackCaps(e: KeyboardEvent) {
		try {
			capsOn = e.getModifierState?.('CapsLock') ?? false;
		} catch {
			capsOn = false;
		}
	}
</script>

<svelte:head>
	<title>Admin · Joseph Fernando</title>
	<meta name="robots" content="noindex, nofollow" />
</svelte:head>

<main class="gate">
	<div class="plate">
		<h1>Restricted</h1>
		<p class="lead">This page needs a passphrase.</p>

		<form
			method="POST"
			use:enhance={() => {
				submitting = true;
				return async ({ update }) => {
					submitting = false;
					await update();
				};
			}}
		>
			<div class="field">
				<label for="password">Passphrase</label>
				<input
					id="password"
					name="password"
					type={showPassword ? 'text' : 'password'}
					autocomplete="current-password"
					placeholder="&mdash;"
					required
					disabled={submitting}
					aria-invalid={form?.error ? true : undefined}
					aria-describedby={form?.error ? 'admin-error' : undefined}
					onkeydown={trackCaps}
					onkeyup={trackCaps}
				/>
				<button
					type="button"
					class="peek"
					aria-pressed={showPassword}
					aria-controls="password"
					onclick={() => (showPassword = !showPassword)}
				>
					{showPassword ? 'Hide' : 'Show'}
				</button>
			</div>

			<div class="notes" aria-live="polite">
				{#if form?.error}
					<p class="note error" id="admin-error" role="alert">
						Incorrect passphrase &mdash; try again.
					</p>
				{:else if capsOn}
					<p class="note">Caps Lock is on</p>
				{:else}
					<p class="note quiet">Session lasts 30 days</p>
				{/if}
			</div>

			<button class="go" type="submit" disabled={submitting}>
				<span>{submitting ? 'Unlocking' : 'Unlock'}</span>
				<span class="rule" aria-hidden="true"></span>
				<span aria-hidden="true">&rarr;</span>
			</button>
		</form>

		<p class="foot"><a href={resolve('/')}>Back to the site</a></p>
	</div>
</main>

<style>
	.gate {
		box-sizing: border-box;
		min-height: calc(100dvh - 5rem);
		display: flex;
		align-items: center;
		padding: clamp(2rem, 8vh, 5rem) clamp(1.25rem, 5vw, 2.5rem);
	}

	/* No box. The left hairline is the only frame — the same rail language the
	   rest of the site uses to hang a column off. */
	.plate {
		width: 100%;
		max-width: 34rem;
		margin-inline: auto;
		border-left: var(--rule) solid var(--line);
		padding-left: clamp(1.25rem, 4vw, 2rem);
	}

	h1 {
		font-family: var(--font-display);
		font-size: var(--t-section);
		font-weight: 400;
		letter-spacing: -0.02em;
		margin: 0;
		color: var(--fg);
	}

	.lead {
		font-family: var(--font-serif);
		font-size: 1.1rem;
		line-height: 1.5;
		max-width: 32ch;
		margin: 0.4rem 0 2.2rem;
		color: var(--muted);
	}

	/* One ruled line, the way a form is printed rather than boxed. */
	.field {
		display: grid;
		grid-template-columns: auto 1fr auto;
		align-items: baseline;
		gap: 0.9rem;
		padding: 0.7rem 0.9rem 0.5rem;
		border-bottom: var(--rule) solid var(--fg);
		/* Translucent, not opaque: the fresco has to stay readable under the
		   entry line, but bare type over the dots was hard to track. */
		background: color-mix(in srgb, var(--bg-raised) 72%, transparent);
	}

	label,
	.peek {
		font-family: var(--font-mono);
		font-size: var(--t-caption);
		letter-spacing: var(--t-track);
		text-transform: uppercase;
		color: var(--muted);
	}

	input {
		min-width: 0;
		font-family: var(--font-mono);
		font-size: var(--t-body);
		letter-spacing: 0.08em;
		border: none;
		background: none;
		padding: 0;
		color: var(--fg);
		caret-color: var(--accent);
	}

	input::placeholder {
		color: var(--comment);
		opacity: 1;
	}

	input:focus {
		outline: none;
	}

	.field:focus-within {
		border-bottom-color: var(--accent-2);
	}

	.field:has(input[aria-invalid='true']) {
		border-bottom-color: var(--accent);
	}

	input:disabled {
		opacity: 0.6;
		cursor: wait;
	}

	.peek {
		background: none;
		border: none;
		padding: 0;
		cursor: pointer;
		text-decoration: underline;
		text-underline-offset: 4px;
		text-decoration-thickness: 1px;
	}

	.peek:hover,
	.peek:focus-visible {
		color: var(--accent);
	}

	/* Fixed height so the plate never jumps when the message changes. */
	.notes {
		min-height: 1.6rem;
		padding-top: 0.6rem;
	}

	.note {
		margin: 0;
		font-family: var(--font-mono);
		font-size: var(--t-caption);
		letter-spacing: var(--t-track);
		text-transform: uppercase;
		color: var(--muted);
	}

	.note.quiet {
		color: var(--comment);
	}

	.note.error {
		color: var(--accent);
	}

	/* The inversion the rest of the site uses to end a section. */
	.go {
		display: flex;
		align-items: center;
		gap: 0.9rem;
		width: 100%;
		margin-top: 1.2rem;
		padding: 0.85rem 1.1rem;
		border: var(--rule) solid var(--fg);
		background: var(--fg);
		color: var(--bg);
		font-family: var(--font-mono);
		font-size: var(--t-caption);
		letter-spacing: var(--t-track);
		text-transform: uppercase;
		text-align: left;
		cursor: pointer;
		transition:
			background 0.2s ease,
			color 0.2s ease;
	}

	.go .rule {
		flex: 1;
		height: var(--rule);
		background: currentColor;
		opacity: 0.4;
	}

	.go:hover:not(:disabled),
	.go:focus-visible:not(:disabled) {
		background: var(--bg);
		color: var(--fg);
	}

	.go:disabled {
		cursor: wait;
		opacity: 0.6;
	}

	.foot {
		margin: 1.6rem 0 0;
		padding-top: 0.9rem;
		border-top: var(--rule) solid var(--line);
		font-family: var(--font-mono);
		font-size: var(--t-caption);
		letter-spacing: var(--t-track);
		text-transform: uppercase;
		color: var(--muted);
	}

	.foot a {
		color: inherit;
		text-decoration: underline;
		text-underline-offset: 4px;
		text-decoration-thickness: 1px;
	}

	.foot a:hover,
	.foot a:focus-visible {
		color: var(--accent);
	}

	@media (prefers-reduced-motion: reduce) {
		.go {
			transition: none;
		}
	}
</style>
