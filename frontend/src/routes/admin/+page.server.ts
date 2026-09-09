import { fail, redirect } from '@sveltejs/kit';
import { resolve } from '$app/paths';
import { isAdminSession, setAdminSession, verifyAdminPassword } from '$lib/server/admin-auth';
import type { Actions, PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ cookies }) => {
	if (isAdminSession(cookies)) {
		redirect(303, resolve('/admin/posts'));
	}
};

export const actions: Actions = {
	default: async ({ request, cookies }) => {
		const form = await request.formData();

		if (!verifyAdminPassword(form.get('password'))) {
			return fail(401, { error: 'Incorrect password' });
		}

		setAdminSession(cookies);
		redirect(303, resolve('/admin/posts'));
	}
};
