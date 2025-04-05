import React, { useState } from 'react';
import { useSermons } from '../../contexts/SermonsContext';
import { FaPlus, FaArchive } from 'react-icons/fa';
import { FaTrashCan } from 'react-icons/fa6';
import { Link } from 'react-router-dom';
import SearchAndFilter from '../ui/SearchAndFilter';
import SermonItem from './SermonItem';

function ListSermons() {
	const { sermons, deleteSermon, updateSermon, loading, error } = useSermons();
	const [filter, setFilter] = useState('all');
	const [searchTerm, setSearchTerm] = useState('');
	const [selectedSermons, setSelectedSermons] = useState([]);
	const [deleting, setDeleting] = useState(false);
	const [archiving, setArchiving] = useState(false);

	const filterOptions = ['all', 'recent', 'archived'];

	if (loading) return <div>Loading sermons...</div>;
	if (error) return <div>Error: {error}</div>;

	const handleDeleteSelectedSermons = async () => {
		if (selectedSermons.length === 0 || deleting) return;

		if (!window.confirm('Are you sure you want to permanently delete the selected sermons?'))
			return;

		setDeleting(true);
		try {
			for (const sermonID of selectedSermons) {
				await deleteSermon(sermonID);
			}
			alert(`Deleted ${selectedSermons.length} sermon(s).`);
			setSelectedSermons([]);
		} catch (err) {
			console.error('Error deleting sermons:', err);
		} finally {
			setDeleting(false);
		}
	};

	const handleArchiveSelectedSermons = async () => {
		if (selectedSermons.length === 0) return;

		setArchiving(true);
		const isUnarchiving = filter === 'archived';

		for (const sermonID of selectedSermons) {
			const sermon = sermons.find((s) => s.id === sermonID);
			if (!sermon) continue;

			await updateSermon(sermonID, {
				...sermon,
				isArchived: !isUnarchiving,
			});
		}

		setSelectedSermons([]);
		setArchiving(false);
	};

	const filteredSermons = sermons.filter((sermon) => {
		// Explicitly exclude archived sermons unless the filter is 'archived'
		if (filter !== 'archived' && sermon.isArchived) return false;

		const matchesFilter =
			filter === 'all' || (filter === 'archived' && sermon.isArchived) || filter === 'recent'; // recent includes all unarchived, already filtered above

		const matchesSearch =
			sermon.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
			sermon.description.toLowerCase().includes(searchTerm.toLowerCase());

		return matchesFilter && matchesSearch;
	});

	return (
		<div className='flex flex-col space-y-4'>
			{/* Header */}
			<div className='flex flex-row items-center justify-between'>
				<div className='flex flex-col'>
					<div className='font-dm text-2xl'>
						{filter.charAt(0).toUpperCase() + filter.slice(1)} Sermons ({filteredSermons.length})
					</div>
					<div className='font-dm text-md'>Select a sermon to edit</div>
				</div>
			</div>

			{/* Filters + Actions */}
			<div className='flex flex-row justify-between'>
				<SearchAndFilter
					filter={filter}
					setFilter={setFilter}
					searchTerm={searchTerm}
					setSearchTerm={setSearchTerm}
					filterOptions={filterOptions}
				/>

				<div className='flex space-x-1 items-center h-[32px]'>
					<div
						onClick={handleDeleteSelectedSermons}
						className={`${
							selectedSermons.length > 0 && !deleting
								? 'bg-red text-bkg cursor-pointer hover:scale-[102%] hover:opacity-50 active:scale-[100%]'
								: 'text-darkred/50 bg-bkg-tp cursor-not-allowed'
						} transition font-dm text-md h-full text-center w-fit px-3 py-1 skew-x-[30deg]`}>
						<div className='flex space-x-1 h-full -skew-x-[30deg] items-center'>
							<FaTrashCan size={16} />
						</div>
					</div>
					<div
						onClick={handleArchiveSelectedSermons}
						className={`${
							selectedSermons.length > 0 && !archiving
								? 'bg-red text-bkg cursor-pointer hover:scale-[102%] hover:opacity-50 active:scale-[100%]'
								: 'text-darkred/50 bg-bkg-tp cursor-not-allowed'
						} transition font-dm text-md h-full text-center w-fit px-3 py-1 skew-x-[30deg]`}>
						<div className='flex space-x-1 h-full -skew-x-[30deg] items-center'>
							<FaArchive size={16} />
						</div>
					</div>
					<Link
						to={'/new/sermon/'}
						className='cursor-pointer hover:scale-[102%] hover:opacity-50 active:scale-[100%] font-dm text-bkg text-md text-end h-full w-fit bg-red px-3 py-1 skew-x-[30deg]'>
						<div className='flex space-x-1 -skew-x-[30deg] items-center'>
							<FaPlus size={16} />
							<div>Add Sermon</div>
						</div>
					</Link>
				</div>
			</div>

			{/* Sermon List */}
			<div className='my-2 flex flex-col space-y-4 px-8 min-h-[800px]'>
				{filteredSermons.length > 0 ? (
					filteredSermons.map((sermon) => (
						<div
							key={sermon.id}
							className='flex relative items-center justify-center'>
							<input
								className='absolute -left-8'
								type='checkbox'
								checked={selectedSermons.includes(sermon.id)}
								onChange={(e) => {
									setSelectedSermons((prevSelected) =>
										e.target.checked
											? [...prevSelected, sermon.id]
											: prevSelected.filter((id) => id !== sermon.id)
									);
								}}
							/>
							<SermonItem sermon={sermon} />
						</div>
					))
				) : (
					<div className='w-full flex justify-center items-center'>
						<span className='italic font-dm text-darkred'>No {filter} sermons.</span>
					</div>
				)}
			</div>
		</div>
	);
}

export default ListSermons;
