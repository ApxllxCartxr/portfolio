<script lang="ts">
	import { onDestroy, onMount } from 'svelte';

	let now = $state(new Date());
	let timer: ReturnType<typeof setInterval> | undefined;

	const dayFormatter = new Intl.DateTimeFormat(undefined, { weekday: 'long' });
	const dateFormatter = new Intl.DateTimeFormat(undefined, {
		month: 'long',
		day: 'numeric',
		year: 'numeric'
	});
	const timeFormatter = new Intl.DateTimeFormat(undefined, { hour: '2-digit', minute: '2-digit' });

	let day = $derived(dayFormatter.format(now));
	let dateLabel = $derived(dateFormatter.format(now));
	let time = $derived(timeFormatter.format(now));

	onMount(() => {
		timer = setInterval(() => {
			now = new Date();
		}, 30_000);
	});

	onDestroy(() => {
		if (timer) clearInterval(timer);
	});
</script>

<div class="clock">
	<p class="day">{day}</p>
	<p class="date" aria-live="polite">{dateLabel}</p>
	<p class="time" aria-hidden="true">{time}</p>
</div>

<style>
	.clock {
		display: flex;
		flex-direction: column;
		gap: 0.25rem;
		font-family: var(--font-mono);
	}

	.day {
		font-size: 1.8rem;
		font-weight: 700;
	}

	.date {
		font-size: 1.2rem;
		font-weight: 700;
	}

	.time {
		font-size: 1.4rem;
		font-weight: 700;
		opacity: 0.8;
	}
</style>
