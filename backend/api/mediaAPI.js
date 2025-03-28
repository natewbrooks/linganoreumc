import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Base directories
const imagesDir = path.join(__dirname, '..', 'media', 'images');
const headerImagesDir = path.join(imagesDir, 'header');

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
export const deleteImage = (req, res) => {
	const { filename } = req.params;
	const fileLocation = findFileRecursively(imagesDir, filename);
	if (!fileLocation || !fs.existsSync(fileLocation)) {
		return res.status(404).json({ error: 'Image not found.' });
	}
	fs.unlink(fileLocation, (err) => {
		if (err) return res.status(500).json({ error: 'Failed to delete image.' });
		res.json({ message: 'Image deleted successfully.' });
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
