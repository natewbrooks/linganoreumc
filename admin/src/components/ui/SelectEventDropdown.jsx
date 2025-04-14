import React, { useState, useRef, useEffect } from 'react';
import { FaPlus, FaSearch } from 'react-icons/fa';
import { useEvents } from '../../contexts/EventsContext';

function SelectEventDropdown({
	eventType,
	initialSelectedEventID = '',
	onSelectedEventIDChange,
	onXButtonClick,
}) {
	const { events } = useEvents();
	const [enabled, setEnabled] = useState(false);
	const [selectedEventID, setSelectedEventID] = useState(initialSelectedEventID);
	const [searchTerm, setSearchTerm] = useState('');
	const dropdownRef = useRef(null);

	// Sync with prop changes.
	useEffect(() => {
		setSelectedEventID(initialSelectedEventID);
	}, [initialSelectedEventID]);

	// Close dropdown on outside click.
	useEffect(() => {
		function handleClickOutside(event) {
			if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
				setEnabled(false);
			}
		}
		document.addEventListener('mousedown', handleClickOutside);
		return () => document.removeEventListener('mousedown', handleClickOutside);
	}, []);

	// When user clicks an event, update state and call parent callback.
	const handleSelect = (id) => {
		setSelectedEventID(id);
		if (onSelectedEventIDChange) {
			onSelectedEventIDChange(id);
		}
		setEnabled(false);
	};

	// Filter events based on eventType and searchTerm.
	const filteredEvents = events.filter((ev) => {
		const matchesType =
			(eventType === 'recurring' && ev.isRecurring) ||
			(eventType === 'featured' && ev.isFeatured) ||
			(eventType === 'archived' && ev.isArchived) ||
			!eventType; // if no eventType, show all

		const search = searchTerm.trim().toLowerCase();
		const matchesSearch =
			ev.title.toLowerCase().includes(search) || ev.id.toString().includes(search); // Allow search by ID

		return matchesType && matchesSearch;
	});

	return (
		<div
			ref={dropdownRef}
			className='relative flex flex-col w-full'>
			{/* Clickable field */}
			<div className='font-dm relative border-l-4 border-red bg-tp clickable px-2 py-1 h-[32px]'>
				{selectedEventID ? (
					<p
						onClick={() => setEnabled(!enabled)}
						className='text-black'>
						{events.find((e) => e.id === selectedEventID)?.title || '(Event not found)'}
					</p>
				) : (
					<p
						onClick={() => setEnabled(!enabled)}
						className='text-black/50'>
						Select event...
					</p>
				)}
				{/* Clear (X) button */}
				<FaPlus
					size={16}
					onClick={(e) => {
						e.stopPropagation();
						onXButtonClick && onXButtonClick();
						setSelectedEventID('');
						setEnabled(false);
					}}
					className='absolute right-2 rotate-45 hover:scale-105 top-2 z-10 text-black/50'
				/>
			</div>

			{/* Dropdown list */}
			{enabled && (
				<div className='absolute w-full max-h-[200px] translate-y-[32px] z-20 overflow-y-auto flex flex-col space-y-1 bg-bkg border-l-4 border-red pb-2 px-4'>
					<div className='flex flex-row justify-between items-center py-2'>
						<span className='font-dm text-black'>
							{eventType === 'recurring'
								? 'Recurring Events'
								: eventType === 'featured'
								? 'Featured Events'
								: eventType === 'archived'
								? 'Archived Events'
								: 'All Events'}
						</span>
						<div className='flex space-x-2 items-center'>
							<input
								type='text'
								value={searchTerm}
								onChange={(e) => setSearchTerm(e.target.value)}
								className='font-dm border-l-4 text-black/50 border-red px-2 outline-none bg-transparent'
								placeholder='Search...'
							/>
							<FaSearch
								size={14}
								className='text-black/50'
							/>
						</div>
					</div>
					{filteredEvents.length > 0 ? (
						filteredEvents.map((ev) => (
							<div
								key={ev.id}
								onClick={() => handleSelect(ev.id)}
								className='bg-red text-bkg px-2 flex space-x-4 w-full font-dm clickable items-center hover:bg-red/80'>
								<span className={`text-xs`}>id: {ev.id}</span>
								<span>{ev.title}</span>
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
