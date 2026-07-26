export const THEMES = ['milk-sea', 'arch-paper', 'straw-berry', 'persian-indigo'] as const;
export type ThemeName = (typeof THEMES)[number];

// Mirrors the [data-theme] blocks in app.css — kept here too so swatch
// buttons can render every theme's colours, not just the active one.
export const THEME_COLORS: Record<ThemeName, readonly [string, string]> = {
	'milk-sea': ['#F4F1EC', '#191265'],
	'arch-paper': ['#076C45', '#F4F1EC'],
	'straw-berry': ['#F4F1EC', '#990011'],
	'persian-indigo': ['#F4F1EC', '#391285']
};

// Every theme pairs its --c1/--c2 with the same pale off-white, so a swatch
// built from the full pair reads as white-plus-a-color. Swatches use just
// the theme's saturated brand colour (never the pale one) as a solid fill.
export const SWATCH_COLORS: Record<ThemeName, string> = {
	'milk-sea': '#191265',
	'arch-paper': '#076C45',
	'straw-berry': '#990011',
	'persian-indigo': '#391285'
};

export const THEME_LABELS: Record<ThemeName, string> = {
	'milk-sea': 'Milk Sea',
	'arch-paper': 'Arch Paper',
	'straw-berry': 'Strawberry',
	'persian-indigo': 'Persian Indigo'
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
