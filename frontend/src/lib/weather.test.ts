import { describe, expect, it } from 'vitest';
import { describeWeatherCode } from './weather';

describe('describeWeatherCode', () => {
	it('maps clear sky to sun', () => {
		expect(describeWeatherCode(0)).toEqual({ label: 'Clear sky', icon: 'sun' });
	});

	it('maps thunderstorm codes to the lightning icon', () => {
		expect(describeWeatherCode(95).icon).toBe('cloud-lightning');
		expect(describeWeatherCode(99).icon).toBe('cloud-lightning');
	});

	it('falls back to overcast/cloud for unknown codes', () => {
		expect(describeWeatherCode(-1)).toEqual({ label: 'Overcast', icon: 'cloud' });
	});
});
