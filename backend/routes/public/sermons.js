import express from 'express';
import { getAllSermons, getSermon } from '../../api/sermons/sermonsAPI.js';

const router = express.Router();

// GET /api/sermons/all - List all sermons (public)
router.get('/all/', getAllSermons);

// GET /api/sermons/:id - Get a specific sermon (public)
router.get('/:id/', getSermon);

export default router;
