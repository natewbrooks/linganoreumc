import React from 'react';
import { Routes, Route, Link } from 'react-router-dom';
import CreateEventForm from '../../components/events/CreateEventForm';
import ListEvents from '../../components/events/ListEvents';

function Events() {
	return (
		<div className={`flex flex-col w-full space-y-8`}>
			<div className={`flex flex-row justify-between`}>
				<div className={`font-dm text-2xl`}>Edit Events</div>
				<button className={`font-dm text-bkg text-lg bg-red px-2 `}>New Event</button>
			</div>
			<ListEvents />
			<CreateEventForm />
		</div>
	);
}

export default Events;
