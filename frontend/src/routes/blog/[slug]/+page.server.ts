import { error } from '@sveltejs/kit';
import { getPost } from '$lib/server/blog-api';
import { renderMarkdown } from '$lib/markdown';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ params, setHeaders }) => {
	setHeaders({ 'cache-control': 'public, max-age=0, s-maxage=600, stale-while-revalidate=86400' });
	const post = await getPost(params.slug);
	if (!post) error(404, 'Post not found');
	return { post, html: renderMarkdown(post.content) };
};
