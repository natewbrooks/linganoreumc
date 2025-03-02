import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import SelectEventDays from './SelectEventDays';
import TimeFields from './TimeFields';

function EventForm({ mode = 'create', initialData = null }) {
	const [title, setTitle] = useState('');
	const [description, setDescription] = useState('');
	const [date, setDate] = useState('');
	const [times, setTimes] = useState(['']);
	const [isRecurring, setIsRecurring] = useState(0);
	const navigate = useNavigate();

	// When in edit mode, initialize the form with existing event data.
	useEffect(() => {
		if (mode === 'edit' && initialData) {
			setTitle(initialData.title || '');
			setDescription(initialData.description || '');
			setDate(initialData.date || '');
			setTimes(initialData.times || ['']);
			setIsRecurring(initialData.isRecurring || 0);
		}
	}, [mode, initialData]);

	// Handler for form submission
	const handleSubmit = async (e) => {
		e.preventDefault();
		if (!title || !description) {
			alert('Please fill in all required fields.');
			return;
		}
		try {
			let response;
			if (mode === 'create') {
				response = await fetch('http://localhost:5000/events', {
					method: 'POST',
					headers: { 'Content-Type': 'application/json' },
					body: JSON.stringify({ title, description, isRecurring, date, times }),
				});
			} else if (mode === 'edit' && initialData) {
				// Assuming initialData contains the event id
				response = await fetch(`http://localhost:5000/events/${initialData.id}`, {
					method: 'PUT', // or PATCH, as needed
					headers: { 'Content-Type': 'application/json' },
					body: JSON.stringify({ title, description, isRecurring, date, times }),
				});
			}
			const data = await response.json();

			if (response.ok) {
				alert(mode === 'create' ? 'Event created successfully!' : 'Event updated successfully!');
				// If creating a new event, reset the fields.
				if (mode === 'create') {
					setTitle('');
					setDescription('');
					setDate('');
					setTimes(['']);
					setIsRecurring(0);
				}
				navigate('/edit/events');
			} else {
				alert(`Error: ${data.error}`);
			}
		} catch (err) {
			console.error('Error processing event:', err);
			alert('An error occurred while processing the event.');
		}
	};

	// Handler for resetting the form fields
	const handleReset = () => {
		if (mode === 'create') {
			setTitle('');
			setDescription('');
			setDate('');
			setTimes(['']);
			setIsRecurring(0);
		} else if (mode === 'edit' && initialData) {
			// Reset back to the initial data when in edit mode
			setTitle(initialData.title || '');
			setDescription(initialData.description || '');
			setDate(initialData.date || '');
			setTimes(initialData.times || ['']);
			setIsRecurring(initialData.isRecurring || 0);
		}
	};

	return (
		<div className='w-full'>
			<form
				className='flex flex-col space-y-2 font-dm'
				onSubmit={handleSubmit}>
				<div className='flex flex-col space-y-1'>
					<span>Details</span>
					<div className='flex flex-col space-y-1 border-l-4 border-red ml-4'>
						<input
							className='bg-tp px-2 py-1 outline-none'
							placeholder='Title'
							type='text'
							maxLength={40}
							value={title}
							onChange={(e) => setTitle(e.target.value)}
						/>
						<input
							className='bg-tp px-2 py-1 outline-none'
							placeholder='Description'
							type='text'
							maxLength={110}
							value={description}
							onChange={(e) => setDescription(e.target.value)}
						/>
					</div>
				</div>

				{/* Date/Time section */}
				<div className='flex flex-col space-y-1'>
					<span>Date Information</span>
					<div className='flex flex-col space-y-1 ml-4 border-l-4 border-red'>
						<div className='flex items-center space-x-2 ml-2'>
							<input
								className='bg-tp px-2 py-1 outline-none accent-red'
								id='isRecurring'
								type='checkbox'
								checked={isRecurring}
								onChange={(e) => setIsRecurring(e.target.checked ? 1 : 0)}
							/>
							<label htmlFor='isRecurring'>Recurring Event</label>
						</div>
						{isRecurring ? (
							<SelectEventDays />
						) : (
							<input
								className='bg-tp px-2 py-1 outline-none'
								type='date'
								value={date}
								onChange={(e) => setDate(e.target.value)}
							/>
						)}
						<TimeFields
							times={times}
							setTimes={setTimes}
						/>
					</div>
				</div>

				<div className='flex w-full justify-around space-x-4'>
					<button
						type='reset'
						className={`bg-tp py-1 px-2 outline-none cursor-pointer`}
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
