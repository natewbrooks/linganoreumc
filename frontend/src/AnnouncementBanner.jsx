import React from 'react';
import { GoAlertFill } from 'react-icons/go';

function AnnouncementBanner() {
	return (
		<div className='sticky top-0 z-20 w-full flex justify-center text-center items-center bg-red h-[60px] px-10'>
			<div className='absolute left-10'>
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
			</div>
			<div className='flex flex-col font-dm'>
				<h1 className='text-accent'>INCLEMENT WEATHER ALERT</h1>
				<p className='text-bkg'>
					Due to weather conditions, we will be canceling today’s sermons. Stay safe and god bless!
				</p>
			</div>
		</div>
	);
}

export default AnnouncementBanner;
