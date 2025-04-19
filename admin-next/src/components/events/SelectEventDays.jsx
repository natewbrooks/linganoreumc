import React from 'react';
import { FaPlus, FaTrash } from 'react-icons/fa';

function SelectEventDays({ dateTimeData = [], setDateTimeData }) {
	const days = ['MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT', 'SUN'];
	const dayLabels = {
		MON: 'Mondays',
		TUE: 'Tuesdays',
		WED: 'Wednesdays',
		THU: 'Thursdays',
		FRI: 'Fridays',
		SAT: 'Saturdays',
		SUN: 'Sundays',
	};

	const getNextWeekdayDate = (abbr) => {
		const dayMap = { SUN: 0, MON: 1, TUE: 2, WED: 3, THU: 4, FRI: 5, SAT: 6 };
		const targetDay = dayMap[abbr];
		const today = new Date();

		for (let i = 1; i <= 7; i++) {
			const next = new Date(today);
			next.setDate(today.getDate() + i);
			if (next.getDay() === targetDay) {
				return `${next.getFullYear()}-${String(next.getMonth() + 1).padStart(2, '0')}-${String(
					next.getDate()
				).padStart(2, '0')}`;
			}
		}
		return null;
	};

	const getAbbrFromDate = (dateStr) => {
		const [year, month, day] = dateStr.split('-').map(Number);
		const date = new Date(year, month - 1, day); // Month is 0-based
		const weekday = date.getDay();

		return ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'][weekday];
	};

	const formatDateInEST = (dateStr) => {
		const [year, month, day] = dateStr.split('-').map(Number);
		const utcDate = new Date(Date.UTC(year, month - 1, day, 5)); // 5 AM UTC = midnight EST

		return new Intl.DateTimeFormat('en-US', {
			timeZone: 'America/New_York',
			month: 'short',
			day: 'numeric',
			year: 'numeric',
		}).format(utcDate);
	};

	const dayDataMap = {};
	for (const entry of dateTimeData) {
		const abbr = entry.abbr || getAbbrFromDate(entry.date);
		if (!dayDataMap[abbr]) {
			dayDataMap[abbr] = { ...entry, abbr };
		}
	}

	const selectedDays = Object.keys(dayDataMap);

	const applyUpdate = (updatedMap) => {
		const ordered = days.filter((abbr) => updatedMap[abbr]).map((abbr) => updatedMap[abbr]);
		setDateTimeData(ordered);
	};

	const addDaysToDate = (dateStr, days) => {
		const [year, month, day] = dateStr.split('-').map(Number);
		const date = new Date(year, month - 1, day);
		date.setDate(date.getDate() + days);

		return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(
			date.getDate()
		).padStart(2, '0')}`;
	};

	const skipDate = (abbr) => {
		const updated = { ...dayDataMap };
		if (updated[abbr]?.date) {
			updated[abbr].date = addDaysToDate(updated[abbr].date, 7);
			applyUpdate(updated);
		}
	};

	const toggleDay = (abbr) => {
		const updated = { ...dayDataMap };

		if (updated[abbr]) {
			delete updated[abbr];
		} else {
			updated[abbr] = {
				abbr,
				date: getNextWeekdayDate(abbr),
				times: [{ startTime: '', endTime: '' }],
				isCancelled: false,
			};
		}

		applyUpdate(updated);
	};

	const addTimeField = (abbr) => {
		const updated = { ...dayDataMap };
		updated[abbr].times.push({ startTime: '', endTime: '' });
		applyUpdate(updated);
	};

	const removeTimeField = (abbr, index) => {
		const updated = { ...dayDataMap };
		updated[abbr].times.splice(index, 1);
		applyUpdate(updated);
	};

	const handleStartTimeChange = (abbr, timeIndex, value) => {
		const updated = { ...dayDataMap };
		if (!updated[abbr]?.times?.[timeIndex]) return;
		updated[abbr].times[timeIndex].startTime = value;
		applyUpdate(updated);
	};

	const handleEndTimeChange = (abbr, timeIndex, value) => {
		const updated = { ...dayDataMap };
		if (!updated[abbr]?.times?.[timeIndex]) return;
		updated[abbr].times[timeIndex].endTime = value;
		applyUpdate(updated);
	};

	return (
		<div className='flex flex-col w-full space-y-4  md:pl-4'>
			{/* Day Buttons */}
			<div className='flex w-full space-x-2'>
				{days.map((d) => (
					<div
						key={d}
						onClick={() => toggleDay(d)}
						className={`font-dm text-sm w-full text-center clickable ${
							selectedDays.includes(d) ? 'text-bkg bg-red' : 'text-black bg-tp'
						}`}>
						{d}
					</div>
				))}
			</div>

			{/* Time Fields */}
			{days
				.filter((d) => selectedDays.includes(d))
				.map((abbr) => {
					const entry = dayDataMap[abbr];
					if (!entry) return null;

					return (
						<div
							key={abbr}
							className='flex flex-col'>
							<div className='flex flex-row justify-between items-center'>
								<div className={`flex space-x-2`}>
									<div className='font-dm text-sm mb-1'>{dayLabels[abbr].toUpperCase()}</div>
									<div className='font-dm text-sm mb-1'>|</div>
									<div className='font-dm text-sm mb-1'>NEXT @ {formatDateInEST(entry.date)}</div>
								</div>

								<div className={`flex space-x-4`}>
									<div
										className='font-dm mb-1 text-red clickable'
										onClick={() => skipDate(abbr)}>
										<div className='text-xs'>SKIP THIS DATE</div>
									</div>
								</div>
							</div>

							{(entry.times || []).map(({ startTime, endTime }, idx) => (
								<div
									key={idx}
									className='relative flex items-center border-l-4 border-red mr-6 md:ml-4'>
									<div className='flex w-full pl-2 items-center'>
										<span className='text-xs whitespace-nowrap w-[24px]'>#{idx + 1}</span>
										<div className={`flex md:space-x-2 items-center w-full`}>
											{/* START TIME */}
											<input
												className='w-full bg-tp px-2 py-1 outline-none'
												type='time'
												value={startTime ?? ''}
												onChange={(e) => handleStartTimeChange(abbr, idx, e.target.value)}
											/>
											<span className='text-xs text-center whitespace-nowrap px-1 w-[24px]'>
												TO
											</span>
											<input
												className='w-full bg-tp px-2 py-1 outline-none'
												type='time'
												value={endTime ?? ''}
												onChange={(e) => handleEndTimeChange(abbr, idx, e.target.value)}
											/>
										</div>
									</div>

									{idx === 0 ? (
										<div
											className='absolute -right-8 bg-red rounded-full p-1 w-fit clickable'
											onClick={() => addTimeField(abbr)}>
											<FaPlus
												className='text-bkg'
												size={12}
											/>
										</div>
									) : (
										<div
											className='absolute -right-8 bg-red rounded-sm p-1 w-fit clickable'
											onClick={() => removeTimeField(abbr, idx)}>
											<FaTrash
												className='text-bkg'
												size={12}
											/>
										</div>
									)}
								</div>
							))}
						</div>
					);
				})}
		</div>
	);
}

export default SelectEventDays;
