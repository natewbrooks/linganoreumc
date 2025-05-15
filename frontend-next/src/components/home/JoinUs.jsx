'use client';
import React from 'react';
import Link from 'next/link';
import { SiGooglemaps } from 'react-icons/si';
import Image from 'next/image';
import getFormat from '@/lib/getFormat';

function JoinUs({
	title,
	subtext,
	events,
	eventDates,
	eventTimes,
	eventIDs,
	locationName,
	address,
	picture,
}) {
	const { formatTime, getShortDayOfWeek } = getFormat;

	// Prebuild timesMap for eventIDs
	const timesMap = {};
	for (const eventID of eventIDs) {
		// Get all date IDs for this event
		const dateIDs = eventDates
			.filter((d) => d.eventID === eventID || d.eventId === eventID)
			.map((d) => d.id);

		// Match times that reference those date IDs and include date information
		const times = eventTimes.filter((t) => dateIDs.includes(t.eventDateID));

		// Add date information to each time
		const timesWithDates = times.map((time) => {
			// Find the associated event date
			const eventDate = eventDates.find((d) => d.id === time.eventDateID);
			return {
				...time,
				date: eventDate ? eventDate.date : null,
			};
		});

		timesMap[eventID] = timesWithDates;
	}

	const combinedAddress = address.replace(/\n/g, ' ');
	const googleMapsLink = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
		combinedAddress
	)}`;

	return (
		<div className='flex flex-col space-y-8 font-dm mx-auto w-full max-w-[800px]'>
			<div className='relative flex flex-col mx-auto items-center space-y-8 w-full max-w-[700px]'>
				<div className='-space-y-1 flex flex-col w-fit text-center'>
					<span className='text-xl'>{title}</span>
					<span className='text-3xl'>{subtext}</span>
				</div>

				<div className='flex flex-col space-y-4 w-full px-8'>
					{eventIDs.map((eventID) => {
						const event = events.find((e) => e.id === eventID);
						if (!event) return null;

						const times = timesMap[eventID] || [];

						// Group times by date
						const timesByDate = {};
						times.forEach((t) => {
							if (t.date) {
								if (!timesByDate[t.date]) {
									timesByDate[t.date] = [];
								}
								timesByDate[t.date].push(t);
							}
						});

						return (
							<Link
								href={`/events/${event.id}`}
								key={eventID}
								className='flex text-lg justify-between clickable'>
								<div className='leading-4 w-fit'>{event.title}</div>
								<div className='w-fit leading-4 whitespace-nowrap'>
									{times.length > 0 && Object.keys(timesByDate).length > 0
										? Object.entries(timesByDate).map(([date, dateTimes], dateIndex) => (
												<span key={date}>
													{dateIndex > 0 && ' | '}
													{getShortDayOfWeek(date)}{' '}
													{dateTimes.map((t, timeIndex) => (
														<span key={`${date}-${timeIndex}`}>
															{timeIndex > 0 && ', '}
															{formatTime(t.startTime)}
														</span>
													))}
												</span>
										  ))
										: 'No times available'}
								</div>
							</Link>
						);
					})}
				</div>
			</div>

			<div className='hidden md:block skew-x-0 sm:-skew-x-[30deg] text-bkg py-4 group'>
				{picture && (
					<div className='hidden md:block absolute z-10 -bottom-7.75 -left-80 skew-x-[30deg] rounded-full overflow-hidden w-[300px] h-[300px]'>
						<Image
							src={picture}
							alt='Join Us!'
							fill
							sizes='(max-width: 768px) 100vw, 300px'
							className='object-cover object-center'
							priority={true}
							unoptimized={true}
						/>
					</div>
				)}
				<div className='absolute w-screen bg-red left-10 top-0 -z-10 bottom-0 py-10' />
				<Link
					href={googleMapsLink}
					target='_blank'
					rel='noopener noreferrer'
					className='outline-none flex items-center space-x-4 skew-x-0 sm:skew-x-[30deg] sm:whitespace-nowrap pl-20 group'>
					<SiGooglemaps
						size={32}
						className={`group-hover:opacity-50 group-hover:scale-[1.02] active:scale-[1]`}
					/>
					<div className='flex flex-col '>
						<span className='group-hover:opacity-50 group-hover:scale-[1.02] active:scale-[1]'>
							{locationName}
						</span>
						<span className='group-hover:opacity-50 group-hover:scale-[1.02] active:scale-[1]'>
							{address}
						</span>
					</div>
				</Link>
			</div>

			<div className='flex md:hidden w-full px-4 bg-red text-bkg py-3 group'>
				<Link
					href={googleMapsLink}
					target='_blank'
					rel='noopener noreferrer'
					className='outline-none flex items-center space-x-4 group'>
					<SiGooglemaps
						size={32}
						className={`group-hover:opacity-50 group-hover:scale-[1.02] active:scale-[1]`}
					/>
					<div className='flex flex-col'>
						<span className='group-hover:opacity-50 group-hover:scale-[1.02] active:scale-[1]'>
							{locationName}
						</span>
						<span className='group-hover:opacity-50 group-hover:scale-[1.02] active:scale-[1]'>
							{address}
						</span>
					</div>
				</Link>
			</div>
		</div>
	);
}

export default JoinUs;
