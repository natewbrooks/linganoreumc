import React, { createContext, useState, useEffect, useContext } from 'react';

const EventsContext = createContext();

export const EventsProvider = ({ children }) => {
	const [events, setEvents] = useState([]);
	const [eventDates, setEventDates] = useState([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(null);

	useEffect(() => {
		fetch('/api/events/all/')
			.then((res) => res.json())
			.then((data) => {
				setEvents(data);
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

	const createEvent = async (eventData) => {
		try {
			const res = await fetch('/api/admin/events/new/', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify(eventData),
			});
			if (!res.ok) throw new Error('Failed to create event');
			return await res.json();
		} catch (err) {
			console.error(err);
			setError(err.message);
		}
	};

	const updateEvent = async (eventId, updatedData) => {
		try {
			await fetch(`/api/admin/events/update/${eventId}/`, {
				method: 'PUT',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify(updatedData),
			});
		} catch (err) {
			console.error(err);
			setError(err.message);
		}
	};

	const deleteEvent = async (eventId) => {
		try {
			await fetch(`/api/admin/events/delete/${eventId}/`, {
				method: 'DELETE',
			});
			setEvents(events.filter((event) => event.id !== eventId));
		} catch (err) {
			console.error(err);
			setError(err.message);
		}
	};

	const toggleEventFeatured = async (eventId, isFeatured) => {
		try {
			setEvents((prevEvents) =>
				prevEvents.map((event) => (event.id === eventId ? { ...event, isFeatured } : event))
			);

			const res = await fetch(`/api/admin/events/update/${eventId}/`, {
				method: 'PUT',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ isFeatured }),
			});

			if (!res.ok) throw new Error('Failed to toggle event featured status');
		} catch (err) {
			console.error(err);
			setError(err.message);
		}
	};

	const createEventDate = async (eventID, date, isCancelled = false) => {
		if (!eventID || !date) {
			console.error('createEventDate: Missing eventID or date');
			return null;
		}

		try {
			const res = await fetch('/api/admin/events/dates/new/', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ eventID, date, isCancelled }),
			});

			if (!res.ok) {
				const errorData = await res.json();
				throw new Error(errorData.error || 'Failed to create event date');
			}

			return await res.json();
		} catch (err) {
			console.error('Error in createEventDate:', err.message);
			setError(err.message);
			return null;
		}
	};

	const updateEventDate = async (eventDateID, date, isCancelled = false) => {
		try {
			console.log('Sending update to API:', { eventDateID, date, isCancelled });
			const res = await fetch(`/api/admin/events/dates/update/${eventDateID}/`, {
				method: 'PUT',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ date, isCancelled }),
			});
			if (!res.ok) throw new Error('Failed to update event date');
		} catch (err) {
			console.error(err);
			setError(err.message);
		}
	};

	const deleteEventDate = async (eventDateID) => {
		try {
			await fetch(`/api/admin/events/dates/delete/${eventDateID}/`, {
				method: 'DELETE',
			});
		} catch (err) {
			console.error(err);
			setError(err.message);
		}
	};

	const createEventTime = async (eventDateID, time) => {
		try {
			const res = await fetch('/api/admin/events/times/new/', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ eventDateID, time }),
			});
			if (!res.ok) throw new Error('Failed to create event time');
			return await res.json();
		} catch (err) {
			console.error(err);
			setError(err.message);
		}
	};

	const updateEventTime = async (eventTimeID, time) => {
		try {
			const res = await fetch(`/api/admin/events/times/update/${eventTimeID}/`, {
				method: 'PUT',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ time }),
			});
			if (!res.ok) throw new Error('Failed to update event time');
		} catch (err) {
			console.error(err);
			setError(err.message);
		}
	};

	const deleteEventTimes = async (eventDateID) => {
		try {
			await fetch(`/api/admin/events/times/delete/${eventDateID}/`, {
				method: 'DELETE',
			});
		} catch (err) {
			console.error(err);
			setError(err.message);
		}
	};

	return (
		<EventsContext.Provider
			value={{
				events,
				loading,
				error,
				fetchEventById,
				fetchEventDatesById,
				fetchEventTimesByDateId,
				createEvent,
				updateEvent,
				deleteEvent,
				toggleEventFeatured,
				createEventDate,
				updateEventDate,
				deleteEventDate,
				createEventTime,
				updateEventTime,
				deleteEventTimes,
			}}>
			{children}
		</EventsContext.Provider>
	);
};

export const useEvents = () => useContext(EventsContext);
