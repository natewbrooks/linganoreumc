import React from 'react';

export default function Filter({ filter, setFilter, filterOptions }) {
	return (
		<div className={`transition flex text-sm w-full bg-bkg-tp py-1 md:skew-l overflow-x-auto`}>
			<div className={`flex space-x-4 md:skew-r px-4 font-dm`}>
				{/* <div className={` text-darkred`}>Filters:</div> */}
				<div className={`flex space-x-1`}>
					{filterOptions.map((option) => (
						<div
							key={option}
							onClick={() => setFilter(option)}
							className={`md:clickable-l-skew transition ${
								filter === option ? 'bg-red text-bkg-tp' : 'bg-bkg-tp text-darkred/50'
							} w-full px-2 b`}>
							<div className={`md:skew-x-[30deg]`}>
								{option.charAt(0).toUpperCase() + option.slice(1)}
							</div>
						</div>
					))}
				</div>
			</div>
		</div>
	);
}
