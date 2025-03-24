import React from 'react';
import TextInput from '../../components/ui/TextInput';
import SelectEventDropdown from '../../components/ui/SelectEventDropdown';

export default function JoinUs({
	joinUsTitle,
	joinUsSubtext,
	joinUsSermonImageURL,
	joinUsEvents,
	onChange, // for single-field changes like title, subtext, address
	onAddEvent, // addItem to joinUsEvents
	onRemoveEvent, // removeItem from joinUsEvents
	onChangeEventID, // handleArrayChange for eventID
}) {
	return (
		<div className='flex flex-col space-y-1 pl-8'>
			<div className={`flex flex-col`}>
				<TextInput
					title='Title'
					value={joinUsTitle}
					onChange={(e) => onChange('joinUsTitle', e.target.value)}
				/>
				<TextInput
					title='Subtext'
					value={joinUsSubtext}
					onChange={(e) => onChange('joinUsSubtext', e.target.value)}
				/>
				<TextInput
					title='Sermon Image URL'
					value={joinUsSermonImageURL}
					onChange={(e) => onChange('joinUsSermonImageURL', e.target.value)}
				/>
			</div>

			<div className={`w-full flex flex-col justify-end items-end`}>
				<div className={`w-full pl-8 flex flex-col justify-end `}>
					<span className='text-sm font-dm mb-1'>Events displayed:</span>
					{joinUsEvents.map((evt, index) => (
						<SelectEventDropdown
							key={index}
							eventType=''
							initialSelectedEventID={evt.eventID}
							onSelectedEventIDChange={(newID) => onChangeEventID(index, newID)}
							onXButtonClick={() => onRemoveEvent(index)}
						/>
					))}
					<div className={`w-full flex justify-end  mt-2`}>
						<button
							className='bg-red text-bkg font-dm px-4 py-1 w-fit'
							onClick={() => onAddEvent({ eventID: '' })}>
							Add Event
						</button>
					</div>
				</div>
			</div>
		</div>
	);
}
