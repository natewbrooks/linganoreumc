import React from 'react';
import SermonForm from './SermonForm';
import { Link } from 'react-router-dom';
import { FaArrowLeft } from 'react-icons/fa';

function CreateSermon() {
	return (
		<div className='flex flex-col w-full min-h-[800px]'>
			<div className='flex justify-between items-center mb-4'>
				<h1 className='text-2xl font-dm'>Create New Sermon</h1>
				<Link
					to='/sermons'
					className='bg-red text-bkg font-dm px-3 py-1 clickable-r-skew'>
					<div className='flex items-center space-x-1 skew-l'>
						<FaArrowLeft size={16} />
						<div>Cancel</div>
					</div>
				</Link>
			</div>

			<SermonForm mode='create' />
		</div>
	);
}

export default CreateSermon;
