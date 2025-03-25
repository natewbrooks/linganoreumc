import React from 'react';
import { Link } from 'react-router-dom';

export default function UpcomingEvents({ title, subtext, events = [] }) {
	return (
		<div className='flex flex-col px-4 py-6'>
			<div className='flex flex-col'>
				<h2 className='text-2xl font-bold'>{title}</h2>
				<p className='text-gray-600'>{subtext}</p>
			</div>

			<div className='flex space-x-4'>
				{events.length > 0 ? (
					events.map(({ event, date }, index) => (
						<Link
							key={event.id || index}
							to={`/event/${event.id}`}
							className='border p-2 my-2'>
							<h3 className='font-semibold'>{event.title || 'Unknown Event'}</h3>
							<p className='text-sm text-gray-500'>
								{date ? new Date(date).toLocaleDateString() : 'Date TBD'}
							</p>
						</Link>
					))
				) : (
					<p className='text-darkred italic'>No upcoming events.</p>
				)}
			</div>
		</div>
	);
}
