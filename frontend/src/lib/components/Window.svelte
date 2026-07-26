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
		maximized?: boolean;
		windowEl?: HTMLElement;
		contentEl?: HTMLElement;
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
		maximized = false,
		windowEl = $bindable(),
		contentEl = $bindable(),
		children
	}: Props = $props();

	let titlebarEl = $state<HTMLElement>();
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	let gsapRef: any;
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	let draggable: any;

	export function snapToCenter() {
		if (!draggable || !gsapRef || !windowEl) return;
		gsapRef.set(windowEl, { x: 0, y: 0 });
		draggable.update();
	}

	export function setDraggable(enabled: boolean) {
		if (enabled) {
			draggable?.enable();
		} else {
			draggable?.disable();
		}
	}

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
		class:maximized
		bind:this={windowEl}
		aria-label={title}
		tabindex="0"
		onkeydown={handleKeydown}
		onpointerdown={onFront}
	>
		<header class="titlebar" bind:this={titlebarEl}>
			<WindowControls {title} {onClose} />
		</header>
		<div class="content" bind:this={contentEl}>
			{@render children?.()}
		</div>
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

	.window.maximized {
		display: flex;
		flex-direction: column;
	}

	.window.maximized .content {
		flex: 1;
		overflow-y: auto;
		max-height: none;
	}

	@media (min-width: 701px) {
		.window.compact .content {
			min-height: 11rem;
			display: flex;
			flex-direction: column;
			justify-content: center;
		}

		/* Extra content (the resume section) lives inside the primary window's
		   content but stays clipped out of view until the window maximizes —
		   avoids a second scroll surface fighting the wheel-driven maximize. */
		.window.primary:not(.maximized) .content {
			max-height: min(52vh, 420px);
			overflow: hidden;
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
</style>
