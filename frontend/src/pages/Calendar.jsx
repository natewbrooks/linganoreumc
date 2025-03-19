import React, { useState } from 'react';
import CalendarGrid from '../components/calendar/grid/CalendarGrid';

function Calendar() {
	const [month, setMonth] = useState(new Date().getMonth());
	const [year, setYear] = useState(new Date().getFullYear());
	const [mode, setMode] = useState('grid');

	const monthNames = [
		'January',
		'February',
		'March',
		'April',
		'May',
		'June',
		'July',
		'August',
		'September',
		'October',
		'November',
		'December',
	];

	const returnToToday = () => {
		const today = new Date();
		setMonth(today.getMonth());
		setYear(today.getFullYear());
	};

	const nextMonth = () => {
		setMonth((prevMonth) => {
			if (prevMonth === 11) {
				setYear(new Date(year + 1, month).getFullYear());
				return 0; // Wrap to January
			}
			return prevMonth + 1;
		});
	};

	const previousMonth = () => {
		setMonth((prevMonth) => {
			if (prevMonth === 0) {
				setYear(new Date(year - 1, month).getFullYear());
				return 11; // Wrap to December
			}
			return prevMonth - 1;
		});
	};

	const changeMode = () => {
		setMode((prevMode) => (prevMode === 'grid' ? 'list' : 'grid'));
	};

	return (
		<div className={`flex flex-col w-full my-8`}>
			{/* Title header thing */}
			<div className={`flex flex-col jusify-center`}>
				<div className={`w-full flex justify-center items-center`}>
					<div className={`text-black text-3xl text-center -translate-x-5 font-dm`}>CALENDAR</div>
				</div>
				<div className={`flex justify-around  items-center bg-red w-full py-2 text-bkg`}>
					<button
						onClick={() => returnToToday()}
						className={`bg-bkg rounded-full font-dm text-red px-2 text-xl cursor-pointer`}>
						TODAY
					</button>
					<div className={`flex justify-center text-center space-x-4 text-3xl`}>
						<button
							onClick={() => previousMonth()}
							className={`cursor-pointer`}>{`<`}</button>
						<h1 className={`font-dm w-[250px]`}>
							{monthNames[month].toUpperCase()}
							{` `}
							{year}
						</h1>
						<button
							className={`cursor-pointer`}
							onClick={() => nextMonth()}>{`>`}</button>
					</div>
					<div className={`space-x-4 font-dm text-xl`}>
						<button
							onClick={() => changeMode()}
							className={`${mode == 'grid' ? 'underline underline-offset-2' : ''} cursor-pointer`}>
							GRID
						</button>
						<span>|</span>
						<button
							onClick={() => changeMode()}
							className={`${mode == 'list' ? 'underline underline-offset-2' : ''} cursor-pointer`}>
							LIST
						</button>
					</div>
				</div>
			</div>
			<CalendarGrid
				month={month}
				year={year}
			/>
		</div>
	);
}

export default Calendar;
