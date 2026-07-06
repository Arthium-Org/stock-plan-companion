import { describe, it, expect } from 'vitest';
import { appsScriptUrl } from '$lib/registration';

describe('registration config', () => {
	it('resolves to the exact deployed Apps Script Web App URL', () => {
		expect(appsScriptUrl).toBe(
			'https://script.google.com/macros/s/AKfycbzM9m0uesrhpzZzDl9mBcpePQx3S8WUfbsyZAVfPcJPxaiId1vxmc31Tge5GmzsZhPi2w/exec'
		);
	});

	it('starts with the Apps Script macros path', () => {
		expect(appsScriptUrl.startsWith('https://script.google.com/macros/s/')).toBe(true);
	});

	it('ends with the /exec deployment suffix', () => {
		expect(appsScriptUrl.endsWith('/exec')).toBe(true);
	});
});
