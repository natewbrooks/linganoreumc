import React from 'react';
import { Link } from 'react-router-dom';

function SermonItem({ sermon, index }) {
	return (
		<div className='w-full clickable transition-transform'>
			<div className='flex flex-row w-full pl-4 -skew-x-[30deg] font-dm text-sm z-10 relative'>
				<Link
					to={`/sermons/${sermon.id}`}
					className='flex flex-row items-stretch w-full bg-tp relative skew-x-[30deg]'>
					{/* Title Block */}
					<div
						className={`${
							index % 2 == 0 ? 'bg-red' : 'bg-darkred'
						} w-fit text-bkg px-4 py-2 text-lg text-center -skew-x-[30deg] flex items-center justify-center`}>
						<p className='skew-x-[30deg] min-w-[300px] w-fit whitespace-nowrap'>{sermon.title}</p>
					</div>

					{/* Description Block */}
					<div className='flex-1 p-2 px-4 text-darkred text-lg -skew-x-[30deg]'>
						<p className='skew-x-[30deg] whitespace-nowrap'>{sermon.description}</p>
					</div>
				</Link>
			</div>
		</div>
	);
}

export default SermonItem;
