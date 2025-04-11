import React, { useState, useEffect } from 'react';
import { FaClock } from 'react-icons/fa';
import { useEvents } from '../../contexts/EventsContext';
import { Link } from 'react-router-dom';
import { useSettings } from '../../contexts/SettingsContext';

function EventItem({ event, previous }) {
	const { eventDates, eventTimes } = useEvents();
	const { formatDate, formatTime } = useSettings();
	const [timesMap, setTimesMap] = useState({});

	useEffect(() => {
		const newMap = {};

		eventDates
			.filter((dateObj) => dateObj.eventID === event.id) // ✅ only for this event
			.forEach((dateObj) => {
				const matchingTimes = Object.values(eventTimes)
					.flat()
					.filter((time) => time.eventDateID === dateObj.id);

				if (matchingTimes.length > 0) {
					newMap[dateObj.id] = matchingTimes;
				}
			});

		if (Object.keys(newMap).length > 0) {
			setTimesMap(newMap); // no need to merge
		}
	}, [eventDates, eventTimes, event.id]);

	return (
		<div className='flex flex-col w-full hover:scale-[1.02] hover:opacity-50 active:scale-[1] '>
			<div
				className={`flex flex-row w-fit pl-4 sm:px-4 -skew-x-[30deg] gap-x-3 font-dm text-sm z-10 relative sm:-left-2 -top-0 min-w-[200px] ${
					previous ? 'text-darkred' : 'text-darkred bg-accent'
				}`}>
				{!previous &&
					eventDates
						.filter((dateObj) => dateObj.eventID === event.id)
						// show only future dates
						.filter((dateObj) => new Date(dateObj.date) >= new Date())
						// sort ascending so the earliest is first
						.sort((a, b) => new Date(a.date) - new Date(b.date))
						// take only the first upcoming date
						.slice(0, 1)
						.map((dateObj, idx) => {
							const times = timesMap[dateObj.id] || [];
							if (!times.length) return null;

							const date = formatDate(dateObj.date);
							const timeString = times.map((t) => formatTime(t.time)).join(', ');

							return (
								<React.Fragment key={dateObj.id}>
									{idx > 0 && <span className=''>|</span>}
									<div className='skew-x-[30deg]'>{`${date} @ ${timeString}`}</div>
								</React.Fragment>
							);
						})}
			</div>

			<Link
				to={`/events/${event.id}`}
				className='flex flex-row items-center bg-tp relative -right-4 sm:right-0 '>
				<div
					className={`font-dm p-1 py-2 text-bkg min-w-[200px] overflow-hidden text-center -left-3 text-lg relative ${
						previous ? 'bg-darkred' : 'bg-red'
					} px-4 py-1 -skew-x-[30deg]`}>
					<p className='skew-x-[30deg]'>{event.title}</p>
				</div>
				<div className='p-2 font-dm items-center text-darkred text-lg whitespace-nowrap'>
					<p>{event.description}</p>
				</div>
			</Link>
		</div>
	);
}

export default EventItem;
