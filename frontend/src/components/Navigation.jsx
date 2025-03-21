import React from 'react';
import { Link } from 'react-router-dom';
import Logo from '../assets/logos/header-logo.svg?react';
import logoNoBkgWhite from '../assets/logos/logo-no-bkg-white.svg';

function Navigation() {
	return (
		<div className={`w-full z-30 bg-darkred pt-6`}>
			<div className={`z-30 w-full flex justify-around bg-red outline-8 outline-bkg h-[60px] mt-8`}>
				<div className={`relative right-10`}>
					{/* <Logo className={`relative -top-10 w-[400px] lg:-[500px]`} /> */}
					<div
						className={`z-10 relative -top-6 bg-red outline-8 outline-bkg  -skew-x-[30deg] w-fit px-6 py-4`}>
						<img
							src={logoNoBkgWhite}
							className={`skew-x-[30deg] translate-x-1 -translate-y-1`}
							width={300}
						/>
					</div>
				</div>
				<div className={`flex items-center font-dm text-2xl text-black space-x-10`}>
					<Link
						to={`/`}
						className={`text-bkg`}>
						H<span className={`text-xl`}>OME</span>
					</Link>
					<Link
						to={`/calendar`}
						className={`text-bkg`}>
						C<span className={`text-xl`}>ALENDAR</span>
					</Link>
					<Link
						to={`/`}
						className={`text-bkg`}>
						S<span className={`text-xl`}>ERMONS</span>
					</Link>
					<Link
						to={`/events`}
						className={`text-bkg`}>
						E<span className={`text-xl`}>VENTS</span>
					</Link>
					<Link
						to={`/`}
						className={`text-bkg`}>
						G<span className={`text-xl`}>IVE</span>
					</Link>
				</div>
			</div>{' '}
		</div>
	);
}

export default Navigation;
