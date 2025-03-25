import React from 'react';
import TextInput from '../../components/ui/TextInput';
import SelectEventDropdown from '../../components/ui/SelectEventDropdown';

export default function UpcomingEvents({
	upcomingEventsTitle,
	upcomingEventsSubtext,
	upcomingEventsSeeMore,
	selectedEvents, // Array of { eventID: X }
	onChange,
	onChangeEventID, // Function to update selected event
}) {
	const displayedEvents = Array.from({ length: 4 }, (_, i) => selectedEvents[i] || { eventID: '' });

	return (
		<div className='flex flex-col pl-8'>
			<TextInput
				title='Title'
				value={upcomingEventsTitle}
				onChange={(e) => onChange('upcomingEventsTitle', e.target.value)}
			/>
			<TextInput
				title='Subtext'
				value={upcomingEventsSubtext}
				onChange={(e) => onChange('upcomingEventsSubtext', e.target.value)}
			/>
			<TextInput
				title='See More Text'
				value={upcomingEventsSeeMore}
				onChange={(e) => onChange('upcomingEventsSeeMore', e.target.value)}
			/>

			{/* Display Four SelectEventDropdown Components */}
			<div className='flex flex-col space-y-1 mt-2'>
				<span className='text-sm font-dm mb-1'>Override upcoming events:</span>
				{displayedEvents.map((eventObj, index) => (
					<SelectEventDropdown
						key={index}
						eventType=''
						initialSelectedEventID={eventObj.eventID}
						onSelectedEventIDChange={(newID) => onChangeEventID(index, newID)}
						onXButtonClick={() => onChangeEventID(index, '')} // Reset override
					/>
				))}
			</div>
		</div>
	);
}
