import React, { useState, useEffect } from 'react';
import { FaClock } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import { useEvents } from '../../contexts/EventsContext';
import ParallelogramBG from '../ParallelogramBG';

function formatShortDate(dateStr) {
	const [year, month, day] = dateStr.split('-').map(Number);
	return `${month}/${day}/${String(year).slice(-2)}`;
}

function formatTime(timeStr) {
	const [hour, minute] = timeStr.split(':').map(Number);
	const dateObj = new Date(0, 0, 0, hour, minute);
	return dateObj.toLocaleString('en-US', {
		hour: 'numeric',
		minute: '2-digit',
		hour12: true,
	});
}

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
		<div className='w-full'>
			{/* Date/Time row */}
			<div className='text-sm text-darkred px-2 w-full flex flex-wrap items-center space-x-2 pb-1'>
				<FaClock size={10} />
				{eventDates.map((dateObj, idx) => {
					const times = timesMap[dateObj.id] || [];
					if (!times.length) return null;

					const date = formatShortDate(dateObj.date);
					const timesString = times.map((t) => formatTime(t.time)).join(', ');

					return (
						<React.Fragment key={dateObj.id}>
							{idx > 0 && <span className=''>|</span>}
							<span>{`${date} @ ${timesString}`}</span>
						</React.Fragment>
					);
				})}
			</div>

			{/* Title/Description row */}
			<div className='relative flex items-center text-black'>
				<Link
					to={`/edit/event/${id}`}
					className='flex w-fit space-x-1 whitespace-nowrap'>
					<ParallelogramBG
						text={`#${id}`}
						textSize={18}
						flipped={false}
						bgColorClass='bg-darkred'
					/>
					<ParallelogramBG
						text={title}
						textSize={18}
						flipped={false}
					/>
				</Link>
				<div className='-z-10 bg-tp relative -left-5 text-left text-md pl-8 py-[5.5px] w-full -skew-x-[30deg] overflow-hidden whitespace-nowrap text-ellipsis'>
					<p className='skew-x-[30deg] text-darkred'>{description}</p>
				</div>
			</div>
		</div>
	);
}

export default EventItem;
