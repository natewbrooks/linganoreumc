import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useSettings } from '@/contexts/SettingsContext';
import getFormat from '@/lib/getFormat';
import { useEvents } from '@/contexts/EventsContext';

function EventItem({ event, previous }) {
	const { eventDates, eventTimes } = useEvents();
	const { getShortDayOfWeek } = getFormat;
	const { formatDate, formatTime } = useSettings();
	const [timesMap, setTimesMap] = useState({});

	useEffect(() => {
		const newMap = {};

		eventDates
			.filter((dateObj) => dateObj.eventID === event.id)
			.forEach((dateObj) => {
				const matchingTimes = Object.values(eventTimes)
					.flat()
					.filter((time) => time.eventDateID === dateObj.id);

				if (matchingTimes.length > 0) {
					newMap[dateObj.id] = matchingTimes;
				}
			});

		if (Object.keys(newMap).length > 0) {
			setTimesMap(newMap);
		}
	}, [eventDates, eventTimes, event.id]);

	return (
		<div className='flex flex-col w-full hover:scale-[1.02] hover:opacity-50 active:scale-[1] '>
			<div
				className={`flex flex-row w-fit pl-4 sm:px-4 -skew-x-[30deg] gap-x-3 font-dm text-sm z-10 relative sm:-left-2 -top-0 min-w-[200px] ${
					previous ? 'text-darkred' : 'text-darkred bg-accent'
				}`}>
				{!previous
					? eventDates
							.filter((dateObj) => dateObj.eventID === event.id)
							.filter((dateObj) => new Date(dateObj.date) >= new Date())
							.sort((a, b) => new Date(a.date) - new Date(b.date))
							// Conditionally slice if not recurring
							.slice(0, event.isRecurring ? undefined : 1)
							.map((dateObj, idx) => {
								const times = timesMap[dateObj.id] || [];
								if (!times.length) return null;

								const date = event.isRecurring
									? getShortDayOfWeek(dateObj.date)
									: formatDate(dateObj.date);

								const timeString = times.map((t) => formatTime(t.time)).join(', ');

								return (
									<React.Fragment key={dateObj.id}>
										{idx > 0 && <span className='skew-x-[30deg]'>|</span>}
										<div className='skew-x-[30deg]'>{`${date} @ ${timeString}`}</div>
									</React.Fragment>
								);
							})
					: null}
			</div>

			<Link
				href={`/events/${event.id}`}
				className='relative flex flex-row items-stretch w-full font-dm'>
				<div className={`absolute bg-tp w-screen h-full`}>{` `}</div>
				{/* Title Block */}
				<div
					className={`${
						previous ? 'bg-darkred' : 'bg-red'
					} w-fit text-bkg relative -left-3 px-4 py-2 text-lg text-center -skew-x-[30deg] flex items-center justify-center`}>
					<p className='skew-x-[30deg] min-w-[200px] w-fit whitespace-nowrap'>{event.title}</p>
				</div>

				{/* Description Block */}
				<div className='flex-1 p-2 px-4 text-darkred text-lg -skew-x-[30deg]'>
					<div
						className='line-clamp-1 whitespace-nowrap overflow-hidden skew-x-[30deg]'
						dangerouslySetInnerHTML={{ __html: event.description }}
					/>
				</div>
			</Link>
		</div>
	);
}

export default EventItem;
