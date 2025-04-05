import express from 'express';
import {
	createSermon,
	deleteSermon,
	getArchivedSermons,
	updateSermon,
} from '../../api/sermons/sermonsAPI.js';

const router = express.Router();

// POST /api/admin/sermons/new/:videoURL - Create an event (admin only)
router.post('/new/', createSermon);

// PUT /api/admin/sermons/update/:id/ - Update an event via it's id (admin only)
router.put('/update/:id/', updateSermon);

// GET /api/sermons/archived/ - List all archived sermons (admin only)
router.get('/archived/', getArchivedSermons);

// GET /api/sermons/delete/ - Delete Sermon by id (admin only)
router.delete('/delete/:id/', deleteSermon);

export default router;
