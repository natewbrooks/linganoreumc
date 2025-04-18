export async function getHomepageData() {
	const base = process.env.NEXT_PUBLIC_API_BASE_URL;

	const generalRes = await fetch(`${base}/settings/general`);
	const homeRes = await fetch(`${base}/settings/home`);
	const eventsRes = await fetch(`${base}/events/all`);
	const datesRes = await fetch(`${base}/events/dates/all`);
	const timesRes = await fetch(`${base}/events/times/all`);
	const sermonsRes = await fetch(`${base}/sermons/all`);

	if (
		!generalRes.ok ||
		!homeRes.ok ||
		!eventsRes.ok ||
		!datesRes.ok ||
		!timesRes.ok ||
		!sermonsRes.ok
	) {
		console.error({
			general: await generalRes.text(),
			home: await homeRes.text(),
			events: await eventsRes.text(),
			dates: await datesRes.text(),
			times: await timesRes.text(),
			sermons: await sermonsRes.text(),
		});
		throw new Error('Failed to fetch homepage data');
	}

	const general = await generalRes.json();
	const home = await homeRes.json();
	const rawEvents = await eventsRes.json();
	const eventDates = await datesRes.json();
	const eventTimes = await timesRes.json();
	const rawSermons = await sermonsRes.json();

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
}
