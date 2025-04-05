import React, { useState, useEffect } from 'react';
import { useEvents } from '../../../contexts/EventsContext';
import CalendarListItemEvent from './CalendarListItemEvent';

function CalendarList({ month, year }) {
	const { events, eventDates, eventTimes } = useEvents();
	const [groupedByDay, setGroupedByDay] = useState({});

	useEffect(() => {
		const dailyMap = {};

		eventDates.forEach((dateObj) => {
			const [y, m, d] = dateObj.date.split('-').map(Number);
			const eventDate = new Date(y, m - 1, d);

			if (eventDate.getMonth() !== month || eventDate.getFullYear() !== year) return;

			const event = events.find((e) => e.id === dateObj.eventID);
			if (!event) return;

			const times = eventTimes
				.filter((t) => t.eventDateID === dateObj.id)
				.map((t) => {
					const [hours, minutes] = t.time.split(':').map(Number);
					const fullDateTime = new Date(eventDate);
					fullDateTime.setHours(hours, minutes, 0, 0);

					return {
						id: event.id,
						title: event.title,
						time: t.time,
						date: eventDate,
						dateTime: fullDateTime,
						isCancelled: dateObj.isCancelled,
					};
				});

			const dateKey = eventDate.toISOString().split('T')[0]; // YYYY-MM-DD
			if (!dailyMap[dateKey]) {
				dailyMap[dateKey] = [];
			}
			dailyMap[dateKey].push(...times);
		});

		// Sort each day's events and convert to array of [dateKey, events]
		const sorted = Object.entries(dailyMap)
			.map(([dateStr, entries]) => {
				entries.sort((a, b) => a.dateTime - b.dateTime);
				return [dateStr, entries];
			})
			.sort((a, b) => new Date(a[0]) - new Date(b[0]));

		setGroupedByDay(Object.fromEntries(sorted));
	}, [month, year, events, eventDates, eventTimes]);

	function formatHeader(dateStr) {
		const date = new Date(dateStr);
		const weekday = date.toLocaleDateString('en-US', { weekday: 'short' }).toUpperCase();
		const month = date.toLocaleDateString('en-US', { month: 'long' }).toUpperCase();
		const day = date.getDate();
		return `${weekday} | ${month} ${day}`;
	}

	return (
		<div className='w-full flex flex-col space-y-6 py-8'>
			{Object.keys(groupedByDay).length === 0 ? (
				<div className='text-center text-darkred font-dm italic'>No events this month.</div>
			) : (
				Object.entries(groupedByDay).map(([dateStr, entries]) => (
					<div
						key={dateStr}
						className='flex flex-col space-y-1'>
						<div className='font-dm text-md'>{formatHeader(dateStr)}</div>
						{entries.map((entry, index) => {
							const now = new Date();
							const isPast = entry.dateTime < now;

							return (
								<CalendarListItemEvent
									key={`${entry.id}-${index}`}
									event={entry}
									date={entry.date}
									time={entry.time}
									isPast={isPast}
								/>
							);
						})}
					</div>
				))
			)}
		</div>
	);
}

export default CalendarList;
