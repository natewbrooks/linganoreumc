import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

function EditEvent() {
	const { id } = useParams(); // get event id from route
	const [event, setEvent] = useState(null);
	const [title, setTitle] = useState('');
	const [description, setDescription] = useState('');
	const [error, setError] = useState(null);

	// Fetch the event details when component mounts or id changes
	useEffect(() => {
		fetch(`http://localhost:5000/events/${id}`)
			.then((response) => {
				if (!response.ok) {
					throw new Error('Failed to fetch event details');
				}
				return response.json();
			})
			.then((data) => {
				setEvent(data);
				setTitle(data.title);
				setDescription(data.description);
			})
			.catch((err) => setError(err.message));
	}, [id]);

	const handleSubmit = async (e) => {
		e.preventDefault();
		try {
			const response = await fetch(`http://localhost:5000/events/${id}`, {
				method: 'PUT', // or PATCH, depending on your API
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ title, description }),
			});
			const data = await response.json();

			if (response.ok) {
				alert('Event updated successfully!');
				// Optionally redirect or perform further actions
			} else {
				alert(`Error: ${data.error}`);
			}
		} catch (err) {
			console.error('Error updating event:', err);
			alert('An error occurred while updating the event.');
		}
	};

	if (error) {
		return <div>Error: {error}</div>;
	}

	if (!event) {
		return <div>Loading event details...</div>;
	}

	return (
		<div className='flex flex-col w-full'>
			<h1 className='text-2xl font-bold mb-4'>Edit Event</h1>
			<form
				onSubmit={handleSubmit}
				className='flex flex-col space-y-2 font-dm'>
				<input
					className='bg-tp px-2 py-1 outline-none'
					placeholder='Title'
					type='text'
					value={title}
					onChange={(e) => setTitle(e.target.value)}
				/>
				<textarea
					className='bg-tp px-2 py-1 outline-none'
					placeholder='Description'
					value={description}
					onChange={(e) => setDescription(e.target.value)}
				/>
				<button
					type='submit'
					className='bg-red w-fit text-bkg py-1 px-2 outline-none'>
					Update Event
				</button>
			</form>
		</div>
	);
}

export default EditEvent;
