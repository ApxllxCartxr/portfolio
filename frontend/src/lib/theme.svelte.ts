import { browser } from '$app/environment';

export type Theme = 'light' | 'dark';

const STORAGE_KEY = 'theme';
const THEME_COLOR: Record<Theme, string> = { light: '#f6f5f2', dark: '#1a1b26' };

// The inline script in app.html has already resolved and stamped the theme by
// the time this module runs in the browser, so read it back off the element
// rather than re-deriving it (and disagreeing with what's on screen).
function initial(): Theme {
	if (!browser) return 'light';
	return document.documentElement.dataset.theme === 'dark' ? 'dark' : 'light';
}

let current = $state<Theme>(initial());

export function theme(): Theme {
	return current;
}

export function setTheme(next: Theme) {
	current = next;
	document.documentElement.dataset.theme = next;
	document.querySelector('meta[name="theme-color"]')?.setAttribute('content', THEME_COLOR[next]);
	try {
		localStorage.setItem(STORAGE_KEY, next);
	} catch {
		// Private browsing / storage disabled — the theme still applies for this
		// page view, it just won't be remembered.
	}
}

export function toggleTheme() {
	setTheme(current === 'dark' ? 'light' : 'dark');
}
