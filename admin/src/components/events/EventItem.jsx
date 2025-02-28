import React from 'react';
import { Link } from 'react-router-dom';

function EventItem({ id, title, description }) {
	return (
		<Link to={`/edit/event/${id}`}>
			<div className='flex flex-row w-full items-center space-x-2 font-dm hover:bg-tp p-2'>
				<div className='bg-red p-2 text-bkg'>{title}</div>
				<span>{description}</span>
			</div>
		</Link>
	);
}

export default EventItem;
