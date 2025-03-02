import React from 'react';
import NavLink from './NavLink';
import NavLabel from './NavLabel';

function Navigation() {
	const links = [
		{ to: '/edit/home', title: 'Home' },
		{ to: '/edit/events', title: 'Events' },
		{ to: '/', title: 'Sermons' },
	];

	return (
		<nav className='h-full w-[400px] flex flex-col space-y-1'>
			<NavLabel title={'Settings'} />
			<NavLink
				to={'/'}
				title={'General'}
			/>
			<NavLabel title={'Pages'} />
			{links.map((link, index) => (
				<NavLink
					key={index}
					to={link.to}
					title={link.title}
				/>
			))}
		</nav>
	);
}

export default Navigation;
