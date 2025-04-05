import React from 'react';
import { Link } from 'react-router-dom';
import { formatShortDate, formatTime } from '../../helper/textFormat';

function SermonItem({ sermon }) {
	// Extract date and time parts
	const dateObj = new Date(sermon.lastEditDate);
	const dateOnly = dateObj.toISOString().split('T')[0];
	const timeOnly = dateObj.toTimeString().split(' ')[0].slice(0, 5); // "HH:MM"

	// Format them
	const formattedDate = formatShortDate(dateOnly);
	const formattedTime = formatTime(timeOnly);

	return (
		<Link
			to={`/edit/sermon/${sermon.id}`}
			className='font-dm w-full cursor-pointer hover:opacity-50 hover:scale-[102%] active:scale-[100%]'>
			{/* Last Edit Date */}
			<div className='text-xs text-darkred bg-accent px-2 py-0.5 w-fit -skew-x-[30deg] relative flex items-center space-x-2'>
				<span className='skew-x-[30deg]'>
					Last edited: {formattedDate} @ {formattedTime}
				</span>
			</div>

			{/* Main Content Row */}
			<div className='w-full flex flex-row items-center bg-tp -skew-x-[30deg] relative'>
				{/* ID Panel */}
				<div className='font-dm py-2 text-bkg min-w-[80px] overflow-hidden text-center text-md relative bg-darkred px-4'>
					<p className='skew-x-[30deg] whitespace-nowrap'>sid: {sermon.id}</p>
				</div>

				{/* Title Panel */}
				<div className='font-dm py-2 text-bkg bg-red px-4 text-center text-md overflow-visible whitespace-nowrap skew-x-0'>
					<p className='skew-x-[30deg]'>{sermon.title}</p>
				</div>

				{/* Description */}
				<div className='p-2 pl-4 font-dm items-center whitespace-nowrap text-darkred text-md overflow-hidden'>
					<p className='skew-x-[30deg]'>
						{sermon.body?.length > 100 ? `${sermon.body.slice(0, 100)}...` : sermon.body}
					</p>
				</div>
			</div>
		</Link>
	);
}

export default SermonItem;
