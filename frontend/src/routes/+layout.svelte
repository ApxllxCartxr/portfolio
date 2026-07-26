<script lang="ts">
	import '../app.css';
	import { onNavigate } from '$app/navigation';

	let { children } = $props();

	// Morphs named elements (e.g. the Blog window ↔ its full-page chrome, see
	// PageWindow.svelte) across navigations instead of a hard cut. No-ops on
	// browsers without View Transitions support (e.g. Firefox) — navigation
	// still works, just without the morph.
	onNavigate((navigation) => {
		if (!document.startViewTransition) return;
		return new Promise((resolve) => {
			const transition = document.startViewTransition(async () => {
				resolve();
				await navigation.complete;
			});
			// Chrome rejects `.ready`/`.finished` with InvalidStateError when a
			// transition is superseded by another before it settles (e.g.
			// navigating again while the previous morph is still animating) —
			// the navigation itself still completes fine, so this is only ever
			// silencing an otherwise-uncaught rejection, not masking a real bug.
			transition.finished.catch(() => {});
		});
	});
</script>

{@render children()}
