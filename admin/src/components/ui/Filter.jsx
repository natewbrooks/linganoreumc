import React from 'react';

export default function Filter({ filter, setFilter, filterOptions }) {
	return (
		// Outer wrapper handles overflow but has no transform
		<div className='w-full overflow-x-auto md:px-2 flex '>
			{/* Inner retains your skew and all styling */}
			<div className={`transition flex text-sm w-full bg-bkg-tp skew-l will-change-transform`}>
				<div className={`flex space-x-4 skew-r px-4 md:px-0 font-dm`}>
					{/* <div className={` text-darkred`}>Filters:</div> */}
					<div className={`flex`}>
						{filterOptions.map((option) => (
							<div
								key={option}
								onClick={() => setFilter(option)}
								className={`clickable-l-skew transition py-1 ${
									filter === option ? 'bg-red text-bkg-tp' : 'bg-bkg-tp text-darkred/50'
								} w-full px-3`}>
								<div className={`skew-x-[30deg]`}>
									{option.charAt(0).toUpperCase() + option.slice(1)}
								</div>
							</div>
						))}
					</div>
				</div>
			</div>
		</div>
	);
}
