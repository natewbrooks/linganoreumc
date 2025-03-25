import React, { useEffect, useState } from 'react';
import { useEvents } from '../../contexts/EventsContext';
import BKG from '../../assets/linganore-bright-pic-upscale.webp';
import { Link } from 'react-router-dom';

function JoinUs({ title, subtext, eventIDs, locationName, address, picture }) {
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

			<div className='flex flex-col w-full sm:max-w-[600px] xl:max-w-[800px]  px-4 '>
				{eventIDs.map(({ eventID }) => {
					const event = events.find((e) => e.id === eventID);
					if (!event) return null;

					const eventTimes = timesMap[eventID] || [];

					return (
						<div
							key={eventID}
							className='flex text-lg justify-between w-full'>
							<div className={`w-fit`}>{event.title}</div>
							<div className='w-fit'>
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
				<div
					className='invisible lg:visible absolute h-[300px] w-[280px] top-0 right-10 lg:right-20 xl:right-30 2xl:right-120 skew-x-[10deg] bg-cover bg-center z-20'
					style={{ backgroundImage: `url(${BKG})` }}
				/>
			</div>

			<div className='flex relative sm:-right-10 text-bkg w-full justify-end text-start py-2'>
				<div className='bg-red px-4 sm:px-8 py-4 sm:-skew-x-[30deg] w-full sm:w-9/10 xl:w-3/4'>
					<div className='flex justify-between items-center skew-x-[30deg]  max-w-[600px] xl:max-w-[750px] 2xl:max-w-[950px]'>
						<Link
							to={googleMapsLink}
							target='_blank'
							rel='noopener noreferrer'
							className={`flex flex-col -skew-x-[30deg] sm:skew-x-0 whitespace-nowrap`}>
							<span>{locationName}</span>
							<span>{address}</span>
						</Link>
						{/* Use Link but point to an external URL, opening a new tab */}
						{/* <Link
							
							className='w-[80px]  relative text-center'>
							OPEN IN MAPS
						</Link> */}
					</div>
				</div>
			</div>
		</div>
	);
}

export default JoinUs;
