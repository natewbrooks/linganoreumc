import React, { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import EventForm from './EventForm';
import { FaArrowLeft } from 'react-icons/fa';
import { useEvents } from '../../contexts/EventsContext';

function EditEvent() {
	const { id } = useParams();
	const { fetchEventById, fetchEventDatesById, fetchEventTimesByDateId, fetchEventImages } =
		useEvents();

	const [editData, setEditData] = useState(null);
	const [error, setError] = useState(null);

	useEffect(() => {
		const loadEventData = async () => {
			try {
				const event = await fetchEventById(id);
				if (!event) throw new Error('Failed to fetch event');

				const dates = await fetchEventDatesById(id);
				if (!Array.isArray(dates)) throw new Error('Failed to fetch event dates');

				const timesPerDate = await Promise.all(dates.map((d) => fetchEventTimesByDateId(d.id)));

				const images = await fetchEventImages(id);
				const formattedImages = images.map((url) => ({ url, active: false }));

				const mergedData = {
					id: event.id,
					title: event.title,
					description: event.description,
					isRecurring: event.isRecurring,
					isFeatured: event.isFeatured,
					eventImages: formattedImages,
					eventDateData: dates.map((d, i) => ({
						eventDateID: d.id,
						date: d.date,
						isCancelled: !!d.isCancelled,
						times: (timesPerDate[i] || []).map((t) => ({
							eventTimeID: t.id,
							time: t.time,
						})),
					})),
				};

				setEditData(mergedData);
			} catch (err) {
				console.error('Error loading event data:', err);
				setError(err.message);
			}
		};

		loadEventData();
	}, [id, fetchEventById, fetchEventDatesById, fetchEventTimesByDateId, fetchEventImages]);

	if (error) return <div>Error: {error}</div>;
	if (!editData) return <div>Loading event details...</div>;

	return (
		<div className='flex flex-col w-full'>
			<div className='flex space-x-1 items-center justify-between'>
				<h1 className='text-2xl font-dm mb-4'>Edit Event</h1>
				<Link
					to='/events/'
					className='font-dm text-bkg text-md text-end w-fit bg-red px-3 py-1 -skew-x-[30deg]'>
					<div className='flex space-x-1 skew-x-[30deg] items-center'>
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
