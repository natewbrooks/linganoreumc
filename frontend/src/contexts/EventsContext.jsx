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
	const fetchEventTimesByEventId = (eventId) => {
		const matchingDates = eventDates.filter((date) => date.eventID === eventId);

		const matchingTimes = eventTimes
			.filter((time) => matchingDates.some((date) => date.id === time.eventDateID))
			.map((time) => ({
				eventDateID: time.eventDateID,
				time: time.time,
			}));

		return matchingTimes;
	};

	function formatDate(dateStr) {
		const [year, month, day] = dateStr.split('-').map(Number);
		return `${month}/${day}/${String(year).slice(-2)}`;
	}

	function formatTime(timeStr) {
		const [hour, minute] = timeStr.split(':').map(Number);
		const dateObj = new Date(0, 0, 0, hour, minute);
		return dateObj.toLocaleString('en-US', {
			hour: 'numeric',
			minute: '2-digit',
			hour12: true,
		});
	}

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
				formatDate,
				formatTime,
			}}>
			{children}
		</EventsContext.Provider>
	);
};

export const useEvents = () => useContext(EventsContext);
