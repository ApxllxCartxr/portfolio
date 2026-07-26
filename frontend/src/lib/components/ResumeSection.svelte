<!--
	Static resume content in normal document flow, below the scroll-jacked
	hero. No scroll-jack awareness needed — same stacked layout at every width.
-->
<script lang="ts">
	import { experience, projects, skills } from '$lib/resume-data';
</script>

<section class="resume">
	<h2>Experience</h2>
	<div class="card-grid">
		{#each experience as job (job.company)}
			<article class="card">
				<h3>{job.role}</h3>
				<p class="meta">{job.company} · {job.location}</p>
				<p class="period">{job.period}</p>
				<ul>
					{#each job.bullets as bullet (bullet)}
						<li>{bullet}</li>
					{/each}
				</ul>
			</article>
		{/each}
	</div>

	<h2>Projects</h2>
	<div class="card-grid">
		{#each projects as project (project.name)}
			<article class="card">
				<h3>{project.name}</h3>
				<ul>
					{#each project.bullets as bullet (bullet)}
						<li>{bullet}</li>
					{/each}
				</ul>
			</article>
		{/each}
	</div>

	<h2>Skills</h2>
	<div class="card pill-card">
		{#each skills as skill (skill)}
			<span class="pill">{skill}</span>
		{/each}
	</div>
</section>

<style>
	.resume {
		max-width: 900px;
		margin: 0 auto;
		padding: clamp(2rem, 6vw, 4rem) clamp(1rem, 4vw, 2rem);
	}

	h2 {
		font-family: var(--font-title);
		font-size: clamp(1.3rem, 3vw, 1.7rem);
		margin: 2.5rem 0 1rem;
	}

	h2:first-child {
		margin-top: 0;
	}

	.card-grid {
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
		gap: 1rem;
	}

	.card {
		background: var(--card-bg);
		border: 1px solid var(--fg);
		padding: clamp(1rem, 2.5vw, 1.5rem);
	}

	.card h3 {
		font-family: var(--font-title);
		font-size: 1.05rem;
		margin: 0 0 0.3rem;
	}

	.meta {
		font-family: var(--font-body);
		font-size: 0.85rem;
		opacity: 0.85;
		margin: 0;
	}

	.period {
		font-family: var(--font-mono);
		font-size: 0.75rem;
		margin: 0.2rem 0 0.8rem;
		opacity: 0.7;
	}

	.card ul {
		display: flex;
		flex-direction: column;
		gap: 0.5rem;
		font-family: var(--font-body);
		font-size: 0.9rem;
		line-height: 1.5;
		padding-left: 1.1rem;
		margin: 0;
	}

	.pill-card {
		display: flex;
		flex-wrap: wrap;
		align-content: flex-start;
	}

	.pill {
		display: inline-block;
		padding: 0.25rem 0.6rem;
		margin: 0.2rem;
		border: 1px solid var(--fg);
		border-radius: 999px;
		font-family: var(--font-mono);
		font-size: 0.75rem;
	}
</style>
