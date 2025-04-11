import React, { createContext, useState, useEffect, useContext } from 'react';

const EventsContext = createContext();

export const EventsProvider = ({ children }) => {
	const [events, setEvents] = useState([]);
	const [eventDates, setEventDates] = useState([]);
	const [eventTimes, setEventTimes] = useState([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(null);

	useEffect(() => {
		fetch('/api/events/all/')
			.then((res) => res.json())
			.then((data) => {
				const filtered = data.filter((event) => !event.isArchived);
				setEvents(filtered);
				setLoading(false);
			})

			.catch((err) => setError(err.message));
	}, []);

	useEffect(() => {
		fetch('/api/events/dates/all/')
			.then((res) => res.json())
			.then((data) => setEventDates(data))
			.catch((err) => setError(err.message));
	}, []);

	useEffect(() => {
		fetch('/api/events/times/all/')
			.then((res) => res.json())
			.then((data) => setEventTimes(data))
			.catch((err) => setError(err.message));
	}, []);

	const fetchEventById = async (eventId) => {
		try {
			const res = await fetch(`/api/events/${eventId}/`);
			if (!res.ok) throw new Error('Failed to fetch event');
			return await res.json();
		} catch (err) {
			console.error(err);
			setError(err.message);
		}
	};

	const fetchEventDatesById = async (eventId) => {
		try {
			const res = await fetch(`/api/events/dates/${eventId}/`);
			if (!res.ok) throw new Error('Failed to fetch event dates');
			return await res.json();
		} catch (err) {
			console.error(err);
			setError(err.message);
		}
	};

	const fetchEventTimesByDateId = async (eventDateId) => {
		try {
			const res = await fetch(`/api/events/times/${eventDateId}/`);
			if (!res.ok) throw new Error('Failed to fetch event times');
			return await res.json();
		} catch (err) {
			console.error(err);
			setError(err.message);
		}
	};

	// Find all event dates associated with this event ID
	const fetchEventTimesByEventId = async (eventId) => {
		try {
			// First, get all event dates associated with this event
			const dateRes = await fetch(`/api/events/dates/${eventId}/`);
			if (!dateRes.ok) throw new Error('Failed to fetch event dates');
			const eventDates = await dateRes.json();

			// For each date, fetch times
			const timeFetches = eventDates.map((date) =>
				fetch(`/api/events/times/${date.id}/`).then((res) => {
					if (!res.ok) throw new Error(`Failed to fetch times for date ID ${date.id}`);
					return res.json();
				})
			);

			// Resolve all time fetches in parallel
			const allTimes = await Promise.all(timeFetches);

			// Flatten and annotate times with eventDateID
			const mergedTimes = allTimes.flat().map((t) => ({
				eventDateID: t.eventDateID,
				time: t.time,
			}));

			return mergedTimes;
		} catch (err) {
			console.error('Error in fetchEventTimesByEventId:', err);
			setError?.(err.message);
			return [];
		}
	};

	const fetchEventImages = async (eventID) => {
		try {
			const res = await fetch(`/api/media/images/events/${eventID}`);
			if (!res.ok) throw new Error('Failed to fetch event images');
			const data = await res.json();

			return data.map((img) => ({
				url: img.photoURL || img.url,
				isThumbnail: img.isThumbnail === 1 || img.isThumbnail === true,
			}));
		} catch (err) {
			console.error('Error fetching event images:', err);
			setError(err.message);
			return [];
		}
	};

	const getShortDayOfWeek = (dateStr) => {
		const [year, month, day] = dateStr.split('-').map(Number);
		const date = new Date(year, month - 1, day); // Local time
		return ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'][date.getDay()];
	};

	const getLongDayOfWeek = (dateStr) => {
		const [year, month, day] = dateStr.split('-').map(Number);
		const date = new Date(year, month - 1, day); // Local time
		return ['SUNDAYS', 'MONDAYS', 'TUESDAYS', 'WEDNESDAYS', 'THURSDAYS', 'FRIDAYS', 'SATURDAYS'][
			date.getDay()
		];
	};

	return (
		<EventsContext.Provider
			value={{
				events,
				eventDates,
				eventTimes,
				loading,
				error,
				fetchEventById,
				fetchEventDatesById,
				fetchEventTimesByDateId,
				fetchEventTimesByEventId,
				fetchEventImages,
				getShortDayOfWeek,
				getLongDayOfWeek,
			}}>
			{children}
		</EventsContext.Provider>
	);
};

export const useEvents = () => useContext(EventsContext);
