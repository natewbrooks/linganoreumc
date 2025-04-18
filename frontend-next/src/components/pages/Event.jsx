'use client';
import React, { useEffect, useState } from 'react';
import { useEvents } from '@/contexts/EventsContext';
import ImageGalleryModal from '@/components/media/ImageGalleryModal';
import MarkdownText from '@/components/ui/MarkdownText';
import getFormat from '@/lib/getFormat';

const Event = ({ eventID }) => {
	const { fetchEventById, fetchEventDatesById, fetchEventTimesByEventId, fetchEventImagesById } =
		useEvents();
	const { formatLongDate, formatTime, getLongDayOfWeek } = getFormat;

	const [event, setEvent] = useState(null);
	const [dates, setDates] = useState([]);
	const [times, setTimes] = useState([]);
	const [images, setImages] = useState([]);
	const [loading, setLoading] = useState(true);
	const [modalIndex, setModalIndex] = useState(null);

	// Ensures date-only values aren't shifted due to timezone offset
	function parseDateAsLocal(dateStr) {
		const [year, month, day] = dateStr.split('-').map(Number);
		return new Date(year, month - 1, day); // JS months are 0-based
	}

	useEffect(() => {
		console.log(eventID);
		const loadEvent = async () => {
			try {
				setLoading(true);

				const [eventData, dateData, timeData, imageData] = await Promise.all([
					fetchEventById(eventID),
					fetchEventDatesById(eventID),
					fetchEventTimesByEventId(eventID),
					fetchEventImagesById(eventID),
				]);

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
		<div className='flex flex-col px-4 py-8 max-w-[1000px] min-h-[1000px] mx-auto space-y-10 font-dm'>
			<div className={`flex flex-col space-y-8 `}>
				<div className={`flex flex-col items-center space-y-2`}>
					<h1 className='text-3xl'>{event.title}</h1>
				</div>

				<div className={`md:bg-red md:px-12 md:py-2 skew-r`}>
					<div className={`skew-l md:text-bkg text-sm md:text-lg`}>
						<MarkdownText html={event.description} />
					</div>
				</div>

				{/* Schedule */}
				<div className=''>
					<div className={`mb-2 font-dm text-sm`}>Event Schedule</div>
					<div className={`grid gap-x-4 grid-cols-2 sm:grid-cols-3 md:grid-cols-4`}>
						{dates.map((date) => {
							const matchedTimes = times.filter((t) => String(t.eventDateID) === String(date.id));
							return (
								<div
									key={date.id}
									className={`${
										date.isCancelled ? 'bg-darkred marker:text-bkg decoration-bkg' : ''
									} px-4 text-bkg space-y-2 py-2`}>
									<div className='flex w-full text-center  items-center  justify-center skew-l bg-red px-4'>
										<span className={`skew-r whitespace-nowrap`}>
											{event.isRecurring
												? getLongDayOfWeek(parseDateAsLocal(date.date))
												: formatLongDate(parseDateAsLocal(date.date))}
											{date.isCancelled ? <span className='ml-2 text-red'>Cancelled</span> : ''}
										</span>
									</div>
									<ul className='ml-4 list-disc '>
										{matchedTimes.length == 0 && (
											<li className='italic text-sm text-gray-400'>No times scheduled</li>
										)}
										{matchedTimes.map((t, i) => {
											return (
												<li
													key={i}
													className='flex items-center space-x-2 text-black'>
													<span className={`p-0.75 rounded-full bg-black`}>{` `}</span>
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

					<div className='columns-1 sm:columns-2 md:columns-3 gap-4 space-y-4 bg-tp rounded p-4'>
						{images.map((img, i) => (
							<div
								key={i}
								className={`break-inside-avoid overflow-hidden rounded-xl clickable hover:opacity-80 transition relative ${
									img.isThumbnail ? '' : ''
								}`}
								onClick={() => setModalIndex(i)}>
								<img
									src={
										`${process.env.NEXT_PUBLIC_API_BASE_URL}/media/images/` +
										img.url.split('/').pop()
									}
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
