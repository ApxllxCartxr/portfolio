/*
	Every section mark on the homepage, in one place.

	All of them are drawn in the same hand as the stack icon in CenterCard and
	the project glyphs in ProjectTicker: a 24×24 box, no fill, 1.8 stroke,
	round caps and joins. Each entry is a list of path `d` strings so a mark
	can be stroked on in order by SectionMark as its section arrives.
*/

export type GlyphId = 'work' | 'experience' | 'stack' | 'writing';

export const glyphs: Record<GlyphId, string[]> = {
	// a framed work with its wall label underneath
	work: ['M3 3.5h18v13H3z', 'M3 8.5h18', 'M8 21h8', 'M8 21v-3', 'M16 21v-3'],

	// a credential on its ribbon
	experience: ['M8 3l4 3.5L16 3', 'M5 6.5h14V21H5z', 'M9 12h6', 'M9 16h4'],

	// the same layered solid as the hero mark, drawn instead of filled
	stack: ['M12 2.5 21 7l-9 4.5L3 7z', 'M3 12l9 4.5 9-4.5', 'M3 17l9 4.5 9-4.5'],

	// a nib, mid-stroke
	writing: ['M3.5 20.5 5 15 15 5l4 4-10 10z', 'M13.5 6.5l4 4', 'M3.5 20.5 9 19']
};
