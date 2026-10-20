'use client';
import React from 'react';
import Link from 'next/link';
import getFormat from '@/lib/getFormat';
import { useEvents } from '@/contexts/EventsContext';

function EventItem({ event, previous }) {
	const { eventDates: allDates, eventTimes } = useEvents();
	const { getShortDayOfWeek, formatDate, formatTime } = getFormat;

	// Derived from context so tab refocus refreshes don't flash a loading state
	const eventDates = allDates.filter((d) => d.eventID === event.id);
	const timesMap = {};
	eventTimes.forEach((t) => {
		if (eventDates.some((d) => d.id === t.eventDateID)) {
			(timesMap[t.eventDateID] ||= []).push(t);
		}
	});

	/** Next date with up to 2 times, then "+N more" for the rest. Skips cancelled and past dates */
	const renderDateTimes = () => {
		const today = new Date().toLocaleDateString('en-CA'); // local YYYY-MM-DD
		const upcoming = eventDates
			.filter((d) => !d.isCancelled && (event.isRecurring || d.date.slice(0, 10) >= today))
			.filter((d) => timesMap[d.id]?.length)
			.sort((a, b) => a.date.localeCompare(b.date));
		if (!upcoming.length) return <div className='skew-x-[30deg]'>No upcoming dates</div>;

		const [next] = upcoming;
		const nextTimes = [...timesMap[next.id]].sort((a, b) => a.startTime.localeCompare(b.startTime));
		const shown = nextTimes.slice(0, 2);
		const more =
			nextTimes.length - shown.length +
			upcoming.slice(1).reduce((sum, d) => sum + timesMap[d.id].length, 0);
		const dateLabel = event.isRecurring ? getShortDayOfWeek(next.date) : formatDate(next.date);

		return (
			<div className='skew-x-[30deg] whitespace-nowrap'>
				{`${dateLabel} @ ${shown.map((t) => formatTime(t.startTime)).join(', ')}`}
				{more > 0 && <span className='ml-2 opacity-60'>+{more} more</span>}
			</div>
		);
	};

	const description = event.description?.replace(/<[^>]*>/g, '').trim();

	return (
		<div className='flex flex-col w-full hover:opacity-50 transition-opacity duration-200'>
			{/* Date/Time Display */}
			<div
				className={`flex flex-row flex-wrap leading-none py-1 w-fit pl-4 sm:px-4 -skew-x-[30deg] gap-x-2 gap-y-1 font-dm text-sm z-10 relative -left-2 -top-0 min-w-[140px] pr-4 ${
					previous ? 'text-darkred' : 'text-darkred bg-accent'
				}`}>
				{!previous && renderDateTimes()}
			</div>

			{/* Event Card */}
			<Link
				href={getFormat.eventPath(event)}
				className='relative flex flex-col sm:flex-row items-stretch w-full font-dm'>
				{description && <div className='hidden sm:block absolute bg-tp w-screen h-full'> </div>}

				{/* Title Block */}
				<div
					className={`${
						previous ? 'bg-darkred' : 'bg-red'
					} w-[calc(100%+1.5rem)] sm:w-fit text-bkg relative -left-3 pl-6 pr-4 sm:px-4 py-2 text-lg text-left sm:text-center -skew-x-[30deg] flex items-center justify-start sm:justify-center`}>
					<p className='skew-x-[30deg] min-w-[200px] w-fit whitespace-nowrap'>{event.title}</p>
				</div>

				{/* Description Block. Hidden with no description */}
				{description && (
					<div className='flex-1 -ml-1 -mr-3 sm:mx-0 px-4 bg-tp sm:bg-transparent py-1 sm:p-2 text-darkred text-sm sm:text-lg skew-x-[30deg] sm:-skew-x-[30deg] overflow-hidden'>
						<p
							className='line-clamp-2 sm:line-clamp-none sm:truncate sm:whitespace-nowrap -skew-x-[30deg] sm:skew-x-[30deg] md:overflow-hidden text-ellipsis'
							title={description}>
							{description}
						</p>
					</div>
				)}
			</Link>
		</div>
	);
}

export default EventItem;
