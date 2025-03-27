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
					className={`absolute -left-10 -bottom-17 -skew-x-[30deg]  w-full z-10 bg-red py-6`}>{`s `}</div>
				<div className='flex px-40  w-full text-bkg justify-between font-dm '>
					{displayEvents.map(({ event, date, placeholder }, index) => (
						<div className={`relative w-[300px] flex justify-center cursor-pointer group  `}>
							<div
								key={event.id || index}
								className={`absolute z-10 p-2 text-center leading-4 ${
									placeholder ? ' pointer-events-none' : 'group-hover:opacity-50'
								}`}>
								<h3 className='text-lg '>{event.title.toUpperCase() || 'Unknown Event'}</h3>
								<p className='text-md'>{date ? new Date(date).toLocaleDateString() : 'Date TBD'}</p>
							</div>
							<div
								className={`${
									!placeholder
										? 'group-hover:opacity-50 group-hover:scale-[102%] group-active:scale-[99%] '
										: ''
								} absolute  skew-x-[5deg] right-0 top-[60px] `}>
								{placeholder ? (
									<div className={`bg-tp w-[250px] h-[150px]`}></div>
								) : (
									<img
										src={BKG}
										className={`bg-cover bg-center`}
										style={{ width: '250px', height: '150px' }}></img>
								)}
							</div>
						</div>
					))}
				</div>
			</div>
			<Link
				to={'/events/'}
				className={`w-fit pl-8 absolute -bottom-0 bg-red py-2 pr-20 -right-8  -skew-x-[30deg] font-dm text-bkg cursor-pointer hover:opacity-90 hover:scale-[102%] active:scale-[99%] `}>
				<div className={`skew-x-[30deg] text-lg`}>VIEW ALL EVENTS</div>
			</Link>
		</div>
	);
}
