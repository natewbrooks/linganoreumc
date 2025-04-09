import React, { useState, useEffect } from 'react';
import { useEvents } from '../../contexts/EventsContext';
// import BKG from '../../assets/linganore-bright-pic-upscale.png'; // Or leave undefined/null to test fallback
import { Link } from 'react-router-dom';

function FeaturedEventItem({ event }) {
	// const { eventDates, eventTimes } = useEvents();
	const { fetchEventImages } = useEvents();
	const [thumbnailUrl, setThumbnailUrl] = useState(null);

	useEffect(() => {
		const loadThumbnail = async () => {
			if (!event?.id) return;

			const images = await fetchEventImages(event.id);
			console.log('Fetched images:', images);

			const thumbnail = images.find((img) => img.isThumbnail);
			setThumbnailUrl(
				thumbnail
					? `http://localhost:5000/api/media/images/${thumbnail.url.split('/').pop()}`
					: null
			);
		};

		loadThumbnail();
	}, [event?.id, fetchEventImages]);

	const hasBackground = !!thumbnailUrl;

	return (
		<Link
			to={`/event/${event.id}`}
			className={`flex flex-col w-full h-[180px] skew-x-[10deg] cursor-pointer hover:scale-[102%] hover:opacity-50 active:scale-[100%] ${
				hasBackground ? 'bg-cover bg-center' : 'bg-tp'
			}`}
			style={hasBackground ? { backgroundImage: `url(${thumbnailUrl})` } : {}}>
			{!hasBackground ? (
				<div className='font-dm text-center w-full -skew-x-[10deg] text-lg flex items-center justify-center h-full text-white'>
					{event.title}
				</div>
			) : (
				<div className={`bg-red`}>
					<p className={`-skew-x-[10deg] font-dm text-center text-bkg`}>{event.title}</p>
				</div>
			)}
		</Link>
	);
}

export default FeaturedEventItem;
