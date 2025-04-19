import React from 'react';
import Link from 'next/link';
import getFormat from '@/lib/getFormat';

function CalendarListItemEvent({ event, date, startTime, endTime, isPast }) {
	const { formatTime } = getFormat;

	const formattedTime = event.isCancelled
		? 'EVENT CANCELLED'
		: `${formatTime(startTime)}${endTime ? ` – ${formatTime(endTime)}` : ''}`;

	return (
		<Link
			href={`/events/${event.id}`}
			className={`flex w-full items-center justify-between font-dm px-2 py-3 border-l-4 clickable ${
				event.isCancelled
					? 'bg-darkred text-bkg border-darkred'
					: isPast
					? 'border-darkred bg-darkred/10'
					: 'border-red bg-tp'
			}`}>
			{/* Time */}
			<div className='text-md flex-shrink-0 pr-4'>{formattedTime}</div>

			{/* Title */}
			<div
				className={`text-md leading-5 text-left w-fit ${event.isCancelled ? 'line-through' : ''}`}>
				{event.title}
			</div>
		</Link>
	);
}

export default CalendarListItemEvent;
