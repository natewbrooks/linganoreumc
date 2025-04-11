import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Logo from '../../assets/logos/logo-no-bkg-white.svg?react';
import { useSettings } from '../../contexts/SettingsContext';

const navItems = [
	{ path: '/', label: 'HOME' },
	{ path: '/calendar/', label: 'CALENDAR' },
	{ path: '/sermons/', label: 'SERMONS' },
	{ path: '/events/', label: 'EVENTS' },
	{ path: '/', label: 'GIVE' },
];

function MobileNavigation() {
	const [open, setOpen] = useState(false);

	return (
		<div className={`w-full`}>
			<div
				className={`w-full flex items-center justify-between px-4 bg-red border-y-4 border-bkg h-[80px]`}>
				<Link to={`/`}>
					<Logo
						width={250}
						className={`group- h-full select-none`}
					/>
				</Link>
				<div
					onClick={() => {
						setOpen(!open);
					}}
					className={`flex flex-col text-md justify-center items-center space-y-2 h-[20px] w-[24px]`}>
					<div
						className={`${
							open ? 'rotate-45 translate-y-[10px] -skew-x-[30deg] ' : 'skew-x-[30deg] '
						} duration-300 transition-all w-full bg-bkg py-0.25`}>{` `}</div>
					<div
						className={`${
							open ? 'rotate-45' : ''
						} duration-300 transition-all w-full bg-bkg -skew-x-[30deg] py-0.25`}>{` `}</div>
					<div
						className={`${
							open ? '-rotate-45 -translate-y-[10px]' : ''
						} duration-300 transition-all w-full bg-bkg skew-x-[30deg] py-0.25`}>{` `}</div>
				</div>
			</div>

			<div
				className={`fixed left-0 w-full ${
					open ? 'translate-y-[0px]' : '-translate-y-[101%]'
				} transition-all delay-100 duration-300 -z-10 bg-red grid grid-cols-2 gap-1 px-8 py-4 justify-center items-center `}>
				{navItems.map(({ path, label }) => (
					<Link
						key={label}
						to={path}
						onClick={() => setOpen(false)}
						className={`text-red group font-dm text-center bg-bkg px-4 py-1 -skew-x-[30deg]`}>
						<div className={`skew-x-[30deg]`}>
							<span className={`text-xl`}>{label[0]}</span>
							<span className={`text-lg`}>{label.slice(1)}</span>
						</div>
					</Link>
				))}
			</div>
		</div>
	);
}

export default MobileNavigation;
