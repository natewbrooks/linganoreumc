import React from 'react';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';

import SocialMediaItem from './SocialMediaItem';

function SocialMediaLinks({ socialLinks, onReorder, onChange, onRemove, onAdd }) {
	// Handles drag-and-drop reordering
	const handleDragEnd = (result) => {
		if (!result.destination) return; // If dropped outside list, do nothing
		const reorderedLinks = [...socialLinks];
		const [movedItem] = reorderedLinks.splice(result.source.index, 1);
		reorderedLinks.splice(result.destination.index, 0, movedItem);
		onReorder(reorderedLinks);
	};

	return (
		<div className='flex flex-col space-y-2'>
			<h3 className='font-dm'>Social Media Links</h3>
			<DragDropContext onDragEnd={handleDragEnd}>
				<Droppable droppableId='social-media-links'>
					{(provided) => (
						<div
							ref={provided.innerRef}
							{...provided.droppableProps}
							className='flex flex-col md:pl-8'>
							{socialLinks.map((link, index) => (
								<Draggable
									key={index}
									draggableId={index.toString()}
									index={index}>
									{(provided) => (
										<div
											ref={provided.innerRef}
											{...provided.draggableProps}
											{...provided.dragHandleProps}
											className='flex items-center py-0.5'>
											<SocialMediaItem
												index={index}
												platform={link.platform}
												url={link.url}
												icon={link.reactIcon}
												onChange={onChange}
												onRemove={onRemove}
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

			<div className={`flex w-full justify-end`}>
				<button
					className='bg-red text-bkg font-dm px-4 py-1 w-fit'
					onClick={onAdd}>
					Add Link
				</button>
			</div>
		</div>
	);
}

export default SocialMediaLinks;
