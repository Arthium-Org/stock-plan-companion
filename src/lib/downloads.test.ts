import { describe, it, expect } from 'vitest';
import { macDownloadUrl, repoUrl, windowsAvailable } from '$lib/downloads';

describe('downloads config', () => {
	it('resolves the macOS download to the exact latest-release asset URL', () => {
		expect(macDownloadUrl).toBe(
			'https://github.com/Arthium-Org/stock-plan-companion-app/releases/latest/download/StockPlanCompanion-arm64.dmg'
		);
	});

	it('marks Windows as unavailable', () => {
		expect(windowsAvailable).toBe(false);
	});

	it('uses the version-less latest-release path on the app repo', () => {
		expect(macDownloadUrl).toContain('releases/latest/download/');
		expect(macDownloadUrl).toContain('stock-plan-companion-app');
	});

	it('resolves repoUrl to the exact app-repo GitHub URL', () => {
		expect(repoUrl).toBe('https://github.com/Arthium-Org/stock-plan-companion-app');
	});

	it('includes the -app suffix in repoUrl (guards against the stale-repo bug)', () => {
		expect(repoUrl).toContain('stock-plan-companion-app');
	});
});
