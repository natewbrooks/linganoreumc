'use client';
import React, { createContext, useState, useEffect, useContext } from 'react';
import axios from 'axios';

const EventsContext = createContext();

export const EventsProvider = ({ children }) => {
	const [events, setEvents] = useState([]);
	const [eventDates, setEventDates] = useState([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(null);
	const base = process.env.NEXT_PUBLIC_API_BASE_URL;

	useEffect(() => {
		axios
			.get(`${base}/events/all`)
			.then((res) => {
				setEvents(res.data);
				setLoading(false);
			})
			.catch((err) => setError(err.message));
	}, [base]);

	useEffect(() => {
		axios
			.get(`${base}/events/dates/all`)
			.then((res) => setEventDates(res.data))
			.catch((err) => setError(err.message));
	}, [base]);

	const fetchEventById = async (eventId) => {
		try {
			const res = await axios.get(`${base}/events/${eventId}`);
			return res.data;
		} catch (err) {
			console.error(err);
			setError(err.message);
		}
	};

	const fetchEventDatesById = async (eventId) => {
		try {
			const res = await axios.get(`${base}/events/dates/${eventId}`);
			return res.data;
		} catch (err) {
			console.error(err);
			setError(err.message);
		}
	};

	const fetchEventTimesByDateId = async (eventDateId) => {
		try {
			const res = await axios.get(`${base}/events/times/${eventDateId}`);
			return res.data;
			console.log(res.data);
		} catch (err) {
			console.error(err);
			setError(err.message);
		}
	};

	const fetchEventImages = async (eventID) => {
		try {
			if (!eventID) throw new Error(`Missing eventID`);
			const res = await axios.get(`${base}/media/images/events/${eventID}`);
			const data = res.data;

			return Array.isArray(data)
				? data.map((img) => ({
						url: img.photoURL || img.url,
						isThumbnail: img.isThumbnail === 1 || img.isThumbnail === true,
				  }))
				: [];
		} catch (err) {
			console.error(`Error fetching event images:`, err);
			setError(err.message);
			return [];
		}
	};

	const uploadEventImage = async (file, eventID) => {
		try {
			const formData = new FormData();
			formData.append('image', file);
			const res = await axios.post(`${base}/admin/media/images/events/${eventID}`, formData, {
				withCredentials: true,
			});
			return res.data.filePath;
		} catch (err) {
			console.error('Error uploading event image:', err);
			throw err;
		}
	};

	const createEvent = async (eventData) => {
		try {
			const res = await axios.post(`${base}/admin/events/new`, eventData, {
				withCredentials: true,
			});
			return res.data;
		} catch (err) {
			console.error(err);
			setError(err.message);
		}
	};

	const updateEvent = async (eventId, updatedData) => {
		try {
			const res = await axios.put(`${base}/admin/events/update/${eventId}`, updatedData, {
				withCredentials: true,
			});
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
			await axios.delete(`${base}/admin/events/delete/${eventId}`, { withCredentials: true });
			setEvents((prevEvents) => prevEvents.filter((event) => event.id !== eventId));
		} catch (err) {
			console.error(err);
			setError(err.message);
		}
	};

	const fetchRecurringEvents = async () => {
		try {
			const res = await axios.get(`${base}/events/recurring`);
			return res.data;
		} catch (err) {
			console.error(err);
			setError(err.message);
			return [];
		}
	};

	const fetchFeaturedEvents = async () => {
		try {
			const res = await axios.get(`${base}/events/featured`);
			return res.data;
		} catch (err) {
			console.error(err);
			setError(err.message);
			return [];
		}
	};

	const fetchArchivedEvents = async () => {
		try {
			const res = await axios.get(`${base}/admin/events/archived`, { withCredentials: true });
			return res.data;
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
			await axios.put(
				`${base}/admin/events/update/${eventId}`,
				{ isFeatured },
				{ withCredentials: true }
			);
		} catch (err) {
			console.error(err);
			setError(err.message);
		}
	};

	const createEventDate = async (eventID, date, isCancelled = false) => {
		try {
			const res = await axios.post(
				`${base}/admin/events/dates/new`,
				{ eventID, date, isCancelled },
				{ withCredentials: true }
			);
			return res.data;
		} catch (err) {
			console.error('Error in createEventDate:', err.message);
			setError(err.message);
			return null;
		}
	};

	const updateEventDate = async (eventDateID, date, isCancelled = false) => {
		try {
			await axios.put(
				`${base}/admin/events/dates/update/${eventDateID}`,
				{ date, isCancelled },
				{ withCredentials: true }
			);
		} catch (err) {
			console.error(err);
			setError(err.message);
		}
	};

	const deleteEventDate = async (eventDateID) => {
		try {
			await axios.delete(`${base}/admin/events/dates/delete/${eventDateID}`, {
				withCredentials: true,
			});
		} catch (err) {
			console.error(err);
			setError(err.message);
		}
	};

	const createEventTime = async (eventDateID, startTime, endTime = null) => {
		try {
			const res = await axios.post(
				`${base}/admin/events/times/new`,
				{ eventDateID, startTime, endTime },
				{ withCredentials: true }
			);
			return res.data;
		} catch (err) {
			console.error(err);
			setError(err.message);
		}
	};

	const updateEventTime = async (eventTimeID, time) => {
		try {
			await axios.put(
				`${base}/admin/events/times/update/${eventTimeID}`,
				{ time },
				{ withCredentials: true }
			);
		} catch (err) {
			console.error(err);
			setError(err.message);
		}
	};

	const deleteEventTimes = async (eventDateID) => {
		try {
			await axios.delete(`${base}/admin/events/times/delete/${eventDateID}`, {
				withCredentials: true,
			});
		} catch (err) {
			console.error(err);
			setError(err.message);
		}
	};

	const setThumbnailImage = async (eventID, filename) => {
		try {
			await axios.put(
				`${base}/admin/events/${eventID}/thumbnail`,
				{ filename },
				{ withCredentials: true }
			);
		} catch (err) {
			console.error('Error setting thumbnail:', err);
		}
	};

	const deleteEventImage = async (filename) => {
		try {
			await axios.delete(`${base}/admin/media/images/${filename}`, { withCredentials: true });
			return true;
		} catch (err) {
			console.error('Error deleting image:', err);
			return false;
		}
	};

	const getShortDayOfWeek = (dateStr) => {
		const [year, month, day] = dateStr.split('-').map(Number);
		const date = new Date(year, month - 1, day);
		return ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'][date.getDay()];
	};

	const getLongDayOfWeek = (dateStr) => {
		const [year, month, day] = dateStr.split('-').map(Number);
		const date = new Date(year, month - 1, day);
		return ['SUNDAY', 'MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY', 'SATURDAY'][
			date.getDay()
		];
	};

	return (
		<EventsContext.Provider
			value={{
				events,
				loading,
				error,
				eventDates,
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
				deleteEventImage,
				getShortDayOfWeek,
				getLongDayOfWeek,
			}}>
			{children}
		</EventsContext.Provider>
	);
};

export const useEvents = () => useContext(EventsContext);
