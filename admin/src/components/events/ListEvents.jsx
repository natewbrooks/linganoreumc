import React, { useEffect, useState } from 'react';
import EventItem from './EventItem';

function ListEvents() {
	const [events, setEvents] = useState([]);
	const [error, setError] = useState(null);

	// Fetch events from backend API on component mount
	useEffect(() => {
		fetch('http://localhost:5000/events')
			.then((response) => {
				if (!response.ok) {
					throw new Error('Failed to fetch events');
				}
				return response.json();
			})
			.then((data) => setEvents(data))
			.catch((err) => setError(err.message));
	}, []);

	if (error) {
		return <div>Error: {error}</div>;
	}

	if (events.length === 0) {
		return <div>Loading events...</div>;
	}

	return (
		<div className='flex flex-col space-y-2 font-dm'>
			{events.map((event) => (
				<EventItem
					key={event.id}
					id={event.id}
					title={event.title}
					description={event.description}
				/>
			))}
		</div>
	);
}

export default ListEvents;
