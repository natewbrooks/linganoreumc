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
		<Link
			to={`/edit/event/${id}`}
			className='w-full cursor-pointer hover:opacity-50 hover:scale-[102%] active:scale-[99%]'>
			{/* Date/Time row */}
			<div className='text-sm text-darkred bg-accent px-2 w-fit -skew-x-[30deg] relative flex flex-wrap items-center space-x-2'>
				{eventDates.map((dateObj, idx) => {
					const times = timesMap[dateObj.id] || [];
					if (!times.length) return null;

					const date = formatShortDate(dateObj.date);
					const timesString = times.map((t) => formatTime(t.time)).join(', ');

					return (
						<React.Fragment key={dateObj.id}>
							<span className={`skew-x-[30deg]`}>
								{idx > 0 && <span className='pr-2'>|</span>}
								<span>{`${date} @ ${timesString}`}</span>
							</span>
						</React.Fragment>
					);
				})}
			</div>

			<div className='w-full flex flex-row items-center bg-tp -skew-x-[30deg] relative'>
				<div className='font-dm py-2 text-bkg min-w-[64px] overflow-hidden text-center text-lg relative bg-darkred px-4'>
					<p className='skew-x-[30deg] whitespace-nowrap'>id: {id}</p>
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
