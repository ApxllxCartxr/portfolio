<!--
	Writing index: date rail on the left, title and excerpt on the right. The
	homepage used to render the whole latest post inline, which buried the
	sections around it — a dated index says the same thing in three lines and
	sends people to the post itself.
-->
<script lang="ts">
	import { page } from '$app/state';
	import { resolve } from '$app/paths';
	import type { PostSummary } from '$lib/types/post';

	interface Props {
		posts: PostSummary[];
		/** Hidden on /blog itself, where the list is already the whole page. */
		showAllLink?: boolean;
		/** The blog API didn't answer. Distinct from an empty list: one means
		 *  come back later, the other means nothing was ever written. */
		unavailable?: boolean;
	}

	let { posts, showAllLink = true, unavailable = false }: Props = $props();

	function formatDate(iso: string) {
		return new Date(iso)
			.toLocaleDateString('en-GB', { year: 'numeric', month: 'short', day: '2-digit' })
			.toUpperCase();
	}
</script>

{#if unavailable}
	<p class="notice">
		Posts aren't loading — the blog API isn't responding. The rest of the site is unaffected.
		<a href={page.url.pathname} data-sveltekit-reload>Try again</a>
	</p>
{:else if posts.length === 0}
	<p class="empty">
		Nothing published yet. The code is on
		<a href="https://github.com/apxllxcartxr" target="_blank" rel="noreferrer">GitHub</a> in the meantime.
	</p>
{:else}
	<ul class="posts">
		{#each posts as post (post.id)}
			<li>
				<a href={resolve('/blog/[slug]', { slug: post.slug })}>
					<span class="title">{post.title}</span>
					<time datetime={post.created_at}>{formatDate(post.created_at)}</time>
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
	.notice {
		margin: 0;
		padding: 1rem 1.1rem;
		border: 1px solid var(--line);
		border-radius: var(--radius);
		background: var(--bg-raised);
		font-family: var(--font-body);
		font-size: 0.95rem;
		line-height: 1.6;
		color: var(--muted);
	}

	.notice a {
		color: var(--fg);
		text-decoration: underline;
		text-underline-offset: 3px;
	}

	.empty {
		font-family: var(--font-body);
		color: var(--muted);
		margin: 0;
	}

	.empty a {
		color: var(--fg);
		text-decoration: underline;
		text-underline-offset: 3px;
	}

	.posts {
		list-style: none;
		margin: 0;
		padding: 0;
		border-top: 1px solid var(--line);
	}

	/* Every index row on the site reads content-left / meta-right against a
	   hairline — the same shape as a resume entry. The date used to sit in its
	   own 7rem rail, which fought the section label's 13rem rail around it. */
	.posts a {
		display: grid;
		grid-template-columns: minmax(0, 1fr) auto;
		grid-template-areas:
			'date date'
			'title arrow'
			'excerpt excerpt';
		gap: 0.3rem 1.25rem;
		align-items: baseline;
		padding: 1rem 0;
		border-bottom: 1px solid var(--line);
		text-decoration: none;
	}

	time {
		grid-area: date;
		font-family: var(--font-mono);
		font-size: 0.7rem;
		letter-spacing: 0.04em;
		color: var(--muted);
	}

	.title {
		grid-area: title;
		font-family: var(--font-title);
		font-size: 1.15rem;
		font-weight: 600;
		line-height: 1.3;
	}

	.excerpt {
		grid-area: excerpt;
		font-family: var(--font-body);
		font-size: 0.92rem;
		line-height: 1.5;
		color: var(--muted);
		max-width: 62ch;
	}

	.arrow {
		grid-area: arrow;
		color: var(--muted);
	}

	.posts a:hover .arrow,
	.posts a:focus-visible .arrow {
		color: var(--fg);
	}

	.all {
		display: inline-block;
		margin-top: 1.1rem;
		font-family: var(--font-mono);
		font-size: 0.75rem;
		color: var(--muted);
		text-decoration: underline;
		text-underline-offset: 3px;
	}

	.all:hover,
	.all:focus-visible {
		color: var(--fg);
	}

	@media (min-width: 700px) {
		.posts a {
			grid-template-columns: minmax(0, 1fr) auto auto;
			grid-template-areas:
				'title date arrow'
				'excerpt excerpt excerpt';
		}
	}
</style>
