import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import {
	uploadImage,
	uploadHeaderImage,
	deleteImage,
	uploadEventImage,
	uploadStainedGlassImage,
} from '../../api/mediaAPI.js';
import { createMulterUploader } from '../../middleware/multerConfig.js';

const router = express.Router();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Use process.cwd() so that the media folder is at the project root.
const mediaImagesPath = path.join(process.cwd(), 'media', 'images');
const headerImagesPath = path.join(mediaImagesPath, 'header');
const stainedGlassDir = path.join(mediaImagesPath, 'stained-glass');
const eventImagesDir = path.join(mediaImagesPath, 'events');

// POST /admin/media/images/
// Use multerConfig to handle general image uploads, storing files in /media/images/
router.post('/images/', createMulterUploader(mediaImagesPath).single('image'), uploadImage);

// POST /admin/media/images/header/
// Use multerConfig to handle header image uploads, storing files in /media/images/header/
router.post(
	'/images/header/',
	createMulterUploader(headerImagesPath).single('image'),
	(req, res, next) => {
		console.log('Uploaded header file:', req.file);
		next();
	},
	uploadHeaderImage
);

// POST /admin/media/images/stained-glass/
router.post(
	'/images/stained-glass/',
	createMulterUploader(stainedGlassDir).single('image'),
	(req, res, next) => {
		console.log('Uploaded stained glass file:', req.file);
		next();
	},
	uploadStainedGlassImage
);

// POST /admin/media/images/events/:eventID
// Use multerConfig to handle event image uploads, storing files in /media/images/event/:eventID
router.post(
	'/images/events/:eventID',
	(req, res, next) => {
		const eventID = req.params.eventID;
		const uploadDir = path.join(eventImagesDir, eventID);
		const upload = createMulterUploader(uploadDir).single('image');

		upload(req, res, (err) => {
			if (err) {
				console.error('Multer error:', err);
				return res.status(400).json({ error: err.message });
			}
			next();
		});
	},
	uploadEventImage
);

// DELETE /admin/media/images/:filename
router.delete('/images/:filename', deleteImage);

export default router;
