<!--
	Big-square grid that drifts continuously toward the upper-left. Rendered as
	one tiled SVG pattern sized larger than its container and animated purely
	with a CSS transform loop (GPU-composited, no JS per frame). The tile repeats
	seamlessly because the drift distance equals one cell.
-->
<script lang="ts">
	const CELL = 72;
</script>

<div class="grid-layer" aria-hidden="true" style="--cell: {CELL}px; inset: -{CELL}px">
	<svg width="100%" height="100%">
		<defs>
			<pattern id="grid-squares" width={CELL} height={CELL} patternUnits="userSpaceOnUse">
				<rect width={CELL} height={CELL} fill="none" stroke="var(--grid-line)" stroke-width="1" />
			</pattern>
		</defs>
		<rect width="100%" height="100%" fill="url(#grid-squares)" />
	</svg>
</div>

<style>
	.grid-layer {
		position: absolute;
		animation: drift 12s linear infinite;
		will-change: transform;
	}

	.grid-layer svg {
		display: block;
		width: 100%;
		height: 100%;
	}

	@keyframes drift {
		from {
			transform: translate(0, 0);
		}
		to {
			transform: translate(calc(-1 * var(--cell)), calc(-1 * var(--cell)));
		}
	}

	@media (prefers-reduced-motion: reduce) {
		.grid-layer {
			animation: none;
		}
	}
</style>
