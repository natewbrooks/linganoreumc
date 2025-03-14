import { useEffect, useState } from 'react';
import AnnouncementBanner from './AnnouncementBanner';
import Header from './Header';
import Motto from './Motto';
function App() {
	const [events, setEvents] = useState([]);

	useEffect(() => {
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
	}, []);

	return (
		<div>
			<AnnouncementBanner />
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
		</div>
	);
}

export default App;
