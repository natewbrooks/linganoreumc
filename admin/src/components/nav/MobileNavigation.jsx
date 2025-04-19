import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Logo from '../../assets/logos/logo-no-bkg-white.svg?react';
import { useAuth } from '../../contexts/AuthContext';
import { FaUserCircle } from 'react-icons/fa';

function MobileNavigation() {
	const [open, setOpen] = useState(false);
	const { isAuthenticated, logout, user } = useAuth();
	const navigate = useNavigate();

	const isAdmin = user?.role === 'admin';

	const handleLogoutClick = () => {
		const confirmed = window.confirm('Are you sure you want to log out?');
		if (confirmed) {
			setOpen(false);
			logout();
		}
	};

	const handleCloseAndNavigate = (path) => {
		setOpen(false);
		navigate(path);
	};

	return (
		<>
			{/* Header Bar */}
			<div className='relative w-full flex items-center justify-between px-4 bg-red border-b-4 border-bkg h-[80px]'>
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

				{/* Slide-out Fullscreen Nav */}
				{/* Slide-out Fullscreen Nav */}
				<div
					className={`fixed bottom-0 left-0 h-[calc(100vh-80px)] w-screen -z-10 bg-darkred text-bkg transform ${
						open ? 'translate-x-0' : '-translate-x-full'
					} transition-transform duration-300 ease-in-out px-6 py-8 flex flex-col justify-between`}>
					{/* If logged in, show nav sections */}
					{isAuthenticated ? (
						<>
							<div className='flex flex-col space-y-8 text-center font-dm'>
								<div className={`flex flex-col space-y-4`}>
									<div className={`w-full text-left border-b-1 pb-2 text-lg`}>Maintenance</div>
									<Link
										to='/events'
										onClick={() => handleCloseAndNavigate('/events')}
										className='text-3xl font-dm'>
										Events
									</Link>
									<Link
										to='/sermons'
										onClick={() => handleCloseAndNavigate('/sermons')}
										className='text-3xl font-dm'>
										Sermons
									</Link>
								</div>

								<div className={`flex flex-col space-y-4`}>
									<div className={`w-full text-left border-b-1 pb-2 text-lg`}>Settings</div>
									<Link
										to='/settings/general'
										onClick={() => handleCloseAndNavigate('/settings/general')}
										className='text-3xl font-dm block'>
										General
									</Link>
									<Link
										to='/settings/home'
										onClick={() => handleCloseAndNavigate('/settings/home')}
										className='text-3xl font-dm block'>
										Home
									</Link>
								</div>

								{isAdmin && (
									<div className={`flex flex-col space-y-4`}>
										<div className={`w-full flex justify-between border-b-1 pb-2 text-lg`}>
											<span>Manage</span> <span className={`italic`}>(admin)</span>
										</div>
										<Link
											to='/manage/users'
											onClick={() => handleCloseAndNavigate('/manage/users')}
											className='text-3xl font-dm block'>
											Users
										</Link>
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
						// Not logged in → show only Exit to Home
						<div className='w-full h-full flex items-center justify-center'>
							<Link
								to={`/`}
								onClick={() => setOpen(false)}
								className='font-dm text-bkg text-center text-3xl'>
								<span className={`text-4xl`}>E</span>
								<span className={`text-2xl`}>XIT TO </span>
								<span className={`text-4xl`}>H</span>
								<span className={`text-2xl`}>OME</span>
							</Link>
						</div>
					)}
				</div>
			</div>
		</>
	);
}

export default MobileNavigation;
