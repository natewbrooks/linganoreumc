import React from 'react';
// import { GoAlertFill } from 'react-icons/go';
import { BsFillMegaphoneFill } from 'react-icons/bs';

function AnnouncementBanner({ title, subtext }) {
	return (
		<>
			<div className='w-full flex space-x-8 justify-center text-center items-center bg-darkred pt-4 pb-4 md:pb-2'>
				<BsFillMegaphoneFill className={`w-[30px] h-[30px] text-red/40 invisible md:visible`} />
				<div className='flex flex-col font-dm text-lg max-w-[800px]'>
					<h1 className='text-accent'>{title}</h1>
					<p className='text-bkg text-[16px] leading-5'>{subtext}</p>
				</div>
				<BsFillMegaphoneFill
					className={`w-[30px] h-[30px] text-red/40 rotate-y-180 invisible md:visible`}
				/>
			</div>
		</>
	);
}

export default AnnouncementBanner;
