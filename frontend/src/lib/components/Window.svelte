<!--
	Reusable window chrome: sharp edges, sheet-coloured surface (occludes the
	grid behind it), Windows-95-style title bar controls. Draggable on desktop
	via GSAP (bounded to the desktop panel); on mobile it renders as a static
	stacked card instead — dragging fights scroll on touch.
-->
<script lang="ts">
	import { onDestroy, onMount } from 'svelte';
	import { browser } from '$app/environment';
	import type { Snippet } from 'svelte';
	import WindowControls from './WindowControls.svelte';

	interface Props {
		title: string;
		x: number;
		y: number;
		order?: number;
		boundsEl: HTMLElement | undefined;
		zIndex: number;
		onClose: () => void;
		onFront: () => void;
		size?: 'primary' | 'compact';
		scrollCue?: boolean;
		children?: Snippet;
	}

	let {
		title,
		x,
		y,
		order = 0,
		boundsEl,
		zIndex,
		onClose,
		onFront,
		size = 'compact',
		scrollCue = false,
		children
	}: Props = $props();

	let windowEl = $state<HTMLElement>();
	let titlebarEl = $state<HTMLElement>();
	let contentEl = $state<HTMLElement>();
	let canScrollMore = $state(false);
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	let gsapRef: any;
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	let draggable: any;

	const STEP = 16;
	const DESKTOP_QUERY = '(min-width: 701px)';

	onMount(() => {
		if (!browser || !windowEl || !titlebarEl || !boundsEl) return;
		let cancelled = false;

		(async () => {
			const isDesktop = window.matchMedia(DESKTOP_QUERY).matches;
			const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
			if (!isDesktop) return;

			const { gsap } = await import('gsap');
			const { Draggable } = await import('gsap/Draggable');
			if (cancelled || !windowEl || !titlebarEl || !boundsEl) return;

			gsap.registerPlugin(Draggable);
			gsapRef = gsap;
			[draggable] = Draggable.create(windowEl, {
				type: 'x,y',
				trigger: titlebarEl,
				bounds: boundsEl,
				inertia: false,
				onPress: () => onFront()
			});

			if (!reduceMotion) {
				gsap.from(windowEl, {
					autoAlpha: 0,
					y: 8,
					scale: 0.98,
					duration: 0.35,
					ease: 'power2.out'
				});
			}
		})();

		return () => {
			cancelled = true;
		};
	});

	onDestroy(() => {
		draggable?.kill();
	});

	// Overflow-aware scroll cue: only relevant when `scrollCue` is set (the
	// center window), and only visible once content actually exceeds the
	// scrollable area — a static hint would be misleading on short content.
	$effect(() => {
		if (!scrollCue || !browser || !contentEl) return;
		const el = contentEl;

		const update = () => {
			canScrollMore = el.scrollHeight - el.clientHeight - el.scrollTop > 4;
		};
		update();

		el.addEventListener('scroll', update);
		const resizeObserver = new ResizeObserver(update);
		resizeObserver.observe(el);

		return () => {
			el.removeEventListener('scroll', update);
			resizeObserver.disconnect();
		};
	});

	function nudge(dx: number, dy: number) {
		if (!draggable || !gsapRef || !windowEl) return;
		const nx = (draggable.x ?? 0) + dx;
		const ny = (draggable.y ?? 0) + dy;
		gsapRef.set(windowEl, { x: nx, y: ny });
		draggable.update();
	}

	function handleKeydown(event: KeyboardEvent) {
		const deltas: Record<string, [number, number]> = {
			ArrowUp: [0, -STEP],
			ArrowDown: [0, STEP],
			ArrowLeft: [-STEP, 0],
			ArrowRight: [STEP, 0]
		};
		const delta = deltas[event.key];
		if (!delta) return;
		event.preventDefault();
		onFront();
		nudge(delta[0], delta[1]);
	}
</script>

<div class="anchor" style={`left: ${x}%; top: ${y}%; --order: ${order}; z-index: ${zIndex};`}>
	<!-- Custom draggable window widget: focusable + keyboard-nudgeable as a
	     keyboard-accessible alternative to mouse drag, so it intentionally
	     carries tabindex and key/pointer handlers despite being a <section>. -->
	<!-- svelte-ignore a11y_no_noninteractive_tabindex -->
	<!-- svelte-ignore a11y_no_noninteractive_element_interactions -->
	<section
		class="window {size}"
		bind:this={windowEl}
		aria-label={title}
		tabindex="0"
		onkeydown={handleKeydown}
		onpointerdown={onFront}
	>
		<header class="titlebar" bind:this={titlebarEl}>
			<WindowControls {title} {onClose} />
		</header>
		<div class="content" class:scrollable={scrollCue} bind:this={contentEl}>
			{@render children?.()}
		</div>
		{#if scrollCue && canScrollMore}
			<div class="scroll-cue" aria-hidden="true">
				<span class="chevron">⌄</span>
			</div>
		{/if}
	</section>
</div>

<style>
	.anchor {
		position: absolute;
		transform: translate(-50%, -50%);
	}

	.window {
		position: relative;
		background: var(--bg);
		border: 1px solid var(--fg);
		width: min(420px, 85vw);
	}

	.window.primary {
		width: min(600px, 92vw);
	}

	.window.compact {
		width: min(280px, 75vw);
	}

	.titlebar {
		display: flex;
		align-items: center;
		padding: 0.5rem 0.6rem;
		background: var(--fg);
		cursor: grab;
		user-select: none;
		-webkit-user-select: none;
	}

	.window:active .titlebar {
		cursor: grabbing;
	}

	.content {
		padding: 0.9rem;
	}

	.content.scrollable {
		max-height: min(52vh, 420px);
		overflow-y: auto;
	}

	.scroll-cue {
		position: absolute;
		left: 0;
		right: 0;
		bottom: 0;
		display: flex;
		justify-content: center;
		padding: 1.4rem 0 0.3rem;
		background: linear-gradient(to bottom, transparent, var(--bg) 65%);
		pointer-events: none;
	}

	.chevron {
		font-family: var(--font-mono);
		font-size: 0.9rem;
		line-height: 1;
		color: var(--fg);
		animation: bob 1.4s ease-in-out infinite;
	}

	@keyframes bob {
		0%,
		100% {
			transform: translateY(0);
			opacity: 0.55;
		}
		50% {
			transform: translateY(3px);
			opacity: 1;
		}
	}

	@media (min-width: 701px) {
		.window.compact .content {
			min-height: 11rem;
			display: flex;
			flex-direction: column;
			justify-content: center;
		}
	}

	@media (max-width: 700px) {
		.anchor {
			position: static;
			transform: none;
			order: var(--order);
			width: 100%;
			z-index: auto !important;
		}

		.window,
		.window.primary,
		.window.compact {
			width: 100%;
			margin-bottom: 1rem;
		}

		.titlebar {
			cursor: default;
		}
	}

	@media (prefers-reduced-motion: reduce) {
		.chevron {
			animation: none;
		}
	}
</style>
