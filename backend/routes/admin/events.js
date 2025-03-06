import express from 'express';
import { createEvent, updateEvent } from '../../api/eventsAPI.js';

const router = express.Router();

// POST /admin/events - Create an event (admin only)
router.post('/', createEvent);

// PUT /admin/events/:id - Update an event (admin only)
router.put('/:id', updateEvent);

export default router;
