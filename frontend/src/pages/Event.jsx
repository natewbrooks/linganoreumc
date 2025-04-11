import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useEvents } from '../contexts/EventsContext';
import EventLabel from '../components/events/EventLabel';
import ImageGalleryModal from '../components/media/ImageGalleryModal';
import { useSettings } from '../contexts/SettingsContext';
import { FaClock } from 'react-icons/fa';
import MarkdownText from '../components/ui/MarkdownText';

const Event = () => {
	const { eventID } = useParams();
	const {
		fetchEventById,
		fetchEventDatesById,
		fetchEventTimesByEventId,
		fetchEventImages,
		getLongDayOfWeek,
	} = useEvents();
	const { formatLongDate, formatTime } = useSettings();

	const [event, setEvent] = useState(null);
	const [dates, setDates] = useState([]);
	const [times, setTimes] = useState([]);
	const [images, setImages] = useState([]);
	const [loading, setLoading] = useState(true);
	const [modalIndex, setModalIndex] = useState(null);

	useEffect(() => {
		const loadEvent = async () => {
			try {
				setLoading(true);
				console.log('Fetching data for event ID:', eventID);

				const [eventData, dateData, timeData, imageData] = await Promise.all([
					fetchEventById(eventID),
					fetchEventDatesById(eventID),
					fetchEventTimesByEventId(eventID),
					fetchEventImages(eventID),
				]);

				console.log('Event:', eventData);
				console.log('Dates:', dateData);
				console.log('Times:', timeData);
				console.log('Images:', imageData);

				setEvent(eventData);
				setDates(dateData);
				setTimes(timeData);
				setImages(imageData);
			} finally {
				setLoading(false);
			}
		};

		loadEvent();
	}, [eventID]);

	if (loading) return <div className='p-8 font-dm'>Loading event...</div>;
	if (!event) return <div className='p-8 font-dm text-darkred'>Event not found.</div>;

	return (
		<div className='flex flex-col px-4 py-8 max-w-[1000px] mx-auto space-y-10 font-dm'>
			<div className={`flex flex-col space-y-8`}>
				<div className={`flex flex-col items-center space-y-2`}>
					<h1 className='text-3xl'>{event.title}</h1>
				</div>
				<div className={`mx-auto max-w-[800px]`}>
					<MarkdownText html={event.description} />
				</div>

				{/* Schedule */}
				<div className=''>
					<div className={`mb-2 font-dm text-sm`}>Event Schedule</div>
					<div className={`grid gap-x-4 grid-cols-2 md:grid-cols-4`}>
						{dates.map((date) => {
							const matchedTimes = times.filter((t) => String(t.eventDateID) === String(date.id));

							return (
								<div
									key={date.id}
									className={`${
										date.isCancelled ? 'bg-darkred marker:text-bkg decoration-bkg' : 'bg-red'
									} skew-l px-4 text-bkg space-y-2 py-2`}>
									<div className='flex w-full justify-between skew-r'>
										{event.isRecurring ? getLongDayOfWeek(date.date) : formatLongDate(date.date)}
										{date.isCancelled ? <span className='ml-2 text-red'>Cancelled</span> : ''}
									</div>
									<ul className='ml-4 list-disc skew-r'>
										{matchedTimes.length == 0 && (
											<li className='italic text-sm text-gray-400'>No times scheduled</li>
										)}
										{matchedTimes.map((t, i) => {
											console.log('Rendering time:', t.time);
											return (
												<li
													key={i}
													className='flex items-center space-x-2'>
													<FaClock size={12} />
													<span>{formatTime(t.time)}</span>
												</li>
											);
										})}
									</ul>
								</div>
							);
						})}
					</div>
				</div>
			</div>

			{/* Image Collage */}
			{images.length > 0 && (
				<div>
					<div className={`mb-2 font-dm text-sm`}>Event Images</div>

					<div className='columns-1 sm:columns-2 md:columns-3 gap-4 space-y-4 bg-tp p-4'>
						{images.map((img, i) => (
							<div
								key={i}
								className={`break-inside-avoid overflow-hidden rounded-xl clickable hover:opacity-80 transition relative ${
									img.isThumbnail ? '' : ''
								}`}
								onClick={() => setModalIndex(i)}>
								<img
									src={'/api/media/images/' + img.url.split('/').pop()}
									alt='Event'
									className='w-full object-cover'
								/>
							</div>
						))}
					</div>
				</div>
			)}

			{/* Modal */}
			{modalIndex !== null && (
				<ImageGalleryModal
					images={images}
					currentIndex={modalIndex}
					setCurrentIndex={setModalIndex}
					onClose={() => setModalIndex(null)}
				/>
			)}
		</div>
	);
};

export default Event;
