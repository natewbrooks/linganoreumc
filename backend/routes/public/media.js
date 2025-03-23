import express from 'express';
import { getAllImages, getAllHeaderImages, getImage } from '../../api/mediaAPI.js';

const router = express.Router();

// GET /api/media/images
router.get('/images/', getAllImages); // or rename to /api/images to replace static
// GET /api/media/images/header/
router.get('/images/header/', getAllHeaderImages); // all header images
// GET /api/media/images/:filename
router.get('/images/:filename', getImage);

// app.use('/api/images', express.static(path.join(__dirname, 'media', 'images')));

export default router;
