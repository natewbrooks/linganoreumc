import React from 'react';

function AnnouncementBanner({ title, subtext }) {
	return (
		<>
			<div
				id='announcementBanner'
				className='w-full flex justify-center text-center items-center bg-darkred px-4 py-2 md:pt-4 md:pb-2'>
				<div className='flex flex-col font-dm text-base leading-6 md:text-lg md:leading-7 max-w-[800px]'>
					<h1 className='text-accent'>{title}</h1>
					<p className='text-bkg text-sm md:text-[16px] leading-5'>{subtext}</p>
				</div>
			</div>
		</>
	);
}

export default AnnouncementBanner;
