import { getPosts } from '$lib/server/blog-api';
import type { PageServerLoad } from './$types';

// The backend runs on a free-tier host that can blip or cold-start, so the
// CDN keeps serving the last-known-good list for up to 5 minutes while
// revalidating in the background, rather than users seeing an error.
export const load: PageServerLoad = async ({ setHeaders }) => {
	setHeaders({ 'cache-control': 'public, max-age=0, s-maxage=60, stale-while-revalidate=300' });
	return { posts: await getPosts() };
};
