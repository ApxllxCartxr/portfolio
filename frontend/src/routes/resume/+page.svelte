<!--
	The resume, in the site's own type rather than as a downloaded artifact
	the visitor has to open somewhere else. It is the page a hiring manager
	looks for first, so it is a route, not a link to a file.

	Two rules govern this page and neither applies anywhere else on the site:

	1. It is a document, not a surface. Black on white, always — the palette
	   tokens are overridden locally so the theme toggle cannot reach it, and
	   the layout root skips the ink shell for this route.
	2. It has to fit on one sheet of A4. Everything here is sized against that
	   budget: no sticky rail heads, no section glyphs, no --measure cap, no
	   generous clamp() rhythm. The print block at the bottom is the PDF, and
	   there is no PDF in the repo because one would go stale the moment
	   resume-data.ts changed.
-->
<script lang="ts">
	import Seo from '$lib/components/Seo.svelte';
	import { experience, projects, education, skillGroups, contact } from '$lib/resume-data';

	function print() {
		window.print();
	}
</script>

<Seo
	title="Resume — Joseph Fernando"
	description="Joseph Fernando's resume: software development at Picabord Technologies, agentic-commerce and simulation projects in Python and Go, and a B.E. in Computer Science at CIT Chennai."
/>

<main class="page">
	<header class="masthead">
		<h1>{contact.name}</h1>
		<p class="contact">
			<a href="mailto:{contact.email}">{contact.email}</a>
			<span aria-hidden="true">·</span>
			<a href="https://{contact.github}" rel="noreferrer">{contact.github}</a>
			<span aria-hidden="true">·</span>
			<span>{contact.phone}</span>
			<span aria-hidden="true">·</span>
			<span>{contact.location}</span>
		</p>
		<button class="print" type="button" onclick={print}>Print or save as PDF &rarr;</button>
	</header>

	<section class="entry" aria-labelledby="resume-experience">
		<h2 id="resume-experience">Experience</h2>
		<div class="body">
			{#each experience as role (role.role)}
				<article>
					<h3>{role.role}</h3>
					<p class="medium">{role.org} · {role.location} · {role.period}</p>
					<ul>
						{#each role.points as point (point)}
							<li>{point}</li>
						{/each}
					</ul>
				</article>
			{/each}
		</div>
	</section>

	<section class="entry" aria-labelledby="resume-projects">
		<h2 id="resume-projects">Projects</h2>
		<div class="body">
			{#each projects as project (project.name)}
				<article>
					<h3>
						{#if project.github}
							<a href={project.github} rel="noreferrer">{project.name}</a>
						{:else}
							{project.name}
						{/if}
					</h3>
					<p class="medium">{project.medium}</p>
					<ul>
						{#each project.points ?? [project.blurb] as point (point)}
							<li>{point}</li>
						{/each}
					</ul>
				</article>
			{/each}
		</div>
	</section>

	<section class="entry" aria-labelledby="resume-education">
		<h2 id="resume-education">Education</h2>
		<div class="body">
			{#each education as school (school.school)}
				<article>
					<h3>{school.school}</h3>
					<p class="medium">{school.credential} · {school.medium}</p>
					<ul>
						{#each school.points as point (point)}
							<li>{point}</li>
						{/each}
					</ul>
				</article>
			{/each}
		</div>
	</section>

	<section class="entry" aria-labelledby="resume-skills">
		<h2 id="resume-skills">Skills</h2>
		<div class="body skills">
			{#each skillGroups as group (group.label)}
				<p class="group">
					<span class="group-label">{group.label}</span>
					{group.items.map((skill) => skill.name).join(' · ')}
				</p>
			{/each}
		</div>
	</section>
</main>

<style>
	/* The document palette lives on the layout (see +layout.svelte) so the nav
	   sitting above this page is monochrome too. */
	.page {
		box-sizing: border-box;
		width: 100%;
		max-width: 46rem;
		min-height: 100dvh;
		margin-inline: auto;
		padding-inline: clamp(1.25rem, 5vw, 2.5rem);
		padding-block: clamp(2.5rem, 7vh, 4rem) clamp(3rem, 10vh, 5rem);
	}

	.masthead {
		padding-bottom: 0.9rem;
		border-bottom: 2px solid var(--fg);
	}

	h1 {
		margin: 0;
		font-family: 'Times New Roman', Times, serif;
		font-size: 16pt;
		font-weight: 700;
		line-height: 1;
		letter-spacing: 0;
	}

	.contact {
		display: flex;
		flex-wrap: wrap;
		align-items: baseline;
		gap: 0.2rem 0.6rem;
		margin: 0.6rem 0 0;
		font-family: 'Times New Roman', Times, serif;
		font-size: 14pt;
		color: var(--muted);
	}

	.contact a {
		text-decoration: underline;
		text-underline-offset: 3px;
		text-decoration-thickness: 1px;
	}

	.print {
		margin-top: 0.9rem;
		padding: 0.45rem 0.8rem;
		border: var(--rule) solid var(--fg);
		background: none;
		font: inherit;
		font-family: 'Times New Roman', Times, serif;
		font-size: 14pt;
		font-weight: 600;
		color: var(--fg);
		cursor: pointer;
	}

	.print:hover,
	.print:focus-visible {
		background: var(--fg);
		color: #fff;
	}

	.entry {
		padding-block: 1.1rem;
	}

	/* A tracked mono rule instead of the site's SectionHead: the rail sticks,
	   carries a glyph and costs an accent underline, none of which a document
	   this dense can afford. */
	h2 {
		display: flex;
		align-items: center;
		gap: 0.7rem;
		margin: 0 0 0.7rem;
		font-family: 'Times New Roman', Times, serif;
		font-size: 14pt;
		font-weight: 600;
		letter-spacing: 0;
		text-transform: uppercase;
	}

	h2::after {
		content: '';
		flex: 1;
		height: var(--rule);
		background: var(--fg);
	}

	.body {
		display: flex;
		flex-direction: column;
		gap: 0.85rem;
	}

	h3 {
		margin: 0;
		font-family: 'Times New Roman', Times, serif;
		font-size: 14pt;
		font-weight: 600;
		line-height: 1.25;
	}

	h3 a {
		text-decoration: underline;
		text-underline-offset: 3px;
		text-decoration-thickness: 1px;
	}

	.medium {
		margin: 0.1rem 0 0;
		font-family: 'Times New Roman', Times, serif;
		font-size: 14pt;
		color: var(--muted);
	}

	/* No --measure cap. That is a reading constraint for prose; this is a
	   document someone scans, and a short line just costs vertical space. */
	ul {
		margin: 0.4rem 0 0;
		padding: 0;
		list-style: none;
		display: flex;
		flex-direction: column;
		gap: 0.3rem;
	}

	li {
		position: relative;
		padding-left: 1rem;
		font-family: 'Times New Roman', Times, serif;
		font-size: 14pt;
		line-height: 1.45;
	}

	li::before {
		content: '';
		position: absolute;
		left: 0;
		top: 0.66em;
		width: 0.55rem;
		height: var(--rule);
		background: var(--fg);
	}

	.skills {
		gap: 0.3rem;
	}

	.group {
		margin: 0;
		font-family: 'Times New Roman', Times, serif;
		font-size: 14pt;
		line-height: 1.45;
	}

	.group-label {
		font-family: 'Times New Roman', Times, serif;
		font-size: 14pt;
		font-weight: 600;
		color: var(--muted);
	}

	.group-label::after {
		content: ' — ';
	}

	/* ============================================================
	   The print stylesheet is the PDF, and its whole job is one sheet.
	   Sizes are in pt because this is paper. Nothing here goes below 9pt.
	   ============================================================ */
	@media print {
		@page {
			size: A4;
			margin: 10mm 11mm;
		}

		.page {
			max-width: none;
			min-height: 0;
			padding: 0;
			font-family: 'Times New Roman', Times, serif;
			font-size: 14pt;
			line-height: 1.22;
		}

		.print {
			display: none;
		}

		h1 {
			font-size: 16pt;
		}

		.contact {
			margin-top: 0.35rem;
			font-size: 14pt;
			gap: 0.1rem 0.5rem;
		}

		.masthead {
			padding-bottom: 0.22rem;
		}

		.entry {
			padding-block: 0.16rem;
		}

		h2 {
			margin-bottom: 0.2rem;
			font-size: 14pt;
		}

		.body {
			gap: 0.28rem;
		}

		h3 {
			font-size: 14pt;
		}

		.medium {
			font-size: 14pt;
		}

		ul {
			margin-top: 0.14rem;
			gap: 0.1rem;
		}

		li {
			padding-left: 0.85rem;
			font-size: 14pt;
		}

		/* The skills run is a keyword list, not prose — it sits with .medium and
		   .contact at 8.5pt so each group stays on one line. */
		.group,
		.group-label {
			font-size: 14pt;
		}

		/* Keep a role or a project whole; do NOT set this on the sections —
		   on a document meant to fit one page it only forces a break. */
		article {
			break-inside: avoid;
		}

		a {
			text-decoration: none;
			color: #000;
		}
	}
</style>
