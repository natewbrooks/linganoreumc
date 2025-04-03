import pool from '../../database.js';

// GET: All event dates
export const getAllEventDates = async (req, res) => {
	try {
		const [rows] = await pool.query('SELECT * FROM EventDates');
		res.json(rows);
	} catch (err) {
		res.status(500).json({ error: err.message });
	}
};

// GET: All dates for a specific event
export const getEventDates = async (req, res) => {
	const { eventID } = req.params;
	try {
		const [rows] = await pool.query('SELECT * FROM EventDates WHERE eventID = ?', [eventID]);
		res.json(rows);
	} catch (err) {
		res.status(500).json({ error: err.message });
	}
};

// GET: Single date by ID
export const getEventDate = async (req, res) => {
	const { id } = req.params;
	try {
		const [rows] = await pool.query('SELECT * FROM EventDates WHERE id = ?', [id]);
		if (rows.length === 0) {
			return res.status(404).json({ error: 'Event Date not found' });
		}
		res.json(rows[0]);
	} catch (err) {
		res.status(500).json({ error: err.message });
	}
};

// POST: Create new EventDate
export const createEventDate = async (req, res) => {
	const { eventID, date, isCancelled = false } = req.body;

	if (!eventID || !date) {
		return res.status(400).json({ error: 'EventID and date are required' });
	}

	try {
		console.log('Creating EventDate:', { eventID, date, isCancelled });

		const [result] = await pool.query(
			'INSERT INTO EventDates (eventID, date, isCancelled) VALUES (?, ?, ?)',
			[eventID, date, isCancelled ? 1 : 0]
		);

		const eventDateID = result.insertId;
		res.status(201).json({
			message: 'Event Date created successfully',
			eventDateID,
		});
	} catch (err) {
		console.error('Create EventDate error:', err);
		res.status(500).json({ error: err.message });
	}
};

// PUT: Update an existing EventDate
export const updateEventDate = async (req, res) => {
	const { eventDateID } = req.params;
	const { date, isCancelled = false } = req.body;

	if (!eventDateID || !date) {
		return res.status(400).json({ error: 'eventDateID and date are required' });
	}

	try {
		console.log('Updating EventDate:', { eventDateID, date, isCancelled });

		const [check] = await pool.query('SELECT id FROM EventDates WHERE id = ?', [eventDateID]);
		if (check.length === 0) {
			return res.status(404).json({ error: 'Event date not found' });
		}

		const [updated] = await pool.query(
			'UPDATE EventDates SET date = ?, isCancelled = ? WHERE id = ?',
			[date, isCancelled ? 1 : 0, eventDateID]
		);

		if (updated.affectedRows === 0) {
			return res.status(500).json({ error: 'Event date update failed' });
		}

		res.status(200).json({
			message: 'Event date updated successfully',
			eventDateID,
		});
	} catch (err) {
		console.error('Update EventDate error:', err);
		res.status(500).json({ error: err.message });
	}
};

// DELETE: Delete EventDate by ID
export const deleteEventDate = async (req, res) => {
	const { eventDateID } = req.params;

	if (!eventDateID) {
		return res.status(400).json({ error: 'eventDateID is required for deletion' });
	}

	try {
		const [result] = await pool.query('DELETE FROM EventDates WHERE id = ?', [eventDateID]);

		if (result.affectedRows > 0) {
			res.status(200).json({ message: 'Event Date deleted successfully' });
		} else {
			res.status(404).json({ error: 'Event Date not found' });
		}
	} catch (err) {
		res.status(500).json({ error: err.message });
	}
};
