import express from 'express';
import { getEvents, getEvent } from '../../api/eventsAPI.js';

const router = express.Router();

// GET /events - List all events (public)
router.get('/', getEvents);

// GET /events/:id - Get a specific event (public)
router.get('/:id', getEvent);

export default router;
