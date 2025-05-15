import Header from '@/components/home/Header';
import Motto from '@/components/home/Motto';
import JoinUs from '@/components/home/JoinUs';
import UpcomingEvents from '@/components/home/UpcomingEvents';
import StainedGlassDisplay from '@/components/home/StainedGlassDisplay';
import { getHomepageData } from '@/lib/getHomepageData';
import { getEvents } from '@/lib/getEvents';

export default async function Home() {
	const { general, home, events, eventDates } = await getHomepageData();
	const { eventTimes, eventImages } = await getEvents(); // image + time hydration

	const activeHeaderImage = (home.header?.images || []).find((img) => img.active)?.url || null;

	const mottoTitle = home.mottoBanner?.text?.title || 'LINGANORE UNITED METHODIST CHURCH';
	const mottoSubtext = home.mottoBanner?.text?.subtext || '';

	const joinUsSettings = {
		title: home.joinUs?.text?.title || '',
		subtext: home.joinUs?.text?.subtext || '',
		eventIDs: (home.joinUs?.events || []).map((e) => e.eventID), // ← explicitly extract eventIDs
		events, // pass all events for lookup
		eventDates,
		eventTimes, // for filtering times
		locationName: general.contactInformation?.locationName || '',
		address: general.contactInformation?.address || '',
		picture: home.joinUs?.sermonImageURL || '',
	};

	const today = new Date();
	today.setHours(0, 0, 0, 0);

	const getUpcomingEventDate = (eventID) => {
		const dates = eventDates.filter((d) => d.eventID === eventID);
		const future = dates.filter((d) => new Date(d.date) >= today);
		const past = dates.filter((d) => new Date(d.date) < today);

		return (
			future.sort((a, b) => new Date(a.date) - new Date(b.date))[0]?.date ||
			past.sort((a, b) => new Date(b.date) - new Date(a.date))[0]?.date ||
			null
		);
	};

	const upcomingFromSettings = home.upcomingEvents?.events || [];

	const presetEvents = upcomingFromSettings
		.map(({ eventID }) => {
			const event = events.find((e) => e.id === eventID);
			if (!event) return null;
			return { event, date: getUpcomingEventDate(event.id) };
		})
		.filter(Boolean);

	const futureEvents = events
		.map((event) => ({
			event,
			date: getUpcomingEventDate(event.id),
		}))
		.filter((e) => e.date !== null)
		.sort((a, b) => new Date(a.date) - new Date(b.date));

	const upcomingEvents = [...presetEvents, ...futureEvents.filter((e) => new Date(e.date) >= today)]
		.filter((entry, index, self) => self.findIndex((e) => e.event.id === entry.event.id) === index)
		.sort((a, b) => new Date(a.date) - new Date(b.date))
		.slice(0, 4);

	return (
		<div className='w-full flex flex-col overflow-hidden'>
			<Header activeHeaderImage={activeHeaderImage} />
			<div className='flex flex-col space-y-50 lg:space-y-72'>
				<Motto
					title={mottoTitle}
					subtext={mottoSubtext}
				/>
				<JoinUs {...joinUsSettings} />
				<UpcomingEvents
					title={home.upcomingEvents?.text?.title || 'Upcoming Events'}
					subtext={home.upcomingEvents?.text?.subtext || ''}
					events={upcomingEvents}
					eventImages={eventImages}
				/>
				<StainedGlassDisplay stainedGlassImages={home.stainedGlassDisplay?.images || []} />
			</div>
		</div>
	);
}
