import React, { useMemo, useState } from 'react';
import { useSermons } from '../contexts/SermonsContext';
import SermonMonthLabel from '../components/sermons/SermonMonthLabel';
import SermonItem from '../components/sermons/SermonItem';

function Sermons() {
	const { sermons } = useSermons();
	const [searchTerm, setSearchTerm] = useState('');
	const [sortAsc, setSortAsc] = useState(false); // false = newest first

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
		<div className='flex flex-col my-8'>
			<div className='flex flex-col space-y-4 items-center w-full page-l-wrapper px-4 py-4 md:py-10'>
				<div className='font-dm text-md w-full'>SERMONS</div>
				<div className='flex flex-col sm:flex-row space-x-4 items-start sm:items-center w-full'>
					<div className='bg-tp w-full sm:w-[300px] px-2 -skew-x-[30deg]'>
						<input
							type='text'
							placeholder='Search sermons...'
							className='px-2 font-dm w-full skew-x-[30deg] outline-none'
							value={searchTerm}
							onChange={(e) => setSearchTerm(e.target.value)}
						/>
					</div>
					<button
						className='px-4 py-1 rounded bg-slate-200 text-sm font-dm hover:bg-slate-300'
						onClick={() => setSortAsc((prev) => !prev)}>
						Sort: {sortAsc ? 'Oldest First' : 'Newest First'}
					</button>
				</div>
			</div>

			<div className='flex flex-col space-y-4 ml-auto max-w-[1400px] pl-4 w-full  min-h-[800px] '>
				{Object.entries(groupedByMonth).map(([month, sermons]) => (
					<div
						key={month}
						className='flex flex-col w-full space-y-2 '>
						<SermonMonthLabel text={`${month}`} />
						{sermons.map((sermon, index) => (
							<SermonItem
								sermon={sermon}
								key={sermon.id}
								index={index}
							/>
						))}
					</div>
				))}

				{filteredAndSortedSermons.length === 0 && (
					<p className='font-dm text-darkred text-sm italic'>No sermons found.</p>
				)}
			</div>
		</div>
	);
}

export default Sermons;
