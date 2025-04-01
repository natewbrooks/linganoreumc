import React from 'react';
import { Link } from 'react-router-dom';
import Logo from '../assets/logos/logo-no-bkg-white.svg?react';
import { useSettings } from '../contexts/SettingsContext';

const navItems = [
	{ path: '/', label: 'HOME' },
	{ path: '/calendar', label: 'CALENDAR' },
	{ path: '/', label: 'SERMONS' },
	{ path: '/events', label: 'EVENTS' },
	{ path: '/', label: 'GIVE' },
];

function Navigation() {
	const { settings } = useSettings();

	return (
		<div
			className={`hidden sm:block w-full z-30 pt-[1px] ${
				settings.general?.announcementBanner?.enabled ? 'bg-darkred' : 'bg-darkred'
			}`}>
			<div className={`z-30 w-full flex justify-around bg-red outline-4 outline-bkg h-[60px] mt-8`}>
				<div className={`relative right-10`}>
					<div
						className={`z-10 relative -top-5 bg-red outline-4 outline-bkg  -skew-x-[30deg] w-fit px-6 py-1`}>
						<Link
							to={`/`}
							className={`group`}>
							<Logo
								width={250}
								className={`group-hover:opacity-50 group-hover:scale-[102%] group-active:scale-[100%] skew-x-[30deg] translate-x-1 -translate-y-1`}
							/>
						</Link>
					</div>
				</div>
				<div className={`flex items-center font-dm text-black space-x-10 outline-none`}>
					{navItems.map(({ path, label }) => (
						<Link
							key={label}
							to={path}
							className={`text-bkg hover:opacity-50 group hover:scale-[102%] active:scale-[100%]`}>
							<span className={`text-xl`}>{label[0]}</span>
							<span className={`text-lg`}>{label.slice(1)}</span>
						</Link>
					))}
				</div>
			</div>
		</div>
	);
}

export default Navigation;
