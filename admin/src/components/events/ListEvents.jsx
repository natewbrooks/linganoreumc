import React, { useEffect, useState } from 'react';
import EventItem from './EventItem';
import { FaArchive, FaFilter, FaMinus, FaMinusCircle, FaPlus, FaPlusCircle } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import ParallelogramBG from '../ParallelogramBG';

function ListEvents() {
	const [events, setEvents] = useState([]);
	const [eventDates, setEventDates] = useState([]);
	const [error, setError] = useState(null);
	const [filter, setFilter] = useState('all'); // 'all', 'recurring', or 'archived'
	const [searchTerm, setSearchTerm] = useState('');

	useEffect(() => {
		fetch('http://localhost:5000/api/events/all/')
			.then((response) => {
				if (!response.ok) {
					console.log(response);
					throw new Error('Failed to fetch events');
				}
				return response.json();
			})
			.then((data) => setEvents(data))
			.catch((err) => setError(err.message));

		fetch('http://localhost:5000/api/events/dates/all/')
			.then((response) => {
				if (!response.ok) {
					console.log(response);
					throw new Error('Failed to fetch event dates');
				}
				return response.json();
			})
			.then((data) => setEventDates(data))
			.catch((err) => setError(err.message));
	}, []);

	if (error) {
		return <div>Error: {error}</div>;
	}

	// Filter events based on filter state and search term
	const filteredEvents = events.filter((event) => {
		let categoryCondition = false;
		if (filter === 'recurring') {
			categoryCondition = event.isRecurring;
		} else if (filter === 'archived') {
			categoryCondition = event.isArchived;
		} else {
			categoryCondition = true;
		}

		let searchCondition = true;
		if (searchTerm) {
			const lowerSearch = searchTerm.toLowerCase();
			searchCondition =
				event.title.toLowerCase().includes(lowerSearch) ||
				event.description.toLowerCase().includes(lowerSearch);
		}

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
				<div className={`flex flex-col space-y-1`}>
					<div className={`flex space-x-1`}></div>
				</div>
			</div>

			{/* List */}
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
								className={`font-dm border-l-4 border-red text-black text-md bg-tp px-2 w-[200px]`}
								placeholder='Search'></input>
						</div>
					</div>
					<div className={`flex space-x-1 items-center`}>
						<Link
							to={'/new/event/'}
							className={`font-dm text-bkg text-md text-end w-fit bg-red px-3 py-1 -skew-x-[30deg] `}>
							<div className={`flex space-x-1 skew-x-[30deg] items-center`}>
								<FaPlus size={16} />
								<div>Add Event</div>
							</div>
						</Link>
					</div>
				</div>
				<div className={`my-2 flex flex-col space-y-4`}>
					{filteredEvents.map((event, index) => (
						<div
							key={event.id}
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
