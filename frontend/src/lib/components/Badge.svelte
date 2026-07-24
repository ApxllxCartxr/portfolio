<script lang="ts">
	interface Props {
		label: string;
		invert?: boolean;
	}

	let { label, invert = false }: Props = $props();
</script>

<span class="badge" class:badge--invert={invert}>{label}</span>

<style>
	.badge {
		display: inline-flex;
		align-items: center;
		padding: 0.22rem 0.55rem;
		border-radius: 6px;
		font-size: 0.82rem;
		font-weight: 500;
		line-height: 1;
		white-space: nowrap;
		color: var(--pill-text);
		background: transparent;
		border: 1px solid var(--pill-border);
		transition: background 0.15s ease;
		/* deliberately no shadow / no glow */
	}
	.badge:not(.badge--invert):hover {
		background: color-mix(in srgb, var(--pill-border) 16%, transparent);
	}

	.badge--invert {
		color: var(--accent-fg);
		background: var(--accent);
		border-color: transparent;
	}
</style>
