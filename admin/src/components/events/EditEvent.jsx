import React, { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import EventForm from './EventForm';
import { FaArrowLeft } from 'react-icons/fa';

function EditEvent() {
	// {
	//   id:           <eventID>,
	//   title:        <title>,
	//   description:  <description>,
	//   isRecurring:  <isRecurringBool>,
	//   eventDateData: [
	//     {
	//       eventDateID: <date.id>,
	//       date:        <date.dateString>,
	//       times: [
	//         { eventTimeID: <time.id>, time: <timeString> },
	//         ...
	//       ]
	//     },
	//     ...
	//   ]
	// }

	const { id } = useParams();

	// This will hold the final merged object that matches EventForm's `initialData` shape
	const [editData, setEditData] = useState(null);
	const [error, setError] = useState(null);

	useEffect(() => {
		let fetchedEvent = null; // Holds the single event (title, desc, isRecurring, etc.)
		let fetchedEventDates = null; // Holds all event dates for that event

		// Fetch the main event record by ID
		fetch(`http://localhost:5000/api/events/${id}`)
			.then((response) => {
				if (!response.ok) {
					throw new Error('Failed to fetch event details');
				}
				return response.json();
			})
			.then((eventData) => {
				// Store the main event data
				fetchedEvent = eventData;
				// Then fetch all event dates for this event ID
				return fetch(`http://localhost:5000/api/events/dates/${id}`);
			})
			.then((response) => {
				if (!response.ok) {
					throw new Error('Failed to fetch event date details');
				}
				return response.json();
			})
			.then((dateData) => {
				// Store all the event dates
				fetchedEventDates = dateData;

				// Fetch times for each date in parallel
				const eventTimesPromises = fetchedEventDates.map((dateObj) => {
					// Use the date’s .id to fetch times
					return fetch(`http://localhost:5000/api/events/times/${dateObj.id}`).then((res) =>
						res.ok ? res.json() : []
					);
				});

				return Promise.all(eventTimesPromises);
			})
			.then((allDatesTimes) => {
				// allDatesTimes will be an array of arrays,
				// each containing time objects for the corresponding date

				// Construct the `editData` object that EventForm expects
				const mergedData = {
					// The event ID from the main record
					id: fetchedEvent.id,
					title: fetchedEvent.title,
					description: fetchedEvent.description,
					isRecurring: fetchedEvent.isRecurring,

					// Build eventDateData from fetchedEventDates & their times
					eventDateData: fetchedEventDates.map((dateObj, index) => {
						const timesForThisDate = allDatesTimes[index] || [];
						return {
							eventDateID: dateObj.id,
							date: dateObj.date,
							times: timesForThisDate.map((t) => ({
								eventTimeID: t.id,
								time: t.time,
							})),
						};
					}),
				};

				setEditData(mergedData);
			})
			.catch((err) => {
				console.error('Error:', err);
				setError(err.message);
			});
	}, [id]);

	if (error) {
		return <div>Error: {error}</div>;
	}

	// Show a loading message until we have all the data merged
	if (!editData) {
		return <div>Loading event details...</div>;
	}

	return (
		<div className='flex flex-col w-full'>
			<div className={`flex space-x-1 items-center justify-between`}>
				<h1 className='text-2xl font-dm mb-4'>Edit Event</h1>
				<Link
					to={'/events/'}
					className={`font-dm text-bkg text-md text-end w-fit bg-red px-3 py-1 -skew-x-[30deg] `}>
					<div className={`flex space-x-1 skew-x-[30deg] items-center`}>
						<FaArrowLeft size={16} />
						<div>Return</div>
					</div>
				</Link>
			</div>
			<EventForm
				mode='edit'
				initialData={editData}
			/>
		</div>
	);
}

export default EditEvent;
