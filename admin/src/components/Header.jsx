import React from 'react';
import Logo from '../assets/header-logo.svg?react';

function Header() {
	return (
		<div className={`relative w-full flex justify-around bg-red h-[60px] mb-20`}>
			<div className={`relative right-20`}>
				<Logo
					width={400}
					className={`relative -top-10`}
				/>
				<h3 className={`absolute -bottom-13 right-18 font-newb text-xl`}>Admin Dashboard</h3>
			</div>
			<button className={`font-dm text-bkg text-2xl cursor-pointer`}>Logout</button>
		</div>
	);
}

export default Header;
