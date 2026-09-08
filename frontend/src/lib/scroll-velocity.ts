/*
	Drives a running CSS animation's playbackRate from scroll velocity.

	Scrolling down runs the animation faster, scrolling up runs it backwards,
	and it eases back to its resting speed once the page settles. Both
	marquees on the homepage — the horizontal availability band and the
	vertical scroll rail — are the same idea at different angles, so the loop
	lives here instead of in either of them.

	No runes: this is a plain rAF loop over one Animation, called from an
	$effect that owns its lifetime.
*/

interface Options {
	/** Cap on |playbackRate|, in units of the resting speed. */
	maxRate?: number;
	/** px/ms of scroll that maps to one extra unit of rate. ~1.6 px/ms is a
	 *  brisk wheel flick, so a hard scroll lands near the cap. */
	pxPerMs?: number;
	/** Per-frame pull back toward rest. Low enough that the line coasts for a
	 *  moment after the page stops, which is the part that reads as inertia. */
	ease?: number;
}

/** Returns a cleanup that detaches the listener and restores rate 1. */
export function driveWithScrollVelocity(anim: Animation, options: Options = {}): () => void {
	const { maxRate = 9, pxPerMs = 0.22, ease = 0.055 } = options;

	let rate = 1;
	let target = 1;
	let lastY = window.scrollY;
	let lastT = performance.now();
	let frame = 0;

	const tick = () => {
		rate += (target - rate) * ease;
		// Nothing new from the scroll listener means the page has settled;
		// let the target fall back to resting speed on its own.
		target += (1 - target) * ease;
		anim.playbackRate = rate;

		if (Math.abs(rate - 1) < 0.01 && Math.abs(target - 1) < 0.01) {
			anim.playbackRate = 1;
			frame = 0;
			return;
		}
		frame = requestAnimationFrame(tick);
	};

	const onScroll = () => {
		const now = performance.now();
		const dt = now - lastT;
		if (dt <= 0) return;

		const dy = window.scrollY - lastY;
		lastY = window.scrollY;
		lastT = now;

		const boost = Math.min(Math.abs(dy / dt) / pxPerMs, maxRate - 1);
		// Direction carries the sign: scrolling up runs the line backwards.
		target = (1 + boost) * (dy < 0 ? -1 : 1);

		if (!frame) frame = requestAnimationFrame(tick);
	};

	window.addEventListener('scroll', onScroll, { passive: true });

	return () => {
		window.removeEventListener('scroll', onScroll);
		if (frame) cancelAnimationFrame(frame);
		anim.playbackRate = 1;
	};
}
