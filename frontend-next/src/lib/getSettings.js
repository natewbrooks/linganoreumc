import { fetchWithRetry } from './fetchWithRetry.js';

export async function getSettings() {
	const base = process.env.NEXT_PUBLIC_API_BASE_URL;

	try {
		const [general, home] = await Promise.all([
			fetchWithRetry(`${base}/settings/general`, { cache: 'no-store' }),
			fetchWithRetry(`${base}/settings/home`, { cache: 'no-store' }),
		]);

		return { general, home };
	} catch (error) {
		console.error('Failed to fetch settings:', error);
		return { general: null, home: null };
	}
}
