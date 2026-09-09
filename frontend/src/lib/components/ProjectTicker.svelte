<!--
	One project slot that runs inline in the hero bio and cycles through the
	work worth showing. Each entry brings its own glyph and a one-liner cut
	to roughly the same length, so the run stays about as wide each turn.

	It has to sit inside the sentence, so it cannot be a fixed-size box:
	only the active entry is in flow, and the tint rides on the words
	themselves (box-decoration-break) rather than on a container. That rules
	out a cross-fade between two stacked layers — the morph is sequential
	instead: the line defocuses out, the text swaps while it is invisible,
	the next one resolves in.

	The rotation is decoration; the full list is repeated for screen readers
	in a clipped span so nothing depends on the animation running.
-->
<script lang="ts">
	import { browser } from '$app/environment';

	type Project = {
		id: 'openstore' | 'cmrlsim' | 'simhalink' | 'facet';
		name: string;
		blurb: string;
		href?: string;
	};

	const projects: Project[] = [
		{
			id: 'openstore',
			name: 'OpenStore',
			blurb: 'an ai sales channel a merchant switches on in three commands',
			href: 'https://github.com/ApxllxCartxr/OpenStore'
		},
		{
			id: 'cmrlsim',
			name: 'cmrlsim',
			blurb: "chennai's metro network as a discrete-event model, in go",
			href: 'https://github.com/ApxllxCartxr/cmrlsim'
		},
		{
			id: 'simhalink',
			name: 'SimhaLink',
			blurb: 'crowd safety in real time, at the scale of a pilgrimage',
			href: 'https://github.com/ApxllxCartxr/SimhaLink'
		},
		{
			id: 'facet',
			name: 'Facet',
			blurb: 'aml triage where the model explains and the rules decide',
			href: 'https://github.com/ApxllxCartxr/Facet'
		}
	];

	const HOLD_MS = 6000;
	// Matches the .run transition duration — the swap happens once the
	// outgoing text has fully blurred out.
	const FADE_MS = 500;

	let index = $state(0);
	let out = $state(false);
	let paused = $state(false);

	const current = $derived(projects[index]);

	$effect(() => {
		if (!browser || paused) return;
		// The rotation is the motion the preference is about — under reduce,
		// the slot just holds whichever project is showing.
		if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

		let swap: ReturnType<typeof setTimeout>;
		const timer = setInterval(() => {
			out = true;
			swap = setTimeout(() => {
				index = (index + 1) % projects.length;
				out = false;
			}, FADE_MS);
		}, HOLD_MS);

		return () => {
			clearInterval(timer);
			clearTimeout(swap);
			out = false;
		};
	});
</script>

{#snippet icon(id: Project['id'])}
	<svg class="glyph" viewBox="0 0 24 24" aria-hidden="true">
		{#if id === 'openstore'}
			<!-- storefront: awning over an open shopfront -->
			<path d="M3 8l1.6-4h14.8L21 8" />
			<path
				d="M3 8a2.4 2.4 0 0 0 4.5 0 2.4 2.4 0 0 0 4.5 0 2.4 2.4 0 0 0 4.5 0 2.4 2.4 0 0 0 4.5 0"
			/>
			<path d="M4.6 10v10h14.8V10" />
			<path d="M9.6 20v-6h4.8v6" />
		{:else if id === 'cmrlsim'}
			<!-- metro: a line with a station node on it -->
			<path d="M3 17h6" />
			<path d="M15 17h6" />
			<circle cx="12" cy="17" r="2.6" />
			<path d="M12 14.4V5" />
			<path d="M7.5 5h9" />
		{:else if id === 'simhalink'}
			<!-- signal: a point broadcasting outward -->
			<circle cx="12" cy="12" r="2.2" />
			<path d="M7.8 16.2a6 6 0 0 1 0-8.4" />
			<path d="M16.2 7.8a6 6 0 0 1 0 8.4" />
			<path d="M4.8 19.2a10 10 0 0 1 0-14.4" />
			<path d="M19.2 4.8a10 10 0 0 1 0 14.4" />
		{:else}
			<!-- prism: one shard, faceted -->
			<path d="M12 3l8 6-3 11H7L4 9z" />
			<path d="M12 3v17" />
			<path d="M4 9h16" />
		{/if}
	</svg>
{/snippet}

<span
	class="run"
	class:out
	aria-hidden="true"
	onmouseenter={() => (paused = true)}
	onmouseleave={() => (paused = false)}
	onfocusin={() => (paused = true)}
	onfocusout={() => (paused = false)}
	>{@render icon(current.id)}<a class="name" href={current.href} rel="noreferrer" tabindex="-1"
		>{current.name}</a
	>
	— {current.blurb}</span
>

<span class="clipped">
	{#each projects as project, i (project.id)}
		<a href={project.href} rel="noreferrer">{project.name}</a>
		— {project.blurb}{i < projects.length - 1 ? '; ' : '.'}
	{/each}
</span>

<style>
	/* The tint rides on the words, not on a container: box-decoration-break
	   keeps the padding on every wrapped line, so the highlight follows the
	   ragged shape of the text and the run stays inside the sentence. */
	.run {
		background: var(--bg-sunken);
		box-decoration-break: clone;
		-webkit-box-decoration-break: clone;
		padding: 0.12em 0.34em;
		color: var(--muted);
		transition:
			opacity 0.5s ease,
			filter 0.5s ease;
	}

	.run.out {
		opacity: 0;
		filter: blur(5px);
	}

	.glyph {
		width: 1.05em;
		height: 1.05em;
		display: inline-block;
		vertical-align: -0.18em;
		margin-right: 0.25em;
		color: var(--accent);
		fill: none;
		stroke: currentColor;
		stroke-width: 1.8;
		stroke-linecap: round;
		stroke-linejoin: round;
	}

	.name {
		font-family: inherit;
		font-size: inherit;
		font-weight: 600;
		color: var(--accent);
		text-decoration: underline;
		text-decoration-thickness: 1px;
		text-underline-offset: 3px;
	}

	.clipped {
		position: absolute;
		width: 1px;
		height: 1px;
		margin: -1px;
		padding: 0;
		overflow: hidden;
		clip-path: inset(50%);
		white-space: nowrap;
		/* Hidden to the eye but still selectable — without this, copying the
		   bio drags the whole project list along with it. */
		user-select: none;
	}

	@media (prefers-reduced-motion: reduce) {
		.run {
			transition: none;
		}
	}
</style>
