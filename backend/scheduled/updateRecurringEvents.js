import dotenv from 'dotenv';
import pool from '../database.js';

dotenv.config();

// Get current date in EST as 'YYYY-MM-DD'
const getTodayEST = () => {
	const now = new Date();
	const estDate = new Intl.DateTimeFormat('en-US', {
		timeZone: 'America/New_York',
		year: 'numeric',
		month: '2-digit',
		day: '2-digit',
	}).format(now);

	// Convert MM/DD/YYYY → YYYY-MM-DD
	const [month, day, year] = estDate.split('/');
	return `${year}-${month}-${day}`;
};

const getNextWeekdayDate = (originalDate) => {
	const oldDate = new Date(originalDate);
	const next = new Date(oldDate);
	next.setDate(oldDate.getDate() + 7);
	return next.toISOString().split('T')[0];
};

export const updateRecurringEventDates = async () => {
	console.log('[HELPER] Checking recurring events...');

	const todayEST = getTodayEST();

	const [rows] = await pool.query(
		`SELECT ed.id AS eventDateID, ed.date, e.id AS eventID
		 FROM EventDates ed
		 JOIN Events e ON ed.eventID = e.id
		 WHERE e.isRecurring = TRUE
		   AND ed.date < ?`,
		[todayEST]
	);

	if (!rows.length) {
		console.log('[HELPER] No past-due recurring events found.');
		return;
	}

	for (const row of rows) {
		const newDate = getNextWeekdayDate(row.date);
		await pool.query(`UPDATE EventDates SET date = ? WHERE id = ?`, [newDate, row.eventDateID]);
		console.log(`[HELPER] Updated EventDate ${row.eventDateID} → ${newDate}`);
	}
};
