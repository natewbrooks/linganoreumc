import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Set images directory to point to "media/images" (assuming api folder is a sibling to media)
const imagesDir = path.join(__dirname, '..', 'media', 'images');

export const uploadImage = (req, res) => {
	// If multer didn't find a file
	if (!req.file) {
		return res.status(400).json({ error: 'No file uploaded.' });
	}

	// Return the public URL of the uploaded image.
	// Because the public media router is mounted at /api/media/images,
	// we return a URL using that prefix.
	const filePath = '/api/media/images/' + req.file.filename;
	return res.json({ filePath });
};

export const getAllImages = (req, res) => {
	fs.readdir(imagesDir, (err, files) => {
		if (err) {
			return res.status(500).json({ error: err.message });
		}
		// Create an array of accessible paths, e.g. /api/media/images/<filename>
		const filePaths = files.map((file) => '/api/media/images/' + file);
		return res.json(filePaths);
	});
};

export const getImage = (req, res) => {
	const { filename } = req.params;
	const fileLocation = path.join(imagesDir, filename);

	if (!fs.existsSync(fileLocation)) {
		return res.status(404).json({ error: 'Image not found.' });
	}

	return res.sendFile(fileLocation);
};

export const deleteImage = (req, res) => {
	const { filename } = req.params;
	const fileLocation = path.join(imagesDir, filename);

	if (!fs.existsSync(fileLocation)) {
		return res.status(404).json({ error: 'Image not found.' });
	}

	fs.unlink(fileLocation, (err) => {
		if (err) {
			return res.status(500).json({ error: 'Failed to delete image.' });
		}
		return res.json({ message: 'Image deleted successfully.' });
	});
};
