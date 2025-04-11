import React, { useEffect, useState } from 'react';
import { useEvents } from '../../contexts/EventsContext';
import { Link } from 'react-router-dom';
import { SiGooglemaps } from 'react-icons/si';
import { useSettings } from '../../contexts/SettingsContext';

function JoinUs({ title, subtext, eventIDs, locationName, address, picture }) {
	const { events, fetchEventTimesByEventId } = useEvents();
	const { formatTime } = useSettings();
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
		<div className='flex flex-col font-dm page-l-wrapper relative md:-right-8 '>
			<div
				className={`relative flex flex-col items-center space-y-8 w-full md:max-w-[400px] lg:max-w-[700px]`}>
				<div className={`-space-y-1 flex flex-col w-fit text-center`}>
					<span className='text-xl'>{title}</span>
					<span className='text-3xl'>{subtext}</span>
				</div>

				<div className='flex flex-col space-y-4 w-full px-8 '>
					{eventIDs.map(({ eventID }) => {
						const event = events.find((e) => e.id === eventID);
						if (!event) return null;

						const eventTimes = timesMap[eventID] || [];

						return (
							<div
								key={eventID}
								className='flex text-lg justify-between'>
								<Link
									to={`/events/${event.id}`}
									className={` leading-4 w-fit   `}>
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
				<div className='hidden md:block absolute z-10 -right-[450px] -bottom-20 -translate-y-[1px] skew-x-[20deg] overflow-hidden w-fit h-fit'>
					<img
						src={picture}
						className='object-contain bg-center object-center transition-all w-[400px] h-[300px] duration-300 scale-150 -skew-x-[20deg]'
					/>
				</div>
			</div>

			<div
				className={`hidden md:block skew-x-0 sm:-skew-x-[30deg] w-full text-center sm:text-start  pl-2 sm:pl-8 bg-red text-bkg py-4 group`}>
				<Link
					to={googleMapsLink}
					target='_blank'
					rel='noopener noreferrer'
					className={`outline-none flex items-center space-x-4 skew-x-0 sm:skew-x-[30deg] sm:whitespace-nowrap`}>
					<SiGooglemaps size={32} />
					<div className={`flex flex-col group`}>
						<span className={`group-hover:opacity-50 group-hover:scale-[1.02] active:scale-[1]`}>
							{locationName}
						</span>
						<span className={`group-hover:opacity-50 group-hover:scale-[1.02] active:scale-[1]`}>
							{address}
						</span>
					</div>
				</Link>
			</div>

			<div className={`flex md:hidden w-full text-start  px-4 bg-red text-bkg py-3 group`}>
				<Link
					to={googleMapsLink}
					target='_blank'
					rel='noopener noreferrer'
					className={`outline-none flex items-center space-x-4 skew-x-0 md:skew-x-[30deg] sm:whitespace-nowrap group-`}>
					<SiGooglemaps size={32} />
					<div className={`flex flex-col group`}>
						<span className={`group-hover:opacity-50 group-hover:scale-[1.02] active:scale-[1]`}>
							{locationName}
						</span>
						<span className={`group-hover:opacity-50 group-hover:scale-[1.02] active:scale-[1]`}>
							{address}
						</span>
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
