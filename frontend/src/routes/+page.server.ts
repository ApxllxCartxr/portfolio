import { getPost, getPosts } from '$lib/server/blog-api';
import type { PageServerLoad } from './$types';
import type { Post } from '$lib/types/post';

// Same caching rationale as the blog list route (see blog/+page.server.ts) —
// the backend can blip or cold-start on its free tier. Unlike /blog, this is
// the homepage — a blog-API outage shouldn't 500 the whole site, so failures
// here are swallowed and the Blog window just falls back to its empty state.
export const load: PageServerLoad = async ({ setHeaders }) => {
	setHeaders({ 'cache-control': 'public, max-age=0, s-maxage=60, stale-while-revalidate=300' });

	let latestPost: Post | null = null;
	try {
		const summaries = await getPosts();
		const [latest] = [...summaries].sort((a, b) => b.created_at.localeCompare(a.created_at));
		latestPost = latest ? await getPost(latest.slug) : null;
	} catch (err) {
		console.error('Failed to load latest post for the homepage Blog window:', err);
	}

	return { latestPost };
};
