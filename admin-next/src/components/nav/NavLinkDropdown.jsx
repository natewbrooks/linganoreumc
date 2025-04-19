'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

function NavLinkDropdown({ title, links, isActive, onHover, doUnderline }) {
	const pathname = usePathname();

	const isAnyChildActive = links.some((link) => pathname.startsWith(link.to));

	const handleClick = (e, link) => {
		if (link.onClick) {
			e.preventDefault();
			link.onClick(e);
		}
	};

	return (
		<div
			onMouseEnter={onHover}
			className='group relative cursor-pointer font-dm text-bkg h-full flex justify-center text-center w-[100px] items-center'>
			<div
				className={`px-2 ${
					isAnyChildActive ? (doUnderline ? 'underline underline-offset-8' : '') : ''
				}`}>
				{typeof title === 'string' ? (
					<>
						<span className='text-xl group-hover:opacity-50 group-hover:scale-[1.02] group-active:scale-[1]'>
							{title[0]}
						</span>
						<span className='text-lg group-hover:opacity-50 group-hover:scale-[1.02] group-active:scale-[1]'>
							{title.slice(1).toUpperCase()}
						</span>
					</>
				) : (
					<span className='text-xl group-hover:opacity-50 group-hover:scale-[1.02] group-active:scale-[1]'>
						{title}
					</span>
				)}
			</div>

			<div
				className={`${
					isActive ? 'translate-y-full' : 'translate-y-0'
				} -z-10 absolute bottom-0 -left-10 bg-darkred text-bkg p-2 skew-x-[10deg] shadow transition-all duration-300 transform w-fit min-w-[200px] px-8`}>
				<div className='flex flex-col w-full items-center -skew-x-[10deg]'>
					{links.map((link, index) =>
						link.onClick ? (
							<a
								key={index}
								href={link.to}
								onClick={(e) => handleClick(e, link)}
								className='hover:underline underline-offset-4 hover:text-white transition text-lg whitespace-nowrap cursor-pointer'>
								{link.title}
							</a>
						) : (
							<Link
								key={index}
								href={link.to}
								className='hover:underline underline-offset-4 hover:text-white transition text-lg whitespace-nowrap cursor-pointer'>
								{link.title}
							</Link>
						)
					)}
				</div>
			</div>
		</div>
	);
}

export default NavLinkDropdown;
