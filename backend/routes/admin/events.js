import express from 'express';
import {
	createEvent,
	deleteEvent,
	getArchivedEvents,
	updateEvent,
} from '../../api/events/eventsAPI.js';
import {
	createEventDate,
	deleteEventDate,
	updateEventDate,
} from '../../api/events/eventDatesAPI.js';
import {
	createEventTime,
	deleteEventTimes,
	updateEventTime,
} from '../../api/events/eventTimesAPI.js';
import { setEventPhotoThumbnail } from '../../api/mediaAPI.js';

const router = express.Router();

// POST /admin/events/new/ - Create an event (admin only)
router.post('/new/', createEvent);
// PUT /admin/events/update/:id - Update an event via it's id (admin only)
router.put('/update/:id/', updateEvent);
// GET /admin/events/archived - List all archived events (private)
router.get('/archived/', getArchivedEvents);
// DELETE /admin/events/delete/:id - Delete event by its id (private)
router.delete('/delete/:id/', deleteEvent);

// POST /admin/events/dates/new/ - Create an event date (admin only)
router.post('/dates/new/', createEventDate);
// PUT /admin/events/dates/update/:id - Update an event date via it's id (admin only)
router.put('/dates/update/:eventDateID/', updateEventDate);
// DELETE /admin/events/dates/delete/:id - Delete an event date via it's id (admin only)
router.delete('/dates/delete/:eventDateID/', deleteEventDate);

// POST /admin/events/times/new/ - Create an event date (admin only)
router.post('/times/new/', createEventTime);
// PUT /admin/events/times/update/:id/ - Update an event time via it's id (admin only)
router.put('/times/update/:eventTimeID/', updateEventTime);
// DELETE /admin/events/times/delete/:eventDateID - Delete all times for an EventDate via EventDateID
router.delete('/times/delete/:eventDateID/', deleteEventTimes);

//PUT  /admin/events/:eventID/thumbnail
// Set an EventPhoto as thumbnail - needs to happen here for json
router.put('/:eventID/thumbnail', setEventPhotoThumbnail);

export default router;
