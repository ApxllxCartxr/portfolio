import { getPosts } from '$lib/server/blog-api';
import type { PageServerLoad } from './$types';
import type { PostSummary } from '$lib/types/post';

// The backend runs on a free-tier host that can blip or cold-start, so the
// CDN keeps serving the last-known-good list for up to 5 minutes while
// revalidating in the background. If it's down past that, the page still
// renders and says so — a blog-API outage shouldn't 500 a route people
// reached from the nav.
export const load: PageServerLoad = async ({ setHeaders }) => {
	setHeaders({ 'cache-control': 'public, max-age=0, s-maxage=60, stale-while-revalidate=300' });

	let posts: PostSummary[] = [];
	let unavailable = false;
	try {
		posts = await getPosts();
	} catch (err) {
		console.error('Failed to load the post list:', err);
		unavailable = true;
	}

	return { posts, unavailable };
};
