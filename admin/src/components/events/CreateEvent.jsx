import React from 'react';
import EventForm from './EventForm';

function CreateEvent() {
	return (
		<div className='flex flex-col w-full'>
			<h1 className='text-2xl font-dm mb-4'>Create New Event</h1>
			<EventForm mode='create' />
		</div>
	);
}

export default CreateEvent;
