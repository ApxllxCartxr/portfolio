<!--
	Windows-95-style title bar controls: minimize / maximize / close, right
	aligned. Only close is wired up — windows stay draggable-but-not-resizable,
	so minimize/maximize render as disabled (visually present, not actionable).
-->
<script lang="ts">
	interface Props {
		title: string;
		onClose: () => void;
	}

	let { title, onClose }: Props = $props();
</script>

<div class="controls">
	<button type="button" class="btn" disabled aria-label={`Minimize ${title} window`}>
		<span class="glyph glyph--minimize"></span>
	</button>
	<button type="button" class="btn" disabled aria-label={`Maximize ${title} window`}>
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
		gap: 0.55rem;
		margin-left: auto;
	}

	.btn {
		width: 0.9rem;
		height: 0.9rem;
		display: inline-flex;
		align-items: center;
		justify-content: center;
		border: none;
		background: none;
		color: var(--bg);
		padding: 0;
		line-height: 1;
	}

	.btn:disabled {
		opacity: 0.45;
	}

	.btn--close {
		cursor: pointer;
	}

	.btn--close:hover,
	.btn--close:focus-visible {
		opacity: 0.6;
	}

	.btn:focus-visible {
		outline: 2px solid var(--bg);
		outline-offset: 2px;
	}

	.glyph {
		font-family: var(--font-mono);
		font-size: 0.7rem;
	}

	.glyph--minimize {
		width: 0.5rem;
		height: 1px;
		background: currentColor;
		align-self: flex-end;
		margin-bottom: 1px;
	}

	.glyph--maximize {
		width: 0.5rem;
		height: 0.5rem;
		border: 1px solid currentColor;
	}

	.glyph--close {
		transform: translateY(-1px);
	}
</style>
