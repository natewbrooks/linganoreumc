import pool from '../../database.js';

// Public: View all Events
export const getAllEvents = async (req, res) => {
	try {
		const [rows] = await pool.query('SELECT * FROM Events');
		res.json(rows);
	} catch (err) {
		res.status(500).json({ error: err.message });
	}
};

// Public: View a specific Event via it's eventID
export const getEvent = async (req, res) => {
	const { id } = req.params;
	try {
		const [rows] = await pool.query('SELECT * FROM Events WHERE id = ?', [id]);
		if (rows.length === 0) {
			return res.status(404).json({ error: 'Event not found' });
		}
		res.json(rows[0]);
	} catch (err) {
		res.status(500).json({ error: err.message });
	}
};

// Public: View all recurring events
export const getRecurringEvents = async (req, res) => {
	try {
		const [rows] = await pool.query('SELECT * FROM Events WHERE isRecurring = 1');
		res.json(rows);
	} catch (err) {
		res.status(500).json({ error: err.message });
	}
};

// Public: View all featured events
export const getFeaturedEvents = async (req, res) => {
	try {
		const [rows] = await pool.query('SELECT * FROM Events WHERE isFeatured = 1');
		res.json(rows);
	} catch (err) {
		res.status(500).json({ error: err.message });
	}
};

// Admin: View all archived events
export const getArchivedEvents = async (req, res) => {
	try {
		const [rows] = await pool.query('SELECT * FROM Events WHERE isArchived = 1');
		res.json(rows);
	} catch (err) {
		res.status(500).json({ error: err.message });
	}
};

// Admin: Create a new Event
export const createEvent = async (req, res) => {
	const { title, description, isRecurring, isFeatured } = req.body;

	if (
		!title ||
		!description ||
		isRecurring === undefined ||
		isRecurring === null ||
		isFeatured === null
	) {
		return res.status(400).json({ error: 'All fields required' });
	}

	try {
		// Check if an event with the same title already exists (case-insensitive)
		const [existingEvents] = await pool.query(
			'SELECT COUNT(*) as count FROM Events WHERE LOWER(title) = LOWER(?)',
			[title]
		);

		if (existingEvents[0].count > 0) {
			return res.status(400).json({ error: 'An event with this title already exists' });
		}

		// Insert new event
		const [result] = await pool.query(
			'INSERT INTO Events (title, description, isRecurring, isFeatured) VALUES (?, ?, ?, ?)',
			[title, description, isRecurring, isFeatured]
		);

		const eventID = result.insertId;

		res.status(201).json({
			message: 'Event created successfully',
			eventID: eventID,
		});
	} catch (err) {
		res.status(500).json({ error: err.message });
	}
};

// Admin: Update an Event via it's eventID
export const updateEvent = async (req, res) => {
	const { id } = req.params;
	const { title, description, isRecurring, isFeatured } = req.body;

	if (!title || !description) {
		return res.status(400).json({ error: 'Title and description are required' });
	}

	try {
		const [result] = await pool.query(
			'UPDATE Events SET title = ?, description = ?, isRecurring = ?, isFeatured =? WHERE id = ?',
			[title, description, isRecurring, isFeatured, id]
		);

		console.log(JSON.stringify(result));
		if (result.affectedRows == 0) {
			return res.status(404).json({ error: 'Event not found' });
		}

		res.status(201).json({
			message: 'Event updated successfully',
			id,
		});
	} catch (err) {
		res.json({ error: err.message });
	}
};
