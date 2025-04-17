import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import pool from '../database.js';
import { fetchVideoMetadata, fetchTranscript } from '../middleware/youtubeScraper.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Base directories
const imagesDir = path.join(__dirname, '..', 'media', 'images');
const headerImagesDir = path.join(imagesDir, 'header');
const stainedGlassDir = path.join(imagesDir, 'stained-glass');
const eventImagesDir = path.join(imagesDir, 'events');

// In-memory cache
const imagePathMap = new Map();
let cacheBuilt = false;

export function buildImagePathCacheOnce() {
	if (cacheBuilt) return;
	if (!fs.existsSync(imagesDir)) {
		fs.mkdirSync(imagesDir, { recursive: true });
		console.log(`[INIT] Created missing image directory: ${imagesDir}`);
	}
	cacheBuilt = true;
	_recursiveCache(imagesDir);
	console.log(`Image path cache built: ${imagePathMap.size} files`);
}

function _recursiveCache(dir) {
	const entries = fs.readdirSync(dir, { withFileTypes: true });
	for (const entry of entries) {
		const fullPath = path.join(dir, entry.name);
		if (entry.isDirectory()) {
			_recursiveCache(fullPath);
		} else {
			imagePathMap.set(entry.name, fullPath);
		}
	}
}

// Unified GET helper for static images
function serveImageDir(res, baseDir, subDir) {
	try {
		const dir = path.join(baseDir, subDir);
		const files = fs.readdirSync(dir);
		const paths = files.map((file) => `${process.env.BASE_API_URL}/media/images/${subDir}/${file}`);
		res.json(paths);
	} catch (err) {
		res.status(500).json({ error: `Failed to fetch ${subDir} images.` });
	}
}

// GET /media/images/
export const getAllImages = (_, res) => {
	try {
		const paths = Array.from(imagePathMap.entries()).map(
			([filename]) => `${process.env.BASE_API_URL}/media/images/${filename}`
		);
		res.json(paths);
	} catch (err) {
		res.status(500).json({ error: err.message });
	}
};

export const getAllHeaderImages = (_, res) => serveImageDir(res, imagesDir, 'header');
export const getAllStainedGlassImages = (_, res) => serveImageDir(res, imagesDir, 'stained-glass');

export const getAllEventsImages = async (_, res) => {
	try {
		const [rows] = await pool.execute('SELECT * FROM EventPhotos');
		res.status(200).json(rows);
	} catch (err) {
		console.error('Error fetching all event images:', err);
		res.status(500).json({ error: err.message });
	}
};

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

export const getImage = (req, res) => {
	const { filename } = req.params;
	const fileLocation = imagePathMap.get(filename);
	if (!fileLocation || !fs.existsSync(fileLocation)) {
		return res.status(404).json({ error: 'Image not found.' });
	}
	return res.sendFile(fileLocation);
};

export const deleteImage = async (req, res) => {
	const { filename } = req.params;
	const fileLocation = imagePathMap.get(filename);

	if (!fileLocation || !fs.existsSync(fileLocation)) {
		return res.status(404).json({ error: 'Image not found.' });
	}

	fs.unlink(fileLocation, async (err) => {
		if (err) return res.status(500).json({ error: 'Failed to delete image.' });
		imagePathMap.delete(filename);

		try {
			const relativePath = path.relative(imagesDir, fileLocation).replace(/\\/g, '/');
			const match = relativePath.match(/^events\/(\d+)\/.+$/);
			if (match) {
				const eventID = match[1];
				const photoURL = `/media/images/${relativePath}`;
				await pool.execute('DELETE FROM EventPhotos WHERE eventID = ? AND photoURL = ?', [
					eventID,
					photoURL,
				]);
			}
			res.json({ message: 'Image deleted successfully.' });
		} catch (err) {
			res.status(500).json({ error: 'Image deleted but failed to update database.' });
		}
	});
};

const saveToCache = (filename, fullPath) => {
	imagePathMap.set(filename, fullPath);
};

export const uploadImage = (req, res) => {
	if (!req.file) return res.status(400).json({ error: 'No file uploaded.' });

	const sanitized = req.file.originalname.replace(/\s+/g, '-');
	const fullPath = path.join(imagesDir, sanitized);
	saveToCache(sanitized, fullPath);

	res.json({ filePath: `${process.env.BASE_API_URL}/media/images/${sanitized}` });
};

export const uploadHeaderImage = (req, res) => {
	if (!req.file) return res.status(400).json({ error: 'No file uploaded.' });

	const sanitized = req.file.originalname.replace(/\s+/g, '-');
	const filePath = `/media/images/header/${sanitized}`;
	const fullPath = path.join(headerImagesDir, sanitized);
	saveToCache(sanitized, fullPath);

	res.json({ filePath });
};

export const uploadStainedGlassImage = (req, res) => {
	if (!req.file) return res.status(400).json({ error: 'No file uploaded.' });

	const sanitized = req.file.originalname.replace(/\s+/g, '-');
	const filePath = `/media/images/stained-glass/${sanitized}`;
	const fullPath = path.join(stainedGlassDir, sanitized);
	saveToCache(sanitized, fullPath);

	res.json({ filePath });
};

export const uploadEventImage = async (req, res) => {
	if (!req.file) return res.status(400).json({ error: 'No file uploaded.' });

	const eventID = req.params.eventID;
	if (!eventID) return res.status(400).json({ error: 'Missing eventID in route params.' });

	try {
		const sanitized = req.file.originalname.replace(/\s+/g, '-');
		const filePath = `/media/images/events/${eventID}/${sanitized}`;
		const fullPath = path.join(eventImagesDir, eventID, sanitized);

		await pool.execute(
			'INSERT INTO EventPhotos (eventID, photoURL, isThumbnail) VALUES (?, ?, ?)',
			[eventID, filePath, false]
		);

		saveToCache(sanitized, fullPath);
		res.status(200).json({ filePath });
	} catch (err) {
		console.error('Error uploading event image:', err);
		res.status(500).json({ error: 'Failed to save image to database.' });
	}
};

export const scrapeYouTubeVideo = async (req, res) => {
	const { videoURL } = req.body;
	if (!videoURL) return res.status(400).json({ error: 'YouTube video URL must be provided' });

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
		res.status(500).json({ error: err.message });
	}
};

export const setEventPhotoThumbnail = async (req, res) => {
	const { eventID } = req.params;
	const { filename } = req.body;

	if (!filename) return res.status(400).json({ error: 'Missing filename' });

	const photoURL = `/media/images/events/${eventID}/${filename}`;

	try {
		await pool.execute('UPDATE EventPhotos SET isThumbnail = false WHERE eventID = ?', [eventID]);
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
