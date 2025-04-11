import React, { useEffect } from 'react';
import linganoreBrightPic from '../../assets/linganore-bright-pic-upscale.webp';

function Header({ activeHeaderImage }) {
	useEffect(() => {
		const link = document.createElement('link');
		link.rel = 'preload';
		link.as = 'image';
		link.href = activeHeaderImage || linganoreBrightPic;
		document.head.appendChild(link);

		return () => {
			document.head.removeChild(link);
		};
	}, [activeHeaderImage]);

	return (
		<div className='select-none relative border-b-12 border-red h-[300px] sm:h-[425px] overflow-hidden'>
			<img
				src={activeHeaderImage || linganoreBrightPic}
				alt='Linganore Church'
				className='absolute inset-0 w-full h-full object-cover object-center'
			/>
		</div>
	);
}

export default Header;
