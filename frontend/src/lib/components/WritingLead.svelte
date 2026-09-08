<!--
	Writing, set the way a printed contents page does it: the newest piece
	gets the lead — title in the display face, excerpt under it — and
	everything after it drops to an index line with a dotted leader running
	out to the date.

	Failure modes collapse to one honest line, same as PostList: an error
	banner on a portfolio is louder than the page around it.
-->
<script lang="ts">
	import { resolve } from '$app/paths';
	import SectionHead from './SectionHead.svelte';
	import type { PostSummary } from '$lib/types/post';

	let { posts, unavailable = false }: { posts: PostSummary[]; unavailable?: boolean } = $props();

	const lead = $derived(posts[0]);
	const rest = $derived(posts.slice(1));

	function formatDate(iso: string) {
		return new Date(iso)
			.toLocaleDateString('en-GB', { year: 'numeric', month: 'short', day: '2-digit' })
			.toUpperCase();
	}
</script>

<section class="writing sec" aria-labelledby="writing">
	<SectionHead title="Writing" glyph="writing" id="writing" />

	<div class="body">
		{#if unavailable || !lead}
			<p class="empty">Writing coming soon.</p>
		{:else}
			<a class="lead" href={resolve('/blog/[slug]', { slug: lead.slug })}>
				<time datetime={lead.created_at}>{formatDate(lead.created_at)}</time>
				<h3>{lead.title}</h3>
				{#if lead.excerpt}<p>{lead.excerpt}</p>{/if}
			</a>

			{#if rest.length}
				<ul class="index">
					{#each rest as post (post.id)}
						<li>
							<a href={resolve('/blog/[slug]', { slug: post.slug })}>
								<span class="title">{post.title}</span>
								<span class="leader" aria-hidden="true"></span>
								<time datetime={post.created_at}>{formatDate(post.created_at)}</time>
							</a>
						</li>
					{/each}
				</ul>
			{/if}

			<a class="all" href={resolve('/blog')}>All posts &rarr;</a>
		{/if}
	</div>
</section>

<style>
	.writing {
		padding-block: clamp(2.5rem, 6vh, 4rem);
	}

	.empty {
		margin: 0;
		font-size: 1.05rem;
		color: var(--muted);
	}

	.lead {
		display: block;
		max-width: var(--measure);
		text-decoration: none;
	}

	time {
		font-size: 0.92rem;
		font-weight: 500;
		color: var(--muted);
	}

	.lead h3 {
		margin: 0.4rem 0 0;
		font-family: var(--font-display);
		font-size: var(--t-h1);
		font-weight: 700;
		line-height: 1.05;
		letter-spacing: -0.02em;
		text-wrap: balance;
	}

	.lead:hover h3,
	.lead:focus-visible h3 {
		color: var(--accent);
	}

	.lead p {
		margin: 0.75rem 0 0;
		font-size: 1.02rem;
		line-height: 1.6;
		color: var(--muted);
	}

	.index {
		margin: clamp(1.75rem, 4vh, 2.5rem) 0 0;
		padding: 0;
		list-style: none;
		border-top: var(--rule) solid var(--line);
	}

	.index a {
		display: flex;
		align-items: baseline;
		gap: 0.75rem;
		padding: 1rem 0;
		border-bottom: var(--rule) solid var(--line);
		text-decoration: none;
	}

	.title {
		font-size: 1.15rem;
		font-weight: 500;
	}

	/* The leader is the printed one: dots running out to the date, sized to
	   whatever room is left after the title. */
	.leader {
		flex: 1;
		min-width: 1.5rem;
		border-bottom: 1px dotted var(--comment);
		transform: translateY(-0.25em);
	}

	.index a:hover .title,
	.index a:focus-visible .title {
		color: var(--accent);
	}

	.all {
		display: inline-block;
		margin-top: 1.5rem;
		font-size: 1rem;
		font-weight: 600;
		color: var(--accent);
		text-decoration: underline;
		text-underline-offset: 5px;
		text-decoration-thickness: 1px;
	}
</style>
