import React, { useState, useEffect } from 'react';
import Navigation from '../components/Navigation';

function Events() {
	const [events, setEvents] = useState([]);

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
	}, []);

	return (
		<div>
			<Navigation />
			<div>
				<h1>Featured Events</h1>
				{events.length > 0 ? (
					events.map((event, index) => (
						<div key={index}>{event.isFeatured === 1 ? event.title : ''}</div>
					))
				) : (
					<p>No events found</p>
				)}
				<h1>All events</h1>

				{events.length > 0 ? (
					events.map((event, index) => (
						<div key={index}>{event.isFeatured === 0 ? event.title : ''}</div>
					))
				) : (
					<p>No events found</p>
				)}
			</div>
		</div>
	);
}

export default Events;
