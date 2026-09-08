<!--
	Writing index — the /blog page. Set as an editorial running index rather
	than a narrow list: each entry carries a folio ordinal, the title in the
	display face at reading size, and the excerpt beneath it, with the date
	as mono fine print on the right. Numbered rows make the list skimmable —
	you can read just the ordinals and titles in a sweep, then drop into an
	excerpt where one snags.

	The title's underline is the only motion: it strokes in from the left on
	hover, the one action the page offers, so nothing else competes with it.

	Failure modes collapse to the same one-liner as an empty list — a live
	error banner on a portfolio is louder than the page around it, so
	"unavailable" and "empty" both render as an honest "writing coming soon"
	and the section quietly waits.
-->
<script lang="ts">
	import { resolve } from '$app/paths';
	import type { PostSummary } from '$lib/types/post';

	interface Props {
		posts: PostSummary[];
		showAllLink?: boolean;
		/** API didn't respond. Renders the explicit outage line so a reader
		 *  who came for posts knows the page tried and is worth a retry. */
		unavailable?: boolean;
		/** Render the explicit outage line instead of collapsing to "coming soon". */
		verboseEmpty?: boolean;
	}

	let { posts, showAllLink = true, unavailable = false, verboseEmpty = false }: Props = $props();

	function formatDate(iso: string) {
		return new Date(iso)
			.toLocaleDateString('en-GB', { year: 'numeric', month: 'short', day: '2-digit' })
			.toUpperCase();
	}

	const number = (i: number) => String(i + 1).padStart(2, '0');
</script>

{#if unavailable || posts.length === 0}
	{#if unavailable && verboseEmpty}
		<p class="empty">Could not reach the blog right now. Try again in a moment.</p>
	{:else}
		<p class="empty">Writing coming soon.</p>
	{/if}
{:else}
	<ol class="index">
		{#each posts as post, i (post.id)}
			<li>
				<a href={resolve('/blog/[slug]', { slug: post.slug })}>
					<span class="num" aria-hidden="true">{number(i)}</span>
					<div class="body">
						<h2>{post.title}</h2>
						{#if post.excerpt}<p class="excerpt">{post.excerpt}</p>{/if}
					</div>
					<time datetime={post.created_at}>{formatDate(post.created_at)}</time>
				</a>
			</li>
		{/each}
	</ol>

	{#if showAllLink}
		<a class="all" href={resolve('/blog')}>All posts &rarr;</a>
	{/if}
{/if}

<style>
	.empty {
		margin: 0;
		font-size: 1.05rem;
		color: var(--muted);
	}

	.index {
		margin: 0;
		padding: 0;
		list-style: none;
		border-top: var(--rule) solid var(--line);
	}

	.index li {
		border-bottom: var(--rule) solid var(--line);
	}

	/* Number · title-and-excerpt · date. On desktop the date parks on the
	   right at the title's baseline, so the eye has a fixed meta column to
	   chase down while the titles step down the left. */
	.index a {
		display: grid;
		grid-template-columns: auto minmax(0, 1fr) auto;
		grid-template-areas:
			'num body date'
			'. excerpt date';
		column-gap: clamp(1rem, 2.5vw, 2rem);
		row-gap: 0.3rem;
		align-items: baseline;
		padding: clamp(1rem, 2.5vh, 1.5rem) 0;
		text-decoration: none;
	}

	.num {
		grid-area: num;
		font-family: var(--font-mono);
		font-size: var(--t-caption);
		color: var(--accent);
	}

	.body {
		grid-area: body;
		min-width: 0;
	}

	h2 {
		margin: 0;
		padding-bottom: 0.12em;
		font-family: var(--font-display);
		font-size: clamp(1.35rem, 2.4vw, 1.9rem);
		font-weight: 700;
		line-height: 1.1;
		letter-spacing: -0.02em;
		text-wrap: balance;
		/* The animated underline: a gradient hairline that sweeps in from the
		   left on hover. `background-position: left calc(100% - ...)` pins it
		   to the bottom of the last line when the title wraps. */
		background-image: linear-gradient(var(--accent), var(--accent));
		background-repeat: no-repeat;
		background-position: left calc(100% - 0.04em);
		background-size: 0% 1px;
		transition: background-size 300ms ease;
	}

	.index a:hover h2,
	.index a:focus-visible h2 {
		background-size: 100% 1px;
	}

	.excerpt {
		grid-area: excerpt;
		max-width: 60ch;
		margin: 0;
		font-size: 0.95rem;
		line-height: 1.45;
		color: var(--muted);
		/* Two-line clamp keeps the list skimmable — long excerpts collapse
		   to the same silhouette as short ones. */
		display: -webkit-box;
		-webkit-box-orient: vertical;
		-webkit-line-clamp: 2;
		overflow: hidden;
		line-clamp: 2;
	}

	time {
		grid-area: date;
		font-family: var(--font-mono);
		font-size: var(--t-caption);
		line-height: 1.5;
		color: var(--muted);
		white-space: nowrap;
		transition: color 150ms ease;
	}

	.index a:hover time,
	.index a:focus-visible time {
		color: var(--accent);
	}

	.all {
		display: inline-block;
		margin-top: 1.1rem;
		font-size: 1rem;
		font-weight: 600;
		color: var(--muted);
		text-decoration: underline;
		text-underline-offset: 4px;
		text-decoration-thickness: 1px;
	}

	.all:hover,
	.all:focus-visible {
		color: var(--accent);
	}

	@media (max-width: 640px) {
		.index a {
			grid-template-areas:
				'num body'
				'. excerpt';
			align-items: start;
		}

		/* The date drops out of the meta column and reads as a caption over
		   the title on narrow screens. */
		.index a time {
			display: none;
		}
	}
</style>
