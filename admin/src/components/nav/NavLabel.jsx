import React from 'react';
import { Link } from 'react-router-dom';

function NavLabel({ title }) {
	return (
		<div className='bg-tp px-2 py-1 w-[250px] text-end font-dm'>
			<span>{title}</span>
		</div>
	);
}

export default NavLabel;
