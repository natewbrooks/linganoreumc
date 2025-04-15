import React, { useState, useEffect } from 'react';
import { FaClock } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import { useEvents } from '../../contexts/EventsContext';
import { formatShortDate, formatTime } from '../../helper/textFormat';

function EventItem({ event }) {
	const { fetchEventDatesById, fetchEventTimesByDateId, getLongDayOfWeek } = useEvents();
	const [eventDates, setEventDates] = useState([]);
	const [timesMap, setTimesMap] = useState({});
	const [error, setError] = useState(null);

	useEffect(() => {
		fetchEventDatesById(event.id)
			.then(setEventDates)
			.catch((err) => setError(err.message));
	}, [event.id, fetchEventDatesById]);

	useEffect(() => {
		eventDates.forEach((dateObj) => {
			if (!timesMap[dateObj.id]) {
				fetchEventTimesByDateId(dateObj.id)
					.then((data) => {
						setTimesMap((prevMap) => ({ ...prevMap, [dateObj.id]: data }));
					})
					.catch((err) => setError(err.message));
			}
		});
	}, [eventDates, fetchEventTimesByDateId]);

	if (error) {
		return <div>Error: {error}</div>;
	}

	return (
		<Link
			to={`/events/${event.id}`}
			className='font-dm w-full clickable   '>
			{/* Date/Time row */}
			<div className='text-xs md:text-sm text-darkred bg-accent px-4 py-0.5 w-fit -skew-x-[30deg] relative flex items-center space-x-2'>
				{eventDates.map((dateObj, idx) => {
					const times = timesMap[dateObj.id] || [];
					if (!times.length) return null;

					const date = event.isRecurring
						? `${getLongDayOfWeek(dateObj.date) + 'S'}`
						: formatShortDate(dateObj.date);

					const timesString = times.map((t) => formatTime(t.time)).join(', ');

					return (
						<React.Fragment key={dateObj.id}>
							<span className={`skew-x-[30deg] whitespace-nowrap`}>
								{idx > 0 && <span className='pr-2'>|</span>}
								<span className={` ${dateObj.isCancelled ? 'line-through' : ''}`}>
									{date} <span className={`hidden md:inline-block `}>@ {timesString}</span>
								</span>
							</span>
						</React.Fragment>
					);
				})}
			</div>

			<div className='w-full flex flex-row items-center bg-tp -skew-x-[30deg] relative text-md md:text-lg '>
				<div className='font-dm py-2 text-bkg min-w-[45px] md:min-w-[80px] overflow-hidden text-center relative bg-darkred px-4'>
					<p className='block md:hidden skew-x-[30deg] whitespace-nowrap'>{event.id}</p>
					<p className='hidden md:block skew-x-[30deg] whitespace-nowrap'>eid: {event.id}</p>
				</div>
				<div className='font-dm py-2 text-bkg bg-red px-4 text-center overflow-visible whitespace-nowrap skew-x-0 w-fit'>
					<p className='skew-x-[30deg]'>{event.title}</p>
				</div>

				<div className='p-2 pl-4 font-dm items-center text-darkred w-screen overflow-hidden'>
					<div
						className='skew-x-[30deg] prose prose-sm line-clamp-1 overflow-hidden text-ellipsis whitespace-nowrap'
						dangerouslySetInnerHTML={{ __html: event.description }}
					/>
				</div>
			</div>
		</Link>
	);
}

export default EventItem;
