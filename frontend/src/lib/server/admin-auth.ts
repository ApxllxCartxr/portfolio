import { redirect, type Cookies } from '@sveltejs/kit';
import { env } from '$env/dynamic/private';
import { resolve } from '$app/paths';

export const ADMIN_SESSION_COOKIE = 'admin_session';

function apiKey(): string {
	if (!env.BLOG_API_KEY) throw new Error('BLOG_API_KEY is not set');
	return env.BLOG_API_KEY;
}

export function isAdminSession(cookies: Cookies): boolean {
	return cookies.get(ADMIN_SESSION_COOKIE) === apiKey();
}

export function requireAdminSession(cookies: Cookies): void {
	if (!isAdminSession(cookies)) {
		redirect(303, resolve('/admin'));
	}
}

export function setAdminSession(cookies: Cookies): void {
	cookies.set(ADMIN_SESSION_COOKIE, apiKey(), {
		path: '/',
		httpOnly: true,
		secure: true,
		sameSite: 'strict',
		maxAge: 60 * 60 * 24 * 7
	});
}

export function clearAdminSession(cookies: Cookies): void {
	cookies.delete(ADMIN_SESSION_COOKIE, { path: '/' });
}
