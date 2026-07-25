<script lang="ts">
	import { THEMES, THEME_COLORS, THEME_LABELS, themeState, setTheme } from '$lib/theme.svelte';

	interface Props {
		onRestore: () => void;
		hasClosedWindows: boolean;
	}

	let { onRestore, hasClosedWindows }: Props = $props();
</script>

<div class="controls" role="group" aria-label="Appearance">
	<div class="swatches" role="group" aria-label="Theme">
		{#each THEMES as name (name)}
			{@const [c1, c2] = THEME_COLORS[name]}
			<button
				type="button"
				class="swatch"
				aria-pressed={themeState.theme === name}
				aria-label={THEME_LABELS[name]}
				onclick={() => setTheme(name)}
			>
				<span class="chip" style={`background: conic-gradient(${c1} 0 50%, ${c2} 50% 100%)`}></span>
			</button>
		{/each}
	</div>

	<button type="button" class="action" disabled={!hasClosedWindows} onclick={onRestore}>
		Restore windows
	</button>
</div>

<style>
	.controls {
		position: relative;
		display: flex;
		flex-wrap: wrap;
		align-items: center;
		gap: 0.6rem;
		margin-bottom: 1.25rem;
	}

	.swatches {
		display: flex;
		gap: 0.4rem;
	}

	.swatch {
		width: 1.5rem;
		height: 1.5rem;
		padding: 0;
		border-radius: 50%;
		border: 1.5px solid var(--fg);
		cursor: pointer;
		background: transparent;
	}

	.chip {
		display: block;
		width: 100%;
		height: 100%;
		border-radius: 50%;
	}

	.swatch[aria-pressed='true'] {
		outline: 2px solid var(--fg);
		outline-offset: 2px;
	}

	.action {
		font-family: var(--font-body);
		font-size: 0.75rem;
		padding: 0.35rem 0.7rem;
		border: 1.5px solid var(--fg);
		background: transparent;
		color: var(--fg);
		cursor: pointer;
	}

	.action:disabled {
		cursor: not-allowed;
		opacity: 0.4;
	}

	button:focus-visible {
		outline: 2px solid var(--focus-ring);
		outline-offset: 2px;
	}
</style>
