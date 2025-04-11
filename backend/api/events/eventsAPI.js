import pool from '../../database.js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Use project root as base (not __dirname) to resolve relative to where Node.js is run
const imagesDir = path.resolve(process.cwd(), 'media', 'images');
const eventImagesDir = path.join(imagesDir, 'events');

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
	const { title, description, isRecurring, isFeatured, isDraft } = req.body;

	if (isDraft === undefined || isRecurring === undefined || isFeatured === undefined) {
		return res.status(400).json({ error: 'Missing required flags' });
	}

	if (!isDraft && (!title || !description)) {
		return res.status(400).json({ error: 'Title and description are required for non-drafts' });
	}

	try {
		// Only enforce title uniqueness for finalized events
		if (!isDraft && title) {
			const [existingEvents] = await pool.query(
				'SELECT COUNT(*) as count FROM Events WHERE LOWER(title) = LOWER(?)',
				[title]
			);

			if (existingEvents[0].count > 0) {
				return res.status(400).json({ error: 'An event with this title already exists' });
			}
		}

		const [result] = await pool.query(
			'INSERT INTO Events (title, description, isRecurring, isFeatured, isDraft) VALUES (?, ?, ?, ?, ?)',
			[title || '', description || '', isRecurring, isFeatured, isDraft]
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
	const { title, description, isRecurring, isFeatured, isArchived, isDraft } = req.body;

	if (!title || !description) {
		return res.status(400).json({ error: 'Title and description are required' });
	}

	try {
		const [result] = await pool.query(
			'UPDATE Events SET title = ?, description = ?, isRecurring = ?, isFeatured = ?, isArchived = ?, isDraft = ? WHERE id = ?',
			[title, description, isRecurring, isFeatured, isArchived, isDraft, id]
		);

		if (result.affectedRows == 0) {
			return res.status(404).json({ error: 'Event not found' });
		}

		res.status(200).json({
			message: 'Event updated successfully',
			id,
		});
	} catch (err) {
		res.status(500).json({ error: err.message });
	}
};

export const deleteEvent = async (req, res) => {
	const { id: eventID } = req.params;

	try {
		// 1. Delete from Events table
		const [result] = await pool.query('DELETE FROM Events WHERE id = ?', [eventID]);

		if (result.affectedRows === 0) {
			console.warn(`Event ${eventID} not found in DB`);
			return res.status(404).json({ error: 'Event not found' });
		}

		// 2. Build and log event image folder path
		const eventImagePath = path.join(eventImagesDir, String(eventID));
		console.log('Resolved event image path:', eventImagePath);

		// 3. Check existence and attempt to delete
		if (fs.existsSync(eventImagePath)) {
			fs.rmSync(eventImagePath, { recursive: true, force: true });
			console.log(`Deleted folder: ${eventImagePath}`);
		} else {
			console.log(`No image folder exists for event ${eventID} at path: ${eventImagePath}`);
		}

		res.json({ message: `Event ${eventID} and associated images deleted.` });
	} catch (err) {
		console.error('Error deleting event or folder:', err);
		res.status(500).json({ error: 'Failed to delete event.' });
	}
};
