import multer from 'multer';
import fs from 'fs';
import path from 'path';

// Helper: Recursively find file by filename
function findFileRecursively(dir, targetFilename) {
	try {
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
	} catch (err) {
		console.error(`Error in findFileRecursively: ${err.message}`);
	}
	return null;
}

export const createMulterUploader = (destinationFolder) => {
	fs.mkdirSync(destinationFolder, { recursive: true });

	const storage = multer.diskStorage({
		destination: (req, file, cb) => {
			cb(null, destinationFolder);
		},
		filename: (req, file, cb) => {
			const sanitized = file.originalname.replace(/\s+/g, '-');

			const mediaRoot = path.join(process.cwd(), 'media', 'images');
			const existing = findFileRecursively(mediaRoot, sanitized);

			if (existing) {
				return cb(new Error('File with this name already exists.'));
			}

			cb(null, sanitized);
		},
	});

	return multer({
		storage,
		limits: { fileSize: 50 * 1024 * 1024 }, // 50MB
	});
};
