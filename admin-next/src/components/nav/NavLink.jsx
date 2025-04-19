'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

function NavLink({ link, onHover }) {
	const pathname = usePathname();
	const isActive = pathname === link.to;

	return (
		<Link
			href={link.to}
			onMouseEnter={onHover}
			className={`group font-dm w-[100px] text-bkg h-full px-2 text-center items-center flex bg-red ${
				isActive ? 'underline underline-offset-4' : ''
			}`}>
			<div className='w-full'>
				<span className='text-xl group-hover:opacity-50 group-hover:scale-[1.02] group-active:scale-[1]'>
					{link.title[0]}
				</span>
				<span className='text-lg group-hover:opacity-50 group-hover:scale-[1.02] group-active:scale-[1]'>
					{link.title.slice(1).toUpperCase()}
				</span>
			</div>
		</Link>
	);
}

export default NavLink;
