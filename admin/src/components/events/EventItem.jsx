import React, { useState, useEffect } from 'react';
import { FaClock } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import ParallelogramBG from '../ParallelogramBG';

function formatShortDate(dateStr) {
	// "2025-04-05" --> "4/5/25"
	const [year, month, day] = dateStr.split('-').map(Number);
	return `${month}/${day}/${String(year).slice(-2)}`;
}

function formatTime(timeStr) {
	// "17:30:00" --> "5:30 PM"
	const [hour, minute] = timeStr.split(':').map(Number);
	const dateObj = new Date(0, 0, 0, hour, minute);
	return dateObj.toLocaleString('en-US', {
		hour: 'numeric',
		minute: '2-digit',
		hour12: true,
	});
}

function EventItem({ id, title, description }) {
	const [eventDates, setEventDates] = useState([]);
	const [timesMap, setTimesMap] = useState({});
	const [error, setError] = useState(null);

	useEffect(() => {
		fetch(`http://localhost:5000/api/events/dates/${id}/`)
			.then((response) => {
				if (!response.ok) {
					throw new Error('Failed to fetch event dates');
				}
				return response.json();
			})
			.then((data) => setEventDates(data))
			.catch((err) => setError(err.message));
	}, [id]);

	function getTimesForDate(eventDateId) {
		if (!timesMap[eventDateId]) {
			fetch(`http://localhost:5000/api/events/times/${eventDateId}/`)
				.then((response) => {
					if (!response.ok) {
						throw new Error(`Failed to fetch event times for eventDateID ${eventDateId}`);
					}
					return response.json();
				})
				.then((data) => {
					setTimesMap((prevMap) => ({
						...prevMap,
						[eventDateId]: data,
					}));
				})
				.catch((err) => setError(err.message));
		}
		return timesMap[eventDateId] || [];
	}

	if (error) {
		return <div>Error: {error}</div>;
	}

	return (
		<div className='w-full'>
			{/* Date/Time row */}
			<div className={`text-sm text-darkred px-2 w-full flex flex-wrap items-center space-x-2`}>
				<FaClock size={10} />
				{eventDates.map((dateObj, idx) => {
					const times = getTimesForDate(dateObj.id);
					// If no times, skip
					if (!times.length) return null;

					// For the first time in `times`, print "DATE @ TIME",
					// for subsequent times, print just ", TIME"
					const date = formatShortDate(dateObj.date);
					const timesString = times
						.map((t, i) => {
							const tFormatted = formatTime(t.time);
							return i === 0 ? `${date} @ ${tFormatted}` : `, ${tFormatted}`;
						})
						.join('');

					return (
						<React.Fragment key={dateObj.id}>
							{/* Put a separator "|" before any date after the first */}
							{idx > 0 && <span className='mx-2'>|</span>}
							<span>{timesString}</span>
						</React.Fragment>
					);
				})}
			</div>

			{/* Title/Description row */}
			<div className='relative flex items-center text-black'>
				<Link
					to={`/edit/event/${id}`}
					className={`flex w-fit space-x-1 whitespace-nowrap `}>
					<ParallelogramBG
						text={`#${id}`}
						textSize={18}
						flipped={false}
						bgColorClass={'bg-darkred'}
					/>
					<ParallelogramBG
						text={title}
						textSize={18}
						flipped={false}
					/>
				</Link>
				<p
					className={`-z-10 bg-tp relative -left-5 text-left text-md pl-8 py-[5.5px] w-full -skew-x-[30deg] overflow-hidden whitespace-nowrap text-ellipsis`}>
					<p className={`skew-x-[30deg] text-darkred`}>{description}</p>
				</p>
			</div>
		</div>
	);
}

export default EventItem;
