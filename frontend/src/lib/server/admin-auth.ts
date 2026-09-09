import { redirect, type Cookies } from '@sveltejs/kit';
import { env } from '$env/dynamic/private';
import { resolve } from '$app/paths';

export const ADMIN_SESSION_COOKIE = 'admin_session';

// The login secret. Prefer ADMIN_PASSWORD (a memorable passphrase); fall
// back to BLOG_API_KEY so deploys without the new var keep working until it
// is set. The API key itself stays the backend credential — it is never
// accepted here once ADMIN_PASSWORD exists.
function adminPassword(): string {
	const password = env.ADMIN_PASSWORD || env.BLOG_API_KEY;
	if (!password) throw new Error('ADMIN_PASSWORD (or BLOG_API_KEY) is not set');
	return password;
}

export function isAdminSession(cookies: Cookies): boolean {
	return cookies.get(ADMIN_SESSION_COOKIE) === adminPassword();
}

export function verifyAdminPassword(password: unknown): boolean {
	return typeof password === 'string' && password !== '' && password === adminPassword();
}

export function requireAdminSession(cookies: Cookies): void {
	if (!isAdminSession(cookies)) {
		redirect(303, resolve('/admin'));
	}
}

export function setAdminSession(cookies: Cookies): void {
	cookies.set(ADMIN_SESSION_COOKIE, adminPassword(), {
		path: '/',
		httpOnly: true,
		secure: true,
		sameSite: 'strict',
		maxAge: 60 * 60 * 24 * 30
	});
}

export function clearAdminSession(cookies: Cookies): void {
	cookies.delete(ADMIN_SESSION_COOKIE, { path: '/' });
}
