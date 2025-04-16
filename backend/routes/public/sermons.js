import express from 'express';
import { getAllSermons, getSermon } from '../../api/sermons/sermonsAPI.js';

const router = express.Router();

// GET /sermons/all - List all sermons (public)
router.get('/all/', getAllSermons);

// GET /sermons/:id - Get a specific sermon (public)
router.get('/:id/', getSermon);

export default router;
