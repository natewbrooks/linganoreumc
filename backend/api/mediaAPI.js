import pool from '../database.js';

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Base directories
const imagesDir = path.join(__dirname, '..', 'media', 'images');
const headerImagesDir = path.join(imagesDir, 'header');
const stainedGlassDir = path.join(imagesDir, 'stained-glass');
const eventImagesDir = path.join(imagesDir, 'events');

import { fetchVideoMetadata, fetchTranscript } from '../middleware/youtubeScraper.js';

// Helper: Recursively get all file paths
function getAllFilesRecursively(dir) {
	let results = [];
	const list = fs.readdirSync(dir, { withFileTypes: true });

	for (const entry of list) {
		const fullPath = path.join(dir, entry.name);
		if (entry.isDirectory()) {
			results = results.concat(getAllFilesRecursively(fullPath));
		} else {
			results.push(fullPath);
		}
	}
	return results;
}

// Helper: Recursively find file by filename
function findFileRecursively(dir, targetFilename) {
	const entries = fs.readdirSync(dir, { withFileTypes: true });

	for (const entry of entries) {
		const fullPath = path.join(dir, entry.name);
		if (entry.isDirectory()) {
			const found = findFileRecursively(fullPath, targetFilename);
			if (found) return found;
		} else if (entry.name === targetFilename) {
			return fullPath;
		}
	}
	return null;
}

// GET /api/media/images/
export const getAllImages = (req, res) => {
	try {
		const allFiles = getAllFilesRecursively(imagesDir);
		const paths = allFiles.map(
			(file) => '/api/media/images/' + path.relative(imagesDir, file).replace(/\\/g, '/')
		);
		res.json(paths);
	} catch (err) {
		res.status(500).json({ error: err.message });
	}
};

// GET /api/media/images/header/
export const getAllHeaderImages = (req, res) => {
	try {
		const headerFiles = getAllFilesRecursively(headerImagesDir);
		const paths = headerFiles.map(
			(file) => '/api/media/images/' + path.relative(imagesDir, file).replace(/\\/g, '/')
		);
		res.json(paths);
	} catch (err) {
		res.status(500).json({ error: err.message });
	}
};

// GET /api/media/images/stained-glass/
export const getAllStainedGlassImages = (req, res) => {
	try {
		const files = getAllFilesRecursively(stainedGlassDir);
		const paths = files.map(
			(file) => '/api/media/images/' + path.relative(imagesDir, file).replace(/\\/g, '/')
		);
		res.json(paths);
	} catch (err) {
		res.status(500).json({ error: err.message });
	}
};

// GET /api/media/images/events/
// export const getAllEventsImages = (req, res) => {
// 	try {
// 		const eventImageFiles = getAllFilesRecursively(eventImagesDir);
// 		const paths = eventImageFiles.map(
// 			(file) => '/api/media/images/' + path.relative(imagesDir, file).replace(/\\/g, '/')
// 		);
// 		res.json(paths);
// 	} catch (err) {
// 		res.status(500).json({ error: err.message });
// 	}
// };
export const getAllEventsImages = async (req, res) => {
	try {
		const [rows] = await pool.execute('SELECT * FROM EventPhotos');
		res.status(200).json(rows);
	} catch (err) {
		console.error('Error fetching all event images from EventPhotos table:', err);
		res.status(500).json({ error: err.message });
	}
};

// GET /api/media/images/events/:eventID
// export const getAllEventImages = (req, res) => {
// 	try {
// 		const eventID = req.params.eventID;
// 		const eventPath = path.join(eventImagesDir, eventID);

// 		if (!fs.existsSync(eventPath)) {
// 			return res.json([]); // No images yet, return empty list
// 		}

// 		const eventImageFiles = getAllFilesRecursively(eventPath);
// 		const paths = eventImageFiles.map(
// 			(file) => '/api/media/images/' + path.relative(imagesDir, file).replace(/\\/g, '/')
// 		);

// 		res.json(paths);
// 	} catch (err) {
// 		console.error(`Error fetching images for event ${req.params.eventID}:`, err);
// 		res.status(500).json({ error: err.message });
// 	}
// };
export const getAllEventImages = async (req, res) => {
	try {
		const { eventID } = req.params;

		const [rows] = await pool.execute('SELECT * FROM EventPhotos WHERE eventID = ?', [eventID]);

		res.status(200).json(rows);
	} catch (err) {
		console.error(`Error fetching images for event ${req.params.eventID}:`, err);
		res.status(500).json({ error: err.message });
	}
};

// GET /api/media/images/:filename
export const getImage = (req, res) => {
	const { filename } = req.params;
	const fileLocation = findFileRecursively(imagesDir, filename);
	if (!fileLocation) {
		return res.status(404).json({ error: 'Image not found.' });
	}
	return res.sendFile(fileLocation);
};

// DELETE /api/media/images/:filename
// deletes relevant EventPhoto from database if applicable
export const deleteImage = async (req, res) => {
	const { filename } = req.params;

	const fileLocation = findFileRecursively(imagesDir, filename);
	if (!fileLocation || !fs.existsSync(fileLocation)) {
		return res.status(404).json({ error: 'Image not found.' });
	}

	fs.unlink(fileLocation, async (err) => {
		if (err) return res.status(500).json({ error: 'Failed to delete image.' });

		try {
			// Check if path contains "events/{eventID}/filename"
			const relativePath = path.relative(imagesDir, fileLocation).replace(/\\/g, '/'); // cross-platform
			const match = relativePath.match(/^events\/(\d+)\/.+$/);

			if (match) {
				const eventID = match[1];
				const photoURL = `/api/media/images/${relativePath}`;

				await pool.execute('DELETE FROM EventPhotos WHERE eventID = ? AND photoURL = ?', [
					eventID,
					photoURL,
				]);
			}

			res.json({ message: 'Image deleted successfully.' });
		} catch (dbErr) {
			console.error('Error deleting EventPhotos entry:', dbErr);
			res.status(500).json({ error: 'Image deleted but failed to update database.' });
		}
	});
};

// POST /api/admin/media/images/
export const uploadImage = (req, res) => {
	if (!req.file) return res.status(400).json({ error: 'No file uploaded.' });

	const sanitized = req.file.originalname.replace(/\s+/g, '-');

	res.json({ filePath: '/api/media/images/' + sanitized });
};

// POST /api/admin/media/images/header/
export const uploadHeaderImage = (req, res) => {
	if (!req.file) return res.status(400).json({ error: 'No file uploaded.' });

	const sanitized = req.file.originalname.replace(/\s+/g, '-');

	res.json({ filePath: '/api/media/images/header/' + sanitized });
};

// POST /api/admin/media/images/stained-glass/
export const uploadStainedGlassImage = (req, res) => {
	if (!req.file) return res.status(400).json({ error: 'No file uploaded.' });

	const sanitized = req.file.originalname.replace(/\s+/g, '-');
	res.json({ filePath: '/api/media/images/stained-glass/' + sanitized });
};

// POST /api/admin/media/images/events/:eventID
export const uploadEventImage = async (req, res) => {
	if (!req.file) {
		return res.status(400).json({ error: 'No file uploaded.' });
	}

	const eventID = req.params.eventID;
	if (!eventID) {
		return res.status(400).json({ error: 'Missing eventID in route params.' });
	}

	try {
		const sanitized = req.file.originalname.replace(/\s+/g, '-');
		const filePath = `/api/media/images/events/${eventID}/${sanitized}`;

		// Insert image into EventPhotos table
		await pool.execute(
			'INSERT INTO EventPhotos (eventID, photoURL, isThumbnail) VALUES (?, ?, ?)',
			[eventID, filePath, false]
		);

		res.status(200).json({ filePath });
	} catch (err) {
		console.error('Error uploading event image:', err);
		res.status(500).json({ error: 'Failed to save image to database.' });
	}
};

export const scrapeYouTubeVideo = async (req, res) => {
	console.log(req.body);
	const { videoURL } = req.body;

	if (!videoURL) {
		return res.status(400).json({ error: 'YouTube video URL must be provided' });
	}

	try {
		const metadata = await fetchVideoMetadata(videoURL);
		const transcript = await fetchTranscript(videoURL);

		if (!metadata.title) {
			return res.status(400).json({
				error: 'Failed to extract video metadata. Ensure the YouTube URL is valid and public.',
			});
		}

		return res.status(200).json({
			title: metadata.title,
			description: metadata.description,
			body: transcript,
			videoURL,
			publishDate: metadata.publishDate,
		});
	} catch (err) {
		console.error('Error scraping video:', err);
		res.status(500).json({ error: err.message });
	}
};

export const setEventPhotoThumbnail = async (req, res) => {
	const { eventID } = req.params;
	const { filename } = req.body;

	if (!filename) return res.status(400).json({ error: 'Missing filename' });

	console.log('Setting eventID: ', eventID, ' thumbnail to: ', filename);

	// Rebuild photoURL from known path structure
	const photoURL = `/api/media/images/events/${eventID}/${filename}`;

	try {
		// Unset all current thumbnails for the event
		await pool.execute('UPDATE EventPhotos SET isThumbnail = false WHERE eventID = ?', [eventID]);

		// Set the selected image as the new thumbnail
		await pool.execute(
			'UPDATE EventPhotos SET isThumbnail = true WHERE eventID = ? AND photoURL = ?',
			[eventID, photoURL]
		);

		res.status(200).json({ success: true });
	} catch (err) {
		console.error('Failed to update thumbnail:', err);
		res.status(500).json({ error: 'Server error' });
	}
};
