function formatLongDate(dateStr, locale = 'en-US') {
	if (!dateStr) return '';
	const date = new Date(dateStr);
	if (isNaN(date)) return '';
	return date.toLocaleDateString(locale, {
		year: 'numeric',
		month: 'long',
		day: '2-digit',
	});
}

function formatDate(dateStr) {
	if (!dateStr || typeof dateStr !== 'string') return '';
	const [year, month, day] = dateStr.split('-').map(Number);
	if (!year || !month || !day) return '';
	return `${month}/${day}/${String(year).slice(-2)}`;
}

function formatTime(timeStr, use24Hour = false, locale = 'en-US') {
	if (!timeStr || typeof timeStr !== 'string') return '';
	const [hour, minute] = timeStr.split(':').map(Number);
	if (isNaN(hour) || isNaN(minute)) return '';
	const dateObj = new Date(0, 0, 0, hour, minute);
	return dateObj.toLocaleString(locale, {
		hour: 'numeric',
		minute: '2-digit',
		hour12: !use24Hour,
	});
}

const normalizeDateInput = (input) => {
	if (input instanceof Date) return input;
	if (typeof input === 'string') {
		const [y, m, d] = input.split('-').map(Number);
		return new Date(y, m - 1, d);
	}
	return null;
};

const getShortDayOfWeek = (input) => {
	const date = normalizeDateInput(input);
	return date ? ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'][date.getDay()] : '';
};

const getLongDayOfWeek = (input) => {
	const date = normalizeDateInput(input);
	return date
		? ['SUNDAYS', 'MONDAYS', 'TUESDAYS', 'WEDNESDAYS', 'THURSDAYS', 'FRIDAYS', 'SATURDAYS'][
				date.getDay()
		  ]
		: '';
};

const getFormat = {
	formatLongDate,
	formatDate,
	formatTime,
	getShortDayOfWeek,
	getLongDayOfWeek,
};

export default getFormat;
