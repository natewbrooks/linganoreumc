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

		const fetchAllTimes = async () => {
			const newTimesMap = {};

			await Promise.all(
				eventIDs.map(async ({ eventID }) => {
					const event = events.find((e) => e.id === eventID);
					if (!event) return;

					const fetchedTimes = await fetchEventTimesByEventId(eventID);
					newTimesMap[eventID] = fetchedTimes || [];
				})
			);

			setTimesMap(newTimesMap);
		};

		fetchAllTimes();
	}, [events, eventIDs, fetchEventTimesByEventId]);

	// Combine lines in address to create a search-friendly address string
	const combinedAddress = address.replace(/\n/g, ' ');
	// Build the Google Maps link
	const googleMapsLink = `//www.google.com/maps/search/?api=1&query=${encodeURIComponent(
		combinedAddress
	)}`;

	return (
		<div className='flex flex-col space-y-8 font-dm mx-auto w-full max-w-[800px]'>
			<div className={`relative flex flex-col mx-auto items-center space-y-8 w-full max-w-[700px]`}>
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
							<Link
								to={`${import.meta.env.VITE_BASE_URL}/events/${event.id}`}
								key={eventID}
								className='flex text-lg justify-between clickable'>
								<div className={` leading-4 w-fit   `}>{event.title}</div>
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
							</Link>
						);
					})}
				</div>
			</div>

			<div className={`hidden md:block skew-x-0 sm:-skew-x-[30deg] text-bkg py-4 group`}>
				<div className='hidden md:block absolute z-10 -bottom-7.75 -left-80 skew-x-[30deg] rounded-full overflow-hidden w-[300px] h-[300px] '>
					<img
						src={picture}
						className='w-full h-full object-cover bg-center object-center transition-all duration-300 '
					/>
				</div>

				<div className={`absolute w-screen bg-red left-10 top-0 -z-10 bottom-0 py-10 `}>{` `}</div>

				<Link
					to={googleMapsLink}
					target='_blank'
					rel='noopener noreferrer'
					className={`outline-none flex items-center space-x-4 skew-x-0 sm:skew-x-[30deg] sm:whitespace-nowrap pl-20`}>
					<SiGooglemaps size={32} />
					<div className={`flex flex-col group`}>
						<span
							className={`transition duration-200 group-hover:opacity-50 group-hover:scale-[1.02] active:scale-[1]`}>
							{locationName}
						</span>
						<span
							className={`transition duration-200 group-hover:opacity-50 group-hover:scale-[1.02] active:scale-[1]`}>
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
		</div>
	);
}

export default JoinUs;
