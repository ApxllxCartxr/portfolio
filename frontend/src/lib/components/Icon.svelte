<script lang="ts">
	import type { IconName } from '$lib/icon-names';

	interface Props {
		name: IconName;
		size?: number;
	}

	let { name, size = 15 }: Props = $props();

	// Lucide-style stroke paths on a 24x24 viewBox.
	const paths: Record<IconName, string> = {
		sun: '<circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41"/>',
		cloud: '<path d="M17.5 19H9a7 7 0 1 1 6.71-9h.79a4.5 4.5 0 1 1 0 9Z"/>',
		'cloud-sun':
			'<path d="M12 2v1M4.22 4.22l.71.71M2 10h1M20.66 5l-.71.71M18.5 10a4.5 4.5 0 0 0-8.62-1.83A5 5 0 0 0 9 18h9a3.5 3.5 0 0 0 .5-6.96"/>',
		'cloud-rain':
			'<path d="M16 13v8M8 13v8M12 15v8M17 8.5A4.5 4.5 0 0 0 12.5 4a5 5 0 0 0-9.44 2.06A4 4 0 0 0 4 14h13a3.5 3.5 0 0 0 0-7c-.06 0-.13 0-.19.01"/>',
		'cloud-snow':
			'<path d="M8 15h.01M8 19h.01M12 17h.01M12 21h.01M16 15h.01M16 19h.01M17 8.5A4.5 4.5 0 0 0 12.5 4a5 5 0 0 0-9.44 2.06A4 4 0 0 0 4 14h13a3.5 3.5 0 0 0 0-7c-.06 0-.13 0-.19.01"/>',
		'cloud-lightning':
			'<path d="M6 16.326A4.5 4.5 0 0 1 7.5 8h.5a5 5 0 0 1 9.5 2.5A4 4 0 0 1 17 18H8"/><path d="m13 12-3 5h4l-3 5"/>',
		'cloud-fog':
			'<path d="M16.5 13a4.5 4.5 0 0 0-8.62-1.83A4 4 0 0 0 5 19h13a3.5 3.5 0 0 0 .5-6.96M3 22h18M5 18h14"/>',
		wind: '<path d="M12.8 19.6A2 2 0 1 0 14 16H2M17.5 8a2.5 2.5 0 1 1 2 4H2M9.8 4.4A2 2 0 1 1 11 8H2"/>'
	};
</script>

<svg
	width={size}
	height={size}
	viewBox="0 0 24 24"
	fill="none"
	stroke="currentColor"
	stroke-width="2"
	stroke-linecap="round"
	stroke-linejoin="round"
	aria-hidden="true"
	focusable="false"
>
	<!-- eslint-disable-next-line svelte/no-at-html-tags -->
	{@html paths[name]}
</svg>
