import React from 'react';
import NavLink from './NavLink';
import NavLabel from './NavLabel';
import { FaPlusCircle, FaGrinTongueWink, FaGrinBeamSweat, FaArchive } from 'react-icons/fa';

function Navigation() {
	const links = [
		{
			to: '/events/',
			title: 'Events',
			subLinks: [{ to: '/new/event/', title: 'New Event', icon: FaPlusCircle }],
		},
		{
			to: '/sermons/',
			title: 'Sermons',
			subLinks: [{ to: '/new/sermon/', title: 'New Sermon', icon: FaPlusCircle }],
		},
	];

	return (
		<nav className={`h-full flex-col text-md hidden sm:flex `}>
			<NavLabel title={'Settings'} />
			<div className={`flex flex-col space-y-1 relative -left-3 text-end`}>
				<NavLink
					to={'/'}
					title={'General'}
				/>
			</div>

			<NavLabel title={'Pages'} />
			<div className={`flex flex-col space-y-1 relative -left-3 text-end`}>
				<NavLink
					to={'/edit/pages/home/'}
					title={'Home'}
				/>{' '}
			</div>

			<NavLabel title={'Maintenance'} />
			<div className={`flex flex-col space-y-1 relative -left-3 text-end`}>
				{links.map((link, index) => (
					<NavLink
						key={link.title + link.index}
						to={link.to}
						title={link.title}
						subLinks={link.subLinks}
					/>
				))}
			</div>
		</nav>
	);
}

export default Navigation;
