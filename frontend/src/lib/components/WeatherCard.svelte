<script lang="ts">
	import { onMount } from 'svelte';
	import Icon from './Icon.svelte';
	import { describeWeatherCode } from '$lib/weather';

	// Colombo — used when geolocation is unavailable or denied, so the card
	// always has something to show.
	const FALLBACK = { lat: 6.9271, lon: 79.8612, label: 'Colombo' };

	let status = $state<'loading' | 'ready' | 'error'>('loading');
	let temp = $state<number | null>(null);
	let code = $state<number | null>(null);
	let locationLabel = $state('');

	let weather = $derived(code !== null ? describeWeatherCode(code) : null);

	async function loadWeather(lat: number, lon: number) {
		try {
			const url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,weather_code&timezone=auto`;
			const res = await fetch(url);
			if (!res.ok) throw new Error('weather request failed');
			const data = await res.json();
			temp = Math.round(data.current.temperature_2m);
			code = data.current.weather_code;
			status = 'ready';
		} catch {
			status = 'error';
		}
	}

	onMount(() => {
		if (!('geolocation' in navigator)) {
			locationLabel = FALLBACK.label;
			loadWeather(FALLBACK.lat, FALLBACK.lon);
			return;
		}
		navigator.geolocation.getCurrentPosition(
			(pos) => {
				locationLabel = 'My location';
				loadWeather(pos.coords.latitude, pos.coords.longitude);
			},
			() => {
				locationLabel = FALLBACK.label;
				loadWeather(FALLBACK.lat, FALLBACK.lon);
			},
			{ timeout: 8000 }
		);
	});
</script>

<div class="weather" aria-live="polite">
	{#if status === 'loading'}
		<p class="status">Loading weather…</p>
	{:else if status === 'error'}
		<p class="status">Weather unavailable</p>
	{:else if weather}
		<div class="row">
			<Icon name={weather.icon} size={34} />
			<span class="temp">{temp}°C</span>
		</div>
		<p class="label">{weather.label}</p>
		<p class="place">{locationLabel}</p>
	{/if}
</div>

<style>
	.weather {
		display: flex;
		flex-direction: column;
		gap: 0.35rem;
		font-family: var(--font-mono);
	}

	.row {
		display: flex;
		align-items: center;
		gap: 0.6rem;
	}

	.temp {
		font-size: 2.6rem;
		font-weight: 700;
		line-height: 1;
	}

	.label {
		font-size: 1.2rem;
		font-weight: 700;
	}

	.place {
		font-size: 0.9rem;
		font-weight: 500;
		opacity: 0.75;
	}

	.status {
		font-size: 1.1rem;
		font-weight: 700;
	}
</style>
