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

	const fetchEventImages = async (eventID) => {
		try {
			if (!eventID) throw new Error('Missing eventID');
			const res = await fetch(`/api/media/images/events/${eventID}`);
			if (!res.ok) throw new Error('Failed to fetch event images');
			const data = await res.json();

			// Sanitize structure
			return Array.isArray(data)
				? data.map((img) => ({
						url: img.photoURL || img.url,
						isThumbnail: img.isThumbnail === 1 || img.isThumbnail === true,
				  }))
				: [];
		} catch (err) {
			console.error('Error fetching event images:', err);
			setError(err.message);
			return [];
		}
	};

	const uploadEventImage = async (file, eventID) => {
		try {
			const formData = new FormData();
			formData.append('image', file);

			const res = await fetch(`/api/admin/media/images/events/${eventID}`, {
				method: 'POST',
				body: formData,
			});

			const data = await res.json();
			if (!res.ok) {
				const errorMessage = data?.error || 'Failed to upload event image';
				throw new Error(errorMessage);
			}

			return data.filePath;
		} catch (err) {
			console.error('Error uploading event image:', err);
			throw err;
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
			const res = await fetch(`/api/admin/events/update/${eventId}/`, {
				method: 'PUT',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify(updatedData),
			});

			if (!res.ok) throw new Error('Failed to update event');

			setEvents((prevEvents) =>
				prevEvents.map((event) => (event.id === eventId ? { ...event, ...updatedData } : event))
			);
		} catch (err) {
			console.error(err);
			setError(err.message);
		}
	};

	const deleteEvent = async (eventId) => {
		try {
			const res = await fetch(`/api/admin/events/delete/${eventId}/`, {
				method: 'DELETE',
			});

			if (!res.ok) throw new Error('Failed to delete event');

			setEvents((prevEvents) => prevEvents.filter((event) => event.id !== eventId));
		} catch (err) {
			console.error(err);
			setError(err.message);
		}
	};

	const fetchRecurringEvents = async () => {
		try {
			const res = await fetch('/api/events/recurring/');
			if (!res.ok) throw new Error('Failed to fetch recurring events');
			return await res.json();
		} catch (err) {
			console.error(err);
			setError(err.message);
			return [];
		}
	};

	const fetchFeaturedEvents = async () => {
		try {
			const res = await fetch('/api/events/featured/');
			if (!res.ok) throw new Error('Failed to fetch featured events');
			return await res.json();
		} catch (err) {
			console.error(err);
			setError(err.message);
			return [];
		}
	};

	const fetchArchivedEvents = async () => {
		try {
			const res = await fetch('/api/admin/events/archived/');
			if (!res.ok) throw new Error('Failed to fetch archived events');
			return await res.json();
		} catch (err) {
			console.error(err);
			setError(err.message);
			return [];
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

	async function setThumbnailImage(eventID, filename) {
		try {
			const res = await fetch(`/api/admin/events/${eventID}/thumbnail`, {
				method: 'PUT',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ filename }),
			});
			if (!res.ok) throw new Error('Failed to set thumbnail');
		} catch (err) {
			console.error('Error setting thumbnail:', err);
		}
	}

	const deleteEventImage = async (filename) => {
		try {
			const res = await fetch(`/api/admin/media/images/${filename}`, {
				method: 'DELETE',
			});
			if (!res.ok) throw new Error('Failed to delete image');
			return true;
		} catch (err) {
			console.error('Error deleting image:', err);
			return false;
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
				fetchEventImages,
				fetchRecurringEvents,
				fetchFeaturedEvents,
				fetchArchivedEvents,
				uploadEventImage,
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
				setThumbnailImage,
			}}>
			{children}
		</EventsContext.Provider>
	);
};

export const useEvents = () => useContext(EventsContext);
