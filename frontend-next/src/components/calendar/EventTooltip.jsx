'use client';
import React, { useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import getFormat from '@/lib/getFormat';

/** Tracks cursor position for `EventTooltip`, flipping sides so it never leaves the viewport. */
export function useEventTooltip() {
	const [pos, setPos] = useState(null);
	const ref = useRef(null);

	const onMouseMove = (e) => {
		const gap = 12;
		const width = ref.current?.offsetWidth || 260;
		const height = ref.current?.offsetHeight || 0;
		const x =
			e.clientX + gap + width > window.innerWidth ? e.clientX - gap - width : e.clientX + gap;
		const y =
			e.clientY + gap + height > window.innerHeight ? e.clientY - gap - height : e.clientY + gap;
		setPos({ x: Math.max(gap, x), y: Math.max(gap, y) });
	};

	return { pos, ref, handlers: { onMouseMove, onMouseLeave: () => setPos(null) } };
}

/** Event detail tooltip. Portaled so scrolling containers can't clip it. Desktop mouse only. */
export default function EventTooltip({ tooltip, event, date, startTime, endTime, isPast }) {
	const { formatTime, formatLongDate, formatDuration } = getFormat;
	if (!tooltip.pos) return null;

	const getDurationMinutes = () => {
		if (!startTime || !endTime) return null;
		const [sh, sm] = startTime.split(':').map(Number);
		const [eh, em] = endTime.split(':').map(Number);
		return Math.max(10, eh * 60 + em - (sh * 60 + sm));
	};

	const duration = getDurationMinutes();

	// Countdown for events later today
	const start = new Date(date);
	const [sh, sm] = (startTime || '0:0').split(':').map(Number);
	start.setHours(sh, sm, 0, 0);
	const now = new Date();
	const minutesUntil = Math.round((start - now) / 60_000);
	const startsToday = start.toDateString() === now.toDateString() && minutesUntil > 0;
	const description = (event.description || '').replace(/<[^>]*>/g, ' ').replace(/&nbsp;/g, ' ');

	const status = event.isCancelled
		? 'Cancelled'
		: isPast
			? 'This event has already happened'
			: startsToday
				? `This event begins in ${formatDuration(minutesUntil)}`
				: 'This event is upcoming';

	return createPortal(
		<div
			ref={tooltip.ref}
			style={{ left: tooltip.pos.x, top: tooltip.pos.y }}
			className='hidden sm:pointer-fine:flex fixed z-50 font-dm flex-col w-[280px] bg-bkg text-dark shadow-lg pointer-events-none text-left'>
			{/* Header mirrors the site's red event bars */}
			<div className='bg-red text-bkg px-3 py-2 text-lg leading-6'>{event.title}</div>
			<div className='flex flex-col space-y-2 px-3 py-2.5'>
				<div
					className={`text-sm ${
						event.isCancelled ? 'text-red' : isPast ? 'text-darkred/60' : 'text-red'
					}`}>
					{status}
				</div>
				<div className='flex flex-col text-[15px] leading-5'>
					<span>{formatLongDate(date)}</span>
					<span>
						{formatTime(startTime)}
						{endTime && ` – ${formatTime(endTime)}`}
						{duration && <span className='text-darkred/60'> · {formatDuration(duration)}</span>}
					</span>
					{!!event.isRecurring && <span className='text-darkred/60'>Repeats weekly</span>}
				</div>
				{description.trim() && (
					<div className='pt-2 border-t border-darkred/15 text-sm leading-5 text-darkred/80 line-clamp-3'>
						{description}
					</div>
				)}
			</div>
		</div>,
		document.body,
	);
}
