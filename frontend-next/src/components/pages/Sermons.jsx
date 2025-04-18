'use client';
import React, { useMemo, useState, useEffect } from 'react';
import SermonMonthLabel from '@/components/sermons/SermonMonthLabel';
import SermonItem from '@/components/sermons/SermonItem';

import { IoFilter } from 'react-icons/io5';
import { useSermons } from '@/contexts/SermonsContext';

export default function Sermons() {
	const [searchTerm, setSearchTerm] = useState('');
	const [sortAsc, setSortAsc] = useState(false); // false = newest first
	const { sermons } = useSermons();

	const filteredAndSortedSermons = useMemo(() => {
		const search = searchTerm.trim().toLowerCase();
		const filtered = sermons.filter((sermon) => {
			if (!search) return true;
			return (
				sermon.title?.toLowerCase().includes(search) ||
				sermon.description?.toLowerCase().includes(search)
			);
		});

		return filtered.sort((a, b) => {
			const dateA = new Date(a.publishDate);
			const dateB = new Date(b.publishDate);
			return sortAsc ? dateA - dateB : dateB - dateA;
		});
	}, [sermons, searchTerm, sortAsc]);

	// Group sermons by month & year
	const groupedByMonth = useMemo(() => {
		const groups = {};

		filteredAndSortedSermons.forEach((sermon) => {
			const date = new Date(sermon.publishDate);
			const key = `${date.toLocaleString('default', { month: 'long' })} ${date.getFullYear()}`;
			if (!groups[key]) groups[key] = [];
			groups[key].push(sermon);
		});

		return groups;
	}, [filteredAndSortedSermons]);

	return (
		<div className='flex flex-col'>
			<div className='flex flex-col space-y-4 items-center w-full page-wrapper px-4 py-4 md:py-10'>
				<div className='font-dm text-lg text-darkred w-full'>SERMONS ({sermons.length})</div>
				<div className='flex flex-row items-center w-full gap-2 sm:gap-1 px-2'>
					{/* Search input wrapper */}
					<div className='bg-tp w-full sm:w-[300px] px-2 -skew-x-[30deg] h-[28px] flex items-center'>
						<input
							type='text'
							placeholder='Search sermons...'
							className='px-2 font-dm w-full h-full skew-x-[30deg] outline-none'
							value={searchTerm}
							onChange={(e) => setSearchTerm(e.target.value)}
						/>
					</div>

					{/* Sort button */}
					<div className='h-[28px] flex space-x-3 items-center'>
						<button
							className='bg-red clickable-l-skew px-2 h-full flex items-center text-bkg text-sm font-dm '
							onClick={() => setSortAsc((prev) => !prev)}>
							<div className='skew-r'>
								<IoFilter size={18} />
							</div>
						</button>
						<div className='hidden md:block font-dm text-sm'>
							{sortAsc ? 'Sort by: Oldest' : 'Sort by: Newest'}
						</div>
						<div className='block md:hidden font-dm text-sm'>{sortAsc ? 'Oldest' : 'Newest'}</div>
					</div>
				</div>
			</div>

			<div className='relative w-full overflow-x-hidden mt-8 md:mt-0'>
				<div className='flex flex-col space-y-4 mx-auto max-w-[1400px] pl-4 w-full  min-h-[800px]'>
					{Object.entries(groupedByMonth).length > 0 ? (
						Object.entries(groupedByMonth).map(([month, sermons]) => (
							<div
								key={month}
								className='flex flex-col w-full space-y-2 '>
								<div className={`w-fit flex h-[36px] `}>
									<SermonMonthLabel text={`${month}`} />
								</div>
								{sermons.map((sermon, index) => (
									<SermonItem
										sermon={sermon}
										key={sermon.id}
										index={index}
									/>
								))}
							</div>
						))
					) : (
						<div className={`italic text-darkred text-sm font-dm`}>No sermons found.</div>
					)}
				</div>

				{filteredAndSortedSermons.length === 0 && (
					<p className='font-dm text-darkred text-sm italic'>No sermons found.</p>
				)}
			</div>
		</div>
	);
}
