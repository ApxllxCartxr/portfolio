import { fail } from '@sveltejs/kit';
import { deletePost, getPosts } from '$lib/server/blog-api';
import { requireAdminSession } from '$lib/server/admin-auth';
import type { Actions, PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ cookies }) => {
	requireAdminSession(cookies);
	return { posts: await getPosts(true) };
};

export const actions: Actions = {
	delete: async ({ request, cookies }) => {
		requireAdminSession(cookies);
		const form = await request.formData();
		const id = Number(form.get('id'));
		if (!id) return fail(400, { error: 'Invalid post id' });

		await deletePost(id);
		return { success: true };
	}
};
