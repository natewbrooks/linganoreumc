import React from 'react';
import Link from 'next/link';

/** Friendly empty/404 block. `links` are `{ href, label }`, the first is the primary red button. `children` adds custom buttons */
export default function NotFound({ title, text, links = [], children }) {
	return (
		<div className='flex flex-col items-center text-center font-dm px-6 pt-10 pb-20 gap-6'>
			<img
				src='/assets/logos/cross-flame.svg'
				alt=''
				width={55}
				height={100}
			/>
			<h1 className='text-[clamp(20px,7vw,30px)] whitespace-nowrap text-darkred'>{title}</h1>
			<p className='text-lg text-dark max-w-[480px]'>{text}</p>
			<div className='flex flex-col sm:flex-row gap-4 mt-2'>
				{links.map((link, i) => (
					<Link
						key={link.href}
						href={link.href}
						className={`${
							i === 0 ? 'bg-red text-bkg' : 'bg-tp text-darkred'
						} text-lg px-8 py-3 -skew-x-[30deg] clickable`}>
						<div className='skew-x-[30deg]'>{link.label}</div>
					</Link>
				))}
				{children}
			</div>
		</div>
	);
}

/** Empty section message styled like an `EventItem` description row */
export const EmptyRow = ({ text }) => (
	<div className='relative w-full font-dm'>
		<div className='hidden sm:block absolute bg-tp w-screen h-full' />
		<div className='relative -ml-1 -mr-3 sm:mx-0 px-4 py-1 sm:p-2 bg-tp sm:bg-transparent text-darkred text-sm sm:text-lg skew-x-[30deg] sm:skew-x-0'>
			<p className='-skew-x-[30deg] sm:skew-x-0'>{text}</p>
		</div>
	</div>
);

/** Red parallelogram button that clears a search */
export const ClearSearch = ({ onClick }) => (
	<button
		onClick={onClick}
		className='bg-red text-bkg font-dm text-lg px-8 py-3 -skew-x-[30deg] clickable'>
		<div className='skew-x-[30deg]'>Clear Search</div>
	</button>
);
