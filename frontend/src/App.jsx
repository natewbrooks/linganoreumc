import { useEffect, useState } from 'react';
import AnnouncementBanner from './AnnouncementBanner';
import Header from './Header';
import Motto from './Motto';
import LivestreamEmbed from './LivestreamEmbed';

function App() {
	const [events, setEvents] = useState([]);
	const [generalSettings, setGeneralSettings] = useState(null);

	useEffect(() => {
		// Fetch events
		fetch('http://localhost:5000/api/events/all/')
			.then((response) => {
				if (!response.ok) {
					throw new Error('Failed to fetch event dates');
				}
				return response.json();
			})
			.then((data) => {
				setEvents(data);
			})
			.catch((error) => {
				console.error('Error fetching events:', error);
			});

		// Fetch general settings
		fetch('http://localhost:5000/api/settings/general/')
			.then((response) => {
				if (!response.ok) {
					throw new Error('Failed to fetch general settings');
				}
				return response.json();
			})
			.then((data) => {
				setGeneralSettings(data);
			})
			.catch((error) => {
				console.error('Error fetching general settings:', error);
			});
	}, []);

	return (
		<div>
			{generalSettings &&
				generalSettings.announcementBanner &&
				generalSettings.announcementBanner.enabled && (
					<AnnouncementBanner
						title={generalSettings.announcementBanner.title}
						subtext={generalSettings.announcementBanner.subtext}
					/>
				)}
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
				ytChannelID='UCXBE_QQSZueB8082ml5fslg'
				ytAPIKey=''
				size={600}
			/>
		</div>
	);
}

export default App;
