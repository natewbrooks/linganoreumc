import React from 'react';
import Link from 'next/link';

function SermonItem({ sermon }) {
	return (
		<div className='w-full flex justify-center items-center  font-dm clickable transition-transform'>
			<div className='flex flex-row w-full pl-4 -skew-x-[30deg] font-dm text-sm z-10 relative'>
				<Link
					href={`/sermons/${sermon.slug ?? sermon.id}`}
					className='flex flex-col sm:flex-row items-stretch w-full relative skew-x-[30deg]'>
					{sermon.description && (
						<div className={`hidden sm:block absolute bg-tp w-screen h-full`}>{` `}</div>
					)}

					{/* Title Block */}
					<div
						className={`bg-red w-[calc(100%+1.5rem)] sm:w-fit relative -left-3 text-bkg pl-6 pr-4 sm:px-4 py-2 text-lg text-left sm:text-center -skew-x-[30deg] flex items-center justify-start sm:justify-center`}>
						<p className='skew-x-[30deg] min-w-[200px] w-fit whitespace-nowrap'>{sermon.title}</p>
					</div>

					{/* Description Block. Hidden with no description */}
					{sermon.description && (
						<div className='flex-1 -ml-1 -mr-3 sm:mx-0 px-4 bg-tp sm:bg-transparent py-1 sm:p-2 text-darkred text-sm sm:text-lg skew-x-[30deg] sm:-skew-x-[30deg] overflow-hidden'>
							<p className='line-clamp-2 sm:line-clamp-none -skew-x-[30deg] sm:skew-x-[30deg] sm:truncate sm:whitespace-nowrap w-full'>
								{sermon.description}
							</p>
						</div>
					)}
				</Link>
			</div>
		</div>
	);
}

export default SermonItem;
