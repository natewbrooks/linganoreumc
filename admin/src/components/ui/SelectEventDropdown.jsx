import React, { useState, useRef, useEffect } from 'react';
import { FaPlus, FaSearch } from 'react-icons/fa';
import { useHomePageSettings } from '../../contexts/HomepageSettingsContext';
import { useEvents } from '../../contexts/EventsContext';

function SelectEventDropdown({ eventType }) {
	const { homepageSettings } = useHomePageSettings();
	const { events } = useEvents();

	const [enabled, setEnabled] = useState(false);
	const [selectedEventID, setSelectedEventID] = useState('');
	const [searchTerm, setSearchTerm] = useState('');
	const dropdownRef = useRef(null);

	// Close dropdown if clicking outside
	useEffect(() => {
		function handleClickOutside(event) {
			if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
				setEnabled(false);
			}
		}

		document.addEventListener('mousedown', handleClickOutside);
		return () => document.removeEventListener('mousedown', handleClickOutside);
	}, []);

	// Filter events based on eventType and searchTerm
	const filteredEvents = events.filter((event) => {
		const matchesType =
			(eventType === 'recurring' && event.isRecurring) ||
			(eventType === 'featured' && event.isFeatured) ||
			(eventType === 'archived' && event.isArchived) ||
			!eventType; // Show all if no eventType is specified

		const matchesSearch = event.title.toLowerCase().includes(searchTerm.toLowerCase());

		return matchesType && matchesSearch;
	});

	return (
		<div
			ref={dropdownRef}
			className='relative flex flex-col'>
			<div className='flex font-dm'>
				<div
					onClick={() => setEnabled(!enabled)}
					className='inline-block relative h-[32px] bg-tp cursor-pointer w-full px-2 py-1 outline-none border-l-4 border-red'>
					{selectedEventID ? (
						<p className='text-black'>
							{events.find((event) => event.id === selectedEventID)?.title}
						</p>
					) : (
						<p className='text-black/50'>{'Select event...'}</p>
					)}
					<FaPlus
						size={16}
						onClick={(e) => {
							e.stopPropagation();
							setEnabled(false);
							setSelectedEventID('');
						}}
						className='absolute right-2 rotate-45 hover:scale-105 top-2 z-10 text-black/50'
					/>
				</div>
			</div>
			{enabled && (
				<div className='absolute w-full max-h-[200px] translate-y-[32px] z-30 overflow-hidden overflow-y-auto flex flex-col space-y-1 bg-bkg border-l-4 border-red pb-2 px-4'>
					<div className='flex flex-col md:flex-row md:space-x-4 items-center'>
						<div className='font-dm text-black'>
							{eventType === 'recurring'
								? 'All Recurring Events'
								: eventType === 'featured'
								? 'All Featured Events'
								: eventType === 'archived'
								? 'All Archived Events'
								: 'All Events'}
						</div>
						<div className='flex space-x-2 items-center'>
							<input
								type='text'
								value={searchTerm}
								onChange={(e) => setSearchTerm(e.target.value)}
								className='font-dm border-l-4 text-black/50 border-red md:border-transparent px-2 outline-none bg-transparent'
								placeholder='Search term'
							/>
						</div>
					</div>
					{filteredEvents.length > 0 ? (
						filteredEvents.map((event) => (
							<div
								key={event.id}
								onClick={() => {
									setSelectedEventID(event.id);
									setEnabled(false);
								}}
								className='bg-red text-bkg p-1 w-full font-dm cursor-pointer hover:bg-red/50'>
								{event.title}
							</div>
						))
					) : (
						<div className='p-2 text-center text-black/50 font-dm'>No events found</div>
					)}
				</div>
			)}
		</div>
	);
}

export default SelectEventDropdown;
