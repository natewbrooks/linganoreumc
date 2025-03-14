import pool from '../../database.js';

// Public: View all EventTimes
export const getAllEventTimes = async (req, res) => {
	try {
		const [rows] = await pool.query('SELECT * FROM EventTimes');
		res.json(rows);
	} catch (err) {
		res.status(500).json({ error: err.message });
	}
};

// Public: View all EventTimes for a specific EventDate via it's eventDateID
export const getEventTimes = async (req, res) => {
	const { eventDateID } = req.params;
	try {
		const [rows] = await pool.query('SELECT * FROM EventTimes WHERE eventDateID = ?', [
			eventDateID,
		]);
		res.status(200).json(rows);
	} catch (err) {
		res.status(500).json({ error: err.message });
	}
};

// Public: View a specific EventTime by it's id
export const getEventTime = async (req, res) => {
	const { id } = req.params;
	try {
		const [rows] = await pool.query('SELECT * FROM EventTimes WHERE id = ?', [id]);
		if (rows.length === 0) {
			return res.status(404).json({ error: 'Event time not found' });
		}
		res.json(rows[0]);
	} catch (err) {
		res.status(500).json({ error: err.message });
	}
};

// Admin: Create a new EventTime associated with an EventDate via it's eventDateID
export const createEventTime = async (req, res) => {
	const { eventDateID, time } = req.body;

	if (!eventDateID || !time) {
		return res.status(400).json({ error: 'EventDateID and time are required' });
	}

	try {
		// Insert the new event time
		const [result] = await pool.query('INSERT INTO EventTimes (eventDateID, time) VALUES (?, ?)', [
			eventDateID,
			time,
		]);

		res.status(201).json({
			message: 'Event time created',
			eventTimeID: result.insertId,
		});
	} catch (err) {
		res.status(500).json({ error: err.message });
	}
};

// Admin: Update an EventTime via it's id
export const updateEventTime = async (req, res) => {
	const { eventTimeID } = req.params;
	const { time } = req.body;

	if (!time) {
		return res.status(400).json({ error: 'Time is required' });
	}

	try {
		// Update the event time in the EventTimes table
		const [result] = await pool.query('UPDATE EventTimes SET `time` = ? WHERE id = ?', [
			time,
			eventTimeID,
		]);

		if (result.affectedRows === 0) {
			return res.status(404).json({ error: 'Event time not found' });
		}

		res.json({ message: 'Event time updated successfully', eventTimeID });
	} catch (err) {
		res.status(500).json({ error: err.message });
	}
};

// Admin: Delete all EventTimes for an EventDate
export const deleteEventTimes = async (req, res) => {
	const { eventDateID } = req.params;

	try {
		const [result] = await pool.query('DELETE FROM EventTimes WHERE eventDateID = ?', [
			eventDateID,
		]);

		console.log(JSON.stringify(eventDateID));

		res.json({ message: 'All event times for the event date deleted successfully', eventDateID });
	} catch (err) {
		res.status(500).json({ error: err.message });
	}
};
