import React, { useEffect, useState } from 'react';
import EventItem from './EventItem';
import { Link } from 'react-router-dom';

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
		<div className={`flex flex-col space-y-4`}>
			{/* Header */}
			<div className={`flex flex-row items-center justify-between`}>
				<div className={`flex flex-col`}>
					<div className={`font-dm text-2xl`}>All Events ({events.length})</div>
					<div className={`font-dm text-md`}>Select an event to edit</div>
				</div>
				<Link
					to={'/edit/event/new'}
					className={`font-dm text-bkg text-lg bg-red px-2 `}>
					New Event
				</Link>
			</div>

			{/* list */}
			<div className='flex flex-col font-dm'>
				{events.map((event) => (
					<EventItem
						key={event.id}
						id={event.id}
						title={event.title}
						description={event.description}
					/>
				))}
			</div>
		</div>
	);
}

export default ListEvents;
