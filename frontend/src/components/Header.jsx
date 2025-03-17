import React from 'react';
import linganoreBrightPic from '../assets/linganore-bright-pic-upscale.png';
import Navigation from './Navigation';

function Header() {
	return (
		<div className={`relative -z-10 border-b-16 border-red`}>
			<img
				className={`w-full`}
				src={linganoreBrightPic}
				alt='Linganore Church'
			/>
		</div>
	);
}

export default Header;
