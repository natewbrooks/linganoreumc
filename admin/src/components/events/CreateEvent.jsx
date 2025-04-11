import React, { useState } from 'react';
import EventForm from './EventForm';
import { FaArrowLeft, FaPlus } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import { useEvents } from '../../contexts/EventsContext';

function CreateEvent() {
	const [eventID, setParentEventID] = useState();
	const { deleteEvent } = useEvents();
	return (
		<div className='flex flex-col w-full'>
			<div className={`flex space-x-1 items-center justify-between`}>
				<h1 className='text-2xl font-dm mb-4'>Create New Event</h1>
				<Link
					to={'/events/'}
					onClick={() => deleteEvent(eventID)}
					className={`font-dm text-bkg text-md text-end w-fit bg-red px-3 py-1 clickable-r-skew `}>
					<div className={`flex space-x-1 skew-l items-center`}>
						<FaArrowLeft size={16} />
						<div className={``}>Cancel</div>
					</div>
				</Link>
			</div>

			<EventForm
				mode='create'
				setParentEventID={setParentEventID}
			/>
		</div>
	);
}

export default CreateEvent;
