import { error } from '@sveltejs/kit';
import { getPost } from '$lib/server/blog-api';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ params, setHeaders }) => {
	setHeaders({ 'cache-control': 'public, max-age=0, s-maxage=60, stale-while-revalidate=300' });
	const post = await getPost(params.slug);
	if (!post) error(404, 'Post not found');
	return { post };
};
