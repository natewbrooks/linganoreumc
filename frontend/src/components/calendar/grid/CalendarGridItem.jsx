import React, { useState, useEffect } from 'react';
import { useEvents } from '../../../contexts/EventsContext';
import CalendarGridItemEvent from './CalendarGridItemEvent';

function CalendarGridItem({ day, date, isCurrentMonth }) {
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

		// Step 1: Match one-off (non-recurring) event dates
		const matchingEventDates = eventDates.filter((d) => {
			const [eYear, eMonth, eDate] = d.date.split('-').map(Number);
			const eventDate = new Date(eYear, eMonth - 1, eDate);
			return isSameDate(eventDate, date);
		});

		matchingEventDates.forEach((d) => {
			const event = events.find((e) => e.id === d.eventID);
			if (!event) return;

			const timesForEvent = eventTimes
				.filter((t) => t.eventDateID === d.id)
				.map((t) => {
					const [hours, minutes] = t.time.split(':').map(Number);
					const timeDate = new Date(date);
					timeDate.setHours(hours, minutes, 0, 0);

					return {
						...event,
						time: t.time,
						timeDate,
						isCancelled: d.isCancelled,
					};
				});

			eventEntries.push(...timesForEvent);
		});

		// Step 2: Handle recurring events
		const dayOfWeek = date.getDay();
		const weekdayAbbr = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'][dayOfWeek];

		events
			.filter((e) => e.isRecurring)
			.forEach((event) => {
				const recurringDateEntry = eventDates.find((d) => {
					const [y, m, d2] = d.date.split('-').map(Number);
					const eventDate = new Date(y, m - 1, d2); // ✅ local date

					return (
						d.eventID === event.id && date.getDay() === eventDate.getDay() && date >= eventDate
					);
				});

				if (!recurringDateEntry) return;

				const timesForRecurring = eventTimes
					.filter((t) => t.eventDateID === recurringDateEntry.id)
					.map((t) => {
						const [hours, minutes] = t.time.split(':').map(Number);
						const timeDate = new Date(date);
						timeDate.setHours(hours, minutes, 0, 0);

						return {
							...event,
							time: t.time,
							timeDate,
							isCancelled: recurringDateEntry.isCancelled,
						};
					});

				eventEntries.push(...timesForRecurring);
			});

		// Final sort
		eventEntries.sort((a, b) => a.timeDate - b.timeDate);
		// Deduplicate based on event ID + time
		const uniqueMap = new Map();

		eventEntries.forEach((entry) => {
			const key = `${entry.id}-${entry.time}`;
			if (!uniqueMap.has(key)) {
				uniqueMap.set(key, entry);
			}
		});

		const uniqueEntries = Array.from(uniqueMap.values()).sort((a, b) => a.timeDate - b.timeDate);
		setSortedEventEntries(uniqueEntries);
	}, [date, events, eventDates, eventTimes]);

	return (
		<div
			className={`${
				isCurrentMonth ? 'bg-tp ' : 'bg-black/20'
			} w-full flex flex-col font-dm text-lg h-[150px] aspect-square relative overflow-hidden overflow-y-auto`}>
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
					<CalendarGridItemEvent
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

export default CalendarGridItem;
