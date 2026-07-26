import { getPosts } from '$lib/server/blog-api';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async () => {
	return { posts: await getPosts() };
};
