'use client';
import React, { useState, useEffect } from 'react';
import CalendarListItemEvent from './CalendarListItemEvent';
import { useEvents } from '@/contexts/EventsContext';

function CalendarList({ month, year }) {
	const { events, eventDates, eventTimes } = useEvents();
	const [groupedByDay, setGroupedByDay] = useState({});

	useEffect(() => {
		const dailyMap = {};

		// Step 1: One-off events
		eventDates.forEach((dateObj) => {
			const [y, m, d] = dateObj.date.split('-').map(Number);
			const eventDate = new Date(y, m - 1, d);

			if (eventDate.getMonth() !== month || eventDate.getFullYear() !== year) return;

			const event = events.find((e) => e.id === dateObj.eventID);
			if (!event) return;

			const times = eventTimes
				.filter((t) => t.eventDateID === dateObj.id)
				.map((t) => {
					const [hours, minutes] = t.startTime?.split(':').map(Number) || [0, 0];
					const fullDateTime = new Date(eventDate);
					fullDateTime.setHours(hours, minutes, 0, 0);

					return {
						id: event.id,
						title: event.title,
						startTime: t.startTime,
						endTime: t.endTime,
						time: t.startTime,
						date: eventDate,
						dateTime: fullDateTime,
						isCancelled: dateObj.isCancelled,
					};
				});

			const uniqueMap = new Map();
			times.forEach((entry) => {
				const key = `${entry.id}-${entry.time}`;
				if (!uniqueMap.has(key)) uniqueMap.set(key, entry);
			});
			const uniqueTimes = Array.from(uniqueMap.values());

			const dateKey = `${eventDate.getFullYear()}-${String(eventDate.getMonth() + 1).padStart(
				2,
				'0'
			)}-${String(eventDate.getDate()).padStart(2, '0')}`;
			if (!dailyMap[dateKey]) dailyMap[dateKey] = [];
			dailyMap[dateKey].push(...uniqueTimes);
		});

		// Step 2: Recurring events
		events
			.filter((e) => e.isRecurring)
			.forEach((event) => {
				const recurringDateEntries = eventDates.filter((d) => d.eventID === event.id);
				if (!recurringDateEntries.length) return;

				const [rYear, rMonth, rDay] = recurringDateEntries[0].date.split('-').map(Number);
				const recurringStartDate = new Date(rYear, rMonth - 1, rDay);

				const daysInMonth = new Date(year, month + 1, 0).getDate();
				for (let dayNum = 1; dayNum <= daysInMonth; dayNum++) {
					const thisDate = new Date(year, month, dayNum);
					if (thisDate < recurringStartDate) continue;

					const dayOfWeek = thisDate.getDay();

					const dateObj = recurringDateEntries.find((d) => {
						const [dy, dm, dd] = d.date.split('-').map(Number);
						const dDate = new Date(dy, dm - 1, dd);
						return dDate.getDay() === dayOfWeek;
					});

					if (!dateObj) continue;

					const times = eventTimes
						.filter((t) => t.eventDateID === dateObj.id)
						.map((t) => {
							const [hours, minutes] = t.startTime?.split(':').map(Number) || [0, 0];
							const fullDateTime = new Date(thisDate);
							fullDateTime.setHours(hours, minutes, 0, 0);

							return {
								id: event.id,
								title: event.title,
								startTime: t.startTime,
								endTime: t.endTime,
								time: t.startTime,
								date: thisDate,
								dateTime: fullDateTime,
								isCancelled: dateObj.isCancelled,
							};
						});

					const uniqueMap = new Map();
					times.forEach((entry) => {
						const key = `${entry.id}-${entry.time}`;
						if (!uniqueMap.has(key)) uniqueMap.set(key, entry);
					});
					const uniqueTimes = Array.from(uniqueMap.values());

					const dateKey = `${thisDate.getFullYear()}-${String(thisDate.getMonth() + 1).padStart(
						2,
						'0'
					)}-${String(thisDate.getDate()).padStart(2, '0')}`;
					if (!dailyMap[dateKey]) dailyMap[dateKey] = [];
					dailyMap[dateKey].push(...uniqueTimes);
				}
			});

		const sorted = Object.entries(dailyMap)
			.map(([dateStr, entries]) => {
				entries.sort((a, b) => a.dateTime - b.dateTime);
				return [dateStr, entries];
			})
			.sort((a, b) => new Date(a[0]) - new Date(b[0]));

		const deduped = sorted.map(([dateKey, entries]) => {
			const seen = new Set();
			const uniqueEntries = entries.filter((entry) => {
				const key = `${entry.id}-${entry.time}`;
				if (seen.has(key)) return false;
				seen.add(key);
				return true;
			});
			return [dateKey, uniqueEntries];
		});

		setGroupedByDay(Object.fromEntries(deduped));
	}, [month, year, events, eventDates, eventTimes]);

	function formatHeader(dateStr) {
		const [y, m, d] = dateStr.split('-').map(Number);
		const date = new Date(y, m - 1, d);
		const weekday = date.toLocaleDateString('en-US', { weekday: 'short' }).toUpperCase();
		const month = date.toLocaleDateString('en-US', { month: 'long' }).toUpperCase();
		const day = date.getDate();
		return `${weekday} | ${month} ${day}`;
	}

	return (
		<div className='flex flex-col space-y-6 py-8 w-full'>
			{Object.keys(groupedByDay).length === 0 ? (
				<div className='text-center text-darkred font-dm italic'>No events this month.</div>
			) : (
				Object.entries(groupedByDay).map(([dateStr, entries]) => (
					<div
						key={dateStr}
						className='flex flex-col space-y-1 w-full'>
						<div className='font-dm text-md'>{formatHeader(dateStr)}</div>
						{entries.map((entry, index) => {
							const now = new Date();
							const isPast = entry.dateTime < now;

							return (
								<CalendarListItemEvent
									key={`${entry.id}-${index}`}
									event={entry}
									date={entry.date}
									startTime={entry.startTime}
									endTime={entry.endTime}
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
