<!--
	Experience, Projects, and Skills as three plates of the same catalog
	rather than a resume. Each block opens with a title carrying the same
	accent asterisk as the hero name, then runs full-width — no sticky rail
	label, no two-column split. Experience and Projects share one entry
	shape: a hanging plate number, a wall-label credit line (employer/stack
	· location/discipline, dates) in place of a mono meta chip, and one
	curatorial sentence instead of bullets. Every entry is the same height
	regardless of how much happened, so the list scales to any count.
	Skills drops the shields-style color pills for a quiet colophon list,
	grouped and set in running text.
-->
<script lang="ts">
	import { experience, projects, skillGroups } from '$lib/resume-data';

	interface Props {
		onOpenDemo: () => void;
	}

	let { onOpenDemo }: Props = $props();
</script>

<section class="resume" aria-label="Resume">
	<div class="block">
		<h2>Experience<span class="mark" aria-hidden="true">*</span></h2>
		<div class="block-body">
			{#each experience as job, i (job.role)}
				<article class="entry">
					<span class="plate" aria-hidden="true">{String(i + 1).padStart(2, '0')}</span>
					<div class="entry-main">
						<h3>{job.role}</h3>
						<p class="medium">{job.medium}</p>
						<p class="blurb">{job.blurb}</p>
					</div>
				</article>
			{/each}
		</div>
	</div>

	<div class="block">
		<h2>Projects<span class="mark" aria-hidden="true">*</span></h2>
		<div class="block-body">
			{#each projects as project, i (project.name)}
				<article class="entry" id={project.anchorId}>
					<span class="plate" aria-hidden="true">{String(i + 1).padStart(2, '0')}</span>
					<div class="entry-main">
						<h3>{project.name}</h3>
						<p class="medium">{project.medium}</p>
						<p class="blurb">{project.blurb}</p>
						<div class="entry-links">
							{#if project.github}
								<a class="entry-link" href={project.github} target="_blank" rel="noreferrer">
									View on GitHub &nearr;
								</a>
							{/if}
							{#if project.demoId === 'cmrlsim'}
								<button type="button" class="entry-link" onclick={onOpenDemo}>
									Open the simulation &rarr;
								</button>
							{/if}
						</div>
					</div>
				</article>
			{/each}
		</div>
	</div>

	<div class="block">
		<h2>Skills<span class="mark" aria-hidden="true">*</span></h2>
		<div class="block-body skills-body">
			{#each skillGroups as group (group.label)}
				<div class="skill-row">
					<span class="skill-label">{group.label}</span>
					<p class="skill-list">{group.items.join(' · ')}</p>
				</div>
			{/each}
		</div>
	</div>
</section>

<style>
	.block + .block {
		margin-top: clamp(2.5rem, 5vh, 3.5rem);
	}

	/* PP Kyoto, dark ink, small — the accent asterisk echoes the mark on the
	   hero name instead of falling back to a tracked mono caption. */
	h2 {
		margin: 0 0 1.1rem;
		font-family: var(--font-serif);
		font-size: var(--t-section);
		font-weight: 700;
		letter-spacing: -0.01em;
		line-height: 1.2;
		color: var(--fg);
	}

	h2 .mark {
		display: inline-block;
		margin-left: -0.05em;
		font-size: 0.8em;
		vertical-align: 0.32em;
		color: var(--accent);
	}

	.block-body {
		border-top: var(--rule) solid var(--line);
		padding-top: 1.1rem;
	}

	/* Plate number hangs to the left, independent of how many lines the
	   entry runs to — the same shape at 2 entries or 20. */
	.entry {
		display: grid;
		grid-template-columns: 2rem minmax(0, 1fr);
		gap: 0 1rem;
		padding-bottom: 1.4rem;
		/* SimhaLink is a hero-bio link target — keep it clear of the sticky nav. */
		scroll-margin-top: 6rem;
	}

	.entry + .entry {
		padding-top: 1.4rem;
		border-top: var(--rule) solid var(--line);
	}

	.block-body > .entry:last-child {
		padding-bottom: 0;
	}

	.plate {
		font-family: var(--font-serif);
		font-weight: 700;
		font-size: 1rem;
		font-variant-numeric: oldstyle-nums;
		color: var(--muted);
	}

	.entry-main {
		min-width: 0;
	}

	.entry-main h3 {
		margin: 0 0 0.35rem;
		font-size: clamp(1.2rem, 1.9vw, 1.4rem);
		font-weight: 600;
		line-height: 1.2;
		letter-spacing: -0.005em;
	}

	.medium {
		margin: 0 0 0.6rem;
		font-family: var(--font-serif);
		font-size: var(--t-caption);
		font-weight: 500;
		color: var(--muted);
	}

	.blurb {
		margin: 0;
		max-width: 64ch;
		font-size: 1rem;
		line-height: 1.6;
		color: var(--fg);
	}

	.entry-links {
		display: flex;
		flex-wrap: wrap;
		gap: 0.5rem 1.5rem;
		margin-top: 0.9rem;
	}

	.entry-link {
		margin: 0;
		padding: 0;
		border: none;
		background: none;
		font-family: var(--font-serif);
		font-size: var(--t-caption);
		font-weight: 500;
		color: var(--muted);
		text-decoration: none;
		cursor: pointer;
	}

	.entry-link:hover,
	.entry-link:focus-visible {
		color: var(--accent);
	}

	/* Skills as a colophon, not a badge shelf: grouped, comma-set, quiet. */
	.skills-body {
		display: flex;
		flex-direction: column;
		gap: 0.9rem;
	}

	.skill-row {
		display: flex;
		flex-wrap: wrap;
		align-items: baseline;
		gap: 0.3rem 1rem;
	}

	.skill-label {
		flex: 0 0 auto;
		min-width: 10rem;
		font-family: var(--font-serif);
		font-weight: 700;
		font-size: 0.95rem;
		color: var(--fg);
	}

	.skill-list {
		flex: 1 1 240px;
		margin: 0;
		font-size: 1rem;
		line-height: 1.6;
		color: var(--muted);
	}
</style>
