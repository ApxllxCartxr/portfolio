<!--
	Static resume content, rendered inline on the single scrolling homepage.
	Entries are hairline-separated rows, not cards — cards mean "widget" in the
	bento above, and boxing everything flattened the hierarchy. Same
	content-left / meta-right shape as the writing index.
	The cmrlsim project's live Mini-Metro-style
	simulation opens on click, in a window, rather than sitting inline — it's
	a tall animated block that otherwise dominates the Projects section. The
	window itself belongs to the page (the simulation tile opens the same one),
	so this only reports the request.
-->
<script lang="ts">
	import { experience, projects, skills } from '$lib/resume-data';

	interface Props {
		onOpenDemo: () => void;
	}

	let { onOpenDemo }: Props = $props();
</script>

<section class="resume" aria-label="Resume">
	<div class="block">
		<h2>Experience</h2>
		<div class="block-body">
			{#each experience as job (job.company)}
				<article class="entry">
					<div class="entry-head">
						<div>
							<h3>{job.role}</h3>
							<p class="meta">{job.period}</p>
						</div>
						<p class="org">
							{job.company}<span class="place">{job.location}</span>
						</p>
					</div>
					<ul>
						{#each job.bullets as bullet (bullet)}
							<li>{bullet}</li>
						{/each}
					</ul>
				</article>
			{/each}
		</div>
	</div>

	<div class="block">
		<h2>Projects</h2>
		<div class="block-body">
			{#each projects as project (project.name)}
				<article class="entry">
					<h3>{project.name}</h3>
					<ul>
						{#each project.bullets as bullet (bullet)}
							<li>{bullet}</li>
						{/each}
					</ul>
					{#if project.demoId === 'cmrlsim'}
						<button type="button" class="demo-open" onclick={onOpenDemo}>
							Open the simulation &rarr;
						</button>
					{/if}
				</article>
			{/each}
		</div>
	</div>

	<div class="block">
		<h2>Skills</h2>
		<div class="block-body">
			<div class="skills">
				{#each skills as skill (skill)}<span class="pill">{skill}</span>{/each}
			</div>
		</div>
	</div>
</section>

<style>
	.block + .block {
		margin-top: 3rem;
	}

	/* Section labels are micro-scale and set in mono, not display serif — they
	   name the column rather than competing with the entry titles inside it. */
	h2 {
		font-family: var(--font-mono);
		font-size: 0.7rem;
		font-weight: 400;
		letter-spacing: 0.12em;
		text-transform: uppercase;
		color: var(--muted);
		margin: 0 0 1.1rem;
	}

	/* Heading in a left rail, entries in the main column. The rail heading
	   sticks while its entries scroll past, so the section you're reading is
	   always labelled. */
	@media (min-width: 900px) {
		.block {
			display: grid;
			grid-template-columns: 13rem minmax(0, 1fr);
			column-gap: 2.5rem;
			align-items: start;
		}

		h2 {
			position: sticky;
			top: 2rem;
			margin: 0;
		}
	}

	/* The rule under the section label anchors the column the way the writing
	   index does, so every block on the page opens the same way. */
	.block-body {
		border-top: 1px solid var(--line);
		padding-top: 1.1rem;
	}

	.entry + .entry {
		padding-top: 1.1rem;
		border-top: 1px solid var(--line);
	}

	.entry {
		padding-bottom: 1.1rem;
	}

	.block-body > .entry:last-child {
		padding-bottom: 0;
	}

	.entry-head {
		display: flex;
		flex-wrap: wrap;
		align-items: baseline;
		justify-content: space-between;
		gap: 0.5rem 1.5rem;
	}

	.org {
		font-family: var(--font-body);
		font-size: 0.9rem;
		text-align: right;
		margin: 0 0 0.7rem;
	}

	.place {
		display: block;
		font-size: 0.8rem;
		color: var(--muted);
	}

	/* Once the head wraps to two rows, right-aligning the org leaves it ragged
	   against the role above it. */
	@media (max-width: 640px) {
		.org {
			text-align: left;
		}
	}

	.entry h3 {
		font-family: var(--font-title);
		font-size: 1.15rem;
		font-weight: 600;
		line-height: 1.3;
		margin: 0 0 0.25rem;
	}

	.demo-open {
		margin-top: 1rem;
		padding: 0.35rem 0.8rem;
		border: 1px solid var(--line);
		border-radius: 999px;
		background: var(--bg);
		color: var(--muted);
		font-family: var(--font-mono);
		font-size: 0.72rem;
		cursor: pointer;
	}

	.demo-open:hover,
	.demo-open:focus-visible {
		border-color: var(--fg);
		color: var(--fg);
	}

	.meta {
		font-family: var(--font-mono);
		font-size: 0.75rem;
		letter-spacing: 0.01em;
		color: var(--muted);
		margin: 0 0 0.7rem;
	}

	/* These read as short paragraphs, not list items — discs were the last
	   default browser styling on the page, and setting the most substantive
	   copy on the site in --muted had the hierarchy backwards. */
	.entry ul {
		max-width: 72ch;
		display: flex;
		flex-direction: column;
		gap: 0.6rem;
		list-style: none;
		font-family: var(--font-body);
		font-size: 1rem;
		line-height: 1.6;
		padding: 0;
		margin: 0;
	}

	.skills {
		display: flex;
		flex-wrap: wrap;
		gap: 0.45rem;
		margin: 0;
	}

	.pill {
		border: 1px solid var(--line);
		background: var(--bg-raised);
		color: var(--muted);
		font-family: var(--font-mono);
		font-size: 0.72rem;
		line-height: 1;
		padding: 0.35rem 0.75rem;
		border-radius: 999px;
		white-space: nowrap;
	}
</style>
