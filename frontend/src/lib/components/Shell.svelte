<!--
	A thin ink shell around the viewport: the page sits inside a rounded
	window rather than running off the edges of the screen. Same ink as the
	availability band and the closing slab, so the frame reads as part of the
	page's one material rather than browser chrome.

	How it's drawn: an inset rounded rectangle with an enormous spread
	shadow. The shadow follows the border radius, so everything outside the
	rounded window fills with ink and the corners come out curved — a border
	alone would leave square ink corners with cream showing through the arc.

	It sits above the page and takes no pointer events, so content scrolls
	behind it the way a mat sits over a print.
-->
<div class="shell" aria-hidden="true"></div>

<style>
	.shell {
		position: fixed;
		inset: var(--shell-w);
		z-index: 35;
		border-radius: var(--shell-radius);
		box-shadow: 0 0 0 100vmax var(--fg);
		pointer-events: none;
	}

	@media print {
		.shell {
			display: none;
		}
	}
</style>
