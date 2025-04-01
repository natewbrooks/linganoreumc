import React from 'react';
import { useEvents } from '../../contexts/EventsContext';
import BKG from '../../assets/linganore-bright-pic-upscale.png'; // Or leave undefined/null to test fallback
import { Link } from 'react-router-dom';

function FeaturedEventItem({ event }) {
	const { eventDates, eventTimes } = useEvents();

	const hasBackground = !!BKG;

	return (
		<Link
			to={`/event/${event.id}`}
			className={`flex flex-col w-full h-[180px] skew-x-[10deg] cursor-pointer hover:scale-[102%] hover:opacity-50 active:scale-[100%] ${
				hasBackground ? 'bg-cover bg-center' : 'bg-tp'
			}`}
			style={hasBackground ? { backgroundImage: `url(${BKG})` } : {}}>
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
