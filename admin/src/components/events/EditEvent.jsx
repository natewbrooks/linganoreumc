import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import EventForm from './EventForm';

function EditEvent() {
	const { id } = useParams();
	const [eventData, setEventData] = useState(null);
	const [error, setError] = useState(null);

	// Fetch event details when component mounts or id changes
	useEffect(() => {
		fetch(`http://localhost:5000/events/${id}`)
			.then((response) => {
				if (!response.ok) {
					throw new Error('Failed to fetch event details');
				}
				return response.json();
			})
			.then((data) => setEventData(data))
			.catch((err) => setError(err.message));
	}, [id]);

	if (error) {
		return <div>Error: {error}</div>;
	}

	if (!eventData) {
		return <div>Loading event details...</div>;
	}

	return (
		<div className='flex flex-col w-full'>
			<h1 className='text-2xl font-dm mb-4'>Edit Event</h1>
			<EventForm
				mode='edit'
				initialData={eventData}
			/>
		</div>
	);
}

export default EditEvent;
