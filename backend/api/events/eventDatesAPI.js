import pool from '../../database.js';

// Public: View all EventDates
export const getAllEventDates = async (req, res) => {
	try {
		const [rows] = await pool.query('SELECT * FROM EventDates');
		res.json(rows);
	} catch (err) {
		res.status(500).json({ error: err.message });
	}
};

// Public: View all EventDates for an event via the eventID
export const getEventDates = async (req, res) => {
	const { eventID } = req.params;
	try {
		const [rows] = await pool.query('SELECT * FROM EventDates WHERE eventID = ?', [eventID]);
		res.json(rows);
	} catch (err) {
		res.status(500).json({ error: err.message });
	}
};

// Public: View a specific EventDate via its id
export const getEventDate = async (req, res) => {
	const { id } = req.params;
	try {
		const [rows] = await pool.query('SELECT * FROM EventDates WHERE id = ?', [id]);
		if (rows.length === 0) {
			return res.status(404).json({ error: 'Event Date not found' });
		}
		res.json(rows[0]); // Return the single event date object
	} catch (err) {
		res.status(500).json({ error: err.message });
	}
};

// Admin: Create an EventDate and associate it with an eventID
export const createEventDate = async (req, res) => {
	const { eventID, date } = req.body;

	if (!eventID || !date) {
		return res.status(400).json({ error: 'EventID and date are required' });
	}

	try {
		const [result] = await pool.query('INSERT INTO EventDates (eventID, date) VALUES (?, ?)', [
			eventID,
			date,
		]);

		const eventDateID = result.insertId;

		res.status(201).json({
			message: 'Event Date created successfully',
			eventDateID: eventDateID,
		});
	} catch (err) {
		res.status(500).json({ error: err.message });
	}
};

// Admin: Update an EventDate via it's id
export const updateEventDate = async (req, res) => {
	const { eventDateID } = req.params; // Get the event date id from URL parameters
	const { date } = req.body; // Update date and optionally times

	try {
		// Fetch the event date for the given event
		const [eventDateResult] = await pool.query('SELECT id FROM EventDates WHERE id = ?', [
			eventDateID,
		]);

		if (eventDateResult.length === 0) {
			return res.status(404).json({ error: 'Event date not found' });
		}
		// Update the date for the EventDate
		const [updatedEventDate] = await pool.query('UPDATE EventDates SET `date` = ? WHERE id = ?', [
			date,
			eventDateResult[0].id,
		]);

		if (updatedEventDate.affectedRows == 0) {
			return res.status(404).json({ error: 'Event date update failed' });
		}

		res.status(201).json({ message: 'Event date updated successfully', eventDateID });
	} catch (err) {
		console.error(err);
		res.status(500).json({ error: err.message });
	}
};

// Admin: Delete an EventDate with its eventDateID
export const deleteEventDate = async (req, res) => {
	const { eventDateID } = req.params;

	if (!eventDateID) {
		return res.status(400).json({ error: 'eventDateID is required for deletion' });
	}

	try {
		const [result] = await pool.query('DELETE FROM EventDates WHERE id = ?', [eventDateID]);

		if (result.affectedRows > 0) {
			res.status(200).json({
				message: 'Event Date deleted successfully',
			});
		} else {
			res.status(404).json({
				message: 'Event Date not found',
			});
		}
	} catch (err) {
		res.status(500).json({ error: err.message });
	}
};
