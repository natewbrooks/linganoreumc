'use client';
import React, { useState, useEffect, useLayoutEffect, useRef } from 'react';
import CalendarGridItemEvent from './CalendarGridItemEvent';
import { useEvents } from '@/contexts/EventsContext';
import getFormat from '@/lib/getFormat';

function CalendarGridItem({ day, date, isCurrentMonth }) {
	const { events, eventDates, eventTimes } = useEvents();
	const [sortedEventEntries, setSortedEventEntries] = useState([]);
	// Minutes since midnight in Eastern time. Set after mount so server and client markup match
	const [nowMinutes, setNowMinutes] = useState(null);
	const [nowLineTop, setNowLineTop] = useState(null);
	const cellRef = useRef(null);
	const listRef = useRef(null);
	const hasScrolledToNow = useRef(false);

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
		if (!isToday) return;

		const update = () => {
			const [h, m] = new Date()
				.toLocaleTimeString('en-GB', {
					timeZone: 'America/New_York',
					hour: '2-digit',
					minute: '2-digit',
				})
				.split(':')
				.map(Number);
			setNowMinutes(h * 60 + m);
		};

		update();
		const interval = setInterval(update, 60_000);
		return () => clearInterval(interval);
	}, [isToday]);

	const toMinutes = (time) => {
		const [h, m] = (time || '0:0').split(':').map(Number);
		return h * 60 + m;
	};

	// Line goes before the first event that hasn't started yet
	const nowLineIndex =
		nowMinutes === null
			? -1
			: (() => {
					const i = sortedEventEntries.findIndex((e) => toMinutes(e.startTime) > nowMinutes);
					return i === -1 ? sortedEventEntries.length : i;
				})();

	// Overlay position: centered in the gap before the first upcoming event, or below the last one
	useLayoutEffect(() => {
		const list = listRef.current;
		if (nowLineIndex === -1 || !list) return setNowLineTop(null);

		const items = list.querySelectorAll(':scope > a');
		const gap = 4; // matches space-y-1
		if (items.length === 0) return setNowLineTop(gap);

		const next = items[nowLineIndex];
		const last = items[items.length - 1];
		setNowLineTop(next ? next.offsetTop - gap / 2 : last.offsetTop + last.offsetHeight + gap / 2);
	}, [nowLineIndex, sortedEventEntries]);

	// Centers the now line once when it first appears. Scrolls only this cell, not the page
	useEffect(() => {
		const cell = cellRef.current;
		const list = listRef.current;
		if (hasScrolledToNow.current || nowLineTop === null || !cell || !list) return;
		if (cell.scrollHeight <= cell.clientHeight) return;
		cell.scrollTop = list.offsetTop + nowLineTop - cell.clientHeight / 2;
		hasScrolledToNow.current = true;
	}, [nowLineTop]);

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
					const [hours, minutes] = t.startTime?.split(':').map(Number) || [0, 0];
					const timeDate = new Date(date);
					timeDate.setHours(hours, minutes, 0, 0);

					return {
						...event,
						startTime: t.startTime,
						endTime: t.endTime,
						time: t.startTime, // keep legacy 'time' for display compatibility
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
						const [hours, minutes] = t.startTime?.split(':').map(Number) || [0, 0];
						const timeDate = new Date(date);
						timeDate.setHours(hours, minutes, 0, 0);

						return {
							...event,
							startTime: t.startTime,
							endTime: t.endTime,
							time: t.startTime,
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
			ref={cellRef}
			className={`${
				isCurrentMonth ? 'bg-tp ' : 'bg-black/20'
			} w-full h-full min-h-0 flex flex-col font-dm text-base relative overflow-hidden overflow-y-auto`}>
			<div className='flex justify-between text-bkg  sticky z-10 top-0 '>
				<div
					className={`${
						isCurrentMonth
							? isToday
								? 'bg-red'
								: isPast
								? 'bg-darkred'
								: 'bg-bkg-tp text-black'
							: 'text-black opacity-50'
					} px-2 w-full`}>
					{day}
				</div>
			</div>
			<div
				ref={listRef}
				className='relative flex flex-col p-1 space-y-1 w-full'>
				{sortedEventEntries.map((e, index) => (
					<CalendarGridItemEvent
						key={`${e.id}-${index}`}
						event={e}
						isPast={e.timeDate < today}
					/>
				))}
				{/* Two segments with the time between, so the gap stays transparent over any background */}
				{nowLineTop !== null && (
					<div
						style={{ top: nowLineTop }}
						className='absolute left-0 right-1 z-[5] h-0 flex items-center pointer-events-none'>
						{/* Right-pointing triangle. -mr-1 slides the line into its body so the thin tip leaves no visual gap */}
						<div className='shrink-0 -mr-1 w-0 h-0 border-y-[5px] border-y-transparent border-l-[7px] border-l-dark' />
						<div className='flex-1 h-0.5 bg-dark' />
						<div className='mx-1 px-1 bg-dark text-bkg font-dm text-[11px] leading-4 whitespace-nowrap'>
							{getFormat.formatTime(`${Math.floor(nowMinutes / 60)}:${nowMinutes % 60}`)}
						</div>
						<div className='flex-1 h-0.5 bg-dark' />
					</div>
				)}
			</div>
		</div>
	);
}

export default CalendarGridItem;
