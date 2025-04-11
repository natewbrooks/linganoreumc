import React, { useEffect, useState } from 'react';
import BKG from '../../assets/linganore-bright-pic-upscale.webp';
import { Link } from 'react-router-dom';
import { useEvents } from '../../contexts/EventsContext';

export default function UpcomingEvents({ title, subtext, events = [] }) {
	const [displayEvents, setDisplayEvents] = useState([]);
	const [thumbnailMap, setThumbnailMap] = useState({});
	const { fetchEventImages } = useEvents();

	useEffect(() => {
		const placeholdersNeeded = 4 - events.length;
		const placeholderEvents = Array.from(
			{ length: placeholdersNeeded > 0 ? placeholdersNeeded : 0 },
			(_, i) => ({
				event: { title: 'Upcoming Event', id: `placeholder-${i}` },
				date: null,
				placeholder: true,
			})
		);
		setDisplayEvents([...events, ...placeholderEvents]);
	}, [events]);

	useEffect(() => {
		const loadThumbnails = async () => {
			const map = {};

			for (const { event, placeholder } of events) {
				if (placeholder) continue;

				try {
					const images = await fetchEventImages(event.id);
					const thumbnail = images.find((img) => img.isThumbnail);
					if (thumbnail) {
						map[event.id] = `/api/media/images/${thumbnail.url.split('/').pop()}`;
					}
				} catch (err) {
					console.error(`Failed to fetch thumbnail for event ${event.id}`, err);
				}
			}

			setThumbnailMap(map);
		};

		if (events.length > 0) {
			loadThumbnails();
		}
	}, [events, fetchEventImages]);

	return (
		<div className={`relative min-h-[600px] md:min-h-[0px] md:h-[300px]`}>
			<div className='flex flex-col font-dm px-4 md:px-30 mb-4 relative -top-4 page-wrapper'>
				<h2 className='text-xl'>{title}</h2>
				<p className='text-3xl'>{subtext}</p>
			</div>
			<div className='flex flex-col relative'>
				<div className={`hidden md:block relative`}>
					<div
						className={`absolute -left-30 -bottom-16 -skew-x-[30deg]  w-full z-10 bg-red py-8`}
					/>
					<div className='flex space-x-2 px-40  w-full text-bkg justify-between font-dm page-wrapper '>
						{displayEvents.map(({ event, date, placeholder }, index) => (
							<Link
								to={`/events/${event.id}`}
								key={event.id || index}
								className='relative w-[300px] flex justify-center group'>
								<div
									className={`absolute z-10 p-2 text-center leading-4 w-[220px] ${
										placeholder ? 'pointer-events-none' : 'group-hover:opacity-50'
									}`}>
									<h3 className='text-lg truncate overflow-hidden whitespace-nowrap'>
										{event.title?.toUpperCase() || 'UNKNOWN EVENT'}
									</h3>
									<p className='text-md truncate overflow-hidden whitespace-nowrap'>
										{date ? new Date(date).toLocaleDateString() : 'DATE TBD'}
									</p>
								</div>

								<div
									className={`absolute right-0 top-[60px] skew-x-[5deg] ${
										!placeholder
											? 'group-hover:opacity-50 group-hover:scale-[1.02] active:scale-[1]'
											: ''
									}`}>
									<div className='h-[150px] overflow-hidden'>
										{placeholder ? (
											<div className='bg-tp w-full h-full'></div>
										) : (
											<img
												src={thumbnailMap[event.id] || BKG}
												className='w-full h-full bg-cover bg-center object-cover object-center'
												alt='Event'
											/>
										)}
									</div>
								</div>
							</Link>
						))}
					</div>
				</div>

				<div className={`block md:hidden`}>
					<div className={`absolute top-0 right-0 w-full z-10 bg-red py-8`} />

					<div className={`flex flex-col`}>
						<div className='grid grid-cols-2 gap-x-2 px-4 text-bkg justify-between font-dm '>
							{displayEvents.slice(0, 2).map(({ event, date, placeholder }, index) => (
								<Link
									to={`/events/${event.id}`}
									key={event.id || index}
									className={`relative flex justify-center clickable  `}>
									<div
										className={`absolute z-10 p-2 text-center leading-4 w-[200px] ${
											placeholder ? ' pointer-events-none' : ''
										}`}>
										<h3 className='text-lg truncate overflow-hidden whitespace-nowrap'>
											{event.title.toUpperCase() || 'Unknown Event'}
										</h3>
										<p className='text-md truncate overflow-hidden whitespace-nowrap'>
											{date ? new Date(date).toLocaleDateString() : 'Date TBD'}
										</p>
									</div>
									<div
										className={`absolute right-0 top-[60px] skew-x-[5deg] ${
											!placeholder
												? 'group-hover:opacity-50 group-hover:scale-[1.02] active:scale-[1]'
												: ''
										}`}>
										<div className='h-[150px] overflow-hidden'>
											{placeholder ? (
												<div className='bg-tp w-full h-full'></div>
											) : (
												<img
													src={thumbnailMap[event.id] || BKG}
													className='w-full h-full object-cover object-center'
													alt='Event'
												/>
											)}
										</div>
									</div>
								</Link>
							))}
						</div>

						<div className={`absolute top-60 w-full z-10 bg-red py-8`} />

						<div className='relative top-60 grid grid-cols-2 gap-x-2 px-4 text-bkg justify-between font-dm '>
							{displayEvents.slice(2).map(({ event, date, placeholder }, index) => (
								<Link
									to={`/events/${event.id}`}
									key={event.id || index}
									className={`relative flex justify-center clickable group  `}>
									<div
										className={`absolute z-10 p-2 text-center leading-4 w-[200px] ${
											placeholder ? ' pointer-events-none' : 'group-'
										}`}>
										<h3 className='text-lg truncate overflow-hidden whitespace-nowrap'>
											{event.title.toUpperCase() || 'Unknown Event'}
										</h3>
										<p className='text-md truncate overflow-hidden whitespace-nowrap'>
											{date ? new Date(date).toLocaleDateString() : 'Date TBD'}
										</p>
									</div>
									<div
										className={`absolute right-0 top-[60px] skew-x-[5deg] ${
											!placeholder
												? 'group-hover:opacity-50 group-hover:scale-[1.02] active:scale-[1]'
												: ''
										}`}>
										<div className='h-[150px] overflow-hidden'>
											{placeholder ? (
												<div className='bg-tp w-full h-full'></div>
											) : (
												<img
													src={thumbnailMap[event.id] || BKG}
													className='w-full h-full object-cover object-center'
													alt='Event'
												/>
											)}
										</div>
									</div>
								</Link>
							))}
						</div>
					</div>
				</div>
			</div>

			<Link
				to={'/events/'}
				className={`w-fit pl-8 absolute bottom-0 bg-red py-2 pr-20 -right-8  clickable-l-skew font-dm text-bkg group   `}>
				<div className={`skew-r text-lg`}>VIEW ALL EVENTS</div>
			</Link>
		</div>
	);
}
