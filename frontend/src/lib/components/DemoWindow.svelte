<!--
	Modal window for inline demos — the one piece of the old desktop shell the
	scrolling homepage keeps: 1px border, inverted titlebar, close button.
	Native <dialog> so Esc and focus trapping come for free; mount it behind an
	{#if} so the demo inside only starts running once it's actually open.
-->
<script lang="ts">
	import type { Snippet } from 'svelte';

	interface Props {
		title: string;
		onClose: () => void;
		children: Snippet;
	}

	let { title, onClose, children }: Props = $props();

	let dialogEl = $state<HTMLDialogElement>();

	$effect(() => {
		dialogEl?.showModal();
		// Lenis drives the page from window wheel events, which the dialog's
		// modal state doesn't intercept — lock the document instead so the page
		// doesn't scroll underneath the open window.
		const html = document.documentElement;
		const previous = html.style.overflow;
		html.style.overflow = 'hidden';
		return () => {
			html.style.overflow = previous;
		};
	});
</script>

<dialog
	bind:this={dialogEl}
	class="window"
	aria-label="{title} demo"
	oncancel={(event) => {
		// Close through the parent's {#if} only, so there's a single teardown
		// path whether it's Esc or the button.
		event.preventDefault();
		onClose();
	}}
>
	<div class="titlebar">
		<span class="title">{title}</span>
		<button type="button" class="close" onclick={onClose} aria-label="Close {title} window"
			>×</button
		>
	</div>
	<div class="content">
		{@render children()}
	</div>
</dialog>

<style>
	.window {
		width: min(760px, 92vw);
		max-height: 88vh;
		margin: auto;
		padding: 0;
		border: 1px solid var(--line);
		border-radius: var(--radius-lg);
		background: var(--bg-raised);
		color: var(--fg);
		overflow: hidden;
	}

	.window::backdrop {
		background: var(--scrim);
	}

	.titlebar {
		display: flex;
		align-items: center;
		gap: 0.6rem;
		padding: 0.5rem 0.6rem 0.5rem 0.9rem;
		border-bottom: 1px solid var(--line);
		background: var(--bg);
		color: var(--muted);
		font-family: var(--font-mono);
		font-size: 0.7rem;
		letter-spacing: 0.08em;
		text-transform: uppercase;
	}

	.title {
		user-select: none;
		-webkit-user-select: none;
	}

	.close {
		margin-left: auto;
		width: 1.4rem;
		height: 1.4rem;
		display: inline-flex;
		align-items: center;
		justify-content: center;
		border: none;
		background: none;
		color: inherit;
		font-size: 1.1rem;
		line-height: 1;
		cursor: pointer;
	}

	.close:hover,
	.close:focus-visible {
		color: var(--fg);
	}

	.content {
		padding: 1rem;
		max-height: calc(88vh - 2.4rem);
		overflow-y: auto;
	}
</style>
