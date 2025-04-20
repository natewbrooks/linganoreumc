import React, { useState, useEffect } from 'react';
import { useEvents } from '@/contexts/EventsContext';
import Link from 'next/link';

function FeaturedEventItem({ event }) {
	// const { eventDates, eventTimes } = useEvents();
	const { fetchEventImages } = useEvents();
	const [thumbnailUrl, setThumbnailUrl] = useState(null);

	useEffect(() => {
		const loadThumbnail = async () => {
			if (!event?.id) return;

			const images = await fetchEventImages(event.id);

			const thumbnail = images.find((img) => img.isThumbnail);
			setThumbnailUrl(
				thumbnail
					? `${process.env.NEXT_PUBLIC_API_BASE_URL}/media/images/${thumbnail.url.split('/').pop()}`
					: null
			);
		};

		loadThumbnail();
	}, [event?.id, fetchEventImages]);

	const hasBackground = !!thumbnailUrl;

	return (
		// <Link
		// 	href={`/events/${event.id}`}
		// 	className={`flex flex-col w-full h-[180px] skew-x-[10deg] hover:scale-[1.02] hover:opacity-50 active:scale-[1]     ${
		// 		hasBackground ? 'bg-contain object-center object-contain bg-center' : 'bg-tp'
		// 	}`}
		// 	style={hasBackground ? { backgroundImage: `url(${thumbnailUrl})` } : {}}>
		// 	{!hasBackground ? (
		// 		<div className='font-dm text-center w-full -skew-x-[10deg] text-lg flex items-center justify-center h-full text-darkred'>
		// 			{event.title}
		// 		</div>
		// 	) : (
		// 		<div className={`bg-red`}>
		// 			<p className={`-skew-x-[10deg] font-dm text-center text-bkg`}>{event.title}</p>
		// 		</div>
		// 	)}
		// </Link>
		<Link
			href={`/events/${event.id}`}
			className={`relative flex flex-col w-full h-[180px] hover:scale-[1.02] hover:opacity-50 active:scale-[1]`}>
			{/* Common wrapper to keep sizing consistent */}
			<div className='w-full h-full'>
				{!hasBackground ? (
					<div className='font-dm text-center w-full h-full skew-x-[10deg] text-lg flex items-center justify-center bg-red text-bkg'>
						<div className={`-skew-x-[10deg]`}>{event.title}</div>
					</div>
				) : (
					<div className='relative w-full h-full bg-red skew-x-[10deg] overflow-hidden'>
						<img
							src={thumbnailUrl}
							alt='Event'
							className='w-full h-full -skew-x-[10deg] scale-115 object-cover object-center'
						/>
					</div>
				)}
			</div>
		</Link>
	);
}

export default FeaturedEventItem;
