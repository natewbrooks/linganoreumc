import express from 'express';
import { getEvents, createEvent, getEvent, updateEvent } from '../api/eventsAPI.js';
import verifyAdmin from '../middleware/verifyAdminJWT.js';

const router = express.Router();

router.get('/', getEvents); // Public: Users can view events
router.post('/', createEvent); // Testing
router.get('/:id', getEvent); // Public: Get specific event
router.put('/:id', updateEvent);

// router.post('/', verifyAdmin, createEvent); // Protected: Only admins can create events

export default router;
