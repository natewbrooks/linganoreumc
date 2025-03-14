import React from 'react';
import { Link } from 'react-router-dom';

function NavLabel({ title }) {
	return (
		<div className='px-2 py-1 w-[200px] text-left font-newb'>
			<span>{title}</span>
		</div>
	);
}

export default NavLabel;
