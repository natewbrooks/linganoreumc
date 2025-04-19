export function formatShortDate(dateStr) {
	const [year, month, day] = dateStr.split('-').map(Number);
	const paddedMonth = String(month).padStart(2, '0');
	const paddedDay = String(day).padStart(2, '0');
	return `${paddedMonth}/${paddedDay}/${year}`;
}

export function formatTime(timeStr) {
	const [hour, minute] = timeStr.split(':').map(Number);
	const dateObj = new Date(0, 0, 0, hour, minute);
	return dateObj.toLocaleString('en-US', {
		hour: 'numeric',
		minute: '2-digit',
		hour12: true,
	});
}
