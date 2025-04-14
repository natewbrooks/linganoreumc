import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useEvents } from '../../contexts/EventsContext';
import DateTimeFields from './DAteTimeFields';
import TextInput from '../ui/TextInput';
import BodyTextInput from '../ui/BodyTextInput';
import SelectEventImages from './SelectEventImages';
import SelectEventDays from './SelectEventDays';
import RichTextEditor from '../ui/RichTextEditor';

function EventForm({ mode = 'create', initialData = null, setParentEventID = null }) {
	const navigate = useNavigate();
	const {
		events,
		createEvent,
		updateEvent,
		createEventDate,
		updateEventDate,
		deleteEventDate,
		createEventTime,
		updateEventTime,
		deleteEventTimes,
		fetchEventDatesById,
		fetchEventTimesByDateId,
		setThumbnailImage,
	} = useEvents();

	const [title, setTitle] = useState('');
	const [description, setDescription] = useState('');
	const [isRecurring, setIsRecurring] = useState(false);
	const [isFeatured, setIsFeatured] = useState(false);
	const [dateTimeData, setDateTimeData] = useState([]);
	const [eventID, setEventID] = useState(null);
	const [eventImages, setEventImages] = useState([]);
	const originalRecurringRef = useRef([]);

	useEffect(() => {
		if (mode === 'edit' && initialData) {
			setTitle(initialData.title || '');
			setDescription(initialData.description || '');
			setIsRecurring(initialData.isRecurring || false);
			setIsFeatured(initialData.isFeatured || false);
			setEventID(initialData.id || null);

			if (initialData.eventDateData) {
				const converted = initialData.eventDateData.map((dateEntry) => ({
					eventDateID: dateEntry.eventDateID,
					date: dateEntry.date,
					isCancelled: dateEntry.isCancelled || false,
					times: (dateEntry.times || []).map((t) => (typeof t === 'string' ? t : t.time)),
				}));
				setDateTimeData(converted);

				if (initialData.isRecurring) {
					originalRecurringRef.current = converted.map((d) => d.eventDateID).filter(Boolean);
				}
			} else {
				setDateTimeData([{ date: '', times: [''] }]);
			}

			if (initialData.eventImages) {
				setEventImages(initialData.eventImages);
			}
		}
	}, [mode, initialData]);

	useEffect(() => {
		if (mode === 'create') {
			const createDraft = async () => {
				try {
					const draft = await createEvent({
						title: 'Untitled Draft',
						description: '',
						isRecurring: false,
						isFeatured: false,
						isDraft: true,
					});
					if (draft?.eventID) {
						setEventID(draft.eventID);
						setParentEventID(draft.eventID);
					}
				} catch (err) {
					console.error('Failed to create draft event:', err);
				}
			};

			createDraft();
			setDateTimeData([{ date: '', times: [''] }]);
		}
	}, [mode]);

	const handleSubmit = async (e) => {
		e.preventDefault();

		if (!title || !description || dateTimeData.some((d) => !d.date)) {
			alert('Please fill in title, description, and all date fields.');
			return;
		}

		const hasAtLeastOneTime = dateTimeData.some(
			(d) => Array.isArray(d.times) && d.times.some((t) => t && t.trim() !== '')
		);

		if (!hasAtLeastOneTime) {
			alert('At least one time must be set for this event.');
			return;
		}

		try {
			const titleExists = events.some(
				(event) => event.title.toLowerCase() === title.trim().toLowerCase()
			);

			if (mode === 'create' && titleExists) {
				alert('An event with this title already exists. Please choose a different title.');
				return;
			}

			const sortedDateTimeData = [...dateTimeData]
				.filter((d) => !!d.date)
				.sort((a, b) => new Date(a.date) - new Date(b.date))
				.map((dateObj) => ({
					...dateObj,
					isCancelled: !!dateObj.isCancelled,
					times: [...dateObj.times].sort((a, b) => {
						const timeA = new Date(`1970-01-01T${a}:00`).getTime();
						const timeB = new Date(`1970-01-01T${b}:00`).getTime();
						return timeA - timeB;
					}),
				}));

			setDateTimeData(sortedDateTimeData);

			let finalEventID = eventID;

			if (mode === 'create') {
				if (!eventID) {
					alert('Event ID not initialized.');
					return;
				}
				// Update draft to finalize it
				await updateEvent(eventID, {
					title,
					description,
					isRecurring,
					isFeatured,
					isDraft: false,
				});
			} else {
				await updateEvent(eventID, {
					title,
					description,
					isRecurring,
					isFeatured,
				});
			}

			if (isRecurring && mode === 'edit') {
				const updatedEventDateIDs = sortedDateTimeData.map((d) => d.eventDateID).filter(Boolean);
				const deletedDateIDs = originalRecurringRef.current.filter(
					(originalID) => !updatedEventDateIDs.includes(originalID)
				);
				for (const id of deletedDateIDs) {
					await deleteEventDate(id);
				}
			}

			for (const { date, times, isCancelled = false, eventDateID } of sortedDateTimeData) {
				let finalDateID = eventDateID;

				if (!eventDateID) {
					const newDate = await createEventDate(finalEventID, date, isCancelled);
					if (!newDate || !newDate.eventDateID) {
						console.error('Failed to create new event date');
						continue;
					}
					finalDateID = newDate.eventDateID;
				} else {
					await updateEventDate(eventDateID, date, isCancelled);
					await deleteEventTimes(eventDateID);
				}

				for (const time of times) {
					await createEventTime(finalDateID, time);
				}
			}

			if (eventImages && eventImages.length > 0) {
				let selectedImage = null;

				if (eventImages.length === 1) {
					selectedImage = eventImages[0];
				} else {
					selectedImage = eventImages.find((img) => img.active);
				}

				if (selectedImage?.url) {
					const filename = selectedImage.url.split('/').pop();
					if (filename) {
						await setThumbnailImage(finalEventID, filename);
					}
				}
			}

			alert(mode === 'create' ? 'Event created successfully!' : 'Event updated successfully!');
			navigate('/events/', { replace: true });
			window.location.reload();
		} catch (err) {
			console.error(err);
			alert('Error occurred while saving the event.');
		}
	};

	return (
		<div className='w-full'>
			<form
				className='flex flex-col font-dm px-4 min-h-[800px] pb-12'
				onSubmit={handleSubmit}>
				<div className='flex flex-col '>
					<span className='font-dm text-md'>Details</span>
					<div className='flex flex-col space-y-2 md:px-4 py-3'>
						<TextInput
							title='Title'
							toggleHeader={true}
							value={title}
							type='text'
							maxLength={40}
							onChange={(e) => setTitle(e.target.value)}
						/>
						{/* <BodyTextInput
							title='Description'
							value={description}
							maxLength={110}
							onChange={(e) => setDescription(e.target.value)}
						/> */}
						<RichTextEditor
							title={`Description`}
							value={description}
							onChange={setDescription}
						/>
						<div className='flex w-full items-center justify-end space-x-2 mt-2 text-sm'>
							<input
								type='checkbox'
								checked={isRecurring}
								onChange={(e) => setIsRecurring(e.target.checked)}
								className='accent-red'
							/>
							<label>Recurring Event?</label>
						</div>
						<div className='flex w-full items-center justify-end space-x-2 mt-2 text-sm'>
							<input
								type='checkbox'
								checked={isFeatured}
								onChange={(e) => setIsFeatured(e.target.checked)}
								className='accent-red'
							/>
							<label>Featured Event?</label>
						</div>
					</div>
				</div>

				<div className='flex flex-col space-y-3'>
					<span className='font-dm text-md'>Dates & Times</span>

					{!isRecurring ? (
						<>
							<div className='flex flex-col space-y-4 ml-4 mr-6 md:px-4'>
								<DateTimeFields
									dateTimeData={dateTimeData}
									setDateTimeData={setDateTimeData}
									deleteEventDate={deleteEventDate}
								/>
							</div>
						</>
					) : (
						<SelectEventDays
							dateTimeData={dateTimeData}
							setDateTimeData={setDateTimeData}
							deleteEventDate={deleteEventDate}
						/>
					)}
				</div>

				{eventID && (
					<div className='flex flex-col mt-6'>
						<span className='font-dm text-md'>Event Images</span>
						<span className='font-dm text-xs md:text-sm text-black'>
							* Checked image determines the event thumbnail
						</span>

						<div className='flex flex-col space-y-4 md:px-4 py-3'>
							<SelectEventImages
								eventID={eventID}
								eventImages={eventImages}
								onChangeEventImages={setEventImages}
							/>
						</div>
					</div>
				)}

				<div className='flex w-full justify-end space-x-4 mt-8'>
					<button
						type='reset'
						className='outline-none clickable px-3 py-1'
						onClick={() => setDateTimeData([{ date: '', times: [''] }])}>
						Reset Fields
					</button>
					<button
						type='submit'
						className='bg-red text-bkg px-3 py-1 outline-none clickable-r-skew'>
						<div className={`skew-l`}>{mode === 'create' ? 'Create Event' : 'Update Event'}</div>
					</button>
				</div>
			</form>
		</div>
	);
}

export default EventForm;
