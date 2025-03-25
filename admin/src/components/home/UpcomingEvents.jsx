import React from 'react';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';
import SelectEventDropdown from '../../components/ui/SelectEventDropdown';
import TextInput from '../../components/ui/TextInput';

export default function UpcomingEvents({
	upcomingEventsTitle,
	upcomingEventsSubtext,
	upcomingEventsSeeMore,
	selectedEvents, // Always contains 4 events
	onChange,
	onChangeEventID,
	onReorder,
}) {
	// Handles drag-and-drop reordering (only for overridden events)
	const handleDragEnd = (result) => {
		if (!result.destination) return;

		// Allow only overridden events to be rearranged
		const overriddenEvents = selectedEvents.filter((evt) => evt.eventID !== '');
		const reorderedEvents = [...overriddenEvents];
		const [movedItem] = reorderedEvents.splice(result.source.index, 1);
		reorderedEvents.splice(result.destination.index, 0, movedItem);

		// Merge reordered overridden events back into selectedEvents
		const updatedEvents = selectedEvents.map((evt) =>
			evt.eventID !== '' ? reorderedEvents.shift() || evt : evt
		);

		onReorder(updatedEvents);
	};

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

			{/* Drag-and-drop for overridden events */}
			<div className='flex flex-col space-y-1 mt-2'>
				<span className='text-sm font-dm mb-1'>Override upcoming events:</span>
				<DragDropContext onDragEnd={handleDragEnd}>
					<Droppable droppableId='upcoming-events'>
						{(provided) => (
							<div
								ref={provided.innerRef}
								{...provided.droppableProps}
								className='flex flex-col'>
								{selectedEvents.map((eventObj, index) => (
									<Draggable
										key={index.toString()}
										draggableId={index.toString()}
										index={index}
										isDragDisabled={eventObj.eventID === ''} // Disable drag for auto-filled events
									>
										{(provided) => (
											<div
												ref={provided.innerRef}
												{...provided.draggableProps}
												{...(eventObj.eventID !== '' ? provided.dragHandleProps : {})} // Apply drag only to overridden events
												className={`flex items-center py-0.5 ${
													eventObj.eventID !== '' ? 'cursor-move' : 'cursor-not-allowed'
												}`}>
												<SelectEventDropdown
													eventType=''
													initialSelectedEventID={eventObj.eventID}
													onSelectedEventIDChange={(newID) => onChangeEventID(index, newID)}
													onXButtonClick={() => onChangeEventID(index, '')} // Reset override
												/>
											</div>
										)}
									</Draggable>
								))}
								{provided.placeholder}
							</div>
						)}
					</Droppable>
				</DragDropContext>
			</div>
		</div>
	);
}
