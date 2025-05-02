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

// Helper function to get API URL for an image path
function getApiUrl(relativePath) {
	return `${process.env.API_BASE_URL}/media/images/${relativePath}`;
}

export function buildImagePathCacheOnce() {
	if (cacheBuilt) return;
	if (!fs.existsSync(imagesDir)) {
		fs.mkdirSync(imagesDir, { recursive: true });
		console.log(`[INIT] Created missing image directory: ${imagesDir}`);
	}

	// Create subdirectories if they don't exist
	[headerImagesDir, stainedGlassDir, eventImagesDir].forEach((dir) => {
		if (!fs.existsSync(dir)) {
			fs.mkdirSync(dir, { recursive: true });
			console.log(`[INIT] Created missing image directory: ${dir}`);
		}
	});

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
			// Store the full filesystem path for internal operations
			imagePathMap.set(entry.name, fullPath);

			// Also store with relative path patterns for lookup during deletion
			const relativePath = path.relative(imagesDir, fullPath).replace(/\\/g, '/');
			imagePathMap.set(relativePath, fullPath);
		}
	}
}

// Unified GET helper for static images
function serveImageDir(res, baseDir, subDir) {
	try {
		const dir = path.join(baseDir, subDir);
		if (!fs.existsSync(dir)) {
			fs.mkdirSync(dir, { recursive: true });
		}

		const files = fs.readdirSync(dir);
		const paths = files.map((file) => getApiUrl(`${subDir}/${file}`));
		res.json(paths);
	} catch (err) {
		console.error(`Failed to fetch ${subDir} images:`, err);
		res.status(500).json({ error: `Failed to fetch ${subDir} images.` });
	}
}

// GET /media/images/
export const getAllImages = (_, res) => {
	try {
		const paths = [];
		for (const [filename, fullPath] of imagePathMap.entries()) {
			// Skip entries with slashes which are our path-keyed entries
			if (!filename.includes('/') && fs.existsSync(fullPath)) {
				paths.push(getApiUrl(filename));
			}
		}
		res.json(paths);
	} catch (err) {
		console.error('Error getting all images:', err);
		res.status(500).json({ error: err.message });
	}
};

export const getAllHeaderImages = (_, res) => serveImageDir(res, imagesDir, 'header');
export const getAllStainedGlassImages = (_, res) => serveImageDir(res, imagesDir, 'stained-glass');

export const getAllEventsImages = async (_, res) => {
	try {
		const [rows] = await pool.execute('SELECT * FROM EventPhotos');
		// Make sure URLs use the API_BASE_URL
		const updatedRows = rows.map((row) => ({
			...row,
			photoURL: row.photoURL.replace(
				/^.*\/media\/images/,
				`${process.env.API_BASE_URL}/media/images`
			),
		}));
		res.status(200).json(updatedRows);
	} catch (err) {
		console.error('Error fetching all event images:', err);
		res.status(500).json({ error: err.message });
	}
};

export const getAllEventImages = async (req, res) => {
	try {
		const { eventID } = req.params;
		const [rows] = await pool.execute('SELECT * FROM EventPhotos WHERE eventID = ?', [eventID]);
		// Make sure URLs use the API_BASE_URL
		const updatedRows = rows.map((row) => ({
			...row,
			photoURL: row.photoURL.replace(
				/^.*\/media\/images/,
				`${process.env.API_BASE_URL}/media/images`
			),
		}));
		res.status(200).json(updatedRows);
	} catch (err) {
		console.error(`Error fetching images for event ${req.params.eventID}:`, err);
		res.status(500).json({ error: err.message });
	}
};

export const getImage = (req, res) => {
	const { filename } = req.params;

	// Try direct lookup first
	let fileLocation = imagePathMap.get(filename);

	// If not found, check if it's in a subdirectory
	if (!fileLocation || !fs.existsSync(fileLocation)) {
		// Try to find in the cache by iterating through all entries
		for (const [key, value] of imagePathMap.entries()) {
			if (key.endsWith(`/${filename}`)) {
				fileLocation = value;
				break;
			}
		}
	}

	if (!fileLocation || !fs.existsSync(fileLocation)) {
		return res.status(404).json({ error: 'Image not found.' });
	}

	return res.sendFile(fileLocation);
};

export const deleteImage = async (req, res) => {
	const { filename } = req.params;
	let fileLocation = imagePathMap.get(filename);
	let relativePath = null;

	// If not found directly, try to find it in subdirectories
	if (!fileLocation || !fs.existsSync(fileLocation)) {
		for (const [key, value] of imagePathMap.entries()) {
			if (key.includes('/') && key.endsWith(`/${filename}`)) {
				fileLocation = value;
				relativePath = key;
				break;
			}
		}
	} else {
		// If found directly, determine the relative path
		relativePath = path.relative(imagesDir, fileLocation).replace(/\\/g, '/');
	}

	if (!fileLocation || !fs.existsSync(fileLocation)) {
		return res.status(404).json({ error: 'Image not found.' });
	}

	fs.unlink(fileLocation, async (err) => {
		if (err) {
			console.error('Failed to delete image:', err);
			return res.status(500).json({ error: 'Failed to delete image.' });
		}

		// Remove from cache - both by filename and by relative path
		imagePathMap.delete(filename);
		if (relativePath) {
			imagePathMap.delete(relativePath);
		}

		try {
			// Check if this is an event photo that needs DB cleanup
			const match = relativePath ? relativePath.match(/^events\/(\d+)\/.+$/) : null;
			if (match) {
				const eventID = match[1];
				const photoURL = getApiUrl(relativePath);
				await pool.execute('DELETE FROM EventPhotos WHERE eventID = ? AND photoURL = ?', [
					eventID,
					photoURL,
				]);
			}
			res.json({ message: 'Image deleted successfully.' });
		} catch (err) {
			console.error('Database error after image deletion:', err);
			res.status(500).json({ error: 'Image deleted but failed to update database.' });
		}
	});
};

const saveToCache = (filename, fullPath) => {
	const relativePath = path.relative(imagesDir, fullPath).replace(/\\/g, '/');
	imagePathMap.set(filename, fullPath);
	imagePathMap.set(relativePath, fullPath);
};

const ensureDirectoryExists = (dirPath) => {
	if (!fs.existsSync(dirPath)) {
		fs.mkdirSync(dirPath, { recursive: true });
	}
};

export const uploadImage = (req, res) => {
	if (!req.file) return res.status(400).json({ error: 'No file uploaded.' });

	const sanitized = req.file.originalname.replace(/\s+/g, '-');
	const fullPath = path.join(imagesDir, sanitized);
	saveToCache(sanitized, fullPath);

	res.json({ filePath: getApiUrl(sanitized) });
};

export const uploadHeaderImage = (req, res) => {
	if (!req.file) return res.status(400).json({ error: 'No file uploaded.' });

	ensureDirectoryExists(headerImagesDir);
	const sanitized = req.file.originalname.replace(/\s+/g, '-');
	const fullPath = path.join(headerImagesDir, sanitized);
	saveToCache(`header/${sanitized}`, fullPath);

	res.json({ filePath: getApiUrl(`header/${sanitized}`) });
};

export const uploadStainedGlassImage = (req, res) => {
	if (!req.file) return res.status(400).json({ error: 'No file uploaded.' });

	ensureDirectoryExists(stainedGlassDir);
	const sanitized = req.file.originalname.replace(/\s+/g, '-');
	const fullPath = path.join(stainedGlassDir, sanitized);
	saveToCache(`stained-glass/${sanitized}`, fullPath);

	res.json({ filePath: getApiUrl(`stained-glass/${sanitized}`) });
};

export const uploadEventImage = async (req, res) => {
	if (!req.file) return res.status(400).json({ error: 'No file uploaded.' });

	const eventID = req.params.eventID;
	if (!eventID) return res.status(400).json({ error: 'Missing eventID in route params.' });

	try {
		const eventDir = path.join(eventImagesDir, eventID);
		ensureDirectoryExists(eventDir);

		const sanitized = req.file.originalname.replace(/\s+/g, '-');
		const relativePath = `events/${eventID}/${sanitized}`;
		const fullPath = path.join(eventImagesDir, eventID, sanitized);
		const apiUrl = getApiUrl(relativePath);

		saveToCache(relativePath, fullPath);

		await pool.execute(
			'INSERT INTO EventPhotos (eventID, photoURL, isThumbnail) VALUES (?, ?, ?)',
			[eventID, apiUrl, false]
		);

		res.status(200).json({ filePath: apiUrl });
	} catch (err) {
		console.error('Error uploading event image:', err);
		res.status(500).json({ error: 'Failed to save image to database.' });
	}
};

export const scrapeYouTubeVideo = async (req, res) => {
	const { videoURL } = req.body;
	if (!videoURL) {
		return res.status(400).json({ error: 'YouTube video URL must be provided' });
	}

	try {
		const metadata = await fetchVideoMetadata(videoURL);
		if (!metadata.title) {
			return res.status(400).json({
				error:
					'Failed to extract video metadata. Ensure the YouTube URL is valid, public, and accessible.',
			});
		}

		let transcript = '';
		let transcriptAvailable = false;

		try {
			transcript = await fetchTranscript(videoURL);
			if (transcript && transcript.trim() !== '') {
				transcriptAvailable = true;
			} else {
				transcript = '[Transcript unavailable]';
			}
		} catch (err) {
			console.warn(`Transcript fetch failed for ${videoURL}: ${err.message}`);
			transcript = '[Transcript unavailable]';
		}

		return res.status(200).json({
			title: metadata.title,
			description: metadata.description,
			body: transcript,
			videoURL,
			publishDate: metadata.publishDate,
			transcriptAvailable,
		});
	} catch (err) {
		console.error('YouTube scraping error:', err);
		res.status(500).json({ error: 'Internal server error during YouTube scrape.' });
	}
};

export const setEventPhotoThumbnail = async (req, res) => {
	const { eventID } = req.params;
	const { filename } = req.body;

	if (!filename) return res.status(400).json({ error: 'Missing filename' });

	try {
		const relativePath = `events/${eventID}/${filename}`;
		const apiUrl = getApiUrl(relativePath);

		await pool.execute('UPDATE EventPhotos SET isThumbnail = false WHERE eventID = ?', [eventID]);
		await pool.execute(
			'UPDATE EventPhotos SET isThumbnail = true WHERE eventID = ? AND photoURL = ?',
			[eventID, apiUrl]
		);

		res.status(200).json({ success: true });
	} catch (err) {
		console.error('Failed to update thumbnail:', err);
		res.status(500).json({ error: 'Server error' });
	}
};
