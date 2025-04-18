'use client';
import React, { useState } from 'react';
import CalendarGrid from '@/components/calendar/grid/CalendarGrid';
import CalendarList from '@/components/calendar/list/CalendarList';

export default function Calendar() {
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

	const changeMode = (modeStr) => {
		setMode(modeStr);
	};

	return (
		<div className={`flex flex-col w-full my-4 min-h-[800px]`}>
			{/* Title header thing */}
			<div className={`flex flex-col jusify-center `}>
				<div className={`w-full flex justify-center items-center`}>
					<div className={`text-black text-xl font-dm`}>CALENDAR</div>
				</div>
				<div className={`flex justify-around items-center bg-red w-full py-2 text-bkg`}>
					<button
						onClick={() => returnToToday()}
						className={`bg-bkg rounded-full  w-[80px] sm:w-[100px] font-dm text-red text-sm sm:text-lg clickable`}>
						TODAY
					</button>
					<div className={`flex justify-center text-center space-x-4 text-2xl`}>
						<button
							onClick={() => previousMonth()}
							className={`clickable`}>{`<`}</button>
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
							className={`clickable`}
							onClick={() => nextMonth()}>{`>`}</button>
					</div>
					<div
						className={`invisible sm:visible space-x-2 w-[80px] sm:w-[100px] font-dm text-sm sm:text-lg`}>
						<button
							onClick={() => changeMode('grid')}
							className={`${mode == 'grid' ? 'underline underline-offset-4' : ''} clickable`}>
							GRID
						</button>
						<span>|</span>
						<button
							onClick={() => changeMode('list')}
							className={`${mode == 'list' ? 'underline underline-offset-4' : ''} clickable`}>
							LIST
						</button>
					</div>
				</div>
			</div>

			<div className={`w-full`}>
				<div className={`block sm:hidden mx-auto px-2`}>
					<CalendarList
						month={month}
						year={year}
					/>
				</div>
				<div
					className={`hidden sm:block mx-auto ${
						mode === 'grid' ? 'page-wrapper' : 'max-w-[800px]'
					} `}>
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
