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
				// Above the fold: preloaded at high priority. Optimized srcset so phones don't download the full-size original
				priority
				fetchPriority='high'
				sizes='100vw'
			/>
		</div>
	);
}

export default Header;
