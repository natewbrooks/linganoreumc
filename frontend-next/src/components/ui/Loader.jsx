import React from 'react';

/** Pulsing cross and flame with a label. Used while an event or sermon page loads */
export default function Loader({ label = 'Loading…' }) {
	return (
		<div
			role='status'
			className='flex flex-col items-center justify-center gap-4 py-32 font-dm text-darkred'>
			<img
				src='/assets/logos/cross-flame.svg'
				alt=''
				width={44}
				height={80}
				className='animate-pulse'
			/>
			<p className='text-lg'>{label}</p>
		</div>
	);
}
