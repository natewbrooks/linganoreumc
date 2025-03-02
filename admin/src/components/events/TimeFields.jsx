import React from 'react';
import { FaPlus, FaTrash } from 'react-icons/fa';

function TimeFields({ times, setTimes }) {
	const handleTimeChange = (index, value) => {
		const newTimes = [...times];
		newTimes[index] = value;
		setTimes(newTimes);
	};

	const addTimeField = () => {
		setTimes([...times, '']);
	};

	const removeTimeField = (index) => {
		setTimes(times.filter((_, i) => i !== index));
	};

	return (
		<div className='flex flex-col space-y-1'>
			{times.map((timeValue, index) => (
				<div
					className='relative flex w-full items-center'
					key={index}>
					<input
						className='w-full bg-tp px-2 py-1 outline-none'
						type='time'
						value={timeValue}
						onChange={(e) => handleTimeChange(index, e.target.value)}
					/>
					{index === 0 ? (
						// Plus icon for the first time field
						<div
							className='absolute -right-8 bg-red p-1 w-fit cursor-pointer'
							onClick={addTimeField}>
							<FaPlus className='text-bkg' />
						</div>
					) : (
						// Trash icon for additional time fields
						<div
							className='absolute -right-8 bg-red p-1 w-fit cursor-pointer'
							onClick={() => removeTimeField(index)}>
							<FaTrash className='text-bkg' />
						</div>
					)}
				</div>
			))}
		</div>
	);
}

export default TimeFields;
