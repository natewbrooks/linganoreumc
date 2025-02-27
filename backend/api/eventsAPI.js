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

// Admin: Create Event
export const createEvent = async (req, res) => {
	const { title, description, date } = req.body;
	if (!title || !description || !date)
		return res.status(400).json({ error: 'All fields required' });

	try {
		const [result] = await pool.query(
			'INSERT INTO events (title, description, date) VALUES (?, ?, ?)',
			[title, description, date]
		);
		res.status(201).json({ message: 'Event created', eventId: result.insertId });
	} catch (err) {
		res.status(500).json({ error: err.message });
	}
};
