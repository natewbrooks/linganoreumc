import React from 'react';
import { FaPlus, FaTrash } from 'react-icons/fa';
import TextInput from '../ui/TextInput';

function DateTimeFields({ dateTimeData, setDateTimeData, deleteEventDate }) {
	const addDateField = () => {
		setDateTimeData([...dateTimeData, { date: '', times: [''], isCancelled: false }]);
	};

	const removeDateField = async (index) => {
		const entry = dateTimeData[index];

		if (entry.eventDateID) {
			try {
				await deleteEventDate(entry.eventDateID);
				console.log(`Deleted eventDateID: ${entry.eventDateID}`);
			} catch (err) {
				console.error('Failed to delete event date:', err);
				return; // Don't update state if deletion fails
			}
		}

		const updated = [...dateTimeData];
		updated.splice(index, 1);
		setDateTimeData(updated);
	};

	const toYYYYMMDD = (isoString) => {
		const d = new Date(isoString);
		const year = d.getFullYear();
		const month = String(d.getMonth() + 1).padStart(2, '0');
		const day = String(d.getDate()).padStart(2, '0');
		return `${year}-${month}-${day}`;
	};

	const handleDateChange = (index, newValue) => {
		const updated = [...dateTimeData];
		updated[index].date = newValue;
		setDateTimeData(updated);
	};

	const addTimeField = (dateIndex) => {
		const updated = [...dateTimeData];
		updated[dateIndex].times.push('');
		setDateTimeData(updated);
	};

	const removeTimeField = (dateIndex, timeIndex) => {
		const updated = [...dateTimeData];
		updated[dateIndex].times = updated[dateIndex].times.filter((_, i) => i !== timeIndex);
		setDateTimeData(updated);
	};

	const handleTimeChange = (dateIndex, timeIndex, newValue) => {
		const updated = [...dateTimeData];
		updated[dateIndex].times[timeIndex] = newValue;
		setDateTimeData(updated);
	};

	const handleCancelToggle = (index) => {
		const updated = [...dateTimeData];
		updated[index].isCancelled = !updated[index].isCancelled;
		console.log(`Toggled isCancelled for date #${index + 1}:`, updated[index].isCancelled);
		setDateTimeData(updated);
	};

	return (
		<div className='flex flex-col'>
			{dateTimeData.map((entry, dateIndex) => {
				const safeDateValue =
					entry.date && entry.date.length > 10 ? toYYYYMMDD(entry.date) : entry.date;

				return (
					<div
						key={dateIndex}
						className='flex flex-col space-y-1 mb-4'>
						<div className={`flex flex-col`}>
							<span className={`text-sm`}>Date #{dateIndex + 1}</span>
							<div className='relative flex w-full items-center'>
								<input
									className='w-full bg-tp px-2 py-1 outline-none border-l-4 border-red'
									type='date'
									value={safeDateValue}
									onChange={(e) => handleDateChange(dateIndex, e.target.value)}
								/>

								<div className='flex items-center space-x-2 mt-1 text-xs pl-1'>
									<input
										type='checkbox'
										checked={!!entry.isCancelled}
										onChange={() => handleCancelToggle(dateIndex)}
										className='accent-red'
									/>
									<label className='text-[12px]'>Canceled?</label>
								</div>

								{dateIndex === 0 ? (
									<div
										className='absolute -right-8 bg-red rounded-full p-1 w-fit cursor-pointer'
										onClick={addDateField}>
										<FaPlus
											className='text-bkg'
											size={12}
										/>
									</div>
								) : (
									<div
										className='absolute -right-8 bg-red rounded-sm p-1 w-fit cursor-pointer'
										onClick={() => removeDateField(dateIndex)}>
										<FaTrash
											className='text-bkg'
											size={12}
										/>
									</div>
								)}
							</div>
						</div>

						<div className='pl-4 flex flex-col '>
							{entry.times.map((timeValue, timeIndex) => (
								<div
									className='relative flex items-center border-l-4 border-red'
									key={timeIndex}>
									<div className={`flex w-full pl-2 items-center`}>
										<span className={`text-xs whitespace-nowrap w-[24px]`}>#{timeIndex + 1}</span>
										<input
											className='w-full bg-tp px-2 py-1 outline-none'
											type='time'
											value={timeValue}
											onChange={(e) => handleTimeChange(dateIndex, timeIndex, e.target.value)}
										/>
									</div>

									{timeIndex === 0 ? (
										<div
											className='absolute -right-8 bg-red rounded-full  p-1 w-fit cursor-pointer'
											onClick={() => addTimeField(dateIndex)}>
											<FaPlus
												className='text-bkg'
												size={12}
											/>
										</div>
									) : (
										<div
											className='absolute -right-8 bg-red rounded-sm p-1 w-fit cursor-pointer'
											onClick={() => removeTimeField(dateIndex, timeIndex)}>
											<FaTrash
												className='text-bkg'
												size={12}
											/>
										</div>
									)}
								</div>
							))}
						</div>
					</div>
				);
			})}
		</div>
	);
}

export default DateTimeFields;
