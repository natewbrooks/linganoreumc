import React, { useState } from 'react';

function CreateEventForm() {
	const [title, setTitle] = useState('');
	const [description, setDescription] = useState('');
	const [date, setDate] = useState('');
	const [time, setTime] = useState('');
	const [isRecurring, setIsRecurring] = useState(0);

	// Handler for form submission
	const handleSubmit = async (e) => {
		e.preventDefault(); // Prevent default form submit behavior

		// Validate required fields
		if (!title || !description) {
			alert('Please fill in all required fields.');
			return;
		}

		try {
			// Send POST request to your backend API
			const response = await fetch('http://localhost:5000/events', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ title, description, isRecurring }),
			});
			const data = await response.json();

			if (response.ok) {
				alert('Event created successfully!');
				// Reset form fields after successful creation
				setTitle('');
				setDescription('');
				setDate('');
				setTime('');
				setIsRecurring(0);
			} else {
				alert(`Error: ${data.error}`);
			}
		} catch (err) {
			console.error('Error creating event:', err);
			alert('An error occurred while creating the event.');
		}
	};

	// Handler for resetting the form fields
	const handleReset = () => {
		setTitle('');
		setDescription('');
		setDate('');
		setTime('');
		setIsRecurring(0);
	};

	return (
		<div className='flex flex-col space-y-2'>
			<h2 className='text-2xl font-dm'>Create New Event</h2>
			<form
				className='flex flex-col space-y-2 font-dm'
				onSubmit={handleSubmit}>
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
				<div className='flex items-center space-x-2'>
					<input
						className='bg-tp px-2 py-1 outline-none accent-red'
						id='isRecurring'
						type='checkbox'
						checked={isRecurring}
						onChange={(e) => setIsRecurring(e.target.checked ? 1 : 0)}
					/>
					<label htmlFor='isRecurring'>Recurring Event</label>
				</div>
				<input
					className='bg-tp px-2 py-1 outline-none'
					type='date'
					value={date}
					onChange={(e) => setDate(e.target.value)}
				/>
				<input
					className='bg-tp px-2 py-1 outline-none'
					type='time'
					value={time}
					onChange={(e) => setTime(e.target.value)}
				/>
				<div className='flex w-full justify-around space-x-4'>
					<button
						type='reset'
						className='bg-tp py-1 px-2 outline-none'
						onClick={handleReset}>
						Reset Fields
					</button>
					<button
						type='submit'
						className='bg-red text-bkg py-1 px-2 outline-none'>
						Create Event
					</button>
				</div>
			</form>
		</div>
	);
}

export default CreateEventForm;
