import React from 'react';
import { GoAlertFill } from 'react-icons/go';

function AnnouncementBanner({ title, subtext }) {
	return (
		<>
			<div className='z-30 w-full flex justify-center text-center items-center bg-darkred px-10 py-4'>
				<div className='flex flex-col font-dm text-xl max-w-[1000px]'>
					<h1 className='text-accent'>{title}</h1>
					<p className='text-bkg'>{subtext}</p>
				</div>
			</div>
		</>
	);
}

export default AnnouncementBanner;
