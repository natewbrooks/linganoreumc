import React, { useState } from 'react';
import { useSermons } from '../../contexts/SermonsContext';
import { FaPlus } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import SearchAndFilter from '../ui/SearchAndFilter';
import SermonItem from './SermonItem';

function ListSermons() {
	const { sermons, loading } = useSermons();
	const [filter, setFilter] = useState('all');
	const [searchTerm, setSearchTerm] = useState('');
	const filterOptions = ['all', 'recent', 'archived'];

	if (loading) return <div>Loading sermons...</div>;

	const filteredSermons = sermons
		.filter((sermon) => {
			const matchesFilter =
				filter === 'all' || (filter === 'archived' && sermon.isArchived) || filter === 'recent'; // Include all for recent, will sort later

			const matchesSearch =
				sermon.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
				sermon.description.toLowerCase().includes(searchTerm.toLowerCase());

			return matchesFilter && matchesSearch;
		})
		.sort((a, b) => {
			if (filter === 'recent') {
				return new Date(b.lastEditDate) - new Date(a.lastEditDate);
			}
			return 0;
		});

	return (
		<div className='flex flex-col space-y-4'>
			<div className='flex flex-row items-center justify-between'>
				<div className='flex flex-col'>
					<div className='font-dm text-2xl'>
						{filter.charAt(0).toUpperCase() + filter.slice(1)} Sermons ({filteredSermons.length})
					</div>
					<div className='font-dm text-md'>Select a sermon to edit</div>
				</div>
			</div>

			<div className={`flex flex-row justify-between`}>
				<SearchAndFilter
					filter={filter}
					setFilter={setFilter}
					searchTerm={searchTerm}
					setSearchTerm={setSearchTerm}
					filterOptions={filterOptions}
				/>

				<div className='flex items-center'>
					<Link
						to={'/new/sermon/'}
						className='font-dm text-bkg text-md text-end w-fit bg-red px-3 py-1 -skew-x-[30deg]'>
						<div className='flex space-x-1 skew-x-[30deg] items-center'>
							<FaPlus size={16} />
							<div>Add Sermon</div>
						</div>
					</Link>
				</div>
			</div>

			<div className='my-2 flex flex-col space-y-4 px-8 min-h-[800px]'>
				{filteredSermons.length > 0 ? (
					filteredSermons.map((sermon) => (
						<SermonItem
							key={sermon.id}
							sermon={sermon}
						/>
					))
				) : (
					<div className={`w-full flex justify-center items-center`}>
						<span className={`italic font-dm text-darkred`}>No {filter} sermons.</span>
					</div>
				)}
			</div>
		</div>
	);
}

export default ListSermons;
