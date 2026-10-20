'use client';
import React, { useEffect, useRef, useState } from 'react';
import { useEvents } from '@/contexts/EventsContext';
import ImageGalleryModal from '@/components/media/ImageGalleryModal';
import MarkdownText from '@/components/ui/MarkdownText';
import getFormat from '@/lib/getFormat';
import { FaCalendarPlus } from 'react-icons/fa6';
import { useSettings } from '@/contexts/SettingsContext';
import ShareButton from '@/components/ui/ShareButton';
import NotFound from '@/components/ui/NotFound';
import Loader from '@/components/ui/Loader';

const Event = ({ eventID }) => {
	const {
		events,
		eventDates,
		eventTimes,
		eventImages,
		fetchEventById,
		fetchEventDatesById,
		fetchEventTimesByEventId,
		fetchEventImages,
	} = useEvents();
	const { formatLongDate, formatTime, getLongDayOfWeek, formatDuration } = getFormat;

	// `eventID` is a slug or ID. Context holds every event with its dates, times and images,
	// so the page renders (or 404s) on first paint with no client fetch
	const known = events?.find((e) => e.slug === eventID || String(e.id) === eventID);
	const missing = events?.length > 0 && !known;
	// Fallback data, only fetched when context is empty (server events fetch failed)
	const [fetched, setFetched] = useState(null);
	const [loading, setLoading] = useState(!known && !missing);

	const knownDates = known ? eventDates.filter((d) => d.eventID === known.id) : [];
	const { event, dates, times, images } = known
		? {
				event: known,
				dates: knownDates,
				times: eventTimes.filter((t) => knownDates.some((d) => d.id === t.eventDateID)),
				images: eventImages?.[known.id] ?? [],
		  }
		: fetched ?? { event: null, dates: [], times: [], images: [] };
	const [modalIndex, setModalIndex] = useState(null);
	const contactInfo = useSettings()?.settings?.general?.contactInformation || {};
	const [pickerOpen, setPickerOpen] = useState(false);
	const pickerRef = useRef(null);

	// Close the calendar picker on outside click
	useEffect(() => {
		if (!pickerOpen) return;
		const close = (e) => !pickerRef.current?.contains(e.target) && setPickerOpen(false);
		document.addEventListener('mousedown', close);
		return () => document.removeEventListener('mousedown', close);
	}, [pickerOpen]);

	function parseDateAsLocal(dateStr) {
		const [year, month, day] = dateStr.split('-').map(Number);
		return new Date(year, month - 1, day);
	}

	useEffect(() => {
		if (known || missing) return setLoading(false);
		setLoading(true);
		(async () => {
			const id = (await fetchEventById(eventID))?.id;
			const [eventData, dateData, timeData, imageData] = id
				? await Promise.all([
						fetchEventById(id),
						fetchEventDatesById(id),
						fetchEventTimesByEventId(id),
						fetchEventImages(id),
				  ])
				: [null, [], [], []];
			setFetched({ event: eventData, dates: dateData, times: timeData, images: imageData });
			setLoading(false);
		})();
	}, [eventID, events?.length]);

	/**
	 * Downloads an `.ics` file for one date/time. Phones and desktops open it in their own calendar app.
	 * Times are church-local, so they're pinned to `America/New_York`. Recurring events repeat weekly
	 */
	function addToCalendar(date, time) {
		const stamp = (d, t) => `${d.slice(0, 10).replace(/-/g, '')}T${t.replace(/:/g, '').padEnd(6, '0')}`;
		const [h, m] = time.startTime.split(':').map(Number);
		// No end time: assume 30 minutes
		const end =
			time.endTime ||
			`${String(Math.min(h + Math.floor((m + 30) / 60), 23)).padStart(2, '0')}:${String((m + 30) % 60).padStart(2, '0')}`;
		const escape = (text) =>
			(text || '').replace(/<[^>]*>/g, '').replace(/[\;,]/g, '\\$&').replace(/\n/g, '\\n');
		const location = [contactInfo.locationName || 'Linganore United Methodist Church', contactInfo.address]
			.filter(Boolean)
			.join(', ');

		const ics = [
			'BEGIN:VCALENDAR',
			'VERSION:2.0',
			'PRODID:-//Linganore UMC//Events//EN',
			'BEGIN:VEVENT',
			`UID:${event.id}-${date.id}-${time.id}@linganoreumc.com`,
			`DTSTAMP:${new Date().toISOString().replace(/[-:]/g, '').slice(0, 15)}Z`,
			`DTSTART;TZID=America/New_York:${stamp(date.date, time.startTime)}`,
			`DTEND;TZID=America/New_York:${stamp(date.date, end)}`,
			...(event.isRecurring ? ['RRULE:FREQ=WEEKLY'] : []),
			`SUMMARY:${escape(event.title)}`,
			`DESCRIPTION:${escape(event.description)}`,
			`LOCATION:${escape(location)}`,
			`URL:${window.location.href}`,
			'END:VEVENT',
			'END:VCALENDAR',
		].join('\r\n');

		const link = document.createElement('a');
		link.href = URL.createObjectURL(new Blob([ics], { type: 'text/calendar' }));
		link.download = `${event.slug || 'event'}.ics`;
		link.click();
		// Revoking right away cancels the download on iOS Safari
		setTimeout(() => URL.revokeObjectURL(link.href), 1000);
	}

	if (loading) return <Loader label='Loading event…' />;
	if (!event)
		return (
			<NotFound
				title="We couldn't find this event"
				text="It may have ended or been removed. You can see everything that's coming up below."
				links={[
					{ href: '/events/', label: 'See All Events' },
					{ href: '/calendar/', label: 'View the Calendar' },
				]}
			/>
		);

	// Next non-cancelled occurrence. Recurring events repeat weekly from their start date
	const now = new Date();
	const nextStart = dates
		.filter((d) => !d.isCancelled)
		.flatMap((d) =>
			times
				.filter((t) => String(t.eventDateID) === String(d.id))
				.map((t) => {
					const start = parseDateAsLocal(d.date);
					const [h, m] = t.startTime.split(':').map(Number);
					start.setHours(h, m, 0, 0);
					if (event.isRecurring) {
						while (start < now) start.setDate(start.getDate() + 7);
					}
					return start;
				})
		)
		.filter((start) => start >= now)
		.sort((a, b) => a - b)[0];
	const minutesUntil = nextStart ? Math.round((nextStart - now) / 60_000) : null;
	const isToday = nextStart?.toDateString() === now.toDateString();
	const nextTime = nextStart?.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' });
	const nextDay = nextStart?.toLocaleDateString('en-US', {
		weekday: 'long',
		month: 'long',
		day: 'numeric',
	});

	// Every addable date and time. Skips cancelled dates, and past ones for one-off events
	const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
	const calendarOptions = dates
		.filter((d) => !d.isCancelled && (event.isRecurring || parseDateAsLocal(d.date) >= today))
		.flatMap((date) =>
			times
				.filter((t) => String(t.eventDateID) === String(date.id))
				.map((time) => ({ date, time }))
		);

	return (
		<div className='relative flex flex-col px-4 pt-12 pb-8 max-w-[1000px] mx-auto space-y-10 font-dm'>
			<ShareButton
				title={event.title}
				label='Share Event'
				className='absolute top-3 right-4'
			/>
			<div className='flex flex-col space-y-8'>
				<div className='relative flex flex-col items-center space-y-4'>
					{/* Next occurrence, with a countdown when it's today. Small and stacked above the title */}
					<div className='flex flex-col items-center text-sm md:text-base text-darkred text-center px-8'>
						{!nextStart ? (
							<span className='text-darkred/60'>This event has already happened</span>
						) : isToday ? (
							<>
								Today at {nextTime}
								<span className='text-red'>
									Starts in {formatDuration(minutesUntil) || 'less than a minute'}
								</span>
							</>
						) : (
							`Next: ${nextDay} at ${nextTime}`
						)}
					</div>
					<h1 className='text-3xl text-center'>{event.title}</h1>
					<div className='-mt-1 md:px-12 md:pb-2 text-base md:text-lg'>
						<MarkdownText html={event.description} />
					</div>
					<div className='bg-red/10 w-full py-1 skew-r'></div>
				</div>

				{/* Schedule */}
				<div>
					<div className='font-dm text-sm mb-2 px-2 flex items-center justify-between'>
						<span>Event Schedule</span>
						{calendarOptions.length > 0 && (
							<div
								ref={pickerRef}
								className='relative'>
								<button
									onClick={() =>
										// One option: add it straight away, no picker
										calendarOptions.length === 1
											? addToCalendar(calendarOptions[0].date, calendarOptions[0].time)
											: setPickerOpen((open) => !open)
									}
									className='flex items-center gap-1.5 text-red clickable'>
									<FaCalendarPlus size={13} />
									Add to Calendar
								</button>

								{/* Picker: each row is one date and time, tap to add */}
								<div
									className={`absolute right-0 top-7 z-20 w-[18rem] max-w-[calc(100vw-2rem)] bg-bkg outline-4 outline-bkg shadow-lg transition-all duration-200 ${
										pickerOpen
											? 'opacity-100 translate-y-0'
											: 'opacity-0 -translate-y-2 pointer-events-none'
									}`}>
									<div className='bg-red text-bkg px-4 py-2 text-base'>Which time would you like to add?</div>
									<div className='max-h-64 overflow-y-auto divide-y divide-tp'>
										{calendarOptions.map(({ date, time }) => (
											<button
												key={`${date.id}-${time.id}`}
												onClick={() => {
													addToCalendar(date, time);
													setPickerOpen(false);
												}}
												className='flex w-full items-center justify-between gap-3 px-4 py-3 text-left hover:bg-tp'>
												<span>
													<span className='block text-darkred'>
														{event.isRecurring
															? `Every ${getLongDayOfWeek(parseDateAsLocal(date.date))}`
															: formatLongDate(parseDateAsLocal(date.date))}
													</span>
													<span className='text-black'>
														{formatTime(time.startTime)}
														{time.endTime ? ` – ${formatTime(time.endTime)}` : ''}
													</span>
												</span>
												<FaCalendarPlus
													size={16}
													className='shrink-0 text-red'
												/>
											</button>
										))}
									</div>
								</div>
							</div>
						)}
					</div>

					<div className='grid gap-x-4 grid-cols-1 sm:grid-cols-3 md:grid-cols-4'>
						{dates.map((date) => {
							const matchedTimes = times.filter((t) => String(t.eventDateID) === String(date.id));
							return (
								<div
									key={'date-' + date.id}
									title={date.isCancelled ? 'Cancelled' : undefined}
									className={`px-4 text-bkg space-y-2 py-2 ${date.isCancelled ? 'cursor-pointer' : ''}`}>
									{/* Cancelled: muted gray tag, times struck through, "Cancelled" on hover */}
									<div
										className={`flex w-full min-w-fit text-center items-center justify-center skew-l px-4 ${
											date.isCancelled ? 'bg-tp text-darkred/60' : 'bg-red'
										}`}>
										<span className='skew-r whitespace-nowrap'>
											{event.isRecurring
												? getLongDayOfWeek(parseDateAsLocal(date.date))
												: formatLongDate(parseDateAsLocal(date.date))}
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
													className={`flex items-center space-x-2 text-black whitespace-nowrap ${
														date.isCancelled ? 'line-through opacity-50' : ''
													}`}>
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
