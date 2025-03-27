import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import { uploadImage, uploadHeaderImage, deleteImage } from '../../api/mediaAPI.js';
import { createMulterUploader } from '../../middleware/multerConfig.js';

const router = express.Router();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Use process.cwd() so that the media folder is at the project root.
const mediaImagesPath = path.join(process.cwd(), 'media', 'images');
const headerImagesPath = path.join(mediaImagesPath, 'header');

// POST /api/admin/media/images/
// Use multerConfig to handle general image uploads, storing files in /media/images/
router.post('/images/', createMulterUploader(mediaImagesPath).single('image'), uploadImage);

// POST /api/admin/media/images/header/
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

// DELETE /api/admin/media/images/:filename
router.delete('/images/:filename', deleteImage);

export default router;
