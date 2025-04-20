'use client';
import React, { useState, useEffect } from 'react';
import CalendarGridItem from './CalendarGridItem';

function CalendarGrid({ month, year }) {
	const [date, setDate] = useState(new Date(year, month + 1, 0)); // Last day of the current month
	const days = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT']; // Sunday first

	useEffect(() => {
		setDate(new Date(year, month + 1, 0)); // Update last day when month/year changes
	}, [month, year]);

	// First and last day of the month
	const firstDayOfMonth = new Date(year, month, 1);
	const lastDayOfMonth = new Date(year, month + 1, 0);

	// Days from previous month to show before the 1st
	const prevMonthDays = firstDayOfMonth.getDay(); // Sunday = 0, Monday = 1, etc.
	const nextMonthDays = 35 - (prevMonthDays + lastDayOfMonth.getDate()); // Total 42 days (6 weeks)

	// Get previous month’s info
	const prevMonth = month === 0 ? 11 : month - 1;
	const prevMonthYear = month === 0 ? year - 1 : year;
	const lastDayPrevMonth = new Date(prevMonthYear, prevMonth + 1, 0).getDate();

	const allDays = [];

	// Previous month's trailing days
	for (let i = prevMonthDays; i > 0; i--) {
		allDays.push({
			day: lastDayPrevMonth - i + 1,
			date: new Date(prevMonthYear, prevMonth, lastDayPrevMonth - i + 1),
			isCurrentMonth: false,
		});
	}

	// Current month's days
	for (let i = 1; i <= lastDayOfMonth.getDate(); i++) {
		allDays.push({
			day: i,
			date: new Date(year, month, i),
			isCurrentMonth: true,
		});
	}

	// Next month's leading days
	const nextMonth = month === 11 ? 0 : month + 1;
	const nextMonthYear = month === 11 ? year + 1 : year;
	for (let i = 1; i <= nextMonthDays; i++) {
		allDays.push({
			day: i,
			date: new Date(nextMonthYear, nextMonth, i),
			isCurrentMonth: false,
		});
	}

	return (
		<div className='w-full flex flex-col justify-center'>
			<div className='grid grid-cols-7 gap-1 text-center w-full font-dm text-md pt-2'>
				{days.map((day, i) => (
					<div key={i}>{day}</div>
				))}
			</div>
			<div className='grid grid-cols-7 gap-1 w-full'>
				{allDays.map((dayObj, index) => (
					<CalendarGridItem
						key={`day-${index}`}
						day={dayObj.day}
						date={dayObj.date}
						isCurrentMonth={dayObj.isCurrentMonth}
					/>
				))}
			</div>
		</div>
	);
}

export default CalendarGrid;
