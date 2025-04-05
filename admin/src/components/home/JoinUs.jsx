import React from 'react';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';
import SelectEventDropdown from '../../components/ui/SelectEventDropdown';
import TextInput from '../../components/ui/TextInput';
import SelectJoinUsImage from './SelectJoinUsImage';

export default function JoinUs({
	joinUsTitle,
	joinUsSubtext,
	joinUsSermonImageURL,
	joinUsEvents,
	onChange,
	onAddEvent,
	onRemoveEvent,
	onChangeEventID,
	onReorder,
}) {
	// Handles drag-and-drop reordering
	const handleDragEnd = (result) => {
		if (!result.destination) return;
		const reorderedEvents = [...joinUsEvents];
		const [movedItem] = reorderedEvents.splice(result.source.index, 1);
		reorderedEvents.splice(result.destination.index, 0, movedItem);
		onReorder(reorderedEvents);
	};

	return (
		<div className='flex flex-col space-y-1 pl-8'>
			<div className={`flex space-x-2`}>
				<div className='flex flex-col w-full '>
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
				</div>
				<SelectJoinUsImage
					joinUsSermonImageURL={joinUsSermonImageURL}
					onChangeImage={(url) => onChange('joinUsSermonImageURL', url)}
				/>
			</div>

			<div className='w-full flex flex-col justify-end items-end'>
				<div className='w-full flex flex-col space-y-1 justify-end'>
					<span className='text-sm font-dm mb-1'>Events displayed:</span>

					<DragDropContext onDragEnd={handleDragEnd}>
						<Droppable droppableId='join-us-events'>
							{(provided) => (
								<div
									ref={provided.innerRef}
									{...provided.droppableProps}
									className='flex flex-col'>
									{joinUsEvents.map((evt, index) => (
										<Draggable
											key={index.toString()}
											draggableId={index.toString()}
											index={index}>
											{(provided) => (
												<div
													ref={provided.innerRef}
													{...provided.draggableProps}
													{...provided.dragHandleProps}
													className='flex items-center py-0.5 cursor-move'>
													<SelectEventDropdown
														eventType=''
														initialSelectedEventID={evt.eventID}
														onSelectedEventIDChange={(newID) => onChangeEventID(index, newID)}
														onXButtonClick={() => onRemoveEvent(index)}
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

					<div className='w-full flex justify-end mt-2'>
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
