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

	{#if hasClosedWindows}
		<button type="button" class="action" onclick={onRestore}> Restore windows </button>
	{/if}
</div>

<style>
	/* Docked like a Windows-95 taskbar to the bottom edge of the desktop
	   frame — pulled flush via negative margins matching .surface's padding
	   in Desktop.svelte — rather than floating as a top toggle row. */
	.controls {
		position: absolute;
		left: 0;
		right: 0;
		bottom: 0;
		display: flex;
		align-items: stretch;
		margin: 0 calc(-1 * clamp(1rem, 3vw, 2rem)) calc(-1 * clamp(1rem, 3vw, 2rem));
		border-top: 2px solid var(--fg);
		background: var(--bg);
		z-index: 40;
	}

	.swatches {
		display: flex;
	}

	.swatch {
		position: relative;
		width: 2.6rem;
		height: 2.6rem;
		padding: 0;
		border: none;
		border-right: 1.5px solid var(--fg);
		cursor: pointer;
		background: transparent;
	}

	.chip {
		display: block;
		width: 100%;
		height: 100%;
	}

	.swatch[aria-pressed='true']::after {
		content: '';
		position: absolute;
		left: 50%;
		bottom: 4px;
		width: 5px;
		height: 5px;
		background: var(--bg);
		box-shadow: 0 0 0 1px var(--fg);
		transform: translateX(-50%);
	}

	.action {
		margin-left: auto;
		display: flex;
		align-items: center;
		font-family: var(--font-mono);
		font-size: 0.75rem;
		padding: 0 0.9rem;
		border: none;
		border-left: 1.5px solid var(--fg);
		background: transparent;
		color: var(--fg);
		cursor: pointer;
	}

	.action:hover,
	.action:focus-visible {
		background: var(--fg);
		color: var(--bg);
	}

	button:focus-visible {
		outline: 2px solid var(--focus-ring);
		outline-offset: -2px;
	}
</style>
