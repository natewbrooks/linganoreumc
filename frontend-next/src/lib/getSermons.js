import { fetchWithRetry } from './fetchWithRetry.js';

export async function getSermons() {
	const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;

	try {
		const res = await fetchWithRetry(`${baseUrl}/sermons/all`, { cache: 'no-store' });
		return res.filter((s) => !s.isArchived);
	} catch (error) {
		console.error('Failed to fetch sermons:', error);
		throw new Error('Failed to fetch sermons');
	}
}
