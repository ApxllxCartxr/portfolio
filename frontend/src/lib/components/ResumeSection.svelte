<!--
	Static resume content, living inside the center window's own content area
	(see +page.svelte) — clipped out of view on the compact card, reachable by
	scrolling once the window is maximized. Minimal typographic treatment: no
	card chrome, just the site's existing three-font pairing (serif titles,
	mono meta/labels, sans body) with thin dividers for separation.
-->
<script lang="ts">
	import { experience, projects, skills } from '$lib/resume-data';

	interface Props {
		maximized?: boolean;
		onOpenDemo?: (id: string) => void;
	}

	let { maximized = false, onOpenDemo }: Props = $props();
</script>

<section class="resume" class:maximized>
	<h2>Experience</h2>
	{#each experience as job (job.company)}
		<article class="entry">
			<h3>{job.role}</h3>
			<p class="meta">{job.company} · {job.location} · {job.period}</p>
			<ul>
				{#each job.bullets as bullet (bullet)}
					<li>{bullet}</li>
				{/each}
			</ul>
		</article>
	{/each}

	<h2>Projects</h2>
	{#each projects as project (project.name)}
		<article class="entry">
			<h3>
				{#if project.demoId}
					<button
						type="button"
						class="demo-trigger"
						onclick={() => onOpenDemo?.(project.demoId ?? '')}
					>
						{project.name}
						<svg class="demo-arrow" viewBox="0 0 10 10" aria-hidden="true">
							<path
								d="M2.4 7.6 7.6 2.4M3.4 2.4h4.2v4.2"
								fill="none"
								stroke="currentColor"
								stroke-width="1.2"
								stroke-linecap="round"
								stroke-linejoin="round"
							/>
						</svg>
					</button>
				{:else}
					{project.name}
				{/if}
			</h3>
			<ul>
				{#each project.bullets as bullet (bullet)}
					<li>{bullet}</li>
				{/each}
			</ul>
		</article>
	{/each}

	<h2>Skills</h2>
	<div class="skills">
		{#each skills as skill (skill)}<span class="pill">{skill}</span>{/each}
	</div>
</section>

<style>
	.resume {
		margin: 3rem 0 0;
		padding: 2rem 0 1rem;
		border-top: 1px solid var(--fg);
	}

	h2 {
		font-family: var(--font-title);
		font-size: 1.85rem;
		font-weight: 600;
		margin: 2.25rem 0 1.1rem;
	}

	h2:first-child {
		margin-top: 0;
	}

	.entry {
		margin-bottom: 1.6rem;
	}

	.entry:last-of-type {
		margin-bottom: 0;
	}

	.entry h3 {
		font-family: var(--font-title);
		font-size: 1.3rem;
		font-weight: 600;
		margin: 0 0 0.3rem;
	}

	.demo-trigger {
		display: inline-flex;
		align-items: baseline;
		gap: 0.3rem;
		font: inherit;
		color: inherit;
		background: none;
		border: none;
		padding: 0.1rem 0.35rem;
		margin: 0 0 0 -0.35rem;
		border-radius: 3px;
		cursor: pointer;
		text-align: left;
		transition: background-color 0.15s ease;
	}

	.demo-trigger:hover,
	.demo-trigger:focus-visible {
		background: color-mix(in srgb, var(--fg) 10%, transparent);
		outline: none;
	}

	.demo-arrow {
		width: 0.65em;
		height: 0.65em;
		align-self: center;
		flex-shrink: 0;
		opacity: 0.55;
		transition:
			opacity 0.15s ease,
			transform 0.15s ease;
	}

	.demo-trigger:hover .demo-arrow,
	.demo-trigger:focus-visible .demo-arrow {
		opacity: 0.9;
		transform: translate(1px, -1px);
	}

	.meta {
		font-family: var(--font-mono);
		font-size: 0.78rem;
		letter-spacing: 0.01em;
		opacity: 0.65;
		margin: 0 0 0.7rem;
	}

	.entry ul {
		display: flex;
		flex-direction: column;
		gap: 0.5rem;
		font-family: var(--font-body);
		font-size: 1.05rem;
		line-height: 1.55;
		padding-left: 1.1rem;
		margin: 0;
	}

	.skills {
		display: flex;
		flex-wrap: wrap;
		gap: 0.45rem;
		margin: 0;
	}

	.pill {
		background: var(--fg);
		color: var(--bg);
		font-family: var(--font-mono);
		font-size: 0.72rem;
		line-height: 1;
		padding: 0.3rem 0.7rem;
		border-radius: 999px;
		white-space: nowrap;
	}

	@media (min-width: 701px) {
		.resume:not(.maximized) {
			display: none;
		}
	}
</style>
