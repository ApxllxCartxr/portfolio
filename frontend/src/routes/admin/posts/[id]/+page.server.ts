import { error, fail, redirect } from '@sveltejs/kit';
import { BlogApiError, deletePost, getPostById, updatePost } from '$lib/server/blog-api';
import { requireAdminSession } from '$lib/server/admin-auth';
import { resolve } from '$app/paths';
import type { Actions, PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ params, cookies }) => {
	requireAdminSession(cookies);
	const post = await getPostById(Number(params.id));
	if (!post) error(404, 'Post not found');
	return { post };
};

export const actions: Actions = {
	update: async ({ request, params, cookies }) => {
		requireAdminSession(cookies);
		const form = await request.formData();
		const title = String(form.get('title') ?? '').trim();
		const slug = String(form.get('slug') ?? '').trim();
		const excerpt = String(form.get('excerpt') ?? '').trim();
		const content = String(form.get('content') ?? '').trim();
		const published = form.get('published') === 'on';

		if (!title || !slug || !content) {
			return fail(400, { error: 'Title, slug, and content are required' });
		}

		try {
			await updatePost(Number(params.id), { title, slug, excerpt, content, published });
		} catch (err) {
			if (err instanceof BlogApiError) return fail(err.status, { error: err.message });
			throw err;
		}

		return { success: true };
	},

	delete: async ({ params, cookies }) => {
		requireAdminSession(cookies);
		await deletePost(Number(params.id));
		redirect(303, resolve('/admin/posts'));
	}
};
