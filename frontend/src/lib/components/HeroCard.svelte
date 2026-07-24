<script lang="ts">
	import { profile, contacts, experience, projects, education, focus, skills } from '$lib/resume';
	import Badge from './Badge.svelte';
	import Icon from './Icon.svelte';
</script>

<article class="sheet">
	<span class="rule"></span>

	<header class="head">
		<h1 class="name">{profile.name}<span class="mark">*</span></h1>
		<p class="intro">
			<strong>{profile.lead}</strong>
			{profile.intro}
			<span class="cta">{profile.cta}</span>
		</p>
	</header>

	<span class="rule"></span>

	<section class="row row--badges">
		<div class="col">
			<span class="label">Skills</span>
			<div class="pills">
				{#each skills as s (s)}
					<Badge label={s} />
				{/each}
			</div>
		</div>
		<div class="col">
			<span class="label">Focus</span>
			<div class="pills">
				{#each focus as f (f)}
					<Badge label={f} invert />
				{/each}
			</div>
		</div>
	</section>

	<span class="rule"></span>

	<section class="row row--exp">
		<div class="col col--wide">
			<span class="label">Experience</span>
			{#each experience as job (job.company)}
				<div class="entry">
					<div class="entry__meta">{job.period}</div>
					<div class="entry__title">
						<span class="tt">{job.company}</span>
						<span class="ts">{job.role}</span>
						<span class="ts">{job.location}</span>
					</div>
					<p class="entry__desc">{job.summary}</p>
				</div>
			{/each}

			<span class="label label--mt">Projects</span>
			{#each projects as p (p.name)}
				<div class="entry">
					<div class="entry__meta">{p.stack}</div>
					<div class="entry__title">
						<span class="tt">{p.name}</span>
						<span class="ts">{p.tagline}</span>
					</div>
					<p class="entry__desc">{p.summary}</p>
				</div>
			{/each}
		</div>

		<div class="col col--narrow">
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
	</section>

	<span class="rule"></span>

	<footer class="foot">
		<span>{profile.fullName}</span>
		<span>Résumé</span>
		<span>2026</span>
	</footer>
</article>

<style>
	.sheet {
		display: flex;
		flex-direction: column;
		gap: 0.62rem;
		height: 100%;
		padding: 1.5rem;
		background: var(--sheet);
		border-radius: 14px;
	}

	.rule {
		display: block;
		height: 1px;
		background: var(--rule);
		flex: none;
	}

	/* ---------- header ---------- */
	.head {
		display: grid;
		grid-template-columns: minmax(0, 1.05fr) minmax(0, 1fr);
		gap: clamp(1rem, 3vw, 3rem);
		align-items: start;
	}
	.name {
		font-family: var(--font-display);
		font-weight: 400;
		font-size: 3.5rem;
		line-height: 0.92;
		letter-spacing: -0.01em;
		color: var(--name);
	}
	.mark {
		color: var(--red);
		margin-left: 0.1em;
	}
	.intro {
		font-size: clamp(0.95rem, 1.05vw, 1.08rem);
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

	/* ---------- rows ---------- */
	.row {
		display: grid;
		grid-template-columns: minmax(0, 1.05fr) minmax(0, 1fr);
		gap: clamp(1rem, 3vw, 3rem);
	}
	.row--exp {
		grid-template-columns: minmax(0, 1.5fr) minmax(0, 1fr);
	}
	.row--badges {
		grid-template-columns: 1fr;
		gap: 0.7rem;
	}
	.col {
		min-width: 0;
	}

	.label {
		display: block;
		font-family: var(--font-title);
		font-size: 0.9rem;
		font-weight: 600;
		letter-spacing: 0.02em;
		color: var(--pill-text);
		margin-bottom: 0.55rem;
	}
	.label--mt {
		margin-top: 0.85rem;
	}
	.label--red {
		color: var(--red);
	}

	.pills {
		display: flex;
		flex-wrap: wrap;
		gap: 0.45rem;
	}

	/* ---------- entries ---------- */
	.entry {
		display: grid;
		grid-template-columns: minmax(10rem, 12.5rem) minmax(0, 1fr);
		grid-template-areas:
			'meta meta'
			'title desc';
		gap: 0.2rem 1.6rem;
		align-items: start;
	}
	.entry + .entry {
		margin-top: 0.72rem;
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
		font-size: 0.82rem;
		line-height: 1.35;
		color: var(--muted);
		font-variant-numeric: tabular-nums;
		white-space: nowrap;
	}
	.entry__title {
		grid-area: title;
		display: flex;
		flex-direction: column;
		gap: 0.1rem;
		line-height: 1.2;
	}
	.tt {
		font-family: var(--font-title);
		font-weight: 700;
		font-size: 1.1rem;
		color: var(--text);
	}
	.ts {
		font-size: 0.82rem;
		color: var(--muted);
	}
	.entry__desc {
		grid-area: desc;
		font-size: 0.92rem;
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
		gap: 0.4rem;
	}
	.contact {
		display: inline-flex;
		align-items: center;
		gap: 0.5rem;
		font-size: 0.9rem;
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
		font-size: 0.76rem;
		color: var(--faint);
		letter-spacing: 0.02em;
	}

	/* ---------- responsive ---------- */
	@media (max-width: 900px) {
		.sheet {
			height: auto;
			overflow: visible;
			gap: 1rem;
		}
		.head,
		.row {
			grid-template-columns: 1fr;
			gap: 1.1rem;
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
