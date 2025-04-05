import React, { useState, useEffect } from 'react';
import { useEvents } from '../../contexts/EventsContext';
import EventItem from './EventItem';
import { FaPlus } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import SearchAndFilter from '../ui/SearchAndFilter';

function ListEvents() {
	const { events, loading, error, fetchEventDatesById } = useEvents();
	const [filter, setFilter] = useState('all');
	const [searchTerm, setSearchTerm] = useState('');
	const [eventDatesMap, setEventDatesMap] = useState({});
	const [datesLoaded, setDatesLoaded] = useState(false);

	const filterOptions = ['all', 'featured', 'recurring', 'upcoming', 'previous', 'archived'];
	const now = new Date();

	// Fetch event dates for each event
	useEffect(() => {
		const loadDates = async () => {
			const map = {};
			await Promise.all(
				events.map(async (event) => {
					const dates = await fetchEventDatesById(event.id);
					map[event.id] = dates;
				})
			);
			setEventDatesMap(map);
			setDatesLoaded(true);
		};

		if (events.length > 0) {
			loadDates();
		}
	}, [events, fetchEventDatesById]);

	if (loading || !datesLoaded) return <div>Loading events...</div>;
	if (error) return <div>Error: {error}</div>;

	const filteredEvents = events
		.filter((event) => {
			const dates = eventDatesMap[event.id] || [];
			const parsed = dates.map((d) => new Date(d.date));
			const hasUpcoming = parsed.some((d) => d >= now);
			const hasPast = parsed.some((d) => d < now);

			const matchesFilter =
				filter === 'all' ||
				(filter === 'recurring' && event.isRecurring) ||
				(filter === 'archived' && event.isArchived) ||
				(filter === 'featured' && event.isFeatured) ||
				(filter === 'upcoming' && hasUpcoming) ||
				(filter === 'previous' && !hasUpcoming && hasPast);

			const matchesSearch =
				event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
				event.description.toLowerCase().includes(searchTerm.toLowerCase());

			return matchesFilter && matchesSearch;
		})
		.sort((a, b) => {
			if (filter === 'upcoming') {
				const getSoonest = (event) => {
					const futureDates = (eventDatesMap[event.id] || [])
						.map((d) => new Date(d.date))
						.filter((d) => d >= now)
						.sort((a, b) => a - b);
					return futureDates[0] || new Date(8640000000000000); // max date fallback
				};
				return getSoonest(a) - getSoonest(b);
			}
			return 0;
		});

	return (
		<div className='flex flex-col space-y-4'>
			{/* Header */}
			<div className='flex flex-row items-center justify-between'>
				<div className='flex flex-col'>
					<div className='font-dm text-2xl'>
						{filter.charAt(0).toUpperCase() + filter.slice(1)} Events ({filteredEvents.length})
					</div>
					<div className='font-dm text-md'>Select an event to edit</div>
				</div>
			</div>

			{/* Filters + Add button */}
			<div className='flex flex-row justify-between'>
				<SearchAndFilter
					filter={filter}
					setFilter={setFilter}
					searchTerm={searchTerm}
					setSearchTerm={setSearchTerm}
					filterOptions={filterOptions}
				/>

				<div className='flex items-center'>
					<Link
						to='/new/event/'
						className='font-dm text-bkg text-md text-end w-fit bg-red px-3 py-1 skew-x-[30deg]'>
						<div className='flex space-x-1 -skew-x-[30deg] items-center'>
							<FaPlus size={16} />
							<div>Add Event</div>
						</div>
					</Link>
				</div>
			</div>

			{/* Event List */}
			<div className='my-2 flex flex-col space-y-4 px-8 min-h-[800px]'>
				{filteredEvents.length > 0 ? (
					filteredEvents.map((event) => (
						<EventItem
							key={event.id}
							id={event.id}
							title={event.title}
							description={event.description}
						/>
					))
				) : (
					<div className='w-full flex justify-center items-center'>
						<span className='italic font-dm text-darkred'>No {filter} events.</span>
					</div>
				)}
			</div>
		</div>
	);
}

export default ListEvents;
