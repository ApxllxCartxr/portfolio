<script lang="ts">
	import { profile, contacts, experience, projects, education, focus, skills } from '$lib/resume';
	import Badge from './Badge.svelte';
	import Icon from './Icon.svelte';

	const year = new Date().getFullYear();

	let activeSection = $state<'experience' | 'projects'>('experience');

	function toggleTheme() {
		const current = document.documentElement.dataset.theme === 'dark' ? 'dark' : 'light';
		const next = current === 'dark' ? 'light' : 'dark';
		document.documentElement.dataset.theme = next;
		try {
			localStorage.setItem('theme', next);
		} catch {
			// storage may be unavailable (private mode) — non-fatal
		}
	}
</script>

<div class="bento">
	<article class="card card--header">
		<div class="name-block">
			<h1 class="name">
				{profile.name}<button
					type="button"
					class="mark"
					onclick={toggleTheme}
					aria-label="Toggle theme"
				>
					*
				</button>
			</h1>
			<span class="name-rule"></span>
		</div>
		<p class="intro">
			<strong>{profile.lead}</strong>
			{profile.intro}
			<span class="cta">{profile.cta}</span>
		</p>
	</article>

	<article class="card card--exp">
		<div class="tabs">
			<button
				type="button"
				class="tab"
				class:tab--active={activeSection === 'experience'}
				onclick={() => (activeSection = 'experience')}
			>
				Experience
			</button>
			<button
				type="button"
				class="tab"
				class:tab--active={activeSection === 'projects'}
				onclick={() => (activeSection = 'projects')}
			>
				Projects
			</button>
		</div>

		{#if activeSection === 'experience'}
			{#each experience as job (job.company)}
				<div class="entry">
					<div class="entry__meta">{job.period}</div>
					<div class="entry__title">
						<span class="tt"
							><span class="entry-icon"><Icon name="briefcase" size={14} /></span
							>{job.company}</span
						>
						<span class="ts">{job.role}</span>
						<span class="ts">{job.location}</span>
					</div>
					<p class="entry__desc">{job.summary}</p>
				</div>
			{/each}
		{:else}
			{#each projects as p (p.name)}
				<div class="entry">
					<div class="entry__meta">{p.stack}</div>
					<div class="entry__title">
						<span class="tt"
							><span class="entry-icon"><Icon name="code" size={14} /></span>{p.name}</span
						>
						<span class="ts">{p.tagline}</span>
					</div>
					<p class="entry__desc">{p.summary}</p>
				</div>
			{/each}
		{/if}
	</article>

	<article class="card card--edu-skills">
		<div class="col">
			<span class="label">Skills</span>
			<div class="skill-groups">
				{#each skills as group (group.category)}
					<div class="skill-group">
						<span class="skill-group__label">{group.category}/</span>
						<div class="pills">
							{#each group.items as s (s)}
								<Badge label={s} />
							{/each}
						</div>
					</div>
				{/each}
			</div>

			<span class="label label--mt">Focus</span>
			<div class="pills">
				{#each focus as f (f)}
					<Badge label={f} invert />
				{/each}
			</div>
		</div>

		<div class="col">
			<span class="label">Education</span>
			<div class="entry entry--stack">
				<div class="entry__meta">{education.period}</div>
				<div class="entry__title">
					<span class="tt">{education.school}</span>
					<span class="ts">{education.degree}</span>
					<span class="ts">{education.location}</span>
				</div>
			</div>
			<p class="entry__desc entry__desc--stack">{education.summary}</p>

			<span class="label label--mt label--red">Contact</span>
			<ul class="contacts">
				{#each contacts as c (c.label)}
					<li>
						<a
							class="contact"
							href={c.href}
							target={c.icon === 'git' ? '_blank' : undefined}
							rel="noreferrer"
						>
							<span class="contact__icon"><Icon name={c.icon} /></span>
							<span>{c.value}</span>
						</a>
					</li>
				{/each}
			</ul>
		</div>
	</article>

	<span class="rule rule--minor"></span>

	<footer class="foot">
		<span>Designed &amp; built by {profile.fullName}</span>
		<span>{year}</span>
	</footer>
</div>

<style>
	.bento {
		display: flex;
		flex-direction: column;
		gap: 1.35rem;
	}

	.card {
		background: var(--sheet);
		border: 1px solid var(--rule);
		border-radius: 14px;
		padding: 1.75rem;
	}

	.rule {
		display: block;
		height: 1px;
		background: var(--rule);
	}
	.rule--minor {
		width: 30%;
	}

	/* ---------- header card ---------- */
	.card--header {
		display: grid;
		grid-template-columns: minmax(0, 1.05fr) minmax(0, 1fr);
		gap: clamp(1rem, 3vw, 3rem);
		align-items: start;
	}
	.name-block {
		display: flex;
		flex-direction: column;
		gap: 0.2rem;
	}
	.name {
		font-family: var(--font-display);
		font-weight: 400;
		font-size: 5.75rem;
		line-height: 0.94;
		letter-spacing: -0.01em;
		color: var(--name);
	}
	.mark {
		display: inline;
		background: none;
		border: none;
		padding: 0;
		margin: 0 0 0 0.15em;
		font: inherit;
		font-family: var(--font-title);
		color: var(--red);
		cursor: pointer;
	}
	.mark:hover {
		opacity: 0.8;
	}
	.name-rule {
		height: 1px;
		background: var(--rule);
	}
	.intro {
		font-size: clamp(1.24rem, 1.37vw, 1.4rem);
		line-height: 1.5;
		color: color-mix(in srgb, var(--text) 88%, transparent);
		max-width: 46ch;
		align-self: center;
	}
	.intro strong {
		font-weight: 600;
		color: var(--text);
	}
	.cta {
		color: var(--red);
		font-weight: 500;
	}

	/* ---------- experience/projects card ---------- */
	.tabs {
		display: flex;
		gap: 1.5rem;
		margin-bottom: 1.2rem;
		border-bottom: 1px solid var(--rule);
	}
	.tab {
		background: none;
		border: none;
		padding: 0.2rem 0 0.7rem;
		font-family: var(--font-title);
		font-size: 1.17rem;
		font-weight: 600;
		letter-spacing: 0.02em;
		color: var(--muted);
		cursor: pointer;
		border-bottom: 2px solid transparent;
		margin-bottom: -1px;
		transition:
			color 0.15s ease,
			border-color 0.15s ease;
	}
	.tab--active {
		color: var(--pill-text);
		border-bottom-color: var(--pill-text);
	}

	/* ---------- education + skills card ---------- */
	.card--edu-skills {
		display: grid;
		grid-template-columns: minmax(0, 1fr) minmax(0, 1fr);
		gap: clamp(1rem, 3vw, 3rem);
	}
	.col {
		min-width: 0;
	}

	.label {
		display: block;
		font-family: var(--font-title);
		font-size: 1.17rem;
		font-weight: 600;
		letter-spacing: 0.02em;
		color: var(--pill-text);
		margin-bottom: 0.7rem;
	}
	.label--mt {
		margin-top: 1rem;
	}
	.label--red {
		color: var(--red);
	}

	.pills {
		display: flex;
		flex-wrap: wrap;
		gap: 0.35rem;
	}

	.skill-groups {
		display: flex;
		flex-direction: column;
		gap: 0.35rem;
	}
	.skill-group {
		display: flex;
		flex-wrap: wrap;
		align-items: baseline;
		gap: 0.12rem 0.45rem;
	}
	.skill-group__label {
		flex: none;
		min-width: 5.4rem;
		font-family: var(--font-title);
		font-size: 0.85rem;
		font-weight: 600;
		color: var(--muted);
	}

	/* ---------- entries ---------- */
	.entry {
		display: grid;
		grid-template-columns: minmax(11rem, 13.5rem) minmax(0, 1fr);
		grid-template-areas:
			'meta meta'
			'title desc';
		gap: 0.25rem 1.6rem;
		align-items: start;
	}
	.entry + .entry {
		margin-top: 0.9rem;
	}
	.entry--stack {
		grid-template-columns: 1fr;
		grid-template-areas:
			'meta'
			'title';
		gap: 0.3rem;
	}
	.entry__meta {
		grid-area: meta;
		font-size: 1.07rem;
		line-height: 1.35;
		color: var(--muted);
		font-variant-numeric: tabular-nums;
		white-space: nowrap;
	}
	.entry__title {
		grid-area: title;
		display: flex;
		flex-direction: column;
		gap: 0.15rem;
		line-height: 1.2;
	}
	.tt {
		display: inline-flex;
		align-items: center;
		gap: 0.4rem;
		font-family: var(--font-title);
		font-weight: 700;
		font-size: 1.43rem;
		color: var(--text);
	}
	.entry-icon {
		display: inline-flex;
		flex: none;
		color: var(--muted);
	}
	.ts {
		font-size: 1.07rem;
		color: var(--muted);
	}
	.entry__desc {
		grid-area: desc;
		font-size: 1.2rem;
		line-height: 1.5;
		color: color-mix(in srgb, var(--text) 84%, transparent);
	}
	.entry__desc--stack {
		margin-top: 0.4rem;
	}

	/* ---------- contact ---------- */
	.contacts {
		display: flex;
		flex-direction: column;
		gap: 0.5rem;
	}
	.contact {
		display: inline-flex;
		align-items: center;
		gap: 0.5rem;
		font-size: 1.17rem;
		color: var(--red);
		text-decoration: none;
		width: fit-content;
	}
	.contact:hover {
		text-decoration: underline;
		text-underline-offset: 3px;
	}
	.contact__icon {
		display: inline-flex;
	}

	/* ---------- footer ---------- */
	.foot {
		display: flex;
		justify-content: space-between;
		font-size: 0.99rem;
		color: var(--faint);
		letter-spacing: 0.02em;
	}

	/* ---------- responsive ---------- */
	@media (max-width: 900px) {
		.card {
			padding: 1.25rem;
		}
		.card--header,
		.card--edu-skills {
			grid-template-columns: 1fr;
			gap: 1.1rem;
		}
		.name {
			font-size: 3.4rem;
		}
		.entry {
			grid-template-columns: 1fr;
			grid-template-areas:
				'meta'
				'title'
				'desc';
			gap: 0.3rem;
		}
	}
</style>
