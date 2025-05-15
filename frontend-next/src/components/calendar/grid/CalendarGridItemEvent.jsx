import React from 'react';
import Link from 'next/link';
import getFormat from '@/lib/getFormat';

function CalendarGridItemEvent({ event, isPast }) {
	const { formatTime } = getFormat;

	const startTime = event.startTime ?? '';
	const endTime = event.endTime ?? '';

	const getDurationMinutes = (start, end) => {
		if (!start || !end) return 30;
		const [sh, sm] = start.split(':').map(Number);
		const [eh, em] = end.split(':').map(Number);
		return Math.max(10, eh * 60 + em - (sh * 60 + sm)); // min 10 min
	};

	const duration = getDurationMinutes(startTime, endTime);
	const paddingY = !endTime ? 2 : Math.min(Math.floor(duration / 5), 6); // default to py-1 if no endTime

	return (
		<Link
			href={`/events/${event.id}`}
			className={`flex ${endTime !== '' ? 'flex-col' : ''} ${
				event.isCancelled
					? 'flex-col space-y-1 bg-darkred text-bkg text-center clickable'
					: isPast
					? 'border-darkred bg-darkred/10'
					: 'border-red bg-red/10 justify-between'
			} items-center border-l-4 px-2 py-${paddingY}`}>
			<div className={`mr-2 text-sm whitespace-nowrap`}>
				{event.isCancelled
					? 'EVENT CANCELLED'
					: `${formatTime(startTime)}${endTime ? ` – ${formatTime(endTime)}` : ''}`}
			</div>
			<div
				className={`${
					event.isCancelled ? 'line-through' : endTime ? 'text-center' : 'text-end'
				} text-[14px] leading-3`}>
				{event.title}
			</div>
		</Link>
	);
}

export default CalendarGridItemEvent;
