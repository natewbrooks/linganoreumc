import React from 'react';
import { Link } from 'react-router-dom';
import { useSettings } from '../../../contexts/SettingsContext';

function CalendarListItemEvent({ event, date, time, isPast }) {
	const { formatTime } = useSettings();

	return (
		<Link
			to={`/events/${event.id}`}
			className={`flex w-full items-center justify-between font-dm px-2 py-3 border-l-4 clickable ${
				event.isCancelled
					? 'bg-darkred text-bkg border-darkred'
					: isPast
					? 'border-darkred bg-darkred/10'
					: 'border-red bg-tp'
			}`}>
			{/* Time */}
			<div className='text-md flex-shrink-0 pr-4'>
				{event.isCancelled ? 'EVENT CANCELLED' : formatTime(time)}
			</div>

			{/* Title */}
			<div
				className={`text-md leading-5 text-left w-fit ${event.isCancelled ? 'line-through' : ''}`}>
				{event.title}
			</div>
		</Link>
	);
}

export default CalendarListItemEvent;
