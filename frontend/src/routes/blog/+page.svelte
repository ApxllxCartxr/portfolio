<!--
	The writing index. Same section language as the homepage — the display
	face for the heading, a hairline for structure, no tracked mono captions —
	so following "Writing" from the homepage does not walk into a different
	document.
-->
<script lang="ts">
	import PostList from '$lib/components/PostList.svelte';
	import Seo from '$lib/components/Seo.svelte';
	import SectionMark from '$lib/components/SectionMark.svelte';
	import type { PageProps } from './$types';

	let { data }: PageProps = $props();
</script>

<Seo
	title="Writing — Joseph Fernando"
	description="Notes on backends, simulation and real-time systems by Joseph Fernando."
/>

<main class="wrap">
	<header class="head">
		<div class="title">
			<SectionMark glyph="writing" size={2.2} />
			<h1>Writing<span class="mark" aria-hidden="true">*</span></h1>
		</div>
		<p>Notes on the things I build — backends, simulation, and systems under load.</p>
	</header>

	<PostList posts={data.posts} unavailable={data.unavailable} verboseEmpty showAllLink={false} />
</main>

<style>
	.wrap {
		width: 100%;
		max-width: 1080px;
		margin-inline: auto;
		padding: clamp(2.5rem, 7vh, 4.5rem) clamp(1.25rem, 5vw, 2.5rem) clamp(3rem, 8vh, 6rem);
		color: var(--fg);
	}

	.head {
		margin-bottom: clamp(2rem, 5vh, 3rem);
		padding-bottom: clamp(1.25rem, 3vh, 2rem);
		border-bottom: var(--rule) solid var(--line);
	}

	.title {
		display: flex;
		align-items: center;
		gap: 0.7rem;
	}

	h1 {
		margin: 0;
		font-family: var(--font-display);
		font-size: clamp(2.25rem, 5vw, 3.25rem);
		font-weight: 700;
		line-height: 1;
		letter-spacing: -0.025em;
	}

	h1 .mark {
		display: inline-block;
		margin-left: -0.02em;
		font-size: 0.75em;
		vertical-align: 0.42em;
		color: var(--accent);
	}

	.head p {
		max-width: var(--measure);
		margin: 1rem 0 0;
		font-size: 1.05rem;
		line-height: 1.6;
		color: var(--muted);
	}
</style>
