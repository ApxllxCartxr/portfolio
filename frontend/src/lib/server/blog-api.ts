import { env } from '$env/dynamic/private';
import type { Post, PostInput, PostSummary } from '$lib/types/post';

class BlogApiError extends Error {
	constructor(
		public status: number,
		message: string
	) {
		super(message);
	}
}

// The Go API's free-tier host occasionally drops a request at the edge
// before it reaches the app (connection race on a spun-down/cold instance).
// A couple of quick retries clear almost all of these — real 4xx/5xx
// responses from the app itself still surface immediately, only network-level
// failures and edge 404s are retried.
const RETRY_DELAYS_MS = [250, 750];

async function request<T>(path: string, init?: RequestInit, attempt = 0): Promise<T> {
	let res: Response;
	try {
		res = await fetch(`${env.BLOG_API_BASE_URL}${path}`, {
			...init,
			headers: {
				'Content-Type': 'application/json',
				...init?.headers
			}
		});
	} catch (err) {
		if (attempt < RETRY_DELAYS_MS.length) {
			await new Promise((r) => setTimeout(r, RETRY_DELAYS_MS[attempt]));
			return request<T>(path, init, attempt + 1);
		}
		throw err;
	}

	if (!res.ok) {
		const isEdgeDrop = res.status === 404 && res.headers.get('x-render-routing') === 'no-server';
		if (isEdgeDrop && attempt < RETRY_DELAYS_MS.length) {
			await new Promise((r) => setTimeout(r, RETRY_DELAYS_MS[attempt]));
			return request<T>(path, init, attempt + 1);
		}
		const body = await res.json().catch(() => ({ error: res.statusText }));
		throw new BlogApiError(res.status, body.error ?? res.statusText);
	}

	if (res.status === 204) return undefined as T;
	return res.json() as Promise<T>;
}

function authHeaders(): HeadersInit {
	return { Authorization: `Bearer ${env.BLOG_API_KEY}` };
}

export function getPosts(includeDrafts = false): Promise<PostSummary[]> {
	return request<PostSummary[]>('/posts', includeDrafts ? { headers: authHeaders() } : undefined);
}

export function getPost(slug: string, includeDrafts = false): Promise<Post | null> {
	return request<Post>(
		`/posts/${slug}`,
		includeDrafts ? { headers: authHeaders() } : undefined
	).catch((err) => {
		if (err instanceof BlogApiError && err.status === 404) return null;
		throw err;
	});
}

export function getPostById(id: number): Promise<Post | null> {
	return request<Post>(`/posts/id/${id}`, { headers: authHeaders() }).catch((err) => {
		if (err instanceof BlogApiError && err.status === 404) return null;
		throw err;
	});
}

export function createPost(input: PostInput): Promise<Post> {
	return request<Post>('/posts', {
		method: 'POST',
		headers: authHeaders(),
		body: JSON.stringify(input)
	});
}

export function updatePost(id: number, input: PostInput): Promise<Post> {
	return request<Post>(`/posts/${id}`, {
		method: 'PUT',
		headers: authHeaders(),
		body: JSON.stringify(input)
	});
}

export function deletePost(id: number): Promise<void> {
	return request<void>(`/posts/${id}`, { method: 'DELETE', headers: authHeaders() });
}

export { BlogApiError };
