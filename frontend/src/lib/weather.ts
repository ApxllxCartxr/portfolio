import type { IconName } from './icon-names';

export interface WeatherDescription {
	label: string;
	icon: IconName;
}

// WMO weather codes (https://open-meteo.com/en/docs) mapped to a short
// label and a glyph from Icon.svelte.
const CODE_MAP: Record<number, WeatherDescription> = {
	0: { label: 'Clear sky', icon: 'sun' },
	1: { label: 'Mainly clear', icon: 'cloud-sun' },
	2: { label: 'Partly cloudy', icon: 'cloud-sun' },
	3: { label: 'Overcast', icon: 'cloud' },
	45: { label: 'Fog', icon: 'cloud-fog' },
	48: { label: 'Fog', icon: 'cloud-fog' },
	51: { label: 'Light drizzle', icon: 'cloud-rain' },
	53: { label: 'Drizzle', icon: 'cloud-rain' },
	55: { label: 'Dense drizzle', icon: 'cloud-rain' },
	56: { label: 'Freezing drizzle', icon: 'cloud-rain' },
	57: { label: 'Freezing drizzle', icon: 'cloud-rain' },
	61: { label: 'Light rain', icon: 'cloud-rain' },
	63: { label: 'Rain', icon: 'cloud-rain' },
	65: { label: 'Heavy rain', icon: 'cloud-rain' },
	66: { label: 'Freezing rain', icon: 'cloud-rain' },
	67: { label: 'Freezing rain', icon: 'cloud-rain' },
	71: { label: 'Light snow', icon: 'cloud-snow' },
	73: { label: 'Snow', icon: 'cloud-snow' },
	75: { label: 'Heavy snow', icon: 'cloud-snow' },
	77: { label: 'Snow grains', icon: 'cloud-snow' },
	80: { label: 'Rain showers', icon: 'cloud-rain' },
	81: { label: 'Rain showers', icon: 'cloud-rain' },
	82: { label: 'Violent rain showers', icon: 'cloud-rain' },
	85: { label: 'Snow showers', icon: 'cloud-snow' },
	86: { label: 'Snow showers', icon: 'cloud-snow' },
	95: { label: 'Thunderstorm', icon: 'cloud-lightning' },
	96: { label: 'Thunderstorm with hail', icon: 'cloud-lightning' },
	99: { label: 'Thunderstorm with hail', icon: 'cloud-lightning' }
};

const FALLBACK: WeatherDescription = { label: 'Overcast', icon: 'cloud' };

export function describeWeatherCode(code: number): WeatherDescription {
	return CODE_MAP[code] ?? FALLBACK;
}
