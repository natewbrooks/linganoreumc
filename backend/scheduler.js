import cron from 'node-cron';
import { updateRecurringEventDates } from './scheduled/updateRecurringEvents.js';

console.log('[CRON] Scheduler initialized. Will run at 2:00 AM EST daily.');

// Run daily at 2:00 AM Eastern Time
cron.schedule(
	'0 2 * * *',
	async () => {
		console.log('[CRON] Running recurring event update');
		try {
			await updateRecurringEventDates();
			console.log('[CRON] Update finished');
		} catch (err) {
			console.error('[CRON] Update failed:', err.message);
		}
	},
	{
		timezone: 'America/New_York',
	}
);

console.log('[CRON] Scheduler running...');
