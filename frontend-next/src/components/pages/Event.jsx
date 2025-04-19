'use client';
import React, { useEffect, useState, useRef } from 'react';
import { useEvents } from '@/contexts/EventsContext';
import ImageGalleryModal from '@/components/media/ImageGalleryModal';
import MarkdownText from '@/components/ui/MarkdownText';
import getFormat from '@/lib/getFormat';
import { FaCalendarDay } from 'react-icons/fa6';

const Event = ({ eventID }) => {
	const { fetchEventById, fetchEventDatesById, fetchEventTimesByEventId, fetchEventImages } =
		useEvents();
	const { formatLongDate, formatTime, getLongDayOfWeek } = getFormat;

	const [event, setEvent] = useState(null);
	const [dates, setDates] = useState([]);
	const [times, setTimes] = useState([]);
	const [images, setImages] = useState([]);
	const [loading, setLoading] = useState(true);
	const [modalIndex, setModalIndex] = useState(null);
	const [showCalendarDropdown, setShowCalendarDropdown] = useState(false);
	const dropdownRef = useRef(null);

	const [expandedDates, setExpandedDates] = useState({});
	const [selectedDate, setSelectedDate] = useState(null);
	const [selectedTime, setSelectedTime] = useState(null);

	function parseDateAsLocal(dateStr) {
		const [year, month, day] = dateStr.split('-').map(Number);
		return new Date(year, month - 1, day);
	}

	useEffect(() => {
		const loadEvent = async () => {
			setLoading(true);
			const [eventData, dateData, timeData, imageData] = await Promise.all([
				fetchEventById(eventID),
				fetchEventDatesById(eventID),
				fetchEventTimesByEventId(eventID),
				fetchEventImages(eventID),
			]);
			setEvent(eventData);
			setDates(dateData);
			setTimes(timeData);
			setImages(imageData);
			setLoading(false);
		};
		loadEvent();
	}, [eventID]);

	useEffect(() => {
		function handleClickOutside(event) {
			if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
				setShowCalendarDropdown(false);
			}
		}
		document.addEventListener('mousedown', handleClickOutside);
		return () => document.removeEventListener('mousedown', handleClickOutside);
	}, []);

	function toggleExpandDate(dateId, e) {
		e.stopPropagation();
		setExpandedDates((prev) => ({
			...prev,
			[dateId]: !prev[dateId],
		}));
	}
	function handleAddToGoogleCalendar() {
		if (!selectedDate || !selectedTime) return;

		const dateObj = dates.find((d) => d.id === selectedDate);
		const timeObj = times.find((t) => t.id === selectedTime);
		if (!dateObj || !timeObj) return;

		const startDate = parseDateAsLocal(dateObj.date);
		console.log(startDate);
		const [sh, sm] = timeObj.startTime.split(':').map(Number);
		startDate.setHours(sh, sm);

		let endDate = new Date(startDate);
		if (timeObj.endTime) {
			const [eh, em] = timeObj.endTime.split(':').map(Number);
			endDate.setHours(eh, em);
		} else {
			endDate.setMinutes(endDate.getMinutes() + 30); // fallback 30 min
		}

		const formatDateEST = (date) => {
			const pad = (n) => String(n).padStart(2, '0');

			const year = date.getFullYear();
			const month = pad(date.getMonth() + 1);
			const day = pad(date.getDate());
			const hours = pad(date.getHours());
			const minutes = pad(date.getMinutes());
			const seconds = pad(date.getSeconds());

			// Timezone offset from UTC, in minutes
			const offsetMinutes = date.getTimezoneOffset(); // e.g. 300 or 240 (note: this is POSITIVE for UTC-)
			const offsetHours = Math.floor(Math.abs(offsetMinutes) / 60);
			const offsetMins = Math.abs(offsetMinutes) % 60;
			const offsetSign = offsetMinutes <= 0 ? '+' : '-'; // FLIP: browser gives +300 for EST (UTC-5)

			const offset = `${offsetSign}${pad(offsetHours)}${pad(offsetMins)}`;

			return `${year}${month}${day}T${hours}${minutes}${seconds}${offset}`;
		};

		const details = {
			action: 'TEMPLATE',
			text: event.title,
			details: `${event.description.replace(/<\/?[^>]+(>|$)/g, '')}${
				event.isRecurring
					? '\n\nNote: This event recurs weekly on ' +
					  getLongDayOfWeek(startDate) +
					  's at ' +
					  formatTime(timeObj.startTime)
					: ''
			}`,
			location: 'Linganore United Methodist Church',
			dates: `${formatDateEST(startDate)}/${formatDateEST(endDate)}`,
		};

		let url = new URL('https://www.google.com/calendar/render');
		for (const key in details) {
			url.searchParams.append(key, details[key]);
		}

		if (event.isRecurring) {
			const dayMap = ['SU', 'MO', 'TU', 'WE', 'TH', 'FR', 'SA'];
			const byDay = dayMap[startDate.getDay()];
			url.searchParams.append('recur', `RRULE:FREQ=WEEKLY;BYDAY=${byDay}`);
		}

		window.open(url.toString(), '_blank');
	}

	if (loading)
		return (
			<div className='p-8 font-dm min-h-screen text-center italic text-sm text-darkred'>
				Loading event...
			</div>
		);
	if (!event)
		return (
			<div className='p-8 font-dm text-sm italic text-center text-darkred'>Event not found.</div>
		);

	return (
		<div className='flex flex-col px-4 py-8 max-w-[1000px] min-h-[1000px] mx-auto space-y-10 font-dm'>
			<div className='flex flex-col space-y-8'>
				<div className='flex flex-col items-center space-y-4'>
					<h1 className='text-3xl'>{event.title}</h1>
					<div className='md:px-12 md:py-2 text-lg'>
						<MarkdownText html={event.description} />
					</div>
					<div className='bg-red w-full py-2 skew-r'></div>
				</div>

				{/* Schedule */}
				<div>
					<div className='font-dm text-sm mb-2 flex items-center justify-between'>
						<span>Event Schedule</span>
						<button className='flex items-center justify-center space-x-2'>
							{/* Schedule Section Header with Dropdown Trigger */}
							<div
								className='relative flex flex-col w-full items-end'
								ref={dropdownRef}>
								<div
									className='flex items-center justify-center space-x-2 z-10 relative'
									onClick={() => setShowCalendarDropdown((prev) => !prev)}>
									<span className='font-dm text-sm text-red clickable'>Add Time to Calendar</span>
								</div>

								{/* Dropdown Panel */}
								<div
									className={`absolute top-8 right-0 w-[20rem] outline-4 outline-darkred md:outline-bkg z-20 transform transition-all duration-200 ease-out ${
										showCalendarDropdown
											? 'opacity-100 translate-y-0 pointer-events-auto'
											: 'opacity-0 -translate-y-4 pointer-events-none'
									} bg-bkg-tp shadow-lg text-sm `}>
									<div className='px-4 py-2 bg-red text-bkg'>
										<div className='text-lg'>Select Event Date & Time</div>

										<div className='text-darkred py-1 px-2 mx-4 bg-bkg-tp text-xs mt-1 skew-r'>
											<p className={`skew-l`}>
												{event.isRecurring
													? 'This is a recurring event. Select a day and time to add to your calendar.'
													: 'Select which date and time to add to your calendar.'}
											</p>
										</div>
									</div>

									{/* Date Selections */}
									<div className='px-4 py-2 relative overflow-y-auto max-h-40'>
										<div className={`flex flex-col w-full space-y-2`}>
											{dates.map((date) => {
												const dateTimes = times.filter(
													(t) => String(t.eventDateID) === String(date.id)
												);

												const isExpanded = expandedDates[date.id] ?? false;

												return (
													<div
														key={date.id}
														className=''>
														{/* Date Row */}
														{!date.isCancelled && (
															<div className='flex items-center space-x-2'>
																<input
																	type='radio'
																	id={`date-${date.id}`}
																	checked={selectedDate === date.id}
																	onChange={(e) => {
																		setSelectedDate(date.id);
																		setSelectedTime(dateTimes[0].id);
																		if (!expandedDates[date.id]) {
																			toggleExpandDate(date.id, e);
																		}
																	}}
																	disabled={date.isCancelled}
																	className='h-4 w-4 accent-red'
																/>
																<div
																	className='flex-grow cursor-pointer flex items-center space-x-1'
																	onClick={(e) => toggleExpandDate(date.id, e)}>
																	<span className={``}>
																		{event.isRecurring
																			? getLongDayOfWeek(parseDateAsLocal(date.date))
																			: formatLongDate(parseDateAsLocal(date.date))}
																	</span>
																	<svg
																		xmlns='http://www.w3.org/2000/svg'
																		className={`h-4 w-4 transition-transform ${
																			isExpanded ? 'rotate-180' : ''
																		}`}
																		fill='none'
																		viewBox='0 0 24 24'
																		stroke='currentColor'>
																		<path
																			strokeLinecap='round'
																			strokeLinejoin='round'
																			strokeWidth={2}
																			d='M19 9l-7 7-7-7'
																		/>
																	</svg>
																</div>
															</div>
														)}

														{/* Times */}
														{isExpanded && (
															<div className='ml-6 mt-1 space-y-1'>
																{dateTimes.length === 0 ? (
																	<div className='text-gray-400 italic text-xs'>
																		No times scheduled
																	</div>
																) : (
																	dateTimes.map((time) => (
																		<div
																			key={`date-${date.id}-time-${time.id}`}
																			className='flex items-center space-x-2'>
																			<input
																				type='radio'
																				id={`time-${time.id}`}
																				checked={
																					selectedTime === time.id && selectedDate === date.id
																				}
																				onChange={(e) => {
																					setSelectedDate(date.id);
																					setSelectedTime(time.id);
																					if (!expandedDates[date.id]) {
																						toggleExpandDate(date.id, e);
																					}
																				}}
																				disabled={date.isCancelled}
																				className='h-3 w-3'
																			/>
																			<label
																				htmlFor={`time-${time.id}`}
																				className={`text-xs cursor-pointer ${
																					date.isCancelled ? 'text-gray-400' : ''
																				}`}>
																				{formatTime(time.startTime)}
																				{time.endTime ? ` – ${formatTime(time.endTime)}` : ''}
																			</label>
																		</div>
																	))
																)}
															</div>
														)}
													</div>
												);
											})}
										</div>
									</div>

									{/* Action Button */}
									<div className='px-4 py-2 bg-tp '>
										<div
											onClick={handleAddToGoogleCalendar}
											className='w-full bg-red text-white py-2 clickable-l-skew transition cursor-pointer'>
											<p className={`skew-r`}>Add to Calendar</p>
										</div>
									</div>
								</div>
							</div>
						</button>
					</div>

					<div className='grid gap-x-4 grid-cols-2 sm:grid-cols-3 md:grid-cols-4'>
						{dates.map((date) => {
							const matchedTimes = times.filter((t) => String(t.eventDateID) === String(date.id));
							return (
								<div
									key={'date-' + date.id}
									className={`${
										date.isCancelled ? 'bg-darkred marker:text-bkg decoration-bkg' : ''
									} px-4 text-bkg space-y-2 py-2`}>
									<div className='flex w-full text-center items-center justify-center skew-l bg-red px-4'>
										<span className='skew-r whitespace-nowrap'>
											{event.isRecurring
												? getLongDayOfWeek(parseDateAsLocal(date.date))
												: formatLongDate(parseDateAsLocal(date.date))}
											{date.isCancelled ? <span className='ml-2 text-red'>Cancelled</span> : ''}
										</span>
									</div>
									<ul className='md:ml-4 list-disc'>
										{matchedTimes.length === 0 ? (
											<li
												key={`date-${date.id}-empty`}
												className='italic text-sm text-gray-400'>
												No times scheduled
											</li>
										) : (
											matchedTimes.map((t, index) => (
												<li
													key={`time-${date.id}-${t.id}-${index}`}
													className='flex items-center space-x-2 text-black whitespace-nowrap'>
													<span className='p-0.75 bg-black'>{` `}</span>
													<span>
														{formatTime(t.startTime)}
														{t.endTime ? ` – ${formatTime(t.endTime)}` : ''}
													</span>
												</li>
											))
										)}
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
					<div className='mb-2 font-dm text-sm'>Event Images</div>
					<div className='columns-1 sm:columns-2 md:columns-3 gap-4 space-y-4 bg-tp p-4'>
						{images.map((img, i) => (
							<div
								key={'img-' + i}
								className='break-inside-avoid overflow-hidden clickable hover:opacity-80 transition relative'
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
