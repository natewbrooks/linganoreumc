import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import DateTimeFields from './DateTimeFields';

function EventForm({ mode = 'create', initialData = null }) {
	const navigate = useNavigate();

	const [title, setTitle] = useState('');
	const [description, setDescription] = useState('');
	const [isRecurring, setIsRecurring] = useState(false);

	/**
	 * dateTimeData shape:
	 * [
	 *   {
	 *     date: 'YYYY-MM-DD',        // or a possible "2025-07-11T00:00:00.000Z"
	 *     times: ['HH:MM', ...],     // or "HH:MM:SS"
	 *     eventDateID?: number
	 *   }
	 * ]
	 */
	const [dateTimeData, setDateTimeData] = useState([]);

	// Initialize form data
	useEffect(() => {
		if (mode === 'edit' && initialData) {
			console.log('Initial Data: ', JSON.stringify(initialData));
			setTitle(initialData.title || '');
			setDescription(initialData.description || '');
			setIsRecurring(initialData.isRecurring || false);

			// Convert initialData.eventDateData => dateTimeData
			// eventDateData: [{ eventDateID, date, times: [{ eventTimeID, time }, ...] }, ...]
			const loadedDateTimeData = (initialData.eventDateData || []).map((dateObj) => ({
				date: dateObj.date, // "YYYY-MM-DD"
				times: dateObj.times?.length
					? dateObj.times.map((t) => t.time) // "HH:MM:SS"
					: [''],
				eventDateID: dateObj.eventDateID,
			}));
			setDateTimeData(loadedDateTimeData);
		} else {
			// For create mode, start with a single date/time block
			setTitle('');
			setDescription('');
			setIsRecurring(false);
			setDateTimeData([{ date: '', times: [''] }]);
		}
	}, [mode, initialData]);

	// Ensure time is "HH:MM:SS"
	const ensureSeconds = (timeString) => {
		if (!timeString) return '';
		// If input is "HH:MM", append ":00"
		if (timeString.length === 5) {
			return timeString + ':00';
		}
		return timeString;
	};

	// Ensure date is "YYYY-MM-DD"
	// If it includes a 'T', assume it's a full ISO string and slice the first 10 chars.
	const ensureDateFormat = (dateString) => {
		if (!dateString) return '';
		if (dateString.includes('T')) {
			return dateString.slice(0, 10); // e.g. "2025-05-08T00:00:00.000Z" => "2025-05-08"
		}
		return dateString; // already "YYYY-MM-DD"
	};

	const handleCreate = async () => {
		// POST /api/admin/events/new/ -> create the event
		const eventRes = await fetch('http://localhost:5000/api/admin/events/new/', {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({ title, description, isRecurring }),
		});
		if (!eventRes.ok) {
			throw new Error('Failed to create event.');
		}
		const eventData = await eventRes.json();
		const createdEventID = eventData.eventID;

		// 2) For each date in dateTimeData, create a new event date, then create times
		for (let i = 0; i < dateTimeData.length; i++) {
			const { date, times } = dateTimeData[i];
			const fixedDate = ensureDateFormat(date); // ensure "YYYY-MM-DD"

			// Create the event date
			const dateRes = await fetch('http://localhost:5000/api/admin/events/dates/new/', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({
					eventID: createdEventID,
					date: fixedDate,
				}),
			});
			if (!dateRes.ok) {
				throw new Error('Failed to create event date.');
			}
			const dateResData = await dateRes.json();
			const newDateID = dateResData.eventDateID;

			console.log(dateResData);

			// Delete previous times for the date
			await fetch(`http://localhost:5000/api/admin/events/times/delete/${newDateID}`, {
				method: 'DELETE',
			});

			// Create new times for that date
			for (let j = 0; j < times.length; j++) {
				const timeValue = ensureSeconds(times[j]);
				if (!timeValue) continue; // skip blank

				await fetch('http://localhost:5000/api/admin/events/times/new/', {
					method: 'POST',
					headers: { 'Content-Type': 'application/json' },
					body: JSON.stringify({
						eventDateID: newDateID,
						time: timeValue,
					}),
				});
			}
		}
	};

	const handleUpdate = async () => {
		const eventID = initialData?.id;
		if (!eventID) {
			throw new Error('No initialData.id found for update!');
		}

		// PUT /api/admin/events/update/:id/ -> update the event
		const eventRes = await fetch(`http://localhost:5000/api/admin/events/update/${eventID}/`, {
			method: 'PUT',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({ title, description, isRecurring }),
		});
		if (!eventRes.ok) {
			throw new Error('Failed to update event.');
		}
		await eventRes.json();

		// For each dateTime entry, decide if we do a POST or PUT
		for (let i = 0; i < dateTimeData.length; i++) {
			const { date, times, eventDateID } = dateTimeData[i];
			const fixedDate = ensureDateFormat(date);

			let finalDateID = eventDateID; // Store the new or existing ID here

			if (eventDateID) {
				// Existing date -> PUT to /dates/update/:eventDateID/
				const dateRes = await fetch(
					`http://localhost:5000/api/admin/events/dates/update/${eventDateID}/`,
					{
						method: 'PUT',
						headers: { 'Content-Type': 'application/json' },
						body: JSON.stringify({ date: fixedDate }),
					}
				);
				if (!dateRes.ok) {
					throw new Error('Failed to update event date.');
				}

				// Remove old times for this date
				await fetch(`http://localhost:5000/api/admin/events/times/delete/${eventDateID}/`, {
					method: 'DELETE',
				});
			} else {
				// No eventDateID -> new date -> POST /dates/new/
				const dateRes = await fetch('http://localhost:5000/api/admin/events/dates/new/', {
					method: 'POST',
					headers: { 'Content-Type': 'application/json' },
					body: JSON.stringify({
						eventID,
						date: fixedDate,
					}),
				});
				if (!dateRes.ok) {
					throw new Error('Failed to create new event date.');
				}
				const dateResData = await dateRes.json();
				finalDateID = dateResData.eventDateID;
			}

			// Get list of original event date IDs from initialData
			const originalDateIDs = (initialData.eventDateData || []).map(
				(dateObj) => dateObj.eventDateID
			);

			// Get list of date IDs from current state (only include those with an eventDateID)
			const currentDateIDs = dateTimeData
				.filter((dateItem) => dateItem.eventDateID)
				.map((dateItem) => dateItem.eventDateID);

			// Identify the removed date IDs
			const removedDateIDs = originalDateIDs.filter((id) => !currentDateIDs.includes(id));

			// Delete each removed event date
			for (const removedID of removedDateIDs) {
				const deleteRes = await fetch(
					`http://localhost:5000/api/admin/events/dates/delete/${removedID}/`,
					{
						method: 'DELETE',
						headers: { 'Content-Type': 'application/json' },
					}
				);
				if (!deleteRes.ok) {
					console.error(`Failed to delete event date with ID: ${removedID}`);
				}
			}

			//  Create new times for this date => POST /times/new/
			for (let j = 0; j < times.length; j++) {
				const timeValue = ensureSeconds(times[j]);
				if (!timeValue) continue; // skip blank

				await fetch('http://localhost:5000/api/admin/events/times/new/', {
					method: 'POST',
					headers: { 'Content-Type': 'application/json' },
					body: JSON.stringify({
						eventDateID: finalDateID,
						time: timeValue,
					}),
				});
			}
		}
	};

	const handleSubmit = async (e) => {
		e.preventDefault();
		if (!title || !description || dateTimeData.some((d) => !d.date)) {
			alert('Please fill in title, description, and all date fields.');
			return;
		}

		try {
			if (mode === 'create') {
				await handleCreate();
				alert('Event created successfully!');
			} else {
				await handleUpdate();
				alert('Event updated successfully!');
			}
			navigate('/events/');
		} catch (err) {
			console.error(err);
			alert('Error occurred while saving the event.');
		}
	};

	const handleReset = () => {
		if (mode === 'create') {
			setTitle('');
			setDescription('');
			setIsRecurring(false);
			setDateTimeData([{ date: '', times: [''] }]);
		} else if (mode === 'edit' && initialData) {
			// Re-load from initialData
			setTitle(initialData.title || '');
			setDescription(initialData.description || '');
			setIsRecurring(initialData.isRecurring || false);

			const loadedDateTimeData = (initialData.eventDateData || []).map((dateObj) => ({
				date: dateObj.date,
				times: dateObj.times?.length ? dateObj.times.map((t) => t.time) : [''],
				eventDateID: dateObj.eventDateID,
			}));
			setDateTimeData(loadedDateTimeData);
		}
	};

	return (
		<div className='w-full'>
			<form
				className='flex flex-col font-dm px-6'
				onSubmit={handleSubmit}>
				{/* Basic Event Info */}
				<div className='flex flex-col '>
					<span className={`font-newb text-md`}>Details</span>
					<div className='flex flex-col space-y-2 px-4 py-3'>
						<label className='flex flex-col'>
							<span className='text-sm'>Title</span>
							<input
								className='bg-tp px-2 py-1 outline-none border-l-4 border-red'
								placeh
								older='Title'
								type='text'
								maxLength={40}
								value={title}
								onChange={(e) => setTitle(e.target.value)}
							/>
						</label>
						<label className='flex flex-col'>
							<span className='text-sm'>Description</span>
							<textarea
								className='bg-tp px-2 py-1 outline-none border-l-4 flex-wrap flex border-red min-h-[100px]'
								placeholder='Description'
								maxLength={110}
								value={description}
								onChange={(e) => setDescription(e.target.value)}
							/>
						</label>

						<div className='flex w-full items-center justify-end space-x-2 mt-2 text-sm'>
							<input
								type='checkbox'
								checked={isRecurring}
								onChange={(e) => setIsRecurring(e.target.checked)}
								className='accent-red'
							/>
							<label>Recurring Event?</label>
						</div>
					</div>
				</div>

				{/* Dates & Times (Combined) */}
				<div className='flex flex-col'>
					<span className={`font-newb text-md`}>Dates & Times</span>
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
						onClick={handleReset}>
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
