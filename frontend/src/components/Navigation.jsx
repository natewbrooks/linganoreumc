import React from 'react';
import Logo from '../assets/header-logo.svg?react';

function Navigation() {
	return (
		<div className={`relative w-full flex justify-around bg-red h-[60px] mt-10 mb-20`}>
			<div className={`relative right-20`}>
				<Logo
					width={400}
					className={`relative -top-10`}
				/>
			</div>
			<button className={`font-dm text-bkg text-2xl cursor-pointer`}>Logout</button>
		</div>
	);
}

export default Navigation;
