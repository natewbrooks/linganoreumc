import React, { useEffect, useState } from 'react';
import BKG from '../../assets/linganore-bright-pic-upscale.webp';
import { Link } from 'react-router-dom';
import { useEvents } from '../../contexts/EventsContext';

export default function UpcomingEvents({ title, subtext, events = [] }) {
	const [displayEvents, setDisplayEvents] = useState([]);
	const [thumbnailMap, setThumbnailMap] = useState({});
	const { fetchEventImages } = useEvents();

	// Ensures date-only values aren't shifted due to timezone offset
	function parseDateAsLocal(dateStr) {
		const [year, month, day] = dateStr.split('-').map(Number);
		return new Date(year, month - 1, day); // JS months are 0-based
	}

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

	const secondRowOnlyPlaceholders = displayEvents.slice(2).every((item) => item.placeholder);

	return (
		<div
			className={`mx-auto max-w-[1200px] w-full ${
				secondRowOnlyPlaceholders ? 'min-h-[350px]' : 'min-h-[550px]'
			} md:min-h-[0px] md:h-[300px]`}>
			<div className='flex flex-col font-dm px-4 relative -top-4 '>
				<h2 className='text-xl'>{title}</h2>
				<p className='text-3xl'>{subtext}</p>
			</div>
			<div className='flex flex-col relative md:items-center'>
				{/* NOT MOBILE */}
				<div className={`hidden md:block h-[200px]`}>
					<div className={`absolute right-0 lg:-skew-x-[30deg]  w-screen z-10 bg-red py-10`} />

					<div className='relative flex space-x-2 w-full text-bkg font-dm mx-auto '>
						{displayEvents.map(({ event, date, placeholder }, index) => (
							<Link
								to={`/events/${event.id}`}
								key={event.id || index}
								className='relative w-[200px] lg:w-[250px] flex justify-center group'>
								<div
									className={`absolute z-10 py-4 text-center leading-4 w-[200px] lg:w-[250px] ${
										placeholder ? 'pointer-events-none' : 'group-hover:opacity-50'
									}`}>
									<h3 className='text-lg truncate overflow-hidden whitespace-nowrap'>
										{event.title?.toUpperCase() || 'UNKNOWN EVENT'}
									</h3>
									<p className='text-md truncate overflow-hidden whitespace-nowrap'>
										{date ? parseDateAsLocal(date).toLocaleDateString() : 'DATE TBD'}
									</p>
								</div>

								<div
									className={`absolute right-0 top-[70px] skew-x-[5deg] ${
										!placeholder
											? 'group-hover:opacity-50 group-hover:scale-[1.02] active:scale-[1]'
											: ''
									}`}>
									<div className='h-[150px] w-[200px] lg:w-[250px] overflow-hidden'>
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

				{/* MOBILE */}

				<div className={`block md:hidden h-[450px]`}>
					<div className={`absolute top-0 right-0 w-screen z-10 bg-red py-8`} />

					<div className={`flex flex-col `}>
						<div className='flex space-x-2 items-center w-full px-4 text-bkg font-dm '>
							{displayEvents.slice(0, 2).map(({ event, date, placeholder }, index) => (
								<Link
									to={`/events/${event.id}`}
									key={event.id || index}
									className={`relative flex w-full justify-center clickable  `}>
									<div
										className={`absolute z-10 p-2 text-center leading-4 max-w-50/52 ${
											placeholder ? ' pointer-events-none' : ''
										}`}>
										<h3 className='text-lg truncate overflow-hidden whitespace-nowrap'>
											{event.title.toUpperCase() || 'Unknown Event'}
										</h3>
										<p className='text-md truncate overflow-hidden whitespace-nowrap'>
											{date ? parseDateAsLocal(date).toLocaleDateString() : 'Date TBD'}
										</p>
									</div>
									<div
										className={`relative w-full right-0 top-[60px] skew-x-[5deg] ${
											!placeholder
												? 'group-hover:opacity-50 group-hover:scale-[1.02] active:scale-[1]'
												: ''
										}`}>
										<div className='h-[150px] w-full overflow-hidden'>
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

						{!secondRowOnlyPlaceholders && (
							<>
								<div className={`absolute top-60 w-full z-10 bg-red py-8`} />

								<div className='relative top-23 flex space-x-2 items-center w-full px-4 text-bkg font-dm '>
									{displayEvents.slice(2).map(({ event, date, placeholder }, index) => (
										<Link
											to={`/events/${event.id}`}
											key={event.id || index}
											className={`relative flex w-full justify-center clickable  `}>
											<div
												className={`absolute z-10 p-2 text-center leading-4 max-w-50/52 ${
													placeholder ? ' pointer-events-none' : ''
												}`}>
												<h3 className='text-lg truncate overflow-hidden whitespace-nowrap'>
													{event.title.toUpperCase() || 'Unknown Event'}
												</h3>
												<p className='text-md truncate overflow-hidden whitespace-nowrap'>
													{date ? parseDateAsLocal(date).toLocaleDateString() : 'Date TBD'}
												</p>
											</div>
											<div
												className={`relative w-full right-0 top-[60px] skew-x-[5deg] ${
													!placeholder
														? 'group-hover:opacity-50 group-hover:scale-[1.02] active:scale-[1]'
														: ''
												}`}>
												<div className='h-[150px] w-full overflow-hidden'>
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
							</>
						)}
					</div>
				</div>
				<div className={`w-full relative left-[50%] md:left-[80%] h-[40px] top-2`}>
					<div className={`bg-red py-5 skew-r left-0 top-10 `} />
					<Link
						to={'/events/'}
						className={``}>
						<div className={`clickable text-lg absolute top-1 px-4 font-dm text-bkg`}>
							VIEW ALL EVENTS
						</div>
					</Link>
				</div>
			</div>
		</div>
	);
}
