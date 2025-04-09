import React from 'react';
import { Link, useLocation } from 'react-router-dom';

function NavLink({ link }) {
	const location = useLocation();
	const isActive = location.pathname === link.to;

	return (
		<Link
			to={link.to}
			className={`font-dm text-bkg ${isActive ? 'underline underline-offset-4' : ''}`}>
			{link.title}
		</Link>
	);
}

export default NavLink;
