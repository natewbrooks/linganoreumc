import React, { useState, useEffect } from 'react';
import { FaClock } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import { useEvents } from '../../contexts/EventsContext';
import { formatShortDate, formatTime } from '../../helper/textFormat';

function EventItem({ id, title, description }) {
	const { fetchEventDatesById, fetchEventTimesByDateId } = useEvents();
	const [eventDates, setEventDates] = useState([]);
	const [timesMap, setTimesMap] = useState({});
	const [error, setError] = useState(null);

	useEffect(() => {
		fetchEventDatesById(id)
			.then(setEventDates)
			.catch((err) => setError(err.message));
	}, [id, fetchEventDatesById]);

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
			to={`/events/${id}`}
			className='font-dm w-full cursor-pointer hover:opacity-50 hover:scale-[102%] active:scale-[100%]'>
			{/* Date/Time row */}
			<div className='text-sm text-darkred bg-accent px-2 py-0.5 w-fit -skew-x-[30deg] relative flex flex-wrap items-center space-x-2'>
				{eventDates.map((dateObj, idx) => {
					const times = timesMap[dateObj.id] || [];
					if (!times.length) return null;

					const date = formatShortDate(dateObj.date);
					const timesString = times.map((t) => formatTime(t.time)).join(', ');

					return (
						<React.Fragment key={dateObj.id}>
							<span className={`skew-x-[30deg]`}>
								{idx > 0 && <span className='pr-2'>|</span>}
								<span
									className={`${
										dateObj.isCancelled ? 'line-through' : ''
									}`}>{`${date} @ ${timesString}`}</span>
							</span>
						</React.Fragment>
					);
				})}
			</div>

			<div className='w-full flex flex-row items-center bg-tp -skew-x-[30deg] relative'>
				<div className='font-dm py-2 text-bkg min-w-[80px] overflow-hidden text-center text-lg relative bg-darkred px-4'>
					<p className='skew-x-[30deg] whitespace-nowrap'>eid: {id}</p>
				</div>
				<div className='font-dm py-2 text-bkg bg-red px-4 text-center text-lg overflow-visible whitespace-nowrap skew-x-0'>
					<p className='skew-x-[30deg]'>{title}</p>
				</div>

				<div className='p-2 pl-4 font-dm items-center whitespace-nowrap text-darkred text-lg overflow-hidden'>
					<p className='skew-x-[30deg]'>{description}</p>
				</div>
			</div>
		</Link>
	);
}

export default EventItem;
