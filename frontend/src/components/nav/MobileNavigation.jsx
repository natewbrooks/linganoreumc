import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Logo from '../../assets/logos/logo-no-bkg-white.svg?react';

function MobileNavigation({ announcementBannerEnabled }) {
	const [open, setOpen] = useState(false);
	const [navHeight, setNavHeight] = useState(80);
	const navigate = useNavigate();

	const updateNavHeight = () => {
		const nav = document.getElementById('navigation');
		if (nav) {
			setNavHeight(nav.offsetHeight);
		}
	};

	useEffect(() => {
		updateNavHeight(); // Initial load and when announcement changes
	}, [announcementBannerEnabled]);

	useEffect(() => {
		window.addEventListener('resize', updateNavHeight);
		return () => window.removeEventListener('resize', updateNavHeight);
	}, []);

	const handleCloseAndNavigate = (path) => {
		setOpen(false);
		navigate(path);
	};

	const navLinks = [
		{ path: '/', label: 'HOME' },
		{ path: '/calendar/', label: 'CALENDAR' },
		{ path: '/events/', label: 'EVENTS' },
		{ path: '/sermons/', label: 'SERMONS' },
		{ path: '/', label: 'GIVE' },
	];

	return (
		<>
			{/* Header Bar */}
			<div className='relative w-full flex items-center justify-between px-4 bg-red border-y-4 border-bkg h-[80px]'>
				<Link to={`/`}>
					<Logo
						width={250}
						className='group- h-full select-none'
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
				style={{ height: `calc(100vh - ${navHeight}px)` }}
				className={`fixed bottom-0 left-0 w-screen -z-10 bg-darkred text-bkg transform ${
					open ? 'translate-x-0' : '-translate-x-full'
				} transition-transform duration-300 ease-in-out px-6 py-8 flex flex-col justify-between`}>
				{/* Nav Links */}
				<div className='flex flex-col space-y-8 text-center font-dm'>
					{navLinks.map((link, index) => (
						<Link
							to={link.path}
							onClick={() => handleCloseAndNavigate(link.path)}
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
