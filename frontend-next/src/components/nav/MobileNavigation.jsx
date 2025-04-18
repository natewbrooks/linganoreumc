'use client';
import React, { useState, useEffect } from 'react';
import Link from 'next/link';

function MobileNavigation({ announcementBannerEnabled }) {
	const [open, setOpen] = useState(false);
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
	];

	return (
		<>
			{/* Header Bar */}
			<div
				id='navigation'
				className='relative w-full flex items-center justify-between px-4 bg-red border-y-4 border-bkg h-[80px]'>
				<Link href='/'>
					<img
						rel='preload'
						as='image'
						src={logo}
						alt='Linganore Logo'
						width={250}
						className='h-full select-none'
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
				style={{ height: `${visibleHeight - navHeight}px` }}
				className={`fixed bottom-0 left-0 w-screen -z-10 bg-darkred text-bkg transform ${
					open ? 'translate-x-0' : '-translate-x-full'
				} transition-transform duration-300 ease-in-out px-6 py-8 flex flex-col justify-between`}>
				<div className='flex flex-col space-y-8 text-center font-dm'>
					{navLinks.map((link, index) => (
						<Link
							href={link.path}
							onClick={() => handleClose()}
							className='text-3xl font-dm'
							key={index}>
							{link.label}
						</Link>
					))}
				</div>
			</div>
		</>
	);
}

export default MobileNavigation;
