import { getPosts } from '$lib/server/blog-api';
import type { PageServerLoad } from './$types';
import type { PostSummary } from '$lib/types/post';

const RECENT_COUNT = 3;

// Same caching rationale as the blog list route (see blog/+page.server.ts) —
// the backend can blip or cold-start on its free tier. Unlike /blog, this is
// the homepage, so an outage must not 500 the whole site: it's reported
// through `unavailable` instead. Folding it into the empty state made the
// section claim nothing had been published, which isn't the same thing.
export const load: PageServerLoad = async ({ setHeaders }) => {
	setHeaders({ 'cache-control': 'public, max-age=0, s-maxage=60, stale-while-revalidate=300' });

	let recentPosts: PostSummary[] = [];
	let unavailable = false;
	try {
		const summaries = await getPosts();
		recentPosts = [...summaries]
			.sort((a, b) => b.created_at.localeCompare(a.created_at))
			.slice(0, RECENT_COUNT);
	} catch (err) {
		console.error('Failed to load recent posts for the homepage:', err);
		unavailable = true;
	}

	return { recentPosts, unavailable };
};
