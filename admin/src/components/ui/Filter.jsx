import React from 'react';

export default function Filter({ filter, setFilter, filterOptions }) {
	return (
		<div className='relative w-full'>
			{/* Skewed background shape, behind text */}

			{/* Scrollable filter options (not skewed for clarity) */}
			<div className='relative z-10 overflow-x-auto whitespace-nowrap px-4'>
				<div className='flex font-dm text-sm space-x-2'>
					{filterOptions.map((option) => (
						<div
							key={option}
							onClick={() => setFilter(option)}
							className={`clickable-l-skew transition px-3 py-1 ${
								filter === option ? 'bg-red text-bkg-tp' : 'text-darkred/50'
							}`}>
							<div className='skew-r'>{option.charAt(0).toUpperCase() + option.slice(1)}</div>
						</div>
					))}
				</div>
			</div>
		</div>
	);
}
