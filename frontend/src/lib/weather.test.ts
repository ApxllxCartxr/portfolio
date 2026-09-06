import { describe, expect, it } from 'vitest';
import { describeWeatherCode } from './weather';

describe('describeWeatherCode', () => {
	it('maps clear sky', () => {
		expect(describeWeatherCode(0)).toBe('Clear sky');
	});

	it('maps both thunderstorm codes', () => {
		expect(describeWeatherCode(95)).toBe('Thunderstorm');
		expect(describeWeatherCode(99)).toBe('Thunderstorm with hail');
	});

	it('falls back for unknown codes', () => {
		expect(describeWeatherCode(-1)).toBe('Overcast');
	});
});
