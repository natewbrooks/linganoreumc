import React, { useEffect, useState } from 'react';
import BKG from '../../assets/linganore-bright-pic-upscale.webp';
import { Link } from 'react-router-dom';

export default function UpcomingEvents({ title, subtext, events = [] }) {
	const [displayEvents, setDisplayEvents] = useState([]);

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

	return (
		<div className={`relative h-[300px]`}>
			<div className='flex flex-col relative'>
				<div className='flex flex-col font-dm px-30 mb-4'>
					<h2 className='text-xl'>{title}</h2>
					<p className='text-4xl'>{subtext}</p>
				</div>

				<div
					className={`absolute -left-30 -bottom-17 -skew-x-[30deg]  w-full z-10 bg-red py-6`}>{`s `}</div>
				<div className='flex px-40  w-full text-bkg justify-between font-dm '>
					{displayEvents.map(({ event, date, placeholder }, index) => (
						<Link
							to={`/event/${event.id}`}
							className={`relative w-[300px] flex justify-center cursor-pointer group  `}>
							<div
								key={event.id || index}
								className={`absolute z-10 p-2 text-center leading-4 ${
									placeholder ? ' pointer-events-none' : 'group-hover:opacity-50'
								}`}>
								<h3 className='text-lg '>{event.title.toUpperCase() || 'Unknown Event'}</h3>
								<p className='text-md'>{date ? new Date(date).toLocaleDateString() : 'Date TBD'}</p>
							</div>
							<div
								className={`absolute right-0 top-[60px] skew-x-[5deg] ${
									!placeholder
										? 'group-hover:opacity-50 group-hover:scale-[102%] group-active:scale-[99%]'
										: ''
								}`}>
								<div className='w-[250px] h-[150px] overflow-hidden'>
									{placeholder ? (
										<div className={`bg-tp w-full h-full`}></div>
									) : (
										<img
											src={BKG}
											className='w-full h-full object-cover object-center skew-x-[-5deg]'
											alt='Event'
										/>
									)}
								</div>
							</div>
						</Link>
					))}
				</div>
			</div>
			<Link
				to={'/events/'}
				className={`w-fit pl-8 absolute -bottom-4 bg-red py-2 pr-20 -right-8  -skew-x-[30deg] font-dm text-bkg cursor-pointer group hover:scale-[102%] active:scale-[99%] `}>
				<div className={`skew-x-[30deg] text-lg group-hover:opacity-50 `}>VIEW ALL EVENTS</div>
			</Link>
		</div>
	);
}
