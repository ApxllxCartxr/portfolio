<!--
	Writing index. Same content-left / meta-right grid the resume uses, so
	the three blocks on the homepage (signature, resume, writing) speak the
	same dialect.

	Failure modes collapse to the same one-liner as an empty list — a live
	error banner on a portfolio is louder than the page around it, so
	"unavailable" and "empty" both render as an honest "writing coming soon"
	and the section quietly waits. The blog list page renders its own
	states; this is just the homepage summary.
-->
<script lang="ts">
	import { resolve } from '$app/paths';
	import type { PostSummary } from '$lib/types/post';

	interface Props {
		posts: PostSummary[];
		showAllLink?: boolean;
		/** API didn't respond. On the homepage this folds into the empty-state
		 *  line; on the /blog index it gets its own honest line so a reader
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
</script>

{#if unavailable || posts.length === 0}
	{#if unavailable && verboseEmpty}
		<p class="empty">Could not reach the blog right now. Try again in a moment.</p>
	{:else}
		<p class="empty">Writing coming soon.</p>
	{/if}
{:else}
	<ul class="posts">
		{#each posts as post (post.id)}
			<li>
				<a href={resolve('/blog/[slug]', { slug: post.slug })}>
					<span class="date">
						<time datetime={post.created_at}>{formatDate(post.created_at)}</time>
					</span>
					<span class="title">{post.title}</span>
					<span class="arrow" aria-hidden="true">&rarr;</span>
					{#if post.excerpt}<span class="excerpt">{post.excerpt}</span>{/if}
				</a>
			</li>
		{/each}
	</ul>

	{#if showAllLink}
		<a class="all" href={resolve('/blog')}>All posts &rarr;</a>
	{/if}
{/if}

<style>
	.empty {
		margin: 0;
		font-family: var(--font-mono);
		font-size: var(--t-caption);
		letter-spacing: var(--t-track);
		text-transform: uppercase;
		color: var(--muted);
	}

	.posts {
		margin: 0;
		padding: 0;
		list-style: none;
		border-top: var(--rule) solid var(--line);
	}

	/* Date rail · title · arrow / excerpt. The excerpt takes the full
	   width below the title on narrow screens, sits beside it on wider. */
	.posts a {
		display: grid;
		grid-template-columns: auto minmax(0, 1fr) auto;
		grid-template-areas:
			'date title arrow'
			'excerpt excerpt excerpt';
		gap: 0.35rem 1.25rem;
		align-items: baseline;
		padding: 1rem 0;
		border-bottom: var(--rule) solid var(--line);
		text-decoration: none;
	}

	@media (min-width: 700px) {
		.posts a {
			grid-template-columns: 6.5rem minmax(0, 1fr) auto;
		}
	}

	.date {
		grid-area: date;
	}

	time {
		font-family: var(--font-mono);
		font-size: var(--t-caption);
		letter-spacing: var(--t-track);
		text-transform: uppercase;
		color: var(--muted);
	}

	.title {
		grid-area: title;
		font-size: 1.05rem;
		font-weight: 600;
		line-height: 1.3;
		letter-spacing: -0.005em;
	}

	.excerpt {
		grid-area: excerpt;
		max-width: 62ch;
		font-size: 0.95rem;
		line-height: 1.5;
		color: var(--muted);
	}

	.arrow {
		grid-area: arrow;
		color: var(--muted);
		transition: transform 150ms ease;
	}

	.posts a:hover .arrow,
	.posts a:focus-visible .arrow {
		color: var(--fg);
		transform: translateX(2px);
	}

	.all {
		display: inline-block;
		margin-top: 1.1rem;
		font-family: var(--font-mono);
		font-size: var(--t-caption);
		letter-spacing: var(--t-track);
		text-transform: uppercase;
		color: var(--muted);
		text-decoration: underline;
		text-underline-offset: 4px;
		text-decoration-thickness: 1px;
	}

	.all:hover,
	.all:focus-visible {
		color: var(--accent);
	}
</style>
