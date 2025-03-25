import React, { useState } from 'react';
import CalendarGrid from '../components/calendar/grid/CalendarGrid';
import CalendarList from '../components/calendar/list/CalendarList';

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
					<div className={`text-black text-xl font-dm`}>CALENDAR</div>
				</div>
				<div className={`flex justify-around items-center bg-red w-full py-2 text-bkg`}>
					<button
						onClick={() => returnToToday()}
						className={`bg-bkg rounded-full hover:opacity-50 w-[80px] sm:w-[100px] font-dm text-red text-sm sm:text-lg cursor-pointer`}>
						TODAY
					</button>
					<div className={`flex justify-center text-center space-x-4 text-2xl`}>
						<button
							onClick={() => previousMonth()}
							className={`cursor-pointer`}>{`<`}</button>
						<h1 className={`block sm:hidden font-dm w-[120px] md:w-[200px]`}>
							{monthNames[month].toUpperCase()}
							<br />
							{year}
						</h1>
						<h1 className={`hidden sm:block font-dm w-[120px] md:w-[200px]`}>
							{monthNames[month].toUpperCase()}
							{` `}
							{year}
						</h1>
						<button
							className={`cursor-pointer`}
							onClick={() => nextMonth()}>{`>`}</button>
					</div>
					<div
						className={`invisible sm:visible space-x-2 w-[80px] sm:w-[100px] font-dm text-sm sm:text-lg`}>
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

			<div className={`px-4 md:px-20 lg:px-40 xl:px-80 2xl:px-120`}>
				<div className={`block sm:hidden`}>
					<CalendarList
						month={month}
						year={year}
					/>
				</div>
				<div className={`hidden sm:block`}>
					{mode === 'grid' ? (
						<CalendarGrid
							month={month}
							year={year}
						/>
					) : (
						<CalendarList
							month={month}
							year={year}
						/>
					)}
				</div>
			</div>
		</div>
	);
}

export default Calendar;
