import React from 'react';
import { useEvents } from '../contexts/EventsContext';
import { useSettings } from '../contexts/SettingsContext';
import Header from '../components/home/Header';
import Motto from '../components/home/Motto';
import LivestreamEmbed from '../components/home/LivestreamEmbed';
import JoinUs from '../components/home/JoinUs';

function Home() {
	const { events } = useEvents();
	const { settings } = useSettings();
	const homeSettings = settings.pages?.home || {};

	const mottoTitle = homeSettings.mottoBanner?.text?.title || 'Welcome!';
	const mottoSubtext = homeSettings.mottoBanner?.text?.subtext || '';
	const ytChannelID = homeSettings.livestream?.youtubeChannelID || 'default_channel_id';
	const ytAPIKey = homeSettings.livestream?.youtubeAPIKey || '';
	const livestreamText = homeSettings.livestream?.text || {};
	const socialLinks = homeSettings.livestream?.socialLinks || [];
	const displayedSermons = homeSettings.displayedSermons?.associatedRecurringEvents || [];
	const upcomingEvents = homeSettings.upcomingEvents?.events || [];

	const joinUsSettings = {
		title: homeSettings.joinUs?.text?.title || '',
		subtext: homeSettings.joinUs?.text?.subtext || '',
		events: homeSettings.joinUs?.events || [],
		address: homeSettings.joinUs?.text?.address || '',
		picture: homeSettings.joinUs?.sermonImageURL || '',
	};

	return (
		<div className='w-full flex flex-col overflow-hidden'>
			{/* Header */}
			<Header />

			<div className={`flex flex-col space-y-46`}>
				{/* Motto Banner */}
				<Motto
					title={mottoTitle}
					subtext={mottoSubtext}
				/>

				<JoinUs
					title={joinUsSettings.title}
					subtext={joinUsSettings.subtext}
					eventIDs={joinUsSettings.events}
					address={joinUsSettings.address}
					picture={joinUsSettings.picture}
				/>

				{/* Livestream Section */}
				<div className='flex flex-col items-center text-center py-6'>
					<LivestreamEmbed
						socialLinks={socialLinks}
						liveTitle={livestreamText.live?.title}
						liveSubtext={livestreamText.live?.subtext}
						offlineTitle={livestreamText.offline?.title}
						offlineSubtext={livestreamText.offline?.subtext}
						ytAPIKey={ytAPIKey}
						ytChannelID={ytChannelID}
						size={600}
					/>
				</div>

				{/* Upcoming Events */}
				<div className='flex flex-col px-4 py-6'>
					<h2 className='text-2xl font-bold'>
						{homeSettings.upcomingEvents?.text?.title || 'Upcoming Events'}
					</h2>
					<p className='text-gray-600'>{homeSettings.upcomingEvents?.text?.subtext || ''}</p>
					{upcomingEvents.length > 0 ? (
						upcomingEvents.map((event, index) => (
							<div
								key={event.eventID || index}
								className='border p-2 my-2'>
								{events.find((e) => e.id === event.eventID)?.title || 'Unknown Event'}
							</div>
						))
					) : (
						<p className='text-darkred italic'>No upcoming events.</p>
					)}
				</div>

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
