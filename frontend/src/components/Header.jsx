import React from 'react';
import linganoreBrightPic from '../assets/linganore-bright-pic.png';
import Navigation from './Navigation';

function Header() {
	return (
		<div className={`relative border-b-16 border-red`}>
			<div className={`flex w-full absolute top-8 justify-between items-center`}>
				{/* <img
					src={logoNoBkg}
					alt='Logo no bkg'
					className={`w-[300px] h-[100px]`}
				/> */}
				{/* <div className={`flex font-dm text-xl text-black space-x-2`}>
					<Link
						to={`/`}
						className={`skew-x-[30deg] bg-red px-3 hover:scale-105`}>
						<p className={`-skew-x-[30deg] text-bkg`}>HOME</p>
					</Link>
					<Link className={`skew-x-[30deg] bg-darkred px-3 hover:scale-105`}>
						<p className={`-skew-x-[30deg] text-bkg`}>CALENDAR</p>
					</Link>
					<Link className={`skew-x-[30deg] bg-darkred px-3 hover:scale-105`}>
						<p className={`-skew-x-[30deg] text-bkg`}>SERMONS</p>
					</Link>
					<Link
						to={`/events/`}
						className={`skew-x-[30deg] bg-darkred px-3 hover:scale-105`}>
						<p className={`-skew-x-[30deg] text-bkg`}>EVENTS</p>
					</Link>
					<Link className={`skew-x-[30deg] bg-darkred px-3 hover:scale-105`}>
						<p className={`-skew-x-[30deg] text-bkg`}>GIVE</p>
					</Link>
				</div> */}
			</div>
			<img
				className={`w-full`}
				src={linganoreBrightPic}
				alt='Linganore Church'
			/>
		</div>
	);
}

export default Header;
