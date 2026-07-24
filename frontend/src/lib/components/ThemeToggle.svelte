<script lang="ts">
	import { onMount } from 'svelte';

	let theme = $state<'light' | 'dark'>('light');

	onMount(() => {
		theme = (document.documentElement.dataset.theme as 'light' | 'dark') ?? 'light';
	});

	function toggle() {
		theme = theme === 'dark' ? 'light' : 'dark';
		document.documentElement.dataset.theme = theme;
		try {
			localStorage.setItem('theme', theme);
		} catch {
			// storage may be unavailable (private mode) — non-fatal
		}
	}
</script>

<button
	type="button"
	class="toggle"
	onclick={toggle}
	aria-label="Switch to {theme === 'dark' ? 'light' : 'dark'} theme"
	title="Toggle theme"
>
	{#if theme === 'dark'}
		<!-- sun -->
		<svg
			viewBox="0 0 24 24"
			width="17"
			height="17"
			fill="none"
			stroke="currentColor"
			stroke-width="2"
			stroke-linecap="round"
			stroke-linejoin="round"
		>
			<circle cx="12" cy="12" r="4" />
			<path
				d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41"
			/>
		</svg>
	{:else}
		<!-- moon -->
		<svg
			viewBox="0 0 24 24"
			width="17"
			height="17"
			fill="none"
			stroke="currentColor"
			stroke-width="2"
			stroke-linecap="round"
			stroke-linejoin="round"
		>
			<path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z" />
		</svg>
	{/if}
</button>

<style>
	.toggle {
		position: fixed;
		top: 1rem;
		right: 1rem;
		z-index: 10;
		display: inline-flex;
		align-items: center;
		justify-content: center;
		width: 2.4rem;
		height: 2.4rem;
		border-radius: 999px;
		color: var(--text);
		background: color-mix(in srgb, var(--sheet) 82%, transparent);
		border: 1px solid var(--rule);
		backdrop-filter: blur(8px);
		cursor: pointer;
		transition:
			background 0.15s ease,
			transform 0.15s ease;
	}
	.toggle:hover {
		background: var(--sheet);
		transform: translateY(-1px);
	}
</style>
