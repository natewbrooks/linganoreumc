import React, { useEffect, useState } from 'react';
import { useEvents } from '../../contexts/EventsContext';
import BKG from '../../assets/linganore-bright-pic-upscale.webp';
import { Link } from 'react-router-dom';

function JoinUs({ title, subtext, eventIDs, address, picture }) {
	const { events, fetchEventTimesByEventId, formatTime } = useEvents();
	const [timesMap, setTimesMap] = useState({});

	useEffect(() => {
		if (!events.length || !eventIDs.length) return;
		const newTimesMap = {};

		eventIDs.forEach(({ eventID }) => {
			const event = events.find((e) => e.id === eventID);
			if (!event) return;
			const fetchedTimes = fetchEventTimesByEventId(eventID);
			newTimesMap[eventID] = fetchedTimes || [];
		});

		setTimesMap(newTimesMap);
	}, [events, eventIDs, fetchEventTimesByEventId]);

	// Combine lines in address to create a search-friendly address string
	const combinedAddress = address.replace(/\n/g, ' ');
	// Build the Google Maps link
	const googleMapsLink = `//www.google.com/maps/search/?api=1&query=${encodeURIComponent(
		combinedAddress
	)}`;

	return (
		<div className='relative w-full flex flex-col space-y-4 items-center text-center font-dm'>
			<div className={`-space-y-1 flex flex-col`}>
				<span className='text-xl'>{title}</span>
				<span className='text-4xl'>{subtext}</span>
			</div>

			<div className='flex flex-col w-full sm:w-[50%]  px-4 '>
				{eventIDs.map(({ eventID }) => {
					const event = events.find((e) => e.id === eventID);
					if (!event) return null;

					const eventTimes = timesMap[eventID] || [];

					return (
						<div
							key={eventID}
							className='flex text-lg justify-between items-end text-right w-full'>
							<div>{event.title}</div>
							<div className='text-right relative sm:right-22'>
								{eventTimes.length > 0
									? eventTimes.map((t, index) => (
											<span key={index}>
												{index > 0 && ' | '}
												{formatTime(t.time)}
											</span>
									  ))
									: 'No times available'}
							</div>
						</div>
					);
				})}
			</div>

			<div className='flex relative sm:-right-10 text-bkg w-full justify-end text-start py-2'>
				<div className='bg-red px-4 sm:px-8 py-4 sm:-skew-x-[30deg] w-full sm:w-4/5'>
					<div className='flex justify-between items-center sm:skew-x-[30deg]'>
						<div>
							{address.split('\n').map((line, index) => (
								<p key={index}>{line}</p>
							))}
						</div>
						{/* Use Link but point to an external URL, opening a new tab */}
						<Link
							to={googleMapsLink}
							target='_blank'
							rel='noopener noreferrer'
							className='w-[80px] sm:right-[27rem] relative text-center'>
							OPEN IN MAPS
						</Link>
					</div>
				</div>
			</div>
			<div
				className='invisible sm:visible absolute h-[300px] w-[280px] right-30 -top-4 skew-x-[10deg] bg-cover bg-center'
				style={{ backgroundImage: `url(${BKG})` }}
			/>
		</div>
	);
}

export default JoinUs;
