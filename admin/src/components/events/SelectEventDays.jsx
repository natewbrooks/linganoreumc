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

	const toggleDay = (abbr) => {
		const updated = { ...dayDataMap };

		if (updated[abbr]) {
			delete updated[abbr];
		} else {
			updated[abbr] = {
				abbr,
				date: getNextWeekdayDate(abbr),
				times: [''],
				isCancelled: false,
			};
		}

		applyUpdate(updated);
	};

	const updateTime = (abbr, timeIndex, value) => {
		const updated = { ...dayDataMap };
		const times = [...(updated[abbr]?.times || [])];
		times[timeIndex] = value;
		updated[abbr].times = times;
		applyUpdate(updated);
	};

	const addTimeField = (abbr) => {
		const updated = { ...dayDataMap };
		updated[abbr].times.push('');
		applyUpdate(updated);
	};

	const removeTimeField = (abbr, index) => {
		const updated = { ...dayDataMap };
		updated[abbr].times.splice(index, 1);
		applyUpdate(updated);
	};

	return (
		<div className='flex flex-col w-full space-y-4  pl-4'>
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
							<div className='font-dm text-sm mb-1'>{dayLabels[abbr].toUpperCase()}</div>

							{(entry.times || []).map((time, idx) => (
								<div
									key={idx}
									className='relative flex items-center border-l-4 border-red ml-4'>
									<div className='flex w-full pl-2 items-center'>
										<span className='text-xs whitespace-nowrap w-[24px]'>#{idx + 1}</span>
										<input
											className='w-full bg-tp px-2 py-1 outline-none'
											type='time'
											value={time}
											onChange={(e) => updateTime(abbr, idx, e.target.value)}
										/>
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
