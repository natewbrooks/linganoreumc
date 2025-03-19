import React, { useEffect, useState } from 'react';
import { useEvents } from '../../../contexts/EventsContext';
import { Link } from 'react-router-dom';

function CalendarGridItemEvent({ event, date, time }) {
	function formatTime(timeStr) {
		const [hours, minutes] = timeStr.split(':').map(Number);
		const period = hours >= 12 ? 'PM' : 'AM';
		const formattedHours = hours % 12 || 12; // Convert 0 (midnight) to 12
		const formattedMinutes = minutes === 0 ? '' : `:${minutes}`; // Omit :00

		return `${formattedHours}${formattedMinutes} ${period}`;
	}

	return (
		<>
			<Link
				key={time}
				to={`/event/${event.id}`}
				className='flex items-center border-l-4 border-red pl-2 hover:opacity-50 justify-between'>
				<div className='mr-2 text-sm whitespace-nowrap'>{formatTime(time)}</div>
				<div className='text-[14px] leading-3 text-end'>{event.title}</div>
			</Link>
		</>
	);
}

export default CalendarGridItemEvent;
