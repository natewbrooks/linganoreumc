import express from 'express';
import {
	getAllEvents,
	getArchivedEvents,
	getEvent,
	getFeaturedEvents,
	getRecurringEvents,
} from '../../api/events/eventsAPI.js';
import { getAllEventDates, getEventDates, getEventDate } from '../../api/events/eventDatesAPI.js';
import { getAllEventTimes, getEventTime, getEventTimes } from '../../api/events/eventTimesAPI.js';

const router = express.Router();

// GET /api/events/all - List all events (public)
router.get('/all/', getAllEvents);
// GET /api/events/:id - Get a specific event (public)
router.get('/:id/', getEvent);
// GET /api/events/recurring - List all recurring events (public)
router.get('/recurring/', getRecurringEvents);
// GET /api/events/featured - List all featured events (public)
router.get('/featured/', getFeaturedEvents);

// GET /api/events/dates/all - List all event dates for a (public)
router.get('/dates/all/', getAllEventDates);
// GET /api/events/dates/:eventID - Get a specific event date via eventID (public)
router.get('/dates/:eventID/', getEventDates);
// GET /api/events/dates/:id - Get a specific event date via eventDateID (public)
router.get('/dates/id/:id/', getEventDate);

// GET /api/events/times/all - List all event dates (public)
router.get('/times/all/', getAllEventTimes);
// GET /api/events/times/all - List event dates for an event via eventDateID (public)
router.get('/times/:eventDateID/', getEventTimes);
// GET /api/events/times/:id - Get a specific event date via its id (public)
router.get('/times/id/:id/', getEventTime);

export default router;
