import React from 'react';
import { useEvents } from '../contexts/EventsContext';
import { useSettings } from '../contexts/SettingsContext';
import Header from '../components/home/Header';
import Motto from '../components/home/Motto';
import LivestreamEmbed from '../components/media/LivestreamEmbed';
import JoinUs from '../components/home/JoinUs';
import UpcomingEvents from '../components/home/UpcomingEvents';
import StainedGlassDisplay from '../components/home/StainedGlassDisplay';

function Home() {
	const { events, eventDates } = useEvents();
	const { settings } = useSettings();

	const generalSettings = settings.general || {};
	const homeSettings = settings.pages?.home || {};

	// Active Header Image
	const activeHeaderImage =
		(homeSettings.header?.images || []).find((img) => img.active)?.url || null;

	// Motto Banner
	const mottoTitle = homeSettings.mottoBanner?.text?.title || 'LINGANORE UNITED METHODIST CHURCH';
	const mottoSubtext = homeSettings.mottoBanner?.text?.subtext || '';

	// Livestream Details
	const ytChannelID = homeSettings.livestream?.youtubeChannelID || 'default_channel_id';
	const ytAPIKey = homeSettings.livestream?.youtubeAPIKey || '';
	const livestreamText = homeSettings.livestream?.text || {};

	// Displayed Sermons & Events
	const displayedSermons = homeSettings.displayedSermons?.associatedRecurringEvents || [];

	// Join Us Settings
	const joinUsSettings = {
		title: homeSettings.joinUs?.text?.title || '',
		subtext: homeSettings.joinUs?.text?.subtext || '',
		events: homeSettings.joinUs?.events || [],
		locationName: generalSettings.contactInformation?.locationName || '',
		address: generalSettings.contactInformation?.address || '',
		picture: homeSettings.joinUs?.sermonImageURL || '',
	};

	// General Settings Social Media Links
	const socialMediaLinks = generalSettings.socialMediaLinks || [];

	const getUpcomingEventDate = (eventID, requireFutureOnly = false) => {
		const today = new Date();
		today.setHours(0, 0, 0, 0);

		const eventDateList = eventDates.filter((date) => date.eventID === eventID);

		if (requireFutureOnly) {
			const futureDates = eventDateList
				.filter((date) => {
					const eventDate = new Date(date.date);
					eventDate.setHours(0, 0, 0, 0);
					return eventDate >= today;
				})
				.sort((a, b) => new Date(a.date) - new Date(b.date));

			return futureDates.length > 0 ? futureDates[0].date : null;
		}

		const futureDates = eventDateList
			.filter((date) => {
				const eventDate = new Date(date.date);
				eventDate.setHours(0, 0, 0, 0);
				return eventDate >= today;
			})
			.sort((a, b) => new Date(a.date) - new Date(b.date));

		const pastDates = eventDateList
			.filter((date) => {
				const eventDate = new Date(date.date);
				eventDate.setHours(0, 0, 0, 0);
				return eventDate < today;
			})
			.sort((a, b) => new Date(b.date) - new Date(a.date));

		return futureDates.length > 0
			? futureDates[0].date
			: pastDates.length > 0
			? pastDates[0].date
			: null;
	};

	// --- UPCOMING EVENTS LOGIC ---
	const upcomingEventsFromSettings = homeSettings.upcomingEvents?.events || [];
	const isOverridden = upcomingEventsFromSettings.length > 0;

	// Get preset events from settings (shown regardless of date)
	const presetEvents = upcomingEventsFromSettings
		.map(({ eventID }) => {
			const event = events.find((e) => e.id === eventID);
			if (!event) return null;
			return { event, date: getUpcomingEventDate(event.id, false) };
		})
		.filter((entry) => entry !== null); // Remove nulls

	const getNextValidEventDate = (eventID) => {
		const today = new Date();
		today.setHours(0, 0, 0, 0);

		return (
			eventDates
				.filter((d) => d.eventID === eventID && !d.isCancelled)
				.filter((d) => {
					const date = new Date(d.date);
					date.setHours(0, 0, 0, 0);
					return date >= today;
				})
				.sort((a, b) => new Date(a.date) - new Date(b.date))[0]?.date || null
		);
	};

	// Get future chronological events (only future events if settings do NOT override)
	const futureEvents = events
		.map((event) => ({
			event,
			date: getNextValidEventDate(event.id),
		}))
		.filter((entry) => entry.date !== null)
		.sort((a, b) => new Date(a.date) - new Date(b.date));

	// Merge preset events with future events
	const upcomingEvents = [...presetEvents, ...futureEvents]
		.filter((entry, index, self) => self.findIndex((e) => e.event.id === entry.event.id) === index)
		.slice(0, 4);

	return (
		<div className='w-full flex flex-col overflow-hidden'>
			{/* Header */}
			<Header activeHeaderImage={activeHeaderImage} />

			<div className='flex flex-col space-y-50 lg:space-y-72'>
				{/* Motto Banner */}
				<Motto
					title={mottoTitle}
					subtext={mottoSubtext}
				/>

				{/* Join Us Section */}
				<JoinUs
					title={joinUsSettings.title}
					subtext={joinUsSettings.subtext}
					eventIDs={joinUsSettings.events}
					locationName={joinUsSettings.locationName}
					address={joinUsSettings.address}
					picture={joinUsSettings.picture}
				/>

				{/* Livestream Section */}
				{/* <div className='flex flex-col items-center text-center py-6'>
					<LivestreamEmbed
						liveTitle={livestreamText.live?.title}
						liveSubtext={livestreamText.live?.subtext}
						liveSeeMore={livestreamText.live?.seeMore}
						offlineTitle={livestreamText.offline?.title}
						offlineSubtext={livestreamText.offline?.subtext}
						offlineSeeMore={livestreamText.offline?.seeMore}
						ytAPIKey={ytAPIKey}
						ytChannelID={ytChannelID}
						size={600}
						socialLinks={socialMediaLinks}
					/>
				</div> */}

				{/* Upcoming Events */}
				<UpcomingEvents
					title={homeSettings.upcomingEvents?.text?.title || 'Upcoming Events'}
					subtext={homeSettings.upcomingEvents?.text?.subtext || ''}
					events={upcomingEvents}
				/>

				<StainedGlassDisplay stainedGlassImages={homeSettings.stainedGlassDisplay?.images || []} />
			</div>
		</div>
	);
}

export default Home;
