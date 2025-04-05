import React, { useEffect, useState } from 'react';
import { useEvents } from '../../../contexts/EventsContext';
import { Link } from 'react-router-dom';

function CalendarGridItemEvent({ event, date, time, isPast }) {
	function formatTime(timeStr) {
		const [hours, minutes] = timeStr.split(':').map(Number);
		const period = hours >= 12 ? 'PM' : 'AM';
		const formattedHours = hours % 12 || 12; // Convert 0 (midnight) to 12
		const formattedMinutes = minutes === 0 ? '' : `:${minutes}`; // Omit :00

		return `${formattedHours}${formattedMinutes} ${period}`;
	}

	console.log(event);

	return (
		<>
			<Link
				key={time}
				to={`/event/${event.id}`}
				className={`flex ${
					event.isCancelled
						? 'flex-col space-y-1 bg-red text-bkg text-center'
						: isPast
						? 'border-darkred bg-darkred/10'
						: 'border-red bg-red/10 justify-between'
				} items-center border-l-4 px-2 py-1 hover:opacity-50`}>
				<div className={` mr-2 text-sm whitespace-nowrap`}>
					{event.isCancelled ? 'EVENT CANCELLED' : formatTime(time)}
				</div>

				<div className={`${event.isCancelled ? 'line-through' : 'text-end'} text-[14px] leading-3`}>
					{event.title}
				</div>
			</Link>
		</>
	);
}

export default CalendarGridItemEvent;
