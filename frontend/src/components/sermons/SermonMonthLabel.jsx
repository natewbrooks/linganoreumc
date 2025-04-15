import React from 'react';

function SermonMonthLabel({ text }) {
	return (
		<div className='absolute -right-10 md:-right-4 font-dm text-lg bg-darkred w-[200px] lg:w-[600px] pl-4 md:pr-8 py-1 skew-r text-bkg'>
			<p className='skew-l'>{text.toUpperCase()}</p>
		</div>
	);
}

export default SermonMonthLabel;
