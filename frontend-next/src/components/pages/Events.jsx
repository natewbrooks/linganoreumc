'use client';
import React, { useMemo, useState, useEffect } from 'react';
import EventItem from '@/components/events/EventItem';
import EventLabel from '@/components/events/EventLabel';
import FeaturedEventItem from '@/components/events/FeaturedEventItem';
import { useEvents } from '@/contexts/EventsContext';

function Events() {
	const { events, eventDates } = useEvents();
	const [searchTerm, setSearchTerm] = useState('');

	const now = new Date();

	// Index event dates by eventID for fast lookup
	const eventDateMap = useMemo(() => {
		const map = {};
		eventDates.forEach(({ date, eventID }) => {
			if (!map[eventID]) map[eventID] = [];
			map[eventID].push(new Date(date));
		});
		return map;
	}, [eventDates]);

	// Categorize and filter
	const { featured, upcoming, previous, recurring } = useMemo(() => {
		const featured = [];
		const upcoming = [];
		const previous = [];
		const recurring = [];

		const matchesSearch = (event) => {
			const search = searchTerm.trim().toLowerCase();
			if (!search) return true;

			return (
				event.title?.toLowerCase().includes(search) ||
				event.description?.toLowerCase().includes(search)
			);
		};

		events.forEach((event) => {
			const dates = eventDateMap[event.id] || [];

			if (event.isRecurring) {
				if (matchesSearch(event)) recurring.push(event);
				if (event.isFeatured) featured.push(event);
				return; // skip upcoming/previous
			}

			const isFuture = dates.some((date) => date > now);
			const isPast = dates.every((date) => date < now);

			if (event.isFeatured) featured.push(event);
			if (!matchesSearch(event)) return;

			if (isFuture) {
				upcoming.push(event);
			} else if (isPast) {
				previous.push(event);
			}
		});

		return { featured, upcoming, previous, recurring };
	}, [events, eventDateMap, searchTerm]);

	return (
		<div className='flex flex-col pb-8'>
			<div className={`flex flex-col `}>
				<div className={`flex flex-col items-center w-full  px-4 py-4 md:py-10`}>
					<div className={`flex flex-col space-y-2 md:space-y-0 md:flex-row w-full page-wrapper`}>
						<div className={`font-dm text-lg text-darkred w-full `}>
							{featured.length > 0 ? `FEATURED EVENTS (${featured.length})` : 'EVENTS'}
						</div>
						<div className={`flex items-center bg-tp md:w-[300px] px-2 -skew-x-[30deg]`}>
							<input
								type='text'
								placeholder='Search all events...'
								className='px-2 font-dm w-full skew-x-[30deg] h-[28px] outline-none'
								value={searchTerm}
								onChange={(e) => setSearchTerm(e.target.value)}
							/>
						</div>
					</div>
					{featured.length > 0 && (
						<div className={`grid grid-cols-2 sm:grid-cols-4 gap-2 p-4 w-full h-fit page-wrapper`}>
							{[...featured, ...Array(4 - featured.length).fill(null)].map((event, index) =>
								event ? (
									<FeaturedEventItem
										key={event.id}
										event={event}
									/>
								) : (
									// Placeholder
									<div
										key={'placeholder-' + index}
										className={`flex flex-col w-full h-[180px] skew-x-[10deg] bg-tp`}>
										<div className='font-dm text-center w-full -skew-x-[10deg] text-lg flex items-center justify-center h-full text-darkred'>
											{''}
										</div>
									</div>
								)
							)}
						</div>
					)}
				</div>

				<div
					className={`flex flex-col space-y-12 w-full mx-auto max-w-[1400px] pl-4 min-h-[800px]`}>
					<div className={`flex flex-col w-full space-y-4`}>
						<EventLabel text={`RECURRING EVENTS (${recurring.length})`} />
						<div className={`flex flex-col space-y-2 w-full pl-4`}>
							{recurring.length > 0 ? (
								recurring.map((event) => (
									<EventItem
										key={event.id}
										previous={false}
										event={event}
									/>
								))
							) : (
								<p className={`font-dm text-darkred text-sm italic`}>No recurring events found.</p>
							)}
						</div>
					</div>

					<div className={`flex flex-col w-full space-y-4`}>
						<EventLabel text={`UPCOMING EVENTS (${upcoming.length})`} />
						<div className={`flex flex-col space-y-2 w-full pl-4`}>
							{upcoming.length > 0 ? (
								upcoming.map((event) => (
									<EventItem
										key={event.id}
										previous={false}
										event={event}
									/>
								))
							) : (
								<p className={`font-dm text-darkred text-sm italic`}>No upcoming events found.</p>
							)}
						</div>
					</div>
					<div className={`flex flex-col w-full space-y-4`}>
						<EventLabel text={`PREVIOUS EVENTS (${previous.length})`} />
						<div className={`flex flex-col space-y-2 w-full pl-4`}>
							{previous.length > 0 ? (
								previous.map((event) => (
									<EventItem
										key={event.id}
										previous={true}
										event={event}
									/>
								))
							) : (
								<p className={`font-dm text-darkred text-sm italic`}>No previous events found.</p>
							)}
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}

export default Events;
