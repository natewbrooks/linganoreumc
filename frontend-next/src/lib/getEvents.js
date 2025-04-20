import { fetchWithRetry } from './fetchWithRetry.js';

export async function getEvents() {
	const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;

	try {
		const [rawEvents, eventDates, eventTimes, allImages] = await Promise.all([
			fetchWithRetry(`${baseUrl}/events/all`, { cache: 'no-store' }),
			fetchWithRetry(`${baseUrl}/events/dates/all`, { cache: 'no-store' }),
			fetchWithRetry(`${baseUrl}/events/times/all`, { cache: 'no-store' }),
			fetchWithRetry(`${baseUrl}/media/images/events/`, { cache: 'no-store' }),
		]);

		const events = rawEvents.filter((event) => !event.isArchived);

		const eventImages = allImages.reduce((acc, img) => {
			const eventID = img.eventID;
			if (!acc[eventID]) acc[eventID] = [];

			acc[eventID].push({
				url: img.photoURL || img.url,
				isThumbnail: img.isThumbnail === 1 || img.isThumbnail === true,
			});

			return acc;
		}, {});

		return {
			events,
			eventDates,
			eventTimes,
			eventImages,
		};
	} catch (error) {
		console.error('Failed to fetch events data:', error);
		throw new Error('Failed to fetch events or associated data');
	}
}
