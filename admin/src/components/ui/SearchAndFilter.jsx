import React from 'react';

export default function SearchAndFilter({
	filter,
	setFilter,
	searchTerm,
	setSearchTerm,
	filterOptions,
}) {
	return (
		<div className={`flex flex-col font-dm`}>
			<div className={`grid grid-cols-3 gap-1 text-xs w-full text-center mb-1 space-x-1`}>
				{filterOptions.map((option) => (
					<div
						key={option}
						onClick={() => setFilter(option)}
						className={`-skew-x-[30deg] ${
							filter === option ? 'bg-red text-bkg' : 'bg-tp text-black/50'
						} w-full px-2 cursor-pointer`}>
						<div className={`skew-x-[30deg]`}>
							{option.charAt(0).toUpperCase() + option.slice(1)}
						</div>
					</div>
				))}
			</div>

			<div className={`flex space-x-1 items-center  border-l-4 border-red bg-tp skew-x-[30deg]`}>
				<input
					value={searchTerm}
					onChange={(e) => setSearchTerm(e.target.value)}
					className={`font-dm px-4 outline-0 text-black text-md w-full -skew-x-[30deg]`}
					placeholder='Search'
				/>
			</div>
		</div>
	);
}
