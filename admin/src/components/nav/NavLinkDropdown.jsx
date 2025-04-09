import React from 'react';
import { Link, useNavigate } from 'react-router-dom';

function NavLinkDropdown({ title, links, isActive, onHover }) {
	const navigate = useNavigate();

	const handleClick = (e, link) => {
		if (link.onClick) {
			e.preventDefault();
			link.onClick();
		} else {
			navigate(link.to);
		}
	};

	return (
		<div
			onMouseEnter={onHover}
			className='relative font-dm text-bkg cursor-pointer w-fit'>
			<div className={`${isActive ? 'underline underline-offset-8' : ''}`}>{title}</div>

			{isActive && (
				<div className='absolute left-0 mt-2 bg-red text-bkg p-2 skew-x-[10deg] shadow transition-all duration-200 transform z-20 w-max min-w-[200px] px-8'>
					<div className='flex flex-col w-full items-center -skew-x-[10deg]'>
						{links.map((link, index) => (
							<Link
								key={index}
								to={link.to}
								onClick={(e) => handleClick(e, link)}
								className='hover:underline underline-offset-4 hover:text-white transition text-lg whitespace-nowrap'>
								{link.title}
							</Link>
						))}
					</div>
				</div>
			)}
		</div>
	);
}

export default NavLinkDropdown;
