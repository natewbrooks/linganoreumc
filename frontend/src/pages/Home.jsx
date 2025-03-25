import React from 'react';
import { useEvents } from '../contexts/EventsContext';
import { useSettings } from '../contexts/SettingsContext';
import Header from '../components/home/Header';
import Motto from '../components/home/Motto';
import LivestreamEmbed from '../components/home/LivestreamEmbed';
import JoinUs from '../components/home/JoinUs';
import UpcomingEvents from '../components/home/UpcomingEvents';

function Home() {
	const { events, eventDates } = useEvents();
	const { settings } = useSettings();

	const generalSettings = settings.general || {};
	const homeSettings = settings.pages?.home || {};

	// Active Header Image
	const activeHeaderImage =
		(homeSettings.header?.images || []).find((img) => img.active)?.url || null;

	// Motto Banner
	const mottoTitle = homeSettings.mottoBanner?.text?.title || 'Welcome!';
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

	// Helper function to find the closest available date (future or most recent past)
	const getUpcomingEventDate = (eventID) => {
		const now = new Date();

		// Get all dates for this event
		const eventDateList = eventDates.filter((date) => date.eventID === eventID);

		// Separate past and future dates
		const futureDates = eventDateList
			.filter((date) => new Date(date.date) >= now)
			.sort((a, b) => new Date(a.date) - new Date(b.date)); // Closest future date first

		const pastDates = eventDateList
			.filter((date) => new Date(date.date) < now)
			.sort((a, b) => new Date(b.date) - new Date(a.date)); // Most recent past date first

		// Prefer the closest upcoming date, otherwise fallback to the most recent past date
		return futureDates.length > 0
			? futureDates[0].date
			: pastDates.length > 0
			? pastDates[0].date
			: null;
	};

	// --- UPCOMING EVENTS LOGIC ---
	const upcomingEventsFromSettings = homeSettings.upcomingEvents?.events || [];

	// Get next chronological events by merging events with their closest upcoming date
	const eventsWithDates = events
		.map((event) => ({
			event,
			date: getUpcomingEventDate(event.id),
		}))
		.filter((entry) => entry.date !== null) // Ensure only events with an upcoming date
		.sort((a, b) => new Date(a.date) - new Date(b.date)); // Sort by earliest upcoming date

	// Get the preset events from settings
	const presetEvents = upcomingEventsFromSettings
		.map(({ eventID }) => eventsWithDates.find((entry) => entry.event.id === eventID))
		.filter((entry) => entry); // Remove nulls (if an eventID doesn't match any event)

	// Fill remaining spots with chronological events
	const upcomingEvents = [...presetEvents, ...eventsWithDates]
		.filter((entry, index, self) => self.findIndex((e) => e.event.id === entry.event.id) === index) // Remove duplicates
		.slice(0, 4); // Limit to 4 events

	return (
		<div className='w-full flex flex-col overflow-hidden'>
			{/* Header */}
			<Header activeHeaderImage={activeHeaderImage} />

			<div className='flex flex-col space-y-46'>
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
				<div className='flex flex-col items-center text-center py-6'>
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
				</div>

				{/* Upcoming Events */}
				<UpcomingEvents
					title={homeSettings.upcomingEvents?.text?.title || 'Upcoming Events'}
					subtext={homeSettings.upcomingEvents?.text?.subtext || ''}
					events={upcomingEvents}
				/>

				{/* Displayed Sermons */}
				<div className='flex flex-col px-4 py-6'>
					<h2 className='text-2xl font-bold'>
						{homeSettings.displayedSermons?.text?.title || 'Sermons'}
					</h2>
					<p className='text-gray-600'>{homeSettings.displayedSermons?.text?.subtext || ''}</p>
					{displayedSermons.length > 0 ? (
						displayedSermons.map((sermon, index) => (
							<div
								key={sermon.eventID || index}
								className='border p-2 my-2'>
								{events.find((e) => e.id === sermon.eventID)?.title || 'Unknown Sermon'}
							</div>
						))
					) : (
						<p className='text-darkred'>No displayed sermons.</p>
					)}
				</div>
			</div>
		</div>
	);
}

export default Home;
