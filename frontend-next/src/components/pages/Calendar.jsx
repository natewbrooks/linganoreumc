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

	const isCurrentMonth = month === new Date().getMonth() && year === new Date().getFullYear();

	const changeMode = (modeStr) => {
		setMode(modeStr);
	};

	return (
		<div className={`flex flex-col w-full my-4 min-h-[800px]`}>
			{/* Title header thing */}
			<div className={`flex flex-col jusify-center `}>
				{/* TODAY is absolute so CALENDAR stays centered. Hidden on the current month */}
				<div className={`relative w-full flex justify-center items-center py-1 px-4`}>
					<div className={`text-black text-lg font-dm`}>CALENDAR</div>
					{!isCurrentMonth && (
						<button
							onClick={() => returnToToday()}
							className={`absolute right-4 bg-red -skew-x-[30deg] px-3 py-0.5 font-dm text-bkg text-sm clickable`}>
							<div className='skew-x-[30deg] whitespace-nowrap'>TODAY</div>
						</button>
					)}
				</div>
				<div className={`flex justify-around items-center gap-2 bg-red w-full py-2 px-2 text-bkg`}>
					{/* Desktop spacer balancing GRID | LIST */}
					<div className={`hidden lg:block w-[100px]`} />
					<div className={`flex justify-center items-center text-center space-x-4 text-2xl`}>
						<button
							onClick={() => previousMonth()}
							className={`clickable`}>{`<`}</button>
						{/* Fixed width keeps the arrows still between months. Wraps only if it can't fit */}
						<h1 className={`font-dm leading-tight text-xl sm:text-2xl w-[190px] sm:w-[240px]`}>
							{monthNames[month].toUpperCase()}
							{` `}
							{year}
						</h1>
						<button
							className={`clickable`}
							onClick={() => nextMonth()}>{`>`}</button>
					</div>
					<div
						className={`hidden lg:block space-x-2 w-[100px] font-dm text-lg`}>
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
				<div className={`block lg:hidden mx-auto px-2 w-full max-w-[800px]`}>
					<CalendarList
						month={month}
						year={year}
					/>
				</div>
				<div
					className={`hidden lg:block mx-auto ${
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
