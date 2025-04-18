'use client';
import React, { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { useEvents } from '../../contexts/EventsContext';
import Image from 'next/image';

export default function UpcomingEvents({ title, subtext, events = [] }) {
	const [displayEvents, setDisplayEvents] = useState([]);
	const { eventImages } = useEvents();

	const fallbackImage = '/assets/linganore-bright-pic-upscale.webp';

	function parseDateAsLocal(dateStr) {
		const [year, month, day] = dateStr.split('-').map(Number);
		return new Date(year, month - 1, day);
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

	const thumbnailMap = useMemo(() => {
		const map = {};
		for (const { event, placeholder } of events) {
			if (placeholder) continue;
			const images = eventImages[event.id] || [];
			const thumbnail = images.find((img) => img.isThumbnail);
			if (thumbnail) {
				map[event.id] = `${process.env.NEXT_PUBLIC_API_BASE_URL}/media/images/${thumbnail.url
					.split('/')
					.pop()}`;
			}
		}
		return map;
	}, [events, eventImages]);

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
				{/* Desktop View */}
				<div className={`hidden md:block h-[200px]`}>
					<div className={`absolute right-0 lg:-skew-x-[30deg] w-screen z-10 bg-red py-10`} />
					<div className='relative flex space-x-2 w-full text-bkg font-dm mx-auto '>
						{displayEvents.map(({ event, date, placeholder }, index) => {
							const content = (
								<>
									<div
										className={`absolute z-10 py-4 text-center leading-4 w-[200px] lg:w-[250px] ${
											!placeholder ? 'group-hover:opacity-50' : ''
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
										<div className='relative h-[150px] w-[200px] lg:w-[250px] overflow-hidden'>
											{placeholder ? (
												<div className='bg-tp w-full h-full'></div>
											) : (
												<Image
													fill
													src={thumbnailMap[event.id] || fallbackImage}
													alt='Event Thumbnail'
													className='w-full h-full object-cover object-center'
													loading='lazy'
													unoptimized={true}
												/>
											)}
										</div>
									</div>
								</>
							);

							return placeholder ? (
								<div
									key={event.id || index}
									className='relative w-[200px] lg:w-[250px] flex justify-center group'>
									{content}
								</div>
							) : (
								<Link
									href={`/events/${event.id}`}
									key={event.id || index}
									className='relative w-[200px] lg:w-[250px] flex justify-center group'>
									{content}
								</Link>
							);
						})}
					</div>
				</div>

				{/* Mobile View */}
				<div
					className={`block md:hidden ${secondRowOnlyPlaceholders ? ' h-[200px]' : ' h-[450px]'}`}>
					<div className={`absolute top-0 right-0 w-screen z-10 bg-red py-8`} />
					<div className={`flex flex-col `}>
						<div className='flex space-x-2 items-center w-full px-4 text-bkg font-dm '>
							{displayEvents.slice(0, 2).map(({ event, date, placeholder }, index) => {
								const content = (
									<>
										<div
											className={`absolute z-10 p-2 text-center leading-4 max-w-50/52 ${
												!placeholder ? 'group-hover:opacity-50' : ''
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
											<div className='relative h-[150px] w-full overflow-hidden'>
												{placeholder ? (
													<div className='bg-tp w-full h-full'></div>
												) : (
													<Image
														fill
														src={thumbnailMap[event.id] || fallbackImage}
														alt='Event Thumbnail'
														className='w-full h-full object-cover object-center'
														loading='lazy'
														unoptimized={true}
													/>
												)}
											</div>
										</div>
									</>
								);

								return placeholder ? (
									<div
										key={event.id || index}
										className='relative flex w-full justify-center group'>
										{content}
									</div>
								) : (
									<Link
										href={`/events/${event.id}`}
										key={event.id || index}
										className='relative flex w-full justify-center group clickable'>
										{content}
									</Link>
								);
							})}
						</div>

						{!secondRowOnlyPlaceholders && (
							<>
								<div className={`absolute top-60 w-full z-10 bg-red py-8`} />
								<div className='relative top-23 flex space-x-2 items-center w-full px-4 text-bkg font-dm '>
									{displayEvents.slice(2).map(({ event, date, placeholder }, index) => {
										const content = (
											<>
												<div
													className={`absolute z-10 p-2 text-center leading-4 max-w-50/52 ${
														!placeholder ? 'group-hover:opacity-50' : ''
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
													<div className='relative h-[150px] w-full overflow-hidden'>
														{placeholder ? (
															<div className='bg-tp w-full h-full'></div>
														) : (
															<Image
																fill
																src={thumbnailMap[event.id] || fallbackImage}
																alt='Event Thumbnail'
																className='w-full h-full object-cover object-center'
																loading='lazy'
																unoptimized={true}
															/>
														)}
													</div>
												</div>
											</>
										);

										return placeholder ? (
											<div
												key={event.id || index}
												className='relative flex w-full justify-center group'>
												{content}
											</div>
										) : (
											<Link
												href={`/events/${event.id}`}
												key={event.id || index}
												className='relative flex w-full justify-center group clickable'>
												{content}
											</Link>
										);
									})}
								</div>
							</>
						)}
					</div>
				</div>

				{/* View All Button */}
				<div
					className={`w-full relative left-[50%] md:left-[80%] h-[40px] ${
						secondRowOnlyPlaceholders ? 'bottom-0 md:top-2' : '-top-64'
					}`}>
					<div className={`bg-red py-5 skew-r left-0 top-10`} />
					<Link href='/events/'>
						<div className='clickable text-lg absolute top-1.5 px-4 font-dm text-bkg'>
							VIEW ALL EVENTS
						</div>
					</Link>
				</div>
			</div>
		</div>
	);
}
