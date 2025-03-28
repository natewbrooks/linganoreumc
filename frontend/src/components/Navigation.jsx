import React from 'react';
import { Link } from 'react-router-dom';
import Logo from '../assets/logos/logo-no-bkg-white.svg?react';
import { useSettings } from '../contexts/SettingsContext';

function Navigation() {
	const { settings } = useSettings();

	return (
		<div
			className={`hidden sm:block w-full z-30 pt-[1px] ${
				settings.general?.announcementBanner?.enabled ? 'bg-darkred' : 'bg-darkred'
			}`}>
			<div className={`z-30 w-full flex justify-around bg-red outline-4 outline-bkg h-[60px] mt-8`}>
				<div className={`relative right-10`}>
					{/* <Logo className={`relative -top-10 w-[400px] lg:-[500px]`} /> */}
					<div
						className={`z-10 relative -top-5 bg-red outline-4 outline-bkg  -skew-x-[30deg] w-fit px-6 py-1`}>
						<Link
							to={`/`}
							className={`group`}>
							<Logo
								width={250}
								className={`group-hover:opacity-50 group-hover:scale-[102%] group-active:scale-[99%] skew-x-[30deg] translate-x-1 -translate-y-1`}
							/>
						</Link>
					</div>
				</div>
				<div className={`flex items-center font-dm text-xl text-black space-x-10 outline-none`}>
					<Link
						to={`/`}
						className={`text-bkg`}>
						H<span className={`text-lg`}>OME</span>
					</Link>
					<Link
						to={`/calendar`}
						className={`text-bkg`}>
						C<span className={`text-lg`}>ALENDAR</span>
					</Link>
					<Link
						to={`/`}
						className={`text-bkg`}>
						S<span className={`text-lg`}>ERMONS</span>
					</Link>
					<Link
						to={`/events`}
						className={`text-bkg`}>
						E<span className={`text-lg`}>VENTS</span>
					</Link>
					<Link
						to={`/`}
						className={`text-bkg`}>
						G<span className={`text-lg`}>IVE</span>
					</Link>
				</div>
			</div>{' '}
		</div>
	);
}

export default Navigation;
