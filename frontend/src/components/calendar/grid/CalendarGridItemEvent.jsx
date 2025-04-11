import React, { useEffect, useState } from 'react';
import { useEvents } from '../../../contexts/EventsContext';
import { Link } from 'react-router-dom';
import { useSettings } from '../../../contexts/SettingsContext';

function CalendarGridItemEvent({ event, date, time, isPast }) {
	const { formatTime } = useSettings();

	console.log(event);

	return (
		<>
			<Link
				key={time}
				to={`/events/${event.id}`}
				className={`flex ${
					event.isCancelled
						? 'flex-col space-y-1 bg-darkred text-bkg text-center clickable'
						: isPast
						? 'border-darkred bg-darkred/10'
						: 'border-red bg-red/10 justify-between'
				} items-center border-l-4 px-2 py-1 `}>
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
