import React from 'react';
import { Link } from 'react-router-dom';
import { formatShortDate, formatTime } from '../../helper/textFormat';

function SermonItem({ sermon }) {
	// Format lastEditDate
	const editDateObj = new Date(sermon.lastEditDate);
	const localEditDate = editDateObj.toLocaleDateString('en-US', {
		year: 'numeric',
		month: '2-digit',
		day: '2-digit',
		timeZone: 'America/New_York',
	});
	const localEditTime = editDateObj.toLocaleTimeString('en-US', {
		hour: '2-digit',
		minute: '2-digit',
		hour12: true,
		timeZone: 'America/New_York',
	});

	// Format publishDate (only date, no time)
	const formattedPublishDate = sermon.publishDate ? formatShortDate(sermon.publishDate) : 'N/A';

	return (
		<Link
			to={`/edit/sermon/${sermon.id}`}
			className='font-dm w-full outline-0 cursor-pointer hover:opacity-50 hover:scale-[102%] active:scale-[100%]'>
			{/* Top Info Panel */}
			<div className='text-sm text-darkred bg-accent px-4 py-0.5 w-fit -skew-x-[30deg] flex items-center space-x-4'>
				<span className='skew-x-[30deg]'>Published: {formattedPublishDate}</span>
				<span className='skew-x-[30deg]'>
					Last edited: {localEditDate} @ {localEditTime}
				</span>
			</div>

			{/* Main Content Row */}
			<div className='w-full flex flex-row items-center bg-tp -skew-x-[30deg] relative'>
				{/* ID Panel */}
				<div className='font-dm py-2 text-bkg min-w-[80px] overflow-hidden text-center text-lg bg-darkred px-4'>
					<p className='skew-x-[30deg] whitespace-nowrap'>sid: {sermon.id}</p>
				</div>

				{/* Title Panel */}
				<div className='font-dm py-2 text-bkg bg-red px-4 text-center text-lg overflow-visible whitespace-nowrap skew-x-0'>
					<p className='skew-x-[30deg]'>{sermon.title}</p>
				</div>

				{/* Description */}
				<div className='p-2 pl-4 font-dm items-center whitespace-nowrap text-darkred text-lg overflow-hidden'>
					<p className='skew-x-[30deg]'>
						{sermon.body?.length > 100 ? `${sermon.body.slice(0, 100)}...` : sermon.body}
					</p>
				</div>
			</div>
		</Link>
	);
}

export default SermonItem;
