import { marked } from 'marked';
import sanitizeHtml from 'sanitize-html';

export function renderMarkdown(source: string): string {
	return sanitizeHtml(marked.parse(source, { async: false }));
}
