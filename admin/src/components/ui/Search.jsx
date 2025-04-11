import React from 'react';

export default function Search({ searchTerm, setSearchTerm }) {
	return (
		<div className={`relative flex flex-col space-y-1 items-center justify-center h-full font-dm`}>
			<div className={`flex h-full space-x-1 items-center justify-center `}>
				<div className={`flex space-x-1 items-center  bg-bkg-tp skew-r`}>
					<input
						value={searchTerm}
						onChange={(e) => setSearchTerm(e.target.value)}
						className={`font-dm px-4 h-[32px] outline-0 text-black text-md w-full skew-l`}
						placeholder='Search'
					/>
				</div>
			</div>
			{/* <div
				className={`${
					showFilters ? 'translate-y-0' : '-translate-y-[1%]'
				} -z-10 transition flex text-xs w-[80%] items-center justify-center text-center mb-1 space-x-1`}>
				{filterOptions.map((option) => (
					<div
						key={option}
						onClick={() => setFilter(option)}
						className={`-skew-x-[30deg] ${
							filter === option ? 'bg-red text-bkg' : 'bg-bkg-tp text-black/50'
						} w-full px-2 clickable`}>
						<div className={`skew-x-[30deg]`}>
							{option.charAt(0).toUpperCase() + option.slice(1)}
						</div>
					</div>
				))}
			</div> */}
		</div>
	);
}
