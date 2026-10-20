'use client';
import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useSettings } from '@/contexts/SettingsContext';

const navItems = [
	{ path: '/', label: 'HOME' },
	{ path: '/calendar/', label: 'CALENDAR' },
	{ path: '/events/', label: 'EVENTS' },
	{ path: '/sermons/', label: 'SERMONS' },
];

/** True when `pathname` is `path` or one of its subpages, ignoring trailing slashes. */
export const isActivePath = (pathname, path) => {
	const base = path.replace(/\/$/, '');
	return base === '' ? pathname === '/' : pathname === base || pathname.startsWith(`${base}/`);
};

function Navigation() {
	const { settings } = useSettings();
	const pathname = usePathname();

	return (
		<div
			className={`hidden sm:block w-full z-30 ${
				settings.general?.announcementBanner?.enabled ? 'bg-darkred pt-[1px]' : 'pt-2 bg-darkred'
			}`}>
			<div className='z-30 w-full flex justify-around bg-red outline-4 outline-bkg h-[60px] mt-8'>
				<div className='relative right-10 select-none'>
					<div className='z-10 relative select-none -top-4 bg-red outline-4 outline-bkg -skew-x-[30deg] w-fit px-6 py-4'>
						<Link
							href='/'
							className='group'>
							<img
								src='/assets/logos/logo-no-bkg-white.svg'
								alt='Linganore Logo'
								width={250}
								height={61}
								className='select-none text-transparent group-hover:opacity-50 transition duration-200 skew-x-[30deg] translate-x-1 -translate-y-1'
							/>
						</Link>
					</div>
				</div>
				<div className='flex items-center font-dm text-black space-x-10 outline-none'>
					{navItems.map(({ path, label }) => {
						const isActive = isActivePath(pathname, path);

						return (
							<Link
								key={label}
								href={path}
								className={`text-bkg group ${isActive ? 'underline underline-offset-4 decoration-2' : ''}`}>
								<span className='text-xl group-hover:opacity-50 transition-all duration-200'>
									{label[0]}
								</span>
								<span className='text-lg group-hover:opacity-50 transition-all duration-200'>
									{label.slice(1)}
								</span>
							</Link>
						);
					})}
				</div>
			</div>
		</div>
	);
}

export default Navigation;
