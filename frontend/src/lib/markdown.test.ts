import { describe, expect, it } from 'vitest';
import { renderMarkdown } from './markdown';

describe('renderMarkdown', () => {
	it('renders headings and paragraphs', () => {
		const html = renderMarkdown('# Title\n\nSome **bold** text.');
		expect(html).toContain('<h1>Title</h1>');
		expect(html).toContain('<strong>bold</strong>');
	});

	it('strips script tags', () => {
		const html = renderMarkdown('<script>alert(1)</script>\n\nSafe text.');
		expect(html).not.toContain('<script>');
		expect(html).toContain('Safe text.');
	});
});
