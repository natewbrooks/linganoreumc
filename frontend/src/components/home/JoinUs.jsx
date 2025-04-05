import React, { useEffect, useState } from 'react';
import { useEvents } from '../../contexts/EventsContext';
import { Link } from 'react-router-dom';
import { SiGooglemaps } from 'react-icons/si';

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
		<div className='relative w-full flex flex-col items-center xl:items-start lg:px-40 xl:px-80 space-y-4 font-dm'>
			<div className={`flex flex-col items-center  space-y-8 w-fit`}>
				<div className={`-space-y-1 flex flex-col w-fit text-center`}>
					<span className='text-xl'>{title}</span>
					<span className='text-4xl'>{subtext}</span>
				</div>

				<div className='flex flex-col space-x-20 w-full sm:min-w-[600px] md:max-w-[800px]  px-4 '>
					{eventIDs.map(({ eventID }) => {
						const event = events.find((e) => e.id === eventID);
						if (!event) return null;

						const eventTimes = timesMap[eventID] || [];

						return (
							<div
								key={eventID}
								className='flex text-lg justify-between w-full'>
								<Link
									to={`/event/${event.id}`}
									className={` leading-4 w-fit hover:opacity-50 hover:scale-[102%] active:scale-[100%]`}>
									{event.title}
								</Link>
								<div className='w-fit leading-4 whitespace-nowrap'>
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
			</div>
			<div
				className='invisible xl:visible absolute h-[300px] w-[280px] top-4 right-20 xl:right-30 skew-x-[10deg] bg-cover bg-center z-10'
				style={{ backgroundImage: `url(${picture})` }}
			/>

			<div
				className={`hidden sm:block absolute -right-20 lg:-right-40 xl:-right-60 -bottom-24 skew-x-0 sm:-skew-x-[30deg] w-full text-center sm:text-start  pl-2 sm:pl-8 bg-red text-bkg py-5 group`}>
				<Link
					to={googleMapsLink}
					target='_blank'
					rel='noopener noreferrer'
					className={`outline-none flex items-center space-x-4 skew-x-0 sm:skew-x-[30deg] sm:whitespace-nowrap group-hover:opacity-50 `}>
					<SiGooglemaps size={32} />
					<div className={`flex flex-col group`}>
						<span className={`group-hover:scale-[102%] group-active:scale-[100%]`}>
							{locationName}
						</span>
						<span className={`group-hover:scale-[102%] group-active:scale-[100%]`}>{address}</span>
					</div>
				</Link>
			</div>

			<div className={`flex sm:hidden w-full text-start  px-4 bg-red text-bkg py-3 group`}>
				<Link
					to={googleMapsLink}
					target='_blank'
					rel='noopener noreferrer'
					className={`outline-none flex items-center space-x-4 skew-x-0 sm:skew-x-[30deg] sm:whitespace-nowrap group-hover:opacity-50`}>
					<SiGooglemaps size={32} />
					<div className={`flex flex-col group`}>
						<span className={`group-hover:scale-[102%] group-active:scale-[100%]`}>
							{locationName}
						</span>
						<span className={`group-hover:scale-[102%] group-active:scale-[100%]`}>{address}</span>
					</div>
				</Link>
			</div>

			{/* <div className='flex relative sm:-right-10 text-bkg w-full justify-end text-start py-2'>
				<div className='bg-red px-4 sm:px-8 py-4 sm:-skew-x-[30deg] w-full '>
					<Link
						to={googleMapsLink}
						target='_blank'
						rel='noopener noreferrer'
						className={`flex flex-col -skew-x-[30deg] sm:skew-x-0 whitespace-nowrap`}>
						<span>{locationName}</span>
						<span>{address}</span>
					</Link>
					<div className='flex justify-between items-center skew-x-[30deg]  max-w-[600px] xl:max-w-[750px] 2xl:max-w-[950px]'></div>
				</div>
			</div> */}
		</div>
	);
}

export default JoinUs;
