<!--
	Fixed, full-viewport grid with pronounced "+" marks at each intersection
	(reference Image #1). Colours come from the theme tokens, so it recolours
	with the light/dark toggle. Rendered as one tiled SVG pattern — cheap to paint.
-->
<div class="grid" aria-hidden="true">
	<svg width="100%" height="100%">
		<defs>
			<pattern id="grid-plus" width="72" height="72" patternUnits="userSpaceOnUse">
				<!-- faint connecting lines through the tile centre -->
				<path d="M36 0V72 M0 36H72" fill="none" stroke="var(--grid-line)" stroke-width="1" />
				<!-- pronounced plus mark on the intersection -->
				<path
					d="M28 36H44 M36 28V44"
					stroke="var(--grid-plus)"
					stroke-width="1.6"
					stroke-linecap="square"
				/>
			</pattern>
		</defs>
		<rect width="100%" height="100%" fill="url(#grid-plus)" />
	</svg>
</div>

<style>
	.grid {
		position: fixed;
		inset: 0;
		z-index: -1;
		pointer-events: none;
		background: var(--bg);
	}
	.grid svg {
		display: block;
	}
</style>
