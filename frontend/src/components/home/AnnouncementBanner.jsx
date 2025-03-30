import React from 'react';
import { GoAlertFill } from 'react-icons/go';

function AnnouncementBanner({ title, subtext }) {
	return (
		<>
			<div className='z-30 w-full flex justify-center text-center items-center bg-darkred px-10 pt-4 pb-4 md:pb-2'>
				<div className='flex flex-col font-dm text-lg max-w-[800px]'>
					<h1 className='text-accent'>{title}</h1>
					<p className='text-bkg text-[16px] leading-5'>{subtext}</p>
				</div>
			</div>
		</>
	);
}

export default AnnouncementBanner;
