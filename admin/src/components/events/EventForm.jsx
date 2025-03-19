import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useEvents } from '../../contexts/EventsContext';
import DateTimeFields from './DateTimeFields';
import TextInput from '../ui/TextInput';
import BodyTextInput from '../ui/BodyTextInput';

function EventForm({ mode = 'create', initialData = null }) {
	const navigate = useNavigate();
	const {
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

	// Load initial data when in edit mode
	useEffect(() => {
		if (mode === 'edit' && initialData) {
			setTitle(initialData.title || '');
			setDescription(initialData.description || '');
			setIsRecurring(initialData.isRecurring || false);
			setIsFeatured(initialData.isFeatured || false);

			// Fetch event dates and times from context
			fetchEventDatesById(initialData.id).then((dates) => {
				Promise.all(
					dates.map(async (dateObj) => {
						const times = await fetchEventTimesByDateId(dateObj.id);
						return {
							date: dateObj.date,
							times: times.map((t) => t.time),
							eventDateID: dateObj.id,
						};
					})
				).then(setDateTimeData);
			});
		} else {
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
			let eventID;

			// Sort the dateTimeData before submission
			const sortedDateTimeData = [...dateTimeData]
				.sort((a, b) => new Date(a.date) - new Date(b.date)) // Sort dates
				.map((dateObj) => ({
					...dateObj,
					times: [...dateObj.times].sort((a, b) => {
						const timeA = new Date(`1970-01-01T${a}:00`).getTime();
						const timeB = new Date(`1970-01-01T${b}:00`).getTime();
						return timeA - timeB;
					}),
				}));

			// Set sorted data in state to reflect changes before submission
			setDateTimeData(sortedDateTimeData);

			if (mode === 'create') {
				const event = await createEvent({ title, description, isRecurring, isFeatured });
				if (!event || !event.eventID) {
					alert('Failed to create event.');
					return;
				}
				eventID = event.eventID;
			} else {
				await updateEvent(initialData.id, { title, description, isRecurring, isFeatured });
				eventID = initialData.id;
			}

			// Process event dates and times
			for (const { date, times, eventDateID } of sortedDateTimeData) {
				let finalDateID = eventDateID;

				if (!eventDateID) {
					const newDate = await createEventDate(eventID, date);
					if (!newDate || !newDate.eventDateID) {
						console.error('Failed to create new event date');
						continue;
					}
					finalDateID = newDate.eventDateID;
				} else {
					await updateEventDate(eventDateID, date);
					await deleteEventTimes(eventDateID);
				}

				// Add times for this date
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
				className='flex flex-col font-dm px-6'
				onSubmit={handleSubmit}>
				{/* Basic Event Info */}
				<div className='flex flex-col '>
					<span className='font-newb text-md'>Details</span>
					<div className='flex flex-col space-y-2 px-4 py-3'>
						<TextInput
							title='Title'
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

				{/* Dates & Times */}
				<div className='flex flex-col'>
					<span className='font-newb text-md'>Dates & Times</span>
					<div className='flex flex-col space-y-4 px-4 py-3'>
						<DateTimeFields
							dateTimeData={dateTimeData}
							setDateTimeData={setDateTimeData}
						/>
					</div>
				</div>

				{/* Buttons */}
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
