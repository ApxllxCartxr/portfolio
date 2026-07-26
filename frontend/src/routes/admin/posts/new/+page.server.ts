import { fail, redirect } from '@sveltejs/kit';
import { BlogApiError, createPost } from '$lib/server/blog-api';
import { requireAdminSession } from '$lib/server/admin-auth';
import { resolve } from '$app/paths';
import type { Actions, PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ cookies }) => {
	requireAdminSession(cookies);
};

export const actions: Actions = {
	default: async ({ request, cookies }) => {
		requireAdminSession(cookies);
		const form = await request.formData();
		const title = String(form.get('title') ?? '').trim();
		const slug = String(form.get('slug') ?? '').trim();
		const excerpt = String(form.get('excerpt') ?? '').trim();
		const content = String(form.get('content') ?? '').trim();
		const published = form.get('published') === 'on';

		if (!title || !content) {
			return fail(400, { error: 'Title and content are required', title, slug, excerpt, content });
		}

		try {
			const post = await createPost({
				title,
				slug: slug || undefined,
				excerpt,
				content,
				published
			});
			redirect(303, resolve('/admin/posts/[id]', { id: String(post.id) }));
		} catch (err) {
			if (err instanceof BlogApiError) {
				return fail(err.status, { error: err.message, title, slug, excerpt, content });
			}
			throw err;
		}
	}
};
