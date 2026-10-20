'use client';
import React from 'react';
import Image from 'next/image';

function Header({ activeHeaderImage }) {
	const fallbackImage = '/assets/linganore-bright-pic-upscale.webp';
	const src = activeHeaderImage || fallbackImage;

	return (
		<div className='select-none relative border-b-12 border-red h-[300px] sm:h-[425px] overflow-hidden'>
			<Image
				fill
				src={src}
				alt='Linganore Church'
				className='object-cover object-center'
				// Above the fold: preloaded at high priority. Unoptimized because the image optimizer rejects API image URLs in production
				priority
				fetchPriority='high'
				unoptimized
			/>
		</div>
	);
}

export default Header;
