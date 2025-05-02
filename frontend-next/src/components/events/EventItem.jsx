'use client';
import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import getFormat from '@/lib/getFormat';
import { useEvents } from '@/contexts/EventsContext';

function EventItem({ event, previous }) {
	const { fetchEventDatesById, fetchEventTimesByDateId } = useEvents();
	const { getShortDayOfWeek, formatDate, formatTime } = getFormat;

	const [eventDates, setEventDates] = useState([]);
	const [timesMap, setTimesMap] = useState({});
	const [isLoading, setIsLoading] = useState(true);

	useEffect(() => {
		const loadDatesAndTimes = async () => {
			setIsLoading(true);
			try {
				const dates = await fetchEventDatesById(event.id);
				setEventDates(dates);

				const timesByDate = {};

				await Promise.all(
					dates.map(async (date) => {
						const times = await fetchEventTimesByDateId(date.id);
						if (times.length > 0) {
							timesByDate[date.id] = times;
						}
					})
				);

				setTimesMap(timesByDate);
				console.log(`Event ${event.id} loaded:`, { dates, times: timesByDate });
			} catch (err) {
				console.error('Error fetching event dates/times:', err);
			} finally {
				setIsLoading(false);
			}
		};

		loadDatesAndTimes();
	}, [event.id, fetchEventDatesById, fetchEventTimesByDateId]);

	const renderDateTimes = () => {
		// Debug output to check what dates we have and what's being filtered
		console.log('Rendering dates:', eventDates);
		console.log('Times map:', timesMap);

		if (eventDates.length === 0) {
			return <div className='skew-x-[30deg]'>No dates available</div>;
		}

		// Show all dates - we'll fix the filtering later once we confirm dates are showing
		const datesToShow = eventDates;

		return datesToShow.map((dateObj, idx) => {
			const times = timesMap[dateObj.id] || [];
			if (times.length === 0) {
				return (
					<div
						key={dateObj.id}
						className='skew-x-[30deg]'>
						{formatDate(dateObj.date)} (No times)
					</div>
				);
			}

			const dateLabel = event.isRecurring
				? getShortDayOfWeek(dateObj.date)
				: formatDate(dateObj.date);

			const timeString = times.map((t) => formatTime(t.startTime)).join(', ');

			return (
				<React.Fragment key={dateObj.id}>
					{idx > 0 && <span className='skew-x-[30deg]'>|</span>}
					<div className='skew-x-[30deg]'>{`${dateLabel} @ ${timeString}`}</div>
				</React.Fragment>
			);
		});
	};

	return (
		<div className='flex flex-col w-full hover:scale-[1.02] hover:opacity-50 active:scale-[1]'>
			{/* Date/Time Display */}
			<div
				className={`flex flex-row flex-wrap leading-none py-1 w-fit pl-4 sm:px-4 -skew-x-[30deg] gap-x-2 gap-y-1 font-dm text-sm z-10 relative -left-2 -top-0 min-w-[200px] ${
					previous ? 'text-darkred' : 'text-darkred bg-accent'
				}`}>
				{!previous &&
					(isLoading ? <div className='skew-x-[30deg]'>Loading...</div> : renderDateTimes())}
			</div>

			{/* Event Card */}
			<Link
				href={`/events/${event.id}`}
				className='relative flex flex-row items-stretch w-full font-dm'>
				<div className='absolute bg-tp w-screen h-full'> </div>

				{/* Title Block */}
				<div
					className={`${
						previous ? 'bg-darkred' : 'bg-red'
					} w-fit text-bkg relative -left-3 px-4 py-2 text-lg text-center -skew-x-[30deg] flex items-center justify-center`}>
					<p className='skew-x-[30deg] min-w-[200px] w-fit whitespace-nowrap'>{event.title}</p>
				</div>

				{/* Description Block */}
				<div className='flex-1 p-2 px-4 text-darkred text-lg -skew-x-[30deg] overflow-hidden'>
					<p
						className='truncate whitespace-nowrap skew-x-[30deg] md:overflow-hidden text-ellipsis'
						title={event.description.replace(/<[^>]*>/g, '')}>
						{event.description.replace(/<[^>]*>/g, '')}
					</p>
				</div>
			</Link>
		</div>
	);
}

export default EventItem;
