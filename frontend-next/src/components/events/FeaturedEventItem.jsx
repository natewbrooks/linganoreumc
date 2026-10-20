import getFormat from '@/lib/getFormat';
import React from 'react';
import { preload } from 'react-dom';
import { useEvents } from '@/contexts/EventsContext';
import Link from 'next/link';

function FeaturedEventItem({ event }) {
	const { eventImages } = useEvents();
	const thumbnail = (eventImages[event.id] || []).find((img) => img.isThumbnail);
	const thumbnailUrl = thumbnail
		? `${process.env.NEXT_PUBLIC_API_BASE_URL}/media/images/${thumbnail.url.split('/').pop()}`
		: null;

	const hasBackground = !!thumbnailUrl;

	// Emits a <link rel=preload> in the server HTML so the image starts downloading before the <img> is parsed
	if (thumbnailUrl) preload(thumbnailUrl, { as: 'image', fetchPriority: 'high' });

	return (
		// <Link
		// 	href={getFormat.eventPath(event)}
		// 	className={`flex flex-col w-full h-[180px] skew-x-[10deg] hover:opacity-50     ${
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
			href={getFormat.eventPath(event)}
			className={`relative flex flex-col w-full h-[180px] hover:opacity-50 transition-opacity duration-200`}>
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
							loading='eager'
							fetchPriority='high'
							decoding='async'
							className='w-full h-full -skew-x-[10deg] scale-115 object-cover object-center'
						/>
					</div>
				)}
			</div>
		</Link>
	);
}

export default FeaturedEventItem;
