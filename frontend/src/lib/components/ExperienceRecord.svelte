<!--
	Experience, set with the same section head and rail layout as the stack
	and writing sections. The role details sit on the left, the achievement
	bullets on the right — a two-column spread that uses the full viewport
	width for breathing room.
-->
<script lang="ts">
	import SectionHead from './SectionHead.svelte';
	import { experience } from '$lib/resume-data';

	const role = experience[0];
	const number = (i: number) => String(i + 1).padStart(2, '0');
</script>

{#if role}
	<section class="experience sec" aria-labelledby="experience">
		<SectionHead title="Experience" glyph="experience" id="experience" />

		<div class="body">
			<div class="details">
				<h3>{role.role}</h3>
				<p class="org">{role.org}</p>
				<p class="period">{role.period}</p>
			</div>

			<ul class="achievements">
				{#each role.points as point, i (point)}
					<li>
						<span class="num" aria-hidden="true">{number(i)}</span>
						<span class="text">{point}</span>
					</li>
				{/each}
			</ul>
		</div>
	</section>
{/if}

<style>
	.experience {
		padding-block: clamp(2.5rem, 6vh, 4rem);
		border-bottom: var(--rule) solid var(--line);
	}

	.body {
		display: flex;
		flex-direction: column;
		gap: clamp(1.5rem, 4vh, 2.5rem);
	}

	.details {
		display: flex;
		flex-direction: column;
		gap: 0.35rem;
	}

	h3 {
		margin: 0;
		font-family: var(--font-display);
		font-size: var(--t-h1);
		font-weight: 700;
		line-height: 1.05;
		letter-spacing: -0.02em;
		text-wrap: balance;
	}

	.org {
		margin: 0;
		font-size: 1.02rem;
		font-weight: 500;
		line-height: 1.4;
		color: var(--muted);
	}

	.period {
		margin: 0;
		font-family: var(--font-mono);
		font-size: var(--t-caption);
		line-height: 1.45;
		color: var(--muted);
	}

	.achievements {
		display: flex;
		flex-direction: column;
		gap: clamp(0.85rem, 2vh, 1.25rem);
		margin: 0;
		padding: 0 0 0 1.6rem;
		border-left: var(--rule) solid var(--line);
		list-style: none;
		max-width: 58ch;
	}

	li {
		display: grid;
		grid-template-columns: auto minmax(0, 1fr);
		column-gap: clamp(1rem, 2vw, 1.5rem);
		align-items: baseline;
	}

	.num {
		font-family: var(--font-mono);
		font-size: var(--t-caption);
		color: var(--accent);
	}

	.text {
		font-size: 1.02rem;
		line-height: 1.55;
	}

	@media (min-width: 760px) {
		.body {
			flex-direction: row;
			align-items: flex-start;
			gap: clamp(2rem, 4vw, 4rem);
		}

		.details {
			flex: 0 0 auto;
			min-width: 14rem;
			max-width: 22rem;
			position: sticky;
			top: var(--sticky-top);
		}

		.achievements {
			flex: 1;
		}
	}
</style>
