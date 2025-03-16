import React from 'react';
import { FaPlus, FaTrash } from 'react-icons/fa';
import TextInput from '../ui/TextInput';

/**
 *   dateTimeData: [
 *     { date: 'YYYY-MM-DD', times: ['HH:MM', ...] },
 *     ...
 *   ]
 */
function DateTimeFields({ dateTimeData, setDateTimeData }) {
	// Add a new empty date with one empty time
	const addDateField = () => {
		setDateTimeData([...dateTimeData, { date: '', times: [''] }]);
	};

	// Remove an entire date (and its times)
	const removeDateField = (index) => {
		setDateTimeData(dateTimeData.filter((_, i) => i !== index));
	};

	// Convert an ISO string (e.g. 2025-03-27T00:00:00.000Z) to YYYY-MM-DD
	const toYYYYMMDD = (isoString) => {
		const d = new Date(isoString);
		const year = d.getFullYear();
		const month = String(d.getMonth() + 1).padStart(2, '0');
		const day = String(d.getDate()).padStart(2, '0');
		return `${year}-${month}-${day}`;
	};

	// Update the date string for a particular index
	const handleDateChange = (index, newValue) => {
		const updated = [...dateTimeData];
		updated[index].date = newValue; // Store the new date (already YYYY-MM-DD from the date input)
		setDateTimeData(updated);
		console.log(dateTimeData);
	};

	// Add a new empty time to a particular date
	const addTimeField = (dateIndex) => {
		const updated = [...dateTimeData];
		updated[dateIndex].times.push('');
		setDateTimeData(updated);
	};

	// Remove a time from a particular date
	const removeTimeField = (dateIndex, timeIndex) => {
		const updated = [...dateTimeData];
		updated[dateIndex].times = updated[dateIndex].times.filter((_, i) => i !== timeIndex);
		setDateTimeData(updated);
	};

	// Update the time string for a date/time index
	const handleTimeChange = (dateIndex, timeIndex, newValue) => {
		const updated = [...dateTimeData];
		updated[dateIndex].times[timeIndex] = newValue;
		setDateTimeData(updated);
	};

	return (
		<div className='flex flex-col'>
			{dateTimeData.map((entry, dateIndex) => {
				// If this date is in ISO format or otherwise longer than 'YYYY-MM-DD',
				// convert it to just 'YYYY-MM-DD'
				const safeDateValue =
					entry.date && entry.date.length > 10 ? toYYYYMMDD(entry.date) : entry.date;

				return (
					<div
						key={dateIndex}
						className='flex flex-col space-y-1 mb-4'>
						<div className={`flex flex-col`}>
							<span className={`text-sm`}>Date #{dateIndex + 1}</span>
							{/* Date row */}
							<div className='relative flex w-full items-center'>
								<input
									className='w-full bg-tp px-2 py-1 outline-none border-l-4 border-red'
									type='date'
									value={safeDateValue}
									onChange={(e) => handleDateChange(dateIndex, e.target.value)}
								/>

								{/* If it's the first date, show a plus icon; otherwise a trash icon.*/}
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

						{/* Time Fields Under This Date */}
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
