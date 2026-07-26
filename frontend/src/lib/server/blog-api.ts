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

async function request<T>(path: string, init?: RequestInit): Promise<T> {
	const res = await fetch(`${env.BLOG_API_BASE_URL}${path}`, {
		...init,
		headers: {
			'Content-Type': 'application/json',
			...init?.headers
		}
	});

	if (!res.ok) {
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
