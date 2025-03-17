import React from 'react';
import { GoAlertFill } from 'react-icons/go';

function AnnouncementBanner({ title, subtext }) {
	return (
		<>
			<div className='sticky top-0 z-20 w-full flex justify-center text-center items-center bg-darkred px-10 py-4'>
				{/* <div className='absolute left-10'>
					<GoAlertFill
						size={30}
						className='text-accent'
					/>
				</div>
				<div className='absolute right-10'>
					<GoAlertFill
						size={30}
						className='text-accent'
					/>
				</div> */}
				<div className='flex flex-col font-dm text-xl'>
					<h1 className='text-accent'>{title}</h1>
					<p className='text-bkg'>{subtext}</p>
				</div>
			</div>
			<div className={`bg-darkred w-full py-14 absolute top-4`}></div>
		</>
	);
}

export default AnnouncementBanner;
