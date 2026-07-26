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
		titlebarEl?: HTMLElement;
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
		titlebarEl = $bindable(),
		children
	}: Props = $props();
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	let gsapRef: any;
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	let draggable: any;
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	let lenisRef: any;

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

	// Lenis smooths the maximized window's own content scroll (Experience/
	// Projects/Skills) — its standard use case, a genuine scrollable
	// container. Scoped to `contentEl` only, so it never competes with
	// +page.svelte's separate wheel handling that drives the maximize itself.
	$effect(() => {
		if (!browser || !maximized || !contentEl) return;
		let cancelled = false;
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		let tickerFn: any;
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		let localGsap: any;

		(async () => {
			const [{ default: Lenis }, { gsap }] = await Promise.all([import('lenis'), import('gsap')]);
			if (cancelled || !contentEl) return;

			localGsap = gsap;
			const inner = contentEl.querySelector<HTMLElement>('.content-inner');
			lenisRef = new Lenis({
				wrapper: contentEl,
				content: inner ?? contentEl,
				duration: 1.1,
				smoothWheel: true
			});
			tickerFn = (time: number) => lenisRef?.raf(time * 1000);
			gsap.ticker.add(tickerFn);
		})();

		return () => {
			cancelled = true;
			if (tickerFn) localGsap?.ticker.remove(tickerFn);
			lenisRef?.destroy();
			lenisRef = undefined;
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
			<!-- Single wrapper so Lenis (below) has one content element to
			     measure the real scroll height against — `children` can render
			     multiple sibling roots (e.g. CenterCard + ResumeSection). -->
			<div class="content-inner">
				{@render children?.()}
			</div>
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
		/* --win-chrome fades this border to flat --bg while maximizing (driven
		   from +page.svelte), so the card reads as part of the background. */
		border: 1px solid color-mix(in srgb, var(--fg) calc(var(--win-chrome, 1) * 100%), transparent);
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
		display: flex;
		flex-direction: column;
		justify-content: safe center;
		overflow-y: auto;
		max-height: none;
		scrollbar-width: none;
	}

	.window.maximized .content::-webkit-scrollbar {
		display: none;
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
		   avoids a second scroll surface fighting the wheel-driven maximize.
		   Fixed (not max-) height so there's always room reserved below the
		   tagline for CenterCard's bottom-pinned scroll cue. */
		.window.primary:not(.maximized) .content {
			height: min(52vh, 420px);
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
