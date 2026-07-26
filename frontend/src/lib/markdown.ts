import { marked } from 'marked';
import { FilterXSS } from 'xss';

const sanitizer = new FilterXSS({ stripIgnoreTag: true, stripIgnoreTagBody: ['script'] });

export function renderMarkdown(source: string): string {
	return sanitizer.process(marked.parse(source, { async: false }));
}
