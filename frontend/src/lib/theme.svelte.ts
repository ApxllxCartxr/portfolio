export const THEMES = ['milk-sea', 'arch-paper', 'straw-berry'] as const;
export type ThemeName = (typeof THEMES)[number];

// Mirrors the [data-theme] blocks in app.css — kept here too so swatch
// buttons can render every theme's colours, not just the active one.
export const THEME_COLORS: Record<ThemeName, readonly [string, string]> = {
	'milk-sea': ['#F4F1EC', '#191265'],
	'arch-paper': ['#076C45', '#F4F1EC'],
	'straw-berry': ['#F4F1EC', '#990011']
};

export const THEME_LABELS: Record<ThemeName, string> = {
	'milk-sea': 'Milk Sea',
	'arch-paper': 'Arch Paper',
	'straw-berry': 'Strawberry'
};

const THEME_KEY = 'theme';
const SWAP_KEY = 'theme-swap';

function readInitialTheme(): ThemeName {
	if (typeof document === 'undefined') return 'milk-sea';
	const current = document.documentElement.dataset.theme;
	return (THEMES as readonly string[]).includes(current ?? '')
		? (current as ThemeName)
		: 'milk-sea';
}

function readInitialSwap(): boolean {
	if (typeof document === 'undefined') return false;
	return document.documentElement.dataset.swap === 'true';
}

export const themeState = $state({
	theme: readInitialTheme(),
	swapped: readInitialSwap()
});

function persist() {
	if (typeof document === 'undefined') return;
	document.documentElement.dataset.theme = themeState.theme;
	document.documentElement.dataset.swap = String(themeState.swapped);
	try {
		localStorage.setItem(THEME_KEY, themeState.theme);
		localStorage.setItem(SWAP_KEY, String(themeState.swapped));
	} catch {
		// localStorage unavailable (private mode, disabled storage) — theme just won't persist.
	}
}

export function setTheme(next: ThemeName) {
	themeState.theme = next;
	persist();
}

export function toggleSwap() {
	themeState.swapped = !themeState.swapped;
	persist();
}
