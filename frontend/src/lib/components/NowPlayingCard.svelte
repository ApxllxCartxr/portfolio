<script lang="ts">
	import { onDestroy, onMount } from 'svelte';

	const TRACK = { title: 'Weird Fishes/Arpeggi', artist: 'Radiohead', duration: 305 };

	let elapsed = $state(0);
	let timer: ReturnType<typeof setInterval> | undefined;

	function formatTime(seconds: number) {
		const m = Math.floor(seconds / 60);
		const s = Math.floor(seconds % 60);
		return `${m}:${String(s).padStart(2, '0')}`;
	}

	let pct = $derived((elapsed / TRACK.duration) * 100);

	onMount(() => {
		const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
		if (reduceMotion) {
			elapsed = Math.floor(TRACK.duration * 0.35);
			return;
		}
		timer = setInterval(() => {
			elapsed = elapsed + 1 >= TRACK.duration ? 0 : elapsed + 1;
		}, 1000);
	});

	onDestroy(() => {
		if (timer) clearInterval(timer);
	});
</script>

<div class="now-playing" aria-live="off">
	<div class="row">
		<svg class="art" viewBox="0 0 64 64" role="img" aria-label="Album art">
			<rect x="0.5" y="0.5" width="63" height="63" fill="var(--bg)" stroke="var(--fg)" />
			<circle cx="32" cy="32" r="22" fill="none" stroke="var(--fg)" stroke-width="1.5" />
			<circle cx="32" cy="32" r="14" fill="none" stroke="var(--accent)" stroke-width="1.5" />
			<circle cx="32" cy="32" r="4" fill="var(--fg)" />
		</svg>
		<div class="meta">
			<p class="title">{TRACK.title}</p>
			<p class="artist">{TRACK.artist}</p>
		</div>
	</div>
	<div class="track-progress">
		<div class="fill" style={`width: ${pct}%`}></div>
	</div>
	<p class="time">{formatTime(elapsed)} / {formatTime(TRACK.duration)}</p>
</div>

<style>
	.now-playing {
		display: flex;
		flex-direction: column;
		gap: 0.5rem;
		font-family: var(--font-mono);
	}

	.row {
		display: flex;
		align-items: center;
		gap: 0.6rem;
	}

	.art {
		width: 3.5rem;
		height: 3.5rem;
		flex-shrink: 0;
	}

	.meta {
		display: flex;
		flex-direction: column;
		gap: 0.15rem;
		min-width: 0;
	}

	.title {
		font-size: 1.1rem;
		font-weight: 700;
		white-space: nowrap;
		overflow: hidden;
		text-overflow: ellipsis;
	}

	.artist {
		font-size: 0.9rem;
		font-weight: 500;
		opacity: 0.75;
		white-space: nowrap;
		overflow: hidden;
		text-overflow: ellipsis;
	}

	.track-progress {
		height: 3px;
		background: color-mix(in srgb, var(--fg) 25%, transparent);
	}

	.fill {
		height: 100%;
		background: var(--fg);
	}

	.time {
		font-size: 0.8rem;
		font-weight: 500;
		opacity: 0.75;
	}
</style>
