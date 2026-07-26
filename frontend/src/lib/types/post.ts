export interface PostSummary {
	id: number;
	title: string;
	slug: string;
	excerpt: string;
	published: boolean;
	created_at: string;
	updated_at: string;
}

export interface Post extends PostSummary {
	content: string;
}

export interface PostInput {
	title: string;
	slug?: string;
	excerpt?: string;
	content: string;
	published?: boolean;
}
