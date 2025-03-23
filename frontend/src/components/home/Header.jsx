import React from 'react';
import linganoreBrightPic from '../../assets/linganore-bright-pic-upscale.webp';

function Header({ activeHeaderImage }) {
	return (
		<div className='relative -z-10 border-b-12 border-red h-[400px] overflow-hidden'>
			<img
				src={activeHeaderImage || linganoreBrightPic}
				alt='Linganore Church'
				className='absolute inset-0 w-full h-full object-cover object-center'
			/>
		</div>
	);
}

export default Header;
