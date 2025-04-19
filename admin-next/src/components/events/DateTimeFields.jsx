import React from 'react';
import { FaPlus, FaTrash } from 'react-icons/fa';
import { TiCancel } from 'react-icons/ti';
import TextInput from '../ui/TextInput';
import { formatShortDate } from '../../helper/textFormat';

function DateTimeFields({ dateTimeData, setDateTimeData, deleteEventDate }) {
	const addDateField = () => {
		setDateTimeData([
			...dateTimeData,
			{ date: '', times: [{ startTime: '', endTime: '' }], isCancelled: false },
		]);
	};

	const removeDateField = async (index) => {
		const entry = dateTimeData[index];

		if (entry.eventDateID) {
			try {
				await deleteEventDate(entry.eventDateID);
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
		updated[dateIndex].times.push({ startTime: '', endTime: '' });
		setDateTimeData(updated);
	};

	const removeTimeField = (dateIndex, timeIndex) => {
		const updated = [...dateTimeData];
		updated[dateIndex].times = updated[dateIndex].times.filter((_, i) => i !== timeIndex);
		setDateTimeData(updated);
	};

	const handleStartTimeChange = (dateIndex, timeIndex, newValue) => {
		const updated = [...dateTimeData];
		updated[dateIndex].times[timeIndex].startTime = newValue;
		setDateTimeData(updated);
	};

	const handleEndTimeChange = (dateIndex, timeIndex, newValue) => {
		const updated = [...dateTimeData];
		updated[dateIndex].times[timeIndex].endTime = newValue;
		setDateTimeData(updated);
	};

	const handleCancelToggle = (index) => {
		const updated = [...dateTimeData];
		updated[index].isCancelled = !updated[index].isCancelled;
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
							<span className={`text-sm`}>
								Date #{dateIndex + 1} {entry.isCancelled && '- Canceled'}
							</span>
							<div className='relative flex w-full items-center'>
								<div className='absolute -left-8 items-center justify-center l text-xs pl-1'>
									<div
										onClick={() => handleCancelToggle(dateIndex)}
										className={`transition-all duration-200 ease-in-out rounded-full h-full text-bkg clickable ${
											entry.isCancelled ? 'bg-red' : 'bg-gray-500 opacity-50'
										} `}>
										<TiCancel size={20} />
									</div>
								</div>

								{entry.isCancelled ? (
									<div
										className={`w-full transition ${
											entry.isCancelled ? 'bg-red text-bkg' : 'bg-tp'
										} px-2 py-1 outline-none border-l-4 border-red`}>
										{formatShortDate(safeDateValue)}
									</div>
								) : (
									<input
										className={`w-full transition ${
											entry.isCancelled ? 'bg-red text-bkg' : 'bg-tp'
										} px-2 py-1 outline-none border-l-4 border-red`}
										type='date'
										value={safeDateValue}
										onChange={(e) => handleDateChange(dateIndex, e.target.value)}
									/>
								)}

								{dateIndex === 0 ? (
									<div
										className='absolute -right-8 bg-red rounded-full p-1 w-fit clickable'
										onClick={addDateField}>
										<FaPlus
											className='text-bkg'
											size={12}
										/>
									</div>
								) : (
									<div
										className='absolute -right-8 bg-red rounded-sm p-1 w-fit clickable'
										onClick={() => removeDateField(dateIndex)}>
										<FaTrash
											className='text-bkg'
											size={12}
										/>
									</div>
								)}
							</div>
						</div>

						{entry.isCancelled ? (
							''
						) : (
							<div className={`md:pl-4 flex flex-col `}>
								{entry.times.map((timeEntry, timeIndex) => (
									<div
										className='relative flex items-center border-l-4 border-red'
										key={timeIndex}>
										<div className={`flex w-full pl-2 items-center`}>
											<span className={`text-xs whitespace-nowrap w-[24px]`}>#{timeIndex + 1}</span>
											<div className={`flex md:space-x-2 items-center w-full`}>
												{/* START TIME */}
												<input
													className='w-full bg-tp px-2 py-1 outline-none'
													type='time'
													value={timeEntry.startTime ?? ''}
													onChange={(e) =>
														handleStartTimeChange(dateIndex, timeIndex, e.target.value)
													}
												/>
												<span className={`text-xs text-center whitespace-nowrap px-1 w-[24px]`}>
													TO
												</span>
												{/* END TIME */}
												<input
													className='w-full bg-tp px-2 py-1 outline-none'
													type='time'
													value={timeEntry.endTime ?? ''}
													onChange={(e) =>
														handleEndTimeChange(dateIndex, timeIndex, e.target.value)
													}
												/>
											</div>
										</div>

										{timeIndex === 0 ? (
											<div
												className='absolute -right-8 bg-red rounded-full  p-1 w-fit clickable'
												onClick={() => addTimeField(dateIndex)}>
												<FaPlus
													className='text-bkg'
													size={12}
												/>
											</div>
										) : (
											<div
												className='absolute -right-8 bg-red rounded-sm p-1 w-fit clickable'
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
						)}
					</div>
				);
			})}
		</div>
	);
}

export default DateTimeFields;
