import pool from '../database.js';

// Public: View Events
export const getEvents = async (req, res) => {
	try {
		const [rows] = await pool.query('SELECT * FROM events');
		res.json(rows);
	} catch (err) {
		res.status(500).json({ error: err.message });
	}
};

// Public: View a Specific Event
export const getEvent = async (req, res) => {
	const { id } = req.params; // Get the event id from URL parameters
	try {
		const [rows] = await pool.query('SELECT * FROM events WHERE id = ?', [id]);
		if (rows.length === 0) {
			return res.status(404).json({ error: 'Event not found' });
		}
		res.json(rows[0]); // Return the single event object
	} catch (err) {
		res.status(500).json({ error: err.message });
	}
};

// Admin: Create Event
export const createEvent = async (req, res) => {
	// Destructure request
	const { title, description, isRecurring } = req.body;

	// Validate required fields.
	if (!title || !description || isRecurring === undefined || isRecurring === null) {
		return res.status(400).json({ error: 'All fields required' });
	}

	try {
		const [result] = await pool.query(
			'INSERT INTO events (title, description, isRecurring) VALUES (?, ?, ?)',
			[title, description, isRecurring]
		);
		res.status(201).json({ message: 'Event created', eventId: result.insertId });
	} catch (err) {
		res.status(500).json({ error: err.message });
	}
};

// Admin: Update Event
export const updateEvent = async (req, res) => {
	const { id } = req.params; // Get the event id from URL parameters
	const { title, description, isRecurring } = req.body;

	// Validate required fields.
	if (!title || !description) {
		return res.status(400).json({ error: 'All fields required' });
	}

	try {
		const [result] = await pool.query(
			'UPDATE events SET title = ?, description = ?, isRecurring = ? WHERE id = ?',
			[title, description, isRecurring, id]
		);
		if (result.affectedRows === 0) {
			return res.status(404).json({ error: 'Event not found' });
		}
		res.json({ message: 'Event updated successfully' });
	} catch (err) {
		res.status(500).json({ error: err.message });
	}
};
