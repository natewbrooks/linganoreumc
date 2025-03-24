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
			<div className='text-sm text-darkred bg-accent px-2 w-fit -skew-x-[30deg] relative -left-2 flex flex-wrap items-center space-x-2 pb-1'>
				{/* <FaClock size={10} /> */}
				{eventDates.map((dateObj, idx) => {
					const times = timesMap[dateObj.id] || [];
					if (!times.length) return null;

					const date = formatShortDate(dateObj.date);
					const timesString = times.map((t) => formatTime(t.time)).join(', ');

					return (
						<div
							key={dateObj.id}
							className={`skew-x-[30deg]`}>
							{idx > 0 && <span className=''>|</span>}
							<span>{`${date} @ ${timesString}`}</span>
						</div>
					);
				})}
			</div>

			{/* Title/Description row */}
			<div className='relative flex items-center text-black'>
				<div className='flex flex-row w-full items-center bg-tp relative -skew-x-[30deg] overflow-hidden'>
					<div
						className={`font-dm p-1 py-2 text-bkg min-w-[64px] overflow-hidden text-center text-lg bg-darkred `}>
						<p className='skew-x-[30deg]'>#{id}</p>
					</div>
					<div
						className={`font-dm p-1 py-2 text-bkg min-w-[200px] overflow-hidden text-center text-lg bg-red px-4`}>
						<p className='skew-x-[30deg]'>{title}</p>
					</div>
					<div className='p-2 font-dm items-center whitespace-nowrap text-darkred text-lg pl-4'>
						<p className={`skew-x-[30deg]`}>{description}</p>
					</div>
				</div>
			</div>
		</Link>
	);
}

export default EventItem;
