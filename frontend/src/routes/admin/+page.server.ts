import { fail, redirect } from '@sveltejs/kit';
import { env } from '$env/dynamic/private';
import { resolve } from '$app/paths';
import { isAdminSession, setAdminSession } from '$lib/server/admin-auth';
import type { Actions, PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ cookies }) => {
	if (isAdminSession(cookies)) {
		redirect(303, resolve('/admin/posts'));
	}
};

export const actions: Actions = {
	default: async ({ request, cookies }) => {
		const form = await request.formData();
		const password = form.get('password');

		if (typeof password !== 'string' || password !== env.BLOG_API_KEY) {
			return fail(401, { error: 'Incorrect password' });
		}

		setAdminSession(cookies);
		redirect(303, resolve('/admin/posts'));
	}
};
