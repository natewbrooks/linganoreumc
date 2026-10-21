'use client';
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { isActivePath } from './Navigation';

function MobileNavigation({ announcementBannerEnabled }) {
	const [open, setOpen] = useState(false);
	const pathname = usePathname();
	// Set on tap so the underline is right before the route finishes loading
	const [activePath, setActivePath] = useState(pathname);

	useEffect(() => {
		setActivePath(pathname);
	}, [pathname]);
	const [navHeight, setNavHeight] = useState(80);
	const [visibleHeight, setVisibleHeight] = useState(0);

	const logo = '/assets/logos/logo-no-bkg-white.svg';

	const updateNavHeight = () => {
		const nav = document.getElementById('navigation');
		const banner = document.getElementById('announcementBanner');

		const navHeight = nav?.offsetHeight || 0;
		const bannerHeight = banner?.offsetHeight || 0;

		setNavHeight(navHeight + bannerHeight);

		// Get visible viewport height (accounts for open search bar or keyboard)
		const vHeight = window.visualViewport?.height || window.innerHeight;
		setVisibleHeight(vHeight);
	};

	useEffect(() => {
		updateNavHeight();
	}, []);

	useEffect(() => {
		updateNavHeight();
	}, [announcementBannerEnabled]);

	useEffect(() => {
		window.addEventListener('resize', updateNavHeight);
		window.visualViewport?.addEventListener('resize', updateNavHeight);
		window.visualViewport?.addEventListener('scroll', updateNavHeight);

		return () => {
			window.removeEventListener('resize', updateNavHeight);
			window.visualViewport?.removeEventListener('resize', updateNavHeight);
			window.visualViewport?.removeEventListener('scroll', updateNavHeight);
		};
	}, []);

	const handleClose = () => {
		setOpen(false);
	};

	const navLinks = [
		{ path: '/', label: 'HOME' },
		{ path: '/calendar/', label: 'CALENDAR' },
		{ path: '/events/', label: 'EVENTS' },
		{ path: '/sermons/', label: 'SERMONS' },
		{ path: '/give/', label: 'GIVE' },
	];

	return (
		<>
			{/* Header Bar */}
			<div
				id='navigation'
				className='relative w-full flex items-center justify-between px-4 bg-red border-y-2 border-bkg h-[80px]'>
				<Link href='/'>
					<img
						src={logo}
						alt='Linganore Logo'
						width={225}
						height={55}
						className='select-none text-transparent'
					/>
				</Link>
				<div
					onClick={() => setOpen(!open)}
					className='flex flex-col text-md justify-center items-center space-y-1.5 h-[16px] w-[20px] box-content p-2 -m-2 cursor-pointer'>
					{/* Open: skew drops so the X arms are symmetric, middle bar collapses to its center */}
					<div
						className={`${
							open ? 'rotate-45 translate-y-[8px]' : 'skew-x-[30deg]'
						} duration-300 transition-all w-full bg-bkg py-0.25`}
					/>
					<div
						className={`${
							open ? 'scale-x-0' : '-skew-x-[30deg]'
						} duration-200 transition-all w-full bg-bkg py-0.25`}
					/>
					<div
						className={`${
							open ? '-rotate-45 -translate-y-[8px]' : 'skew-x-[30deg]'
						} duration-300 transition-all w-full bg-bkg py-0.25`}
					/>
				</div>
			</div>

			{/* Slide-out Fullscreen Nav */}
			<div
				style={{ height: `${visibleHeight - navHeight}px` }}
				className={`fixed bottom-0 left-0 w-screen -z-10 bg-bkg text-darkred transform ${
					open ? 'translate-x-0' : '-translate-x-full'
				} transition-transform duration-300 ease-in-out px-6 py-8 flex flex-col justify-between`}>
				<div className='flex flex-col space-y-8 text-center font-dm'>
					{navLinks.map((link, index) => (
						<Link
							href={link.path}
							onClick={() => {
								setActivePath(link.path);
								handleClose();
							}}
							className={`font-dm clickable ${
								isActivePath(activePath, link.path) ? 'underline underline-offset-4 decoration-2' : ''
							}`}
							key={index}>
							{/* Larger first letter, matching the desktop nav */}
							<span className='text-2xl'>{link.label[0]}</span>
							<span className='text-xl'>{link.label.slice(1)}</span>
						</Link>
					))}
				</div>
			</div>
		</>
	);
}

export default MobileNavigation;
