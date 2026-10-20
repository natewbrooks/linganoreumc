'use client';
import React from 'react';
import Link from 'next/link';
import getFormat from '@/lib/getFormat';
import EventTooltip, { useEventTooltip } from '../EventTooltip';

function CalendarGridItemEvent({ event, isPast }) {
	const { formatTime } = getFormat;
	const tooltip = useEventTooltip();

	const startTime = event.startTime ?? '';
	const endTime = event.endTime ?? '';

	const getDurationMinutes = (start, end) => {
		if (!start || !end) return null;
		const [sh, sm] = start.split(':').map(Number);
		const [eh, em] = end.split(':').map(Number);
		return Math.max(10, eh * 60 + em - (sh * 60 + sm)); // min 10 min
	};

	const duration = getDurationMinutes(startTime, endTime);
	// Base height plus a per-minute amount so every length stays proportional. No end time counts as 30 min
	const height = Math.min(30 + (duration ?? 30) * 0.35, 90);

	return (
		<Link
			href={getFormat.eventPath(event)}
			{...tooltip.handlers}
			style={{ minHeight: `${height}px` }}
			className={`flex shrink-0 ${endTime !== '' ? 'flex-col justify-center' : ''} ${
				isPast ? 'opacity-40 cursor-pointer' : 'cursor-pointer'
			} ${
				event.isCancelled
					? 'flex-col space-y-1 bg-darkred text-bkg text-center'
					: 'border-red bg-red/10 justify-between'
			} items-center border-l-4 px-2 py-1`}>
			<div className={`mr-2 text-[13px] whitespace-nowrap`}>
				{event.isCancelled
					? 'EVENT CANCELLED'
					: `${formatTime(startTime)}${endTime ? ` – ${formatTime(endTime)}` : ''}`}
			</div>
			<div
				className={`${
					event.isCancelled ? 'line-through' : endTime ? 'text-center' : 'text-end'
				} text-[14px] leading-4`}>
				{event.title}
			</div>

			<EventTooltip
				tooltip={tooltip}
				event={event}
				date={event.timeDate}
				startTime={startTime}
				endTime={endTime}
				isPast={isPast}
			/>
		</Link>
	);
}

export default CalendarGridItemEvent;
