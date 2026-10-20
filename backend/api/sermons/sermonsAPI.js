import pool from '../../database.js';
import buildSlugs from '../buildSlugs.js';

// Public: View all sermons
export const getAllSermons = async (req, res) => {
	try {
		const [rows] = await pool.query('SELECT * FROM Sermons ORDER BY id');
		const slugs = buildSlugs(rows);
		res.json(rows.map((s) => ({ ...s, slug: slugs[s.id] })));
	} catch (err) {
		res.status(500).json({ error: err.message });
	}
};

// Public: Get a single sermon by ID
export const getSermon = async (req, res) => {
	const { id } = req.params;

	try {
		const [rows] = await pool.query('SELECT * FROM Sermons ORDER BY id');
		const slugs = buildSlugs(rows);
		// Accepts a slug, or a numeric ID for old links
		const sermon = rows.find((s) => String(s.id) === id) ?? rows.find((s) => slugs[s.id] === id);
		if (!sermon) {
			return res.status(404).json({ error: 'Sermon not found' });
		}
		res.json({ ...sermon, slug: slugs[sermon.id] });
	} catch (err) {
		res.status(500).json({ error: err.message });
	}
};

// Admin: View all archived sermons
export const getArchivedSermons = async (req, res) => {
	try {
		const [rows] = await pool.query('SELECT * FROM Sermons WHERE isArchived = 1');
		res.json(rows);
	} catch (err) {
		res.status(500).json({ error: err.message });
	}
};

// Admin: Create a new sermon from a YouTube video
export const createSermon = async (req, res) => {
	const { title, description, body, videoURL, publishDate } = req.body;

	if (!title || !body) {
		return res.status(400).json({ error: 'Required fields missing: title, body, or videoURL' });
	}

	try {
		const [result] = await pool.query(
			`INSERT INTO Sermons (title, description, body, videoURL, publishDate)
			 VALUES (?, ?, ?, ?, ?)`,
			[title, description, body, videoURL, publishDate || null]
		);

		res.status(201).json({
			message: 'Sermon created successfully',
			sermonID: result.insertId,
		});
	} catch (err) {
		console.error('Create sermon failed:', err);
		res.status(500).json({ error: err.message });
	}
};

// Admin: Update a sermon by ID
export const updateSermon = async (req, res) => {
	const { id } = req.params;
	const { title, description, body, videoURL, publishDate, isArchived } = req.body;

	console.log('Update Request:', {
		id,
		title,
		description,
		body,
		videoURL,
		publishDate,
		isArchived,
	});

	const safePublishDate = publishDate && publishDate !== '' ? publishDate : null;

	try {
		const [result] = await pool.query(
			`UPDATE Sermons 
			 SET title = ?, description = ?, body = ?, videoURL = ?, publishDate = ?, isArchived = ?
			 WHERE id = ?`,
			[title, description, body, videoURL, safePublishDate, isArchived ?? false, id]
		);

		if (result.affectedRows === 0) {
			return res.status(404).json({ error: 'Sermon not found' });
		}

		res.status(200).json({
			message: 'Sermon updated successfully',
			id,
		});
	} catch (err) {
		console.error('Update sermon failed:', err);
		res.status(500).json({ error: err.message });
	}
};

// Admin: Delete a sermon by ID
export const deleteSermon = async (req, res) => {
	const { id } = req.params;

	try {
		const [result] = await pool.query('DELETE FROM Sermons WHERE id = ?', [id]);

		if (result.affectedRows === 0) {
			return res.status(404).json({ error: 'Sermon not found' });
		}

		res.status(200).json({ message: 'Sermon deleted successfully', id });
	} catch (err) {
		res.status(500).json({ error: err.message });
	}
};
