import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useEvents } from '../../contexts/EventsContext';
import DateTimeFields from './DateTimeFields';
import TextInput from '../ui/TextInput';
import BodyTextInput from '../ui/BodyTextInput';
import SelectEventImages from './SelectEventImages';

function EventForm({ mode = 'create', initialData = null }) {
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
	} = useEvents();

	const [title, setTitle] = useState('');
	const [description, setDescription] = useState('');
	const [isRecurring, setIsRecurring] = useState(false);
	const [isFeatured, setIsFeatured] = useState(false);
	const [dateTimeData, setDateTimeData] = useState([]);
	const [eventID, setEventID] = useState(null);
	const [eventImages, setEventImages] = useState([]);

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
			} else {
				setDateTimeData([{ date: '', times: [''] }]);
			}

			if (initialData.eventImages) {
				setEventImages(initialData.eventImages);
			}
		}

		if (mode === 'create') {
			setDateTimeData([{ date: '', times: [''] }]);
		}
	}, [mode, initialData, fetchEventDatesById, fetchEventTimesByDateId]);

	const handleSubmit = async (e) => {
		e.preventDefault();

		if (!title || !description || dateTimeData.some((d) => !d.date)) {
			alert('Please fill in title, description, and all date fields.');
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
				const event = await createEvent({ title, description, isRecurring, isFeatured });
				if (!event || !event.eventID) {
					alert('Failed to create event.');
					return;
				}
				finalEventID = event.eventID;
				setEventID(finalEventID);
			} else {
				await updateEvent(eventID, { title, description, isRecurring, isFeatured });
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
				className='flex flex-col font-dm px-6 min-h-[800px]'
				onSubmit={handleSubmit}>
				<div className='flex flex-col '>
					<span className='font-newb text-md'>Details</span>
					<div className='flex flex-col space-y-2 px-4 py-3'>
						<TextInput
							title='Title'
							toggleHeader={true}
							value={title}
							type='text'
							maxLength={40}
							onChange={(e) => setTitle(e.target.value)}
						/>
						<BodyTextInput
							title='Description'
							value={description}
							maxLength={110}
							onChange={(e) => setDescription(e.target.value)}
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

				<div className='flex flex-col'>
					<span className='font-newb text-md'>Dates & Times</span>
					<div className='flex flex-col space-y-4 px-4 py-3'>
						<DateTimeFields
							dateTimeData={dateTimeData}
							setDateTimeData={setDateTimeData}
							deleteEventDate={deleteEventDate}
						/>
					</div>
				</div>

				{eventID && (
					<div className='flex flex-col mt-6'>
						<span className='font-newb text-md'>Event Images</span>
						<div className='flex flex-col space-y-4 px-4 py-3'>
							<SelectEventImages
								eventID={eventID}
								eventImages={eventImages}
								onChangeEventImages={setEventImages}
							/>
						</div>
					</div>
				)}

				<div className='flex w-full justify-end space-x-4'>
					<button
						type='reset'
						className='bg-tp py-1 px-2 outline-none cursor-pointer'
						onClick={() => setDateTimeData([{ date: '', times: [''] }])}>
						Reset Fields
					</button>
					<button
						type='submit'
						className='bg-red text-bkg py-1 px-2 outline-none cursor-pointer'>
						{mode === 'create' ? 'Create Event' : 'Update Event'}
					</button>
				</div>
			</form>
		</div>
	);
}

export default EventForm;
