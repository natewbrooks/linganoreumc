import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import ParallelogramBG from '../ParallelogramBG';

function NavLink({ to, title }) {
	const location = useLocation();
	const isActive = location.pathname === to;

	return (
		<Link
			to={to}
			className={``}>
			<ParallelogramBG
				text={title}
				textSize={18}
				width={200}
			/>
		</Link>
	);
}

export default NavLink;
