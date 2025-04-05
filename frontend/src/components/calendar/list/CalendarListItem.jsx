import React, { useState, useEffect } from 'react';
import { useEvents } from '../../../contexts/EventsContext';
import CalendarListItemEvent from './CalendarListItemEvent';

function CalendarListItem({ day, date, isCurrentMonth }) {
	const { events, eventDates, eventTimes } = useEvents();
	const [sortedEventEntries, setSortedEventEntries] = useState([]);

	const isSameDate = (date1, date2) => {
		return (
			date1.getFullYear() === date2.getFullYear() &&
			date1.getMonth() === date2.getMonth() &&
			date1.getDate() === date2.getDate()
		);
	};

	const today = new Date();
	const isPast = date < today;
	const isToday =
		date.getFullYear() === today.getFullYear() &&
		date.getMonth() === today.getMonth() &&
		day === today.getDate();

	useEffect(() => {
		const eventEntries = [];

		// Get matching eventDates for the selected day
		const matchingEventDates = eventDates.filter((d) => {
			const [eYear, eMonth, eDate] = d.date.split('-').map(Number);
			const eventDate = new Date(eYear, eMonth - 1, eDate);
			return isSameDate(eventDate, date);
		});

		// Loop through matching events
		matchingEventDates.forEach((d) => {
			const event = events.find((e) => e.id === d.eventID);
			if (!event) return;

			// Find times for this event
			const eventTimesForEvent = eventTimes
				.filter((time) => time.eventDateID === d.id)
				.map((t) => {
					const [hours, minutes] = t.time.split(':').map(Number);
					const timeDate = new Date(date);
					timeDate.setHours(hours, minutes, 0, 0);

					console.log('DATE: ' + d);
					return {
						...event,
						time: t.time, // Store as string for display
						timeDate: timeDate, // Store as Date for sorting
					};
				});

			// Add all event times as separate entries
			eventEntries.push(...eventTimesForEvent);
		});

		// Sort by time
		eventEntries.sort((a, b) => a.timeDate - b.timeDate);

		setSortedEventEntries(eventEntries);
	}, [date, events, eventDates, eventTimes]);
	return (
		<div
			className={`${
				isCurrentMonth ? 'bg-tp ' : 'bg-black/20'
			} w-full flex flex-col font-dm text-lg h-[150px] pt-2 relative overflow-hidden overflow-y-auto`}>
			<div className='flex justify-between text-bkg  sticky z-10 top-0 '>
				<div
					className={`${
						isCurrentMonth
							? isToday
								? 'bg-red'
								: isPast
								? 'bg-darkred'
								: 'text-black'
							: 'text-black opacity-50'
					} px-2 w-full`}>
					{day}
				</div>
			</div>
			<div className='flex flex-col p-2 space-y-1 w-full '>
				{sortedEventEntries.map((e, index) => (
					<CalendarListItemEvent
						key={`${e.id}-${index}`}
						event={e}
						date={date}
						time={e.time}
						isPast={isPast}
					/>
				))}
			</div>
		</div>
	);
}

export default CalendarListItem;
