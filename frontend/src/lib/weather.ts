// WMO weather codes (https://open-meteo.com/en/docs) mapped to a short label.
const CODE_MAP: Record<number, string> = {
	0: 'Clear sky',
	1: 'Mainly clear',
	2: 'Partly cloudy',
	3: 'Overcast',
	45: 'Fog',
	48: 'Fog',
	51: 'Light drizzle',
	53: 'Drizzle',
	55: 'Dense drizzle',
	56: 'Freezing drizzle',
	57: 'Freezing drizzle',
	61: 'Light rain',
	63: 'Rain',
	65: 'Heavy rain',
	66: 'Freezing rain',
	67: 'Freezing rain',
	71: 'Light snow',
	73: 'Snow',
	75: 'Heavy snow',
	77: 'Snow grains',
	80: 'Rain showers',
	81: 'Rain showers',
	82: 'Violent rain showers',
	85: 'Snow showers',
	86: 'Snow showers',
	95: 'Thunderstorm',
	96: 'Thunderstorm with hail',
	99: 'Thunderstorm with hail'
};

const FALLBACK = 'Overcast';

export function describeWeatherCode(code: number): string {
	return CODE_MAP[code] ?? FALLBACK;
}
