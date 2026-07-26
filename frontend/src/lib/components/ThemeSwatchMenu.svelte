<!--
	Right-click the empty desktop to summon the theme picker: swatches bloom
	in a small ring around the cursor, one after another, and vanish on
	pick/escape/click-away. Replaces the old docked taskbar — it only exists
	for the moment you ask for it, rather than sitting on screen distracting
	from the desktop.
-->
<script lang="ts">
	import { browser } from '$app/environment';
	import { tick } from 'svelte';
	import { THEMES, SWATCH_COLORS, THEME_LABELS, themeState, setTheme } from '$lib/theme.svelte';

	interface Props {
		boundsEl: HTMLElement | undefined;
	}

	let { boundsEl }: Props = $props();

	const RADIUS = 44;

	let visible = $state(false);
	let closing = $state(false);
	let menuX = $state(0);
	let menuY = $state(0);
	let swatchEls = $state<(HTMLButtonElement | null)[]>([]);

	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	let gsapRef: any;

	function reduceMotion() {
		return browser && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
	}

	async function animateIn() {
		const els = swatchEls.filter((el): el is HTMLButtonElement => !!el);
		if (!browser || !els.length) return;
		if (reduceMotion()) {
			els.forEach((el) => el.style.setProperty('opacity', '1'));
			return;
		}
		const { gsap } = await import('gsap');
		gsapRef = gsap;
		gsap.killTweensOf(els);
		gsap.fromTo(
			els,
			{ scale: 0, opacity: 0, rotate: -50 },
			{
				scale: 1,
				opacity: 1,
				rotate: 0,
				duration: 0.5,
				ease: 'back.out(2.4)',
				stagger: 0.07
			}
		);
	}

	function animateOut(onComplete: () => void) {
		const els = swatchEls.filter((el): el is HTMLButtonElement => !!el).reverse();
		if (!browser || !gsapRef || !els.length || reduceMotion()) {
			onComplete();
			return;
		}
		gsapRef.killTweensOf(els);
		gsapRef.to(els, {
			scale: 0,
			opacity: 0,
			duration: 0.2,
			ease: 'power2.in',
			stagger: 0.03,
			onComplete
		});
	}

	function openAt(clientX: number, clientY: number) {
		if (!boundsEl) return;
		const rect = boundsEl.getBoundingClientRect();
		// Clamp so the ring can't bloom past the desktop edge.
		menuX = Math.min(Math.max(clientX - rect.left, RADIUS + 24), rect.width - RADIUS - 24);
		menuY = Math.min(Math.max(clientY - rect.top, RADIUS + 24), rect.height - RADIUS - 24);
		swatchEls = [];
		visible = true;
		closing = false;
		tick().then(animateIn);
	}

	function close() {
		if (!visible || closing) return;
		closing = true;
		animateOut(() => {
			visible = false;
			closing = false;
		});
	}

	function pick(name: (typeof THEMES)[number]) {
		setTheme(name);
		close();
	}

	function handleContextMenu(event: MouseEvent) {
		if (!boundsEl) return;
		const target = event.target as HTMLElement;
		if (target.closest('.window')) return;
		event.preventDefault();
		openAt(event.clientX, event.clientY);
	}

	function handlePointerDown(event: PointerEvent) {
		if (!visible) return;
		const target = event.target as HTMLElement;
		if (!target.closest('.swatch-ring')) close();
	}

	function handleKeydown(event: KeyboardEvent) {
		if (event.key === 'Escape') close();
	}

	$effect(() => {
		if (!browser || !boundsEl) return;
		const el = boundsEl;
		el.addEventListener('contextmenu', handleContextMenu);
		window.addEventListener('pointerdown', handlePointerDown);
		window.addEventListener('keydown', handleKeydown);
		window.addEventListener('scroll', close, true);
		return () => {
			el.removeEventListener('contextmenu', handleContextMenu);
			window.removeEventListener('pointerdown', handlePointerDown);
			window.removeEventListener('keydown', handleKeydown);
			window.removeEventListener('scroll', close, true);
		};
	});
</script>

{#if visible}
	<div
		class="swatch-ring"
		style={`left: ${menuX}px; top: ${menuY}px;`}
		role="menu"
		aria-label="Choose theme"
	>
		{#each THEMES as name, i (name)}
			{@const angle = (i / THEMES.length) * 2 * Math.PI - Math.PI / 2}
			{@const dx = Math.cos(angle) * RADIUS}
			{@const dy = Math.sin(angle) * RADIUS}
			<!-- Position lives on this wrapper's transform; gsap owns the
			     button's own transform (scale/rotate) so the two never fight
			     over the same CSS property. -->
			<div class="swatch-slot" style={`transform: translate(${dx}px, ${dy}px);`}>
				<button
					bind:this={swatchEls[i]}
					type="button"
					class="swatch"
					style={`background: ${SWATCH_COLORS[name]};`}
					aria-pressed={themeState.theme === name}
					aria-label={THEME_LABELS[name]}
					onclick={() => pick(name)}
				></button>
			</div>
		{/each}
	</div>
{/if}

<style>
	.swatch-ring {
		position: absolute;
		width: 0;
		height: 0;
		z-index: 100;
	}

	.swatch-slot {
		position: absolute;
		top: 0;
		left: 0;
		width: 0;
		height: 0;
	}

	.swatch {
		position: absolute;
		top: 0;
		left: 0;
		width: 2.2rem;
		height: 2.2rem;
		margin: -1.1rem;
		padding: 0;
		border-radius: 50%;
		border: 1.5px solid var(--fg);
		cursor: pointer;
		box-shadow: 0 2px 10px rgba(0, 0, 0, 0.28);
		opacity: 0;
		transition: box-shadow 0.15s ease;
	}

	.swatch[aria-pressed='true'] {
		box-shadow:
			0 0 0 2px var(--bg),
			0 0 0 3.5px var(--fg),
			0 2px 10px rgba(0, 0, 0, 0.28);
	}

	.swatch:focus-visible {
		outline: 2px solid var(--focus-ring);
		outline-offset: 2px;
	}
</style>
