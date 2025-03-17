import React from 'react';
import { useEvents } from '../contexts/EventsContext';
import { useSettings } from '../contexts/SettingsContext';
import Header from '../components/Header';
import Motto from '../components/Motto';
import LivestreamEmbed from '../components/LivestreamEmbed';

function Home() {
	const { events } = useEvents();
	const { settings } = useSettings();
	const homeSettings = settings.pages?.home || {};

	return (
		<div className='w-full flex flex-col'>
			<Header />
			<Motto />

			<h1>Events</h1>
			{events.length > 0 ? (
				events.map((event, index) => (
					<div key={index}>{event.isRecurring === 1 ? event.title : ''}</div>
				))
			) : (
				<p>No events found</p>
			)}

			<LivestreamEmbed
				ytChannelID={homeSettings.ytChannelID || 'default_channel_id'}
				ytAPIKey={homeSettings.ytAPIKey || ''}
				size={600}
			/>
		</div>
	);
}

export default Home;
