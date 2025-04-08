import React from 'react';
import Logo from '../../assets/header-logo.svg?react';
import { useAuth } from '../../contexts/AuthContext';
import { Link } from 'react-router-dom';
import NavLink from './NavLink';

function Navigation() {
	const { isAuthenticated, logout } = useAuth();

	const links = [
		// { title: 'Home', to: '/sermons/' },
		// { title: 'Events', to: '/events/' },
		// { title: 'Sermons', to: '/sermons/' },
		{ title: 'Edit Pages', to: '/sermons/' },
		{ title: 'Maintenance', to: '/sermons/' },
		{ title: 'Settings', to: '/sermons/' },
		{ title: 'Manage', to: '/manage/account/' },
		{ title: 'Users', to: '/manage/users/' },
	];

	const handleLogoutClick = () => {
		const confirmed = window.confirm('Are you sure you want to log out?');
		if (confirmed) {
			logout();
		}
	};

	return (
		<div className={`relative w-full flex justify-around bg-red h-[60px] mb-20`}>
			<div className={`relative right-20`}>
				<Logo
					width={400}
					className={`relative -top-10`}
				/>
				<h3 className={`absolute -bottom-13 right-18 font-newb text-xl`}>Admin Dashboard</h3>
			</div>
			<div className={`flex text-start w-fit space-x-8 items-center`}>
				{isAuthenticated ? (
					<>
						{links.map((link, index) => (
							<NavLink
								key={index}
								link={link}
							/>
						))}

						<span
							onClick={handleLogoutClick}
							className={`font-dm text-bkg text-2xl cursor-pointer hover:underline`}>
							Logout
						</span>
					</>
				) : (
					<Link
						to={'http://localhost'}
						className={`font-dm text-bkg text-2xl cursor-pointer`}>
						Exit
					</Link>
				)}
			</div>
		</div>
	);
}

export default Navigation;
