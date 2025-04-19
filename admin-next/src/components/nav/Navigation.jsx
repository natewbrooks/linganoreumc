'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';
import NavLink from './NavLink';
import NavLinkDropdown from './NavLinkDropdown';
import { FaUserCircle } from 'react-icons/fa';

function Navigation() {
	const { isAuthenticated, logout, user } = useAuth();
	const [activeDropdown, setActiveDropdown] = useState(null);

	const handleLogoutClick = () => {
		const confirmed = window.confirm('Are you sure you want to log out?');
		if (confirmed) logout();
	};

	const isAdmin = user?.role === 'admin';

	const manageLinks = isAdmin ? [{ title: 'Users', to: '/manage/users' }] : [];

	const settingsLinks = [
		{ title: 'General', to: '/settings/general' },
		{ title: 'Home', to: '/settings/home' },
	];

	const accountLinks = [
		{
			title: 'Logout',
			to: '#',
			onClick: handleLogoutClick,
		},
	];

	return (
		<>
			<div
				onMouseLeave={() => setActiveDropdown(null)}
				className='w-full flex justify-around bg-red outline-4 outline-bkg h-[60px]'>
				{/* Logo */}
				<div className='relative -right-40'>
					<div className='z-10 relative select-none -top-4 bg-red outline-4 outline-bkg -skew-x-[30deg] w-fit px-6 py-4'>
						<Link
							href={`/`}
							className='group'>
							<img
								rel='preload'
								as='image'
								src='/assets/logos/logo-no-bkg-white.svg'
								alt='Linganore Logo'
								width={350}
								className='select-none group-hover:opacity-50 group-hover:scale-[1.02] active:scale-[1] transition duration-200 skew-x-[30deg] translate-x-1 -translate-y-1'
							/>
						</Link>
					</div>
					<h3 className='absolute -bottom-12 -left-8 text-darkred font-newb text-xl bg-bkg'>
						Admin Dashboard
					</h3>
				</div>

				{/* Links */}
				<div className='flex text-start w-full items-center justify-end pr-40 text-xl bg-red'>
					{isAuthenticated ? (
						<>
							<NavLink
								onHover={() => setActiveDropdown(null)}
								link={{ title: 'Events', to: '/events' }}
							/>
							<NavLink
								onHover={() => setActiveDropdown(null)}
								link={{ title: 'Sermons', to: '/sermons' }}
							/>

							<NavLinkDropdown
								title='Settings'
								links={settingsLinks}
								doUnderline={true}
								isActive={activeDropdown === 'Settings'}
								onHover={() => setActiveDropdown('Settings')}
							/>

							{isAdmin && (
								<NavLinkDropdown
									title='Manage'
									links={manageLinks}
									doUnderline={true}
									isActive={activeDropdown === 'Manage'}
									onHover={() => setActiveDropdown('Manage')}
								/>
							)}

							<span className='text-darkred px-2'>|</span>

							{user && (
								<NavLinkDropdown
									title={
										<div className='flex items-center space-x-2 text-darkred'>
											<FaUserCircle size={20} />
											<span>{user.username}</span>
										</div>
									}
									doUnderline={false}
									links={[{ title: 'Account', to: '/manage/account' }, ...accountLinks]}
									isActive={activeDropdown === 'Account'}
									onHover={() => setActiveDropdown('Account')}
								/>
							)}
						</>
					) : (
						<Link
							href={`/`}
							className='font-dm text-bkg clickable'>
							<span className='text-xl'>E</span>
							<span className='text-lg'>
								XIT TO <span className='text-xl'>H</span>OME
							</span>
						</Link>
					)}
				</div>
			</div>
		</>
	);
}

export default Navigation;
