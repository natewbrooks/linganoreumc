import React from 'react';
import Link from 'next/link';
import getFormat from '@/lib/getFormat';

function CalendarGridItemEvent({ event, date, time, isPast }) {
	const { formatTime } = getFormat;

	return (
		<>
			<Link
				key={time}
				href={`/events/${event.id}`}
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
