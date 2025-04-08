import React, { useState, useEffect } from 'react';
import { useEvents } from '../../contexts/EventsContext';
import EventItem from './EventItem';
import { FaArchive, FaCheck, FaPlus } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import { FaTrashCan } from 'react-icons/fa6';
import SkewedSelectToggle from '../ui/SkewedSelectToggle';
import Search from '../ui/Search';
import Filter from '../ui/Filter';

function ListEvents() {
	const { events, deleteEvent, updateEvent, loading, error, fetchEventDatesById } = useEvents();
	const [filter, setFilter] = useState('all');
	const [searchTerm, setSearchTerm] = useState('');
	const [eventDatesMap, setEventDatesMap] = useState({});
	const [datesLoaded, setDatesLoaded] = useState(false);
	const [selectedEvents, setSelectedEvents] = useState([]);
	const [deleting, setDeleting] = useState(false);
	const [archiving, setArchiving] = useState(false);

	const filterOptions = ['all', 'featured', 'recurring', 'upcoming', 'previous', 'archived'];
	const now = new Date();

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

	const handleArchiveSelectedEvents = async () => {
		if (selectedEvents.length === 0) return;
		setArchiving(true);

		const isUnarchiving = filter === 'archived';

		for (const eventID of selectedEvents) {
			const event = events.find((e) => e.id === eventID);
			if (!event) continue;

			await updateEvent(eventID, {
				title: event.title,
				description: event.description,
				isRecurring: event.isRecurring,
				isFeatured: event.isFeatured,
				isArchived: !isUnarchiving,
			});
		}

		setSelectedEvents([]);
		setArchiving(false);
	};

	const handleDeleteSelectedEvents = async () => {
		if (selectedEvents.length === 0 || deleting) return;

		if (!window.confirm('Are you sure you want to permanently delete the selected events?')) return;

		setDeleting(true);
		try {
			for (const eventID of selectedEvents) {
				await deleteEvent(eventID);
			}
			alert(`Deleted ${selectedEvents.length} event(s).`);
			setSelectedEvents([]);
		} catch (err) {
			console.error('Error deleting events:', err);
		} finally {
			setDeleting(false);
		}
	};

	const filteredEvents = events
		.filter((event) => {
			if (filter !== 'archived' && event.isArchived) return false;
			if (filter === 'archived' && !event.isArchived) return false;

			const dates = eventDatesMap[event.id] || [];
			const parsed = dates.map((d) => new Date(d.date));
			const hasUpcoming = parsed.some((d) => d >= now);
			const hasPast = parsed.some((d) => d < now);

			const matchesFilter =
				filter === 'all' ||
				(filter === 'recurring' && event.isRecurring) ||
				(filter === 'featured' && event.isFeatured) ||
				(filter === 'upcoming' && hasUpcoming) ||
				(filter === 'previous' && !hasUpcoming && hasPast) ||
				filter === 'archived';

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
					return futureDates[0] || new Date(8640000000000000);
				};
				return getSoonest(a) - getSoonest(b);
			}
			return 0;
		});

	return (
		<div className='flex flex-col space-y-6'>
			{/* Header */}
			<div className='flex flex-col space-y-4'>
				<div className='flex flex-row items-center justify-between'>
					<div className='flex flex-col'>
						<div className='font-dm text-2xl'>
							{filter.charAt(0).toUpperCase() + filter.slice(1)} Events ({filteredEvents.length})
						</div>
						<div className='font-dm text-md'>Select an event to edit</div>
					</div>
				</div>

				<div className={`flex flex-col space-y-1`}>
					<div className='flex flex-row justify-between'>
						<Search
							searchTerm={searchTerm}
							setSearchTerm={setSearchTerm}
						/>
						<div className='flex space-x-1 items-center h-[32px]'>
							<div
								onClick={handleDeleteSelectedEvents}
								className={`${
									selectedEvents.length > 0 && !deleting
										? 'bg-red text-bkg cursor-pointer hover:scale-[102%] hover:opacity-50 active:scale-[100%] '
										: 'text-darkred/50 bg-bkg-tp cursor-not-allowed'
								} transition font-dm text-md h-full text-center w-fit px-3 py-1 skew-x-[30deg]`}>
								<div className='flex space-x-1 h-full -skew-x-[30deg] items-center'>
									<FaTrashCan size={16} />
								</div>
							</div>
							<div
								onClick={handleArchiveSelectedEvents}
								className={`${
									selectedEvents.length > 0 && !archiving
										? 'bg-red text-bkg cursor-pointer hover:scale-[102%] hover:opacity-50 active:scale-[100%] '
										: 'text-darkred/50 bg-bkg-tp cursor-not-allowed'
								} transition font-dm text-md h-full text-center w-fit px-3 py-1 skew-x-[30deg]`}>
								<div className='flex space-x-1 h-full -skew-x-[30deg] items-center'>
									<FaArchive size={16} />
								</div>
							</div>
							<Link
								to='/new/event/'
								className='cursor-pointer hover:scale-[102%] hover:opacity-50 active:scale-[100%] font-dm text-bkg text-md text-end h-full w-fit bg-red px-3 py-1 skew-x-[30deg]'>
								<div className='flex space-x-1 -skew-x-[30deg] items-center'>
									<FaPlus size={16} />
									<div>Add Event</div>
								</div>
							</Link>
						</div>
					</div>

					<Filter
						filter={filter}
						setFilter={setFilter}
						filterOptions={filterOptions}
					/>
				</div>
				<div
					onClick={() => {
						const allSelected = filteredEvents.every((event) => selectedEvents.includes(event.id));
						setSelectedEvents(
							allSelected
								? [] // Deselect all
								: filteredEvents.map((event) => event.id) // Select all filtered
						);
					}}
					className={`font-dm text-darkred cursor-pointer hover:opacity-50 select-none`}>
					{selectedEvents.length === filteredEvents.length ? 'Deselect' : 'Select'} all events
				</div>
			</div>

			{/* Event List */}
			<div className='my-2 flex flex-col space-y-4 px-8 min-h-[800px]'>
				{filteredEvents.length > 0 ? (
					filteredEvents.map((event) => (
						<div
							key={event.id}
							className='flex relative items-center justify-center'>
							<SkewedSelectToggle
								id={event.id}
								selectedList={selectedEvents}
								setSelectedList={setSelectedEvents}
							/>
							<EventItem
								id={event.id}
								title={event.title}
								description={event.description}
							/>
						</div>
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
