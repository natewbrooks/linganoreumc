export async function getEvents() {
	const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;

	const eventsRes = await fetch(`${baseUrl}/events/all`, { cache: 'no-store' });
	const datesRes = await fetch(`${baseUrl}/events/dates/all`, { cache: 'no-store' });
	const timesRes = await fetch(`${baseUrl}/events/times/all`, { cache: 'no-store' });
	const imagesRes = await fetch(`${baseUrl}/media/images/events/`, { cache: 'no-store' });

	if (!eventsRes.ok || !datesRes.ok || !timesRes.ok || !imagesRes.ok) {
		console.error({
			events: await eventsRes.text(),
			dates: await datesRes.text(),
			times: await timesRes.text(),
			images: await imagesRes.text(),
		});
		throw new Error('Failed to fetch events or associated data');
	}

	const rawEvents = await eventsRes.json();
	const eventDates = await datesRes.json();
	const eventTimes = await timesRes.json();
	const allImages = await imagesRes.json();

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
}
