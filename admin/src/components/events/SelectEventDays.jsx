import React, { useState } from 'react';

function SelectEventDays() {
	const days = ['MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT', 'SUN'];
	const [selectedDays, setSelectedDays] = useState([]);

	const toggleDay = (day) => {
		if (selectedDays.includes(day)) {
			// Remove day if already selected
			setSelectedDays(selectedDays.filter((d) => d !== day));
		} else {
			// Add day if not selected
			setSelectedDays([...selectedDays, day]);
		}
	};

	return (
		<div className='flex w-full space-x-2'>
			{days.map((d, index) => {
				return selectedDays.includes(d) ? (
					// Selected day style
					<div
						key={index}
						onClick={() => toggleDay(d)}
						className='font-dm text-sm text-bkg bg-red w-full text-center cursor-pointer'>
						{d}
					</div>
				) : (
					// Unselected day style
					<div
						key={index}
						onClick={() => toggleDay(d)}
						className='font-dm text-sm text-black bg-tp w-full text-center cursor-pointer'>
						{d}
					</div>
				);
			})}
		</div>
	);
}

export default SelectEventDays;
