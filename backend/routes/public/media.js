import express from 'express';
import {
	getAllImages,
	getAllHeaderImages,
	getAllEventImages,
	getAllEventsImages,
	getImage,
} from '../../api/mediaAPI.js';
import { scrapeYouTubeVideo } from '../../api/mediaAPI.js';

const router = express.Router();

// GET /api/media/images
router.get('/images/', getAllImages); // or rename to /api/images to replace static
// GET /api/media/images/header/
router.get('/images/header/', getAllHeaderImages); // all header images
// GET /api/media/images/events/
router.get('/images/events/', getAllEventsImages); // all event images
// GET /api/media/images/:filename
router.get('/images/:filename', getImage); // get specific image by name, regardless of the folder its in
// GET /api/media/images/events/
router.get('/images/events/:eventID', getAllEventImages); // all event images

// POST /api/media/scrape-youtube/
router.post('/scrape-youtube/', scrapeYouTubeVideo);

// app.use('/api/images', express.static(path.join(__dirname, 'media', 'images')));

export default router;
