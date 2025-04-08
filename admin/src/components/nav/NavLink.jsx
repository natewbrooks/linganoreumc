import React from 'react';
import { Link, useLocation } from 'react-router-dom';

function NavLink({ link }) {
	const location = useLocation();
	const isActive = location.pathname === link.to;

	return (
		<Link
			to={link.to}
			className={`font-dm text-bkg text-2xl ${isActive ? 'bg-blue-500' : ''}`}>
			{link.title}
		</Link>
	);
}

export default NavLink;
