'use client';
import React from 'react';
import Link from 'next/link';
import getFormat from '@/lib/getFormat';
import EventTooltip, { useEventTooltip } from '../EventTooltip';

function CalendarListItemEvent({ event, date, startTime, endTime, isPast }) {
	const { formatTime } = getFormat;
	const tooltip = useEventTooltip();

	const formattedTime = event.isCancelled
		? 'EVENT CANCELLED'
		: `${formatTime(startTime)}${endTime ? ` – ${formatTime(endTime)}` : ''}`;

	return (
		<Link
			href={getFormat.eventPath(event)}
			{...tooltip.handlers}
			className={`flex w-full items-center justify-between font-dm px-2 py-3 border-l-4 ${
				isPast ? 'opacity-40 cursor-pointer' : 'cursor-pointer'
			} ${event.isCancelled ? 'bg-darkred text-bkg border-darkred' : 'border-red bg-tp'}`}>
			{/* Time */}
			<div className='text-md flex-shrink-0 pr-4'>{formattedTime}</div>

			{/* Title */}
			<div
				className={`text-md leading-5 text-left w-fit ${event.isCancelled ? 'line-through' : ''}`}>
				{event.title}
			</div>

			<EventTooltip
				tooltip={tooltip}
				event={event}
				date={date}
				startTime={startTime}
				endTime={endTime}
				isPast={isPast}
			/>
		</Link>
	);
}

export default CalendarListItemEvent;
