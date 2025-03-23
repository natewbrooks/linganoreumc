import React, { useEffect, useState } from 'react';
import { useEvents } from '../../../contexts/EventsContext';
import { Link } from 'react-router-dom';

function CalendarListItemEvent({ event, date, time, isPast }) {
	function formatTime(timeStr) {
		const [hours, minutes] = timeStr.split(':').map(Number);
		const period = hours >= 12 ? 'PM' : 'AM';
		const formattedHours = hours % 12 || 12; // Convert 0 (midnight) to 12
		const formattedMinutes = minutes === 0 ? ':00' : `:${minutes}`; // Omit :00

		return `${formattedHours}${formattedMinutes} ${period}`;
	}

	return (
		<>
			<Link
				key={time}
				to={`/event/${event.id}`}
				className={`flex items-center font-dm ${
					isPast ? 'border-darkred bg-darkred/10' : 'border-red bg-red/10'
				} border-l-4 px-2 py-3 hover:opacity-50 justify-between`}>
				<div className='mr-2 text-md whitespace-nowrap'>{formatTime(time)}</div>
				<div className='text-md leading-3 text-end'>{event.title}</div>
			</Link>
		</>
	);
}

export default CalendarListItemEvent;
