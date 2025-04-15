import React from 'react';
import { Link } from 'react-router-dom';

function SermonItem({ sermon, index }) {
	return (
		<div className='w-full clickable transition-transform'>
			<div className='flex flex-row w-full pl-4 -skew-x-[30deg] font-dm text-sm z-10 relative'>
				<Link
					to={`/sermons/${sermon.id}`}
					className='flex flex-row items-stretch w-full relative skew-x-[30deg]'>
					<div className={`absolute bg-tp w-screen h-full`}>{` `}</div>

					{/* Title Block */}
					<div
						className={`${
							index % 2 == 0 ? 'bg-red' : 'bg-red'
						} w-fit relative -left-3 text-bkg px-4 py-2 text-lg text-center -skew-x-[30deg] flex items-center justify-center`}>
						<p className='skew-x-[30deg] min-w-[200px] w-fit whitespace-nowrap'>{sermon.title}</p>
					</div>

					{/* Description Block */}
					<div className='flex-1 p-2 px-2 text-darkred text-lg -skew-x-[30deg]'>
						<p className='skew-x-[30deg] whitespace-nowrap'>{sermon.description}</p>
					</div>
				</Link>
			</div>
		</div>
	);
}

export default SermonItem;
