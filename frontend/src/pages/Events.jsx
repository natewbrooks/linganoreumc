import React from 'react';
import { useEvents } from '../contexts/EventsContext';
import Navigation from '../components/Navigation';

function Events() {
	const { events } = useEvents();

	return (
		<div>
			<div>
				<h1>Featured Events</h1>
				{events.length > 0 ? (
					events.map((event, index) =>
						event.isFeatured === 1 ? <div key={index}>{event.title}</div> : null
					)
				) : (
					<p>No events found</p>
				)}

				<h1>All events</h1>
				{events.length > 0 ? (
					events.map((event, index) =>
						event.isFeatured === 0 ? <div key={index}>{event.title}</div> : null
					)
				) : (
					<p>No events found</p>
				)}
			</div>
		</div>
	);
}

export default Events;
