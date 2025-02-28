import React from 'react';
import { Link, useLocation } from 'react-router-dom';

function NavLink({ to, title }) {
	const location = useLocation();
	const isActive = location.pathname === to;

	return (
		<Link
			className={`${
				isActive ? 'border-darkred' : 'border-transparent'
			} border-r-4 bg-red px-2 py-1 w-[200px] text-center shadow-sm text-bkg font-dm`}
			to={to}>
			{title}
		</Link>
	);
}

export default NavLink;
