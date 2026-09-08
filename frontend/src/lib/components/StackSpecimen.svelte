<!--
	The stack as a type specimen sheet rather than a wall of equal-weight
	chips: every name is set in the display face at a size proportional to
	how much of my working time it actually takes. Go and Python are large
	because they are what I reach for; Firebase is small because it is not.

	That makes the section an editorial claim instead of an inventory, which
	is the point — a hiring manager can disagree with it, which they cannot
	do with a list of logos. The weights live in resume-data.ts.

	The floor of 1rem is a readability floor, not a design one: nothing on
	the sheet is allowed to become decoration.
-->
<script lang="ts">
	import SectionHead from './SectionHead.svelte';
	import { skillGroups } from '$lib/resume-data';
</script>

<section class="specimen sec" aria-labelledby="stack">
	<SectionHead title="The stack" glyph="stack" id="stack" />

	<div class="body">
		<p class="legend">Every name is set at the size it actually takes up in my week.</p>

		<div class="sheet">
			{#each skillGroups as group (group.label)}
				<div class="group">
					<h3>{group.label}</h3>
					<p class="run">
						{#each group.items as skill, i (skill.name)}<span
								class="item"
								style="--w: {skill.weight}">{skill.name}</span
							>{#if i < group.items.length - 1}<span class="sep" aria-hidden="true">*</span
								>{/if}{/each}
					</p>
				</div>
			{/each}
		</div>
	</div>
</section>

<style>
	.specimen {
		padding-block: clamp(2.5rem, 6vh, 4rem);
		border-bottom: var(--rule) solid var(--line);
	}

	.legend {
		max-width: var(--measure);
		margin: 0 0 clamp(1.75rem, 4vh, 2.5rem);
		font-size: 1.02rem;
		line-height: 1.6;
		color: var(--muted);
	}

	.sheet {
		display: flex;
		flex-direction: column;
		gap: clamp(1.5rem, 4vh, 2.25rem);
	}

	/* The section head is already a left rail, so the group labels stack
	   above their runs rather than opening a second one. */
	.group {
		display: grid;
		gap: 0.6rem;
		padding-top: 1.25rem;
		border-top: var(--rule) solid var(--line);
	}

	/* Group labels are navigation, so they read at body size in the body
	   face rather than as tracked mono fine print. */
	h3 {
		margin: 0;
		font-size: 1rem;
		font-weight: 600;
		line-height: 1.4;
		color: var(--muted);
	}

	/* Baseline-aligned so the different sizes sit on one printed line the way
	   a specimen sheet sets them, not centred like a tag cloud. */
	.run {
		display: flex;
		flex-wrap: wrap;
		align-items: baseline;
		gap: 0.15rem 0.5rem;
		margin: 0;
	}

	.item {
		font-family: var(--font-display);
		font-weight: 400;
		font-size: min(calc(1.15rem + var(--w) * 2.4rem), var(--t-h1));
		line-height: 1.05;
		letter-spacing: -0.015em;
	}

	.sep {
		font-family: var(--font-display);
		font-size: 1.1rem;
		color: var(--accent);
		transform: translateY(-0.15em);
	}
</style>
