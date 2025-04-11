import React from 'react';

function SermonMonthLabel({ text }) {
	return (
		<div className='self-end relative -right-8 font-dm text-lg bg-darkred w-[200px] pl-4 md:pr-8 py-1 -skew-x-[30deg] text-bkg'>
			<p className='skew-x-[30deg]'>{text}</p>
		</div>
	);
}

export default SermonMonthLabel;
