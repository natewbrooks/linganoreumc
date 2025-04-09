import React, { useState } from 'react';
import Logo from '../../assets/header-logo.svg?react';
import { useAuth } from '../../contexts/AuthContext';
import { Link } from 'react-router-dom';
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

	const isAdmin = user?.role === 'admin'; // Customize this based on your auth system

	const manageLinks = isAdmin ? [{ title: 'Users', to: '/manage/users/' }] : [];

	const settingsLinks = [
		{ title: 'General', to: '/settings/general/' },
		{ title: 'Home', to: '/settings/home/' },
	];

	const accountLinks = [
		{
			title: 'Logout',
			to: '#',
			onClick: handleLogoutClick,
		},
	];

	return (
		<div
			className='relative w-full flex justify-around bg-red h-[60px] mb-20'
			onMouseLeave={() => setActiveDropdown(null)}>
			{/* Logo */}
			<div className='relative right-20'>
				<Logo
					width={400}
					className='relative -top-10'
				/>
				<h3 className='absolute -bottom-13 right-18 font-newb text-xl'>Admin Dashboard</h3>
			</div>

			{/* Links */}
			<div className='flex text-start w-fit space-x-6 items-center text-xl'>
				{isAuthenticated ? (
					<>
						<NavLink link={{ title: 'Events', to: '/events/' }} />
						<NavLink link={{ title: 'Sermons', to: '/sermons/' }} />
						{isAdmin && (
							<NavLinkDropdown
								title='Manage'
								links={manageLinks}
								isActive={activeDropdown === 'Manage'}
								onHover={() => setActiveDropdown('Manage')}
							/>
						)}
						<NavLinkDropdown
							title='Settings'
							links={settingsLinks}
							isActive={activeDropdown === 'Settings'}
							onHover={() => setActiveDropdown('Settings')}
						/>
						<span className={`text-darkred`}>|</span>

						<NavLinkDropdown
							title={
								<div className='flex items-center space-x-2'>
									<FaUserCircle />
									<span>{user.username}</span>
								</div>
							}
							links={[{ title: 'Account', to: '/manage/account/' }, ...accountLinks]}
							isActive={activeDropdown === 'Account'}
							onHover={() => setActiveDropdown('Account')}
						/>
					</>
				) : (
					<Link
						to='http://localhost'
						className='font-dm text-bkg text-2xl cursor-pointer'>
						Exit
					</Link>
				)}
			</div>
		</div>
	);
}

export default Navigation;
