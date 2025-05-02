'use client';
import React, { createContext, useState, useEffect, useContext } from 'react';
import { fetchWithRetry } from '@/lib/fetchWithRetry';

const EventsContext = createContext();

export const EventsProvider = ({ children }) => {
	const [events, setEvents] = useState([]);
	const [eventDates, setEventDates] = useState([]);
	const [eventTimes, setEventTimes] = useState([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(null);

	useEffect(() => {
		const fetchEvents = async () => {
			try {
				const data = await fetchWithRetry(`${process.env.NEXT_PUBLIC_API_BASE_URL}/events/all`);
				const filtered = data.filter((event) => !event.isArchived);
				setEvents(filtered);
			} catch (err) {
				console.error('Failed to fetch events:', err);
				setError(err.message);
			} finally {
				setLoading(false);
			}
		};

		fetchEvents();
	}, []);

	useEffect(() => {
		const fetchAllDates = async () => {
			try {
				const data = await fetchWithRetry(
					`${process.env.NEXT_PUBLIC_API_BASE_URL}/events/dates/all`
				);
				setEventDates(Array.isArray(data) ? data : []);
			} catch (err) {
				console.error('Failed to fetch event dates:', err);
				setError(err.message);
			}
		};

		fetchAllDates();
	}, []);

	useEffect(() => {
		const fetchAllTimes = async () => {
			try {
				const data = await fetchWithRetry(
					`${process.env.NEXT_PUBLIC_API_BASE_URL}/events/times/all`
				);
				setEventTimes(Array.isArray(data) ? data : []);
			} catch (err) {
				console.error('Failed to fetch event times:', err);
				setError(err.message);
			}
		};

		fetchAllTimes();
	}, []);

	const fetchEventById = async (eventId) => {
		try {
			return await fetchWithRetry(`${process.env.NEXT_PUBLIC_API_BASE_URL}/events/${eventId}`);
		} catch (err) {
			console.error(`Error fetching event ${eventId}:`, err);
			setError(err.message);
			return null;
		}
	};

	const fetchEventDatesById = async (eventId) => {
		try {
			const data = await fetchWithRetry(
				`${process.env.NEXT_PUBLIC_API_BASE_URL}/events/dates/${eventId}`
			);
			return Array.isArray(data) ? data : [];
		} catch (err) {
			console.error(`Error fetching dates for event ${eventId}:`, err);
			setError(err.message);
			return [];
		}
	};

	const fetchEventTimesByDateId = async (eventDateId) => {
		try {
			const data = await fetchWithRetry(
				`${process.env.NEXT_PUBLIC_API_BASE_URL}/events/times/${eventDateId}`
			);
			return Array.isArray(data) ? data : [];
		} catch (err) {
			console.error(`Error fetching times for date ${eventDateId}:`, err);
			setError(err.message);
			return [];
		}
	};

	const fetchEventTimesByEventId = async (eventId) => {
		try {
			const eventDates = await fetchEventDatesById(eventId);
			if (!eventDates.length) return [];

			const timeFetches = eventDates.map(async (date) => {
				try {
					return await fetchEventTimesByDateId(date.id);
				} catch (err) {
					console.error(`Failed to fetch times for date ID ${date.id}:`, err);
					return [];
				}
			});

			const allTimes = await Promise.all(timeFetches);
			const mergedTimes = allTimes
				.flat()
				.filter((t) => t)
				.map((t) => ({
					id: t.id,
					eventDateID: t.eventDateID,
					startTime: t.startTime,
					endTime: t.endTime,
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
			const data = await fetchWithRetry(
				`${process.env.NEXT_PUBLIC_API_BASE_URL}/media/images/events/${eventID}`
			);
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
			}}>
			{children}
		</EventsContext.Provider>
	);
};

export const useEvents = () => useContext(EventsContext);
