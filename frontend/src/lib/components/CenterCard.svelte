<script lang="ts">
	import { toggleSwap } from '$lib/theme.svelte';

	interface Props {
		maximized?: boolean;
	}

	let { maximized = false }: Props = $props();
</script>

<div class="layout" class:maximized>
	<button
		type="button"
		class="name-card"
		onclick={toggleSwap}
		aria-label="Joseph Fernando — click to swap the theme colors"
	>
		<span class="intro">hi i'm</span>
		<span class="name">
			Joseph<br />
			Fernando <span class="accent">*</span>
		</span>
	</button>

	<div class="info">
		<div class="bio" class:maximized>
			<p>
				Software developer, currently building full-stack systems as a dev intern at Picabord
				Technologies — multi-tenant CRMs, RBAC, and everything underneath them.
			</p>
			<p>
				Also shipped a real-time crowd-safety app for one of the world's largest gatherings, and a
				discrete-event train simulator modelling an entire metro network as a weighted graph.
			</p>
			<p class="context">
				CS student at Chennai Institute of Technology, leading a 35-member entrepreneurship cell on
				the side.
			</p>
		</div>

		<div class="links" class:maximized>
			<a href="mailto:josephfernando05@proton.me">Email</a>
			<a href="https://github.com/apxllxcartxr" target="_blank" rel="noreferrer">GitHub</a>
		</div>
	</div>
</div>

<div class="scroll-cue" class:maximized>
	<span>Scroll to see more</span>
	<span class="chevron" aria-hidden="true">↓</span>
</div>

<style>
	.layout {
		display: flex;
		flex-direction: column;
	}

	.bio {
		display: flex;
		flex-direction: column;
		gap: 0.8rem;
		margin-top: 2rem;
		font-family: var(--font-body);
		font-size: 1.15rem;
		line-height: 1.5;
	}

	.context {
		opacity: 0.85;
	}

	.bio.maximized p:first-child {
		font-weight: 700;
	}

	.links {
		display: flex;
		gap: 1rem;
		margin-top: 1.1rem;
		padding-top: 0.8rem;
		border-top: 1px solid var(--fg);
		font-family: var(--font-mono);
		font-size: 0.8rem;
	}

	.links a {
		text-decoration: underline;
		text-underline-offset: 3px;
	}

	.links a:hover,
	.links a:focus-visible {
		color: var(--accent);
	}

	.links.maximized a {
		font-weight: 700;
	}

	.name-card {
		display: flex;
		flex-direction: column;
		align-items: flex-start;
		gap: 0.3rem;
		width: 100%;
		background: none;
		border: none;
		padding: 0;
		cursor: pointer;
		color: var(--fg);
		text-align: left;
	}

	.name-card:focus-visible {
		outline: 2px solid var(--focus-ring);
		outline-offset: 4px;
	}

	.intro {
		font-family: var(--font-hand);
		font-size: 1.9rem;
	}

	.name {
		font-family: var(--font-display);
		font-size: clamp(2.75rem, 9vw, 4.5rem);
		line-height: 1.05;
		font-weight: 700;
	}

	.accent {
		color: var(--accent);
		font-family: var(--font-redaction-clear);
	}

	.scroll-cue {
		display: none;
	}

	@media (min-width: 701px) {
		.bio:not(.maximized),
		.links:not(.maximized) {
			display: none;
		}

		.scroll-cue:not(.maximized) {
			display: flex;
			align-items: center;
			gap: 0.4rem;
			position: absolute;
			left: 50%;
			bottom: 1.1rem;
			transform: translateX(-50%);
			font-family: var(--font-mono);
			font-size: 0.7rem;
			letter-spacing: 0.06em;
			text-transform: uppercase;
			opacity: 0.65;
			white-space: nowrap;
			pointer-events: none;
		}

		.scroll-cue .chevron {
			display: inline-block;
			animation: cue-bounce 1.6s ease-in-out infinite;
		}
	}

	@keyframes cue-bounce {
		0%,
		100% {
			transform: translateY(0);
		}
		50% {
			transform: translateY(4px);
		}
	}
</style>
