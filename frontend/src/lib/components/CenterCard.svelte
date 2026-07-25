<script lang="ts">
	import { toggleSwap } from '$lib/theme.svelte';
</script>

<button
	type="button"
	class="name-card"
	onclick={toggleSwap}
	aria-label="Joseph Fernando — click to swap the theme colors"
>
	<span class="intro">hi i'm</span>
	<span class="name">
		Joseph<br />
		Fernando <span class="accent">*</span>
	</span>
</button>

<style>
	.name-card {
		display: flex;
		flex-direction: column;
		align-items: flex-start;
		gap: 0.3rem;
		width: 100%;
		background: none;
		border: none;
		padding: 0;
		cursor: pointer;
		color: var(--fg);
		text-align: left;
	}

	.name-card:focus-visible {
		outline: 2px solid var(--focus-ring);
		outline-offset: 4px;
	}

	.intro {
		font-family: var(--font-hand);
		font-size: 1.4rem;
	}

	.name {
		font-family: var(--font-display);
		font-size: clamp(1.6rem, 6vw, 2.1rem);
		line-height: 1.05;
		font-weight: 700;
	}

	.accent {
		color: var(--accent);
		font-family: var(--font-redaction-clear);
	}
</style>
