<!--
	Windows-95-style title bar controls: minimize / maximize / close, right
	aligned. Close is always wired up. Maximize is only actionable when a
	window opts in via `onMaximize` (windows stay draggable-but-not-resizable
	otherwise, so it renders disabled — visually present, not actionable).
	Minimize is never wired up.
-->
<script lang="ts">
	interface Props {
		title: string;
		onClose: () => void;
		onMaximize?: () => void;
		maximized?: boolean;
	}

	let { title, onClose, onMaximize, maximized = false }: Props = $props();
</script>

<div class="controls">
	<button type="button" class="btn" disabled aria-label={`Minimize ${title} window`}>
		<span class="glyph glyph--minimize"></span>
	</button>
	<button
		type="button"
		class="btn"
		class:btn--active={onMaximize}
		disabled={!onMaximize}
		onclick={onMaximize}
		aria-label={`${maximized ? 'Restore' : 'Maximize'} ${title} window`}
	>
		<span class="glyph glyph--maximize"></span>
	</button>
	<button
		type="button"
		class="btn btn--close"
		onclick={onClose}
		aria-label={`Close ${title} window`}
	>
		<span class="glyph glyph--close">×</span>
	</button>
</div>

<style>
	.controls {
		display: flex;
		gap: 0.7rem;
		margin-left: auto;
	}

	.btn {
		width: 1.3rem;
		height: 1.3rem;
		display: inline-flex;
		align-items: center;
		justify-content: center;
		border: 1.5px solid transparent;
		background: none;
		/* Inherited from the titlebar (see Window.svelte) — fades opposite the
		   titlebar's own background so the glyphs stay legible as the whole
		   bar fades from solid --fg toward --bg. */
		color: color-mix(in srgb, var(--bg) calc(var(--win-chrome, 1) * 100%), var(--fg));
		padding: 0;
		line-height: 1;
	}

	.btn:disabled {
		opacity: 0.5;
	}

	.btn--close,
	.btn--active {
		cursor: pointer;
	}

	.btn--close:hover,
	.btn--close:focus-visible,
	.btn--active:hover,
	.btn--active:focus-visible {
		background: var(--bg);
		color: var(--fg);
	}

	.btn:focus-visible {
		outline: 2px solid var(--bg);
		outline-offset: 2px;
	}

	.glyph {
		font-family: var(--font-mono);
		font-size: 0.95rem;
		font-weight: 700;
	}

	.glyph--minimize {
		width: 0.7rem;
		height: 2.5px;
		background: currentColor;
		align-self: flex-end;
		margin-bottom: 2px;
	}

	.glyph--maximize {
		width: 0.7rem;
		height: 0.7rem;
		border: 2px solid currentColor;
	}

	.glyph--close {
		transform: translateY(-1px);
	}
</style>
