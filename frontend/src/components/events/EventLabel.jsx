import React from 'react';

function EventLabel({ text }) {
	return (
		<div className={`flex w-full`}>
			<div className={`font-dm text-darkred text-lg`}>
				<p className={``}>{text}</p>
			</div>
		</div>
	);
}

export default EventLabel;
