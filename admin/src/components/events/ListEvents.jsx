import React, { useState } from 'react';
import { useEvents } from '../../contexts/EventsContext';
import EventItem from './EventItem';
import { FaPlus } from 'react-icons/fa';
import { Link } from 'react-router-dom';

function ListEvents() {
	const { events, loading, error } = useEvents();
	const [filter, setFilter] = useState('all');
	const [searchTerm, setSearchTerm] = useState('');

	if (loading) return <div>Loading events...</div>;
	if (error) return <div>Error: {error}</div>;

	// Filter events based on state
	const filteredEvents = events.filter((event) => {
		let categoryCondition =
			filter === 'all' ||
			(filter === 'recurring' && event.isRecurring) ||
			(filter === 'archived' && event.isArchived) ||
			(filter === 'featured' && event.isFeatured);

		let searchCondition =
			event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
			event.description.toLowerCase().includes(searchTerm.toLowerCase());

		return categoryCondition && searchCondition;
	});

	return (
		<div className={`flex flex-col space-y-4`}>
			{/* Header */}
			<div className={`flex flex-row items-center justify-between`}>
				<div className={`flex flex-col`}>
					<div className={`font-dm text-2xl`}>
						{filter.charAt(0).toUpperCase() + filter.slice(1)} Events ({filteredEvents.length})
					</div>
					<div className={`font-dm text-md`}>Select an event to edit</div>
				</div>
			</div>

			{/* Filter and Search */}
			<div className='flex flex-col font-dm w-full justify-end px-8 py-4'>
				<div className={`flex w-full justify-between mb-2`}>
					<div className={`flex flex-col`}>
						<div className={`flex text-xs w-full text-center mb-1 space-x-1`}>
							<div
								onClick={() => setFilter('all')}
								className={`${
									filter === 'all' ? 'bg-red text-bkg ' : 'bg-tp text-black/50 '
								} w-full px-2 cursor-pointer`}>
								All
							</div>
							<div
								onClick={() => setFilter('featured')}
								className={`${
									filter === 'featured' ? 'bg-red text-bkg ' : 'bg-tp text-black/50 '
								} w-full px-2 cursor-pointer`}>
								Featured
							</div>
							<div
								onClick={() => setFilter('recurring')}
								className={`${
									filter === 'recurring' ? 'bg-red text-bkg ' : 'bg-tp text-black/50 '
								} w-full px-2 cursor-pointer`}>
								Recurring
							</div>
							<div
								onClick={() => setFilter('archived')}
								className={`${
									filter === 'archived' ? 'bg-red text-bkg ' : 'bg-tp text-black/50 '
								} w-full px-2 cursor-pointer`}>
								Archived
							</div>
						</div>
						<div className={`flex space-x-1 items-center`}>
							<input
								value={searchTerm}
								onChange={(e) => setSearchTerm(e.target.value)}
								className={`font-dm border-l-4 border-red text-black text-md bg-tp px-2 w-full`}
								placeholder='Search'
							/>
						</div>
					</div>
					<div className={`flex space-x-1 items-center`}>
						<Link
							to={'/new/event/'}
							className={`font-dm text-bkg text-md text-end w-fit bg-red px-3 py-1 -skew-x-[30deg]`}>
							<div className={`flex space-x-1 skew-x-[30deg] items-center`}>
								<FaPlus size={16} />
								<div>Add Event</div>
							</div>
						</Link>
					</div>
				</div>

				{/* Event List */}
				<div className={`my-2 flex flex-col space-y-4`}>
					{filteredEvents.map((event) => (
						<div
							key={event.title + event.id}
							className={`flex flex-row items-center text-center text-bkg`}>
							<EventItem
								id={event.id}
								title={event.title}
								description={event.description}
							/>
						</div>
					))}
				</div>
			</div>
		</div>
	);
}

export default ListEvents;
