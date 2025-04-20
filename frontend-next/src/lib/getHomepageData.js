import { fetchWithRetry } from './fetchWithRetry.js';

export async function getHomepageData() {
	const base = process.env.NEXT_PUBLIC_API_BASE_URL;

	try {
		const [generalResult, homeResult, eventsResult, datesResult, timesResult, sermonsResult] =
			await Promise.allSettled([
				fetchWithRetry(`${base}/settings/general`, { cache: 'no-store' }),
				fetchWithRetry(`${base}/settings/home`, { cache: 'no-store' }),
				fetchWithRetry(`${base}/events/all`, { cache: 'no-store' }),
				fetchWithRetry(`${base}/events/dates/all`, { cache: 'no-store' }),
				fetchWithRetry(`${base}/events/times/all`, { cache: 'no-store' }),
				fetchWithRetry(`${base}/sermons/all`, { cache: 'no-store' }),
			]);

		const general = generalResult.status === 'fulfilled' ? generalResult.value : {};
		const home = homeResult.status === 'fulfilled' ? homeResult.value : {};
		const rawEvents = eventsResult.status === 'fulfilled' ? eventsResult.value : [];
		const eventDates = datesResult.status === 'fulfilled' ? datesResult.value : [];
		const eventTimes = timesResult.status === 'fulfilled' ? timesResult.value : [];
		const rawSermons = sermonsResult.status === 'fulfilled' ? sermonsResult.value : [];

		if (!general || !home) {
			throw new Error('Failed to fetch critical homepage data');
		}

		const events = rawEvents.filter((e) => !e.isArchived);
		const sermons = rawSermons.filter((s) => !s.isArchived);

		return {
			general,
			home,
			events,
			eventDates,
			eventTimes,
			sermons,
		};
	} catch (error) {
		console.error('Error fetching homepage data:', error);
		throw new Error('Failed to fetch homepage data');
	}
}
