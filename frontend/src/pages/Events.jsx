import React, { useMemo, useState } from 'react';
import { useEvents } from '../contexts/EventsContext';
import Navigation from '../components/Navigation';
import EventItem from '../components/events/EventItem';
import EventLabel from '../components/events/EventLabel';
import FeaturedEventItem from '../components/events/FeaturedEventItem';

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
	const { featured, upcoming, previous } = useMemo(() => {
		const featured = [];
		const upcoming = [];
		const previous = [];

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
			const isFuture = dates.some((date) => date > now);
			const isPast = dates.every((date) => date < now);

			if (!matchesSearch(event)) return;

			if (event.isFeatured) {
				featured.push(event);
			}

			if (isFuture) {
				upcoming.push(event);
			} else if (isPast) {
				previous.push(event);
			}
		});

		return { featured, upcoming, previous };
	}, [events, eventDateMap, searchTerm]);

	return (
		<div className='flex flex-col my-8 overflow-hidden'>
			<div className={`font-dm text-md w-full text-center text-xl`}>EVENTS</div>

			<div className={`flex flex-col space-y-8  `}>
				<div className={`flex flex-col items-center w-full  px-4 sm:px-20`}>
					<div className={`grid grid-cols-2 sm:grid-cols-4 gap-2 p-4 w-full h-fit max-w-[1200px]`}>
						{featured.length > 0 ? (
							featured.map((event) => (
								<>
									<FeaturedEventItem
										key={event.id}
										event={event}
									/>
								</>
							))
						) : (
							<></>
						)}
					</div>
				</div>

				<div
					className={`flex flex-col justify-center space-y-12 pl-4 sm:pl-40 xl:pl-80 2xl:pl-180 w-full`}>
					{/* <EventLabel text={`FEATURED EVENTS (${featured.length})`} /> */}
					<div className={`bg-tp w-[300px] px-2 -skew-x-[30deg]`}>
						<input
							type='text'
							placeholder='Search events...'
							className='px-2 font-dm w-full skew-x-[30deg] outline-none'
							value={searchTerm}
							onChange={(e) => setSearchTerm(e.target.value)}
						/>
					</div>
					<div className={`flex flex-col w-full space-y-4`}>
						<EventLabel text={`UPCOMING EVENTS (${upcoming.length})`} />
						<div className={`flex flex-col space-y-4 sm:space-y-2 w-full`}>
							{upcoming.length > 0 ? (
								upcoming.map((event) => (
									<EventItem
										key={event.id}
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
						<div className={`flex flex-col space-y-1 w-full`}>
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
