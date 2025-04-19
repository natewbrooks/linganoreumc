'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { FaUserCircle } from 'react-icons/fa';
import { useAuth } from '@/contexts/AuthContext';
import Image from 'next/image';

function MobileNavigation() {
	const [open, setOpen] = useState(false);
	const [visibleHeight, setVisibleHeight] = useState(0);

	const { isAuthenticated, logout, user } = useAuth();
	const router = useRouter();
	const isAdmin = user?.role === 'admin';

	const logo = '/assets/logos/logo-no-bkg-white.svg';

	useEffect(() => {
		const updateNavHeight = () => {
			const vHeight = window.visualViewport?.height || window.innerHeight;
			setVisibleHeight(vHeight);
		};

		updateNavHeight();

		window.addEventListener('resize', updateNavHeight);
		window.visualViewport?.addEventListener('resize', updateNavHeight);
		window.visualViewport?.addEventListener('scroll', updateNavHeight);

		return () => {
			window.removeEventListener('resize', updateNavHeight);
			window.visualViewport?.removeEventListener('resize', updateNavHeight);
			window.visualViewport?.removeEventListener('scroll', updateNavHeight);
		};
	}, []);

	const handleLogoutClick = () => {
		const confirmed = window.confirm('Are you sure you want to log out?');
		if (confirmed) {
			setOpen(false);
			logout();
		}
	};

	const handleCloseAndNavigate = (path) => {
		setOpen(false);
		router.push(path);
	};

	return (
		<>
			{/* Header Bar */}
			<div className='relative w-full flex items-center justify-between px-4 bg-red border-b-4 border-bkg h-[80px]'>
				<Link href={`/`}>
					<Image
						src={logo}
						alt='Linganore Logo'
						width={250}
						height={60}
						className='h-full select-none'
						priority
					/>
				</Link>
				<div
					onClick={() => setOpen(!open)}
					className='flex flex-col text-md justify-center items-center space-y-2 h-[20px] w-[24px] cursor-pointer'>
					<div
						className={`${
							open ? 'rotate-45 translate-y-[10px] -skew-x-[30deg]' : 'skew-x-[30deg]'
						} duration-300 transition-all w-full bg-bkg py-0.25`}
					/>
					<div
						className={`${
							open ? 'opacity-0' : ''
						} duration-300 transition-all w-full bg-bkg -skew-x-[30deg] py-0.25`}
					/>
					<div
						className={`${
							open ? '-rotate-45 -translate-y-[10px]' : ''
						} duration-300 transition-all w-full bg-bkg skew-x-[30deg] py-0.25`}
					/>
				</div>
			</div>

			{/* Slide-out Fullscreen Nav */}
			<div
				style={{ height: `${visibleHeight - 80}px` }}
				className={`fixed bottom-0 left-0 w-screen -z-10 bg-darkred text-bkg transform ${
					open ? 'translate-x-0' : '-translate-x-full'
				} transition-transform duration-300 ease-in-out px-6 py-8 flex flex-col justify-between`}>
				{isAuthenticated ? (
					<>
						<div className='flex flex-col space-y-8 text-center font-dm'>
							<div className='flex flex-col space-y-4'>
								<div className='w-full text-left border-b-1 pb-2 text-lg'>Settings</div>
								<button
									onClick={() => handleCloseAndNavigate('/settings/general')}
									className='text-3xl'>
									General
								</button>
								<button
									onClick={() => handleCloseAndNavigate('/settings/home')}
									className='text-3xl'>
									Home
								</button>
							</div>

							<div className='flex flex-col space-y-4'>
								<div className='w-full text-left border-b-1 pb-2 text-lg'>Maintenance</div>
								<button
									onClick={() => handleCloseAndNavigate('/events')}
									className='text-3xl'>
									Events
								</button>
								<button
									onClick={() => handleCloseAndNavigate('/sermons')}
									className='text-3xl'>
									Sermons
								</button>
							</div>

							{isAdmin && (
								<div className='flex flex-col space-y-4'>
									<div className='w-full flex justify-between border-b-1 pb-2 text-lg'>
										<span>Manage</span> <span className='italic text-tp'>(admin)</span>
									</div>
									<button
										onClick={() => handleCloseAndNavigate('/manage/users')}
										className='text-3xl'>
										Users
									</button>
								</div>
							)}
						</div>

						{/* Account + Logout */}
						{user && (
							<div className='flex justify-between items-center'>
								<button
									onClick={() => handleCloseAndNavigate('/manage/account')}
									className='flex items-center space-x-2 text-xl font-dm'>
									<FaUserCircle size={24} />
									<span>{user.username}</span>
								</button>
								<button
									onClick={handleLogoutClick}
									className='text-xl font-dm text-bkg'>
									Logout
								</button>
							</div>
						)}
					</>
				) : (
					<div className='w-full h-full flex items-center justify-center'>
						<Link
							href={`/`}
							onClick={() => setOpen(false)}
							className='font-dm text-bkg text-center text-3xl'>
							<span className='text-4xl'>E</span>
							<span className='text-2xl'>XIT TO </span>
							<span className='text-4xl'>H</span>
							<span className='text-2xl'>OME</span>
						</Link>
					</div>
				)}
			</div>
		</>
	);
}

export default MobileNavigation;
