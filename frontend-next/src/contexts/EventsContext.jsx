'use client';
import React, { createContext, useContext } from 'react';
import { fetchWithRetry } from '@/lib/fetchWithRetry';

const EventsContext = createContext();

/** Provides events data fetched server-side in `layout.js`. */
export const EventsProvider = ({ events, eventDates, eventTimes, eventImages, children }) => {
	const fetchEventById = async (eventId) => {
		try {
			return await fetchWithRetry(`${process.env.NEXT_PUBLIC_API_BASE_URL}/events/${eventId}`);
		} catch (err) {
			console.error(`Error fetching event ${eventId}:`, err);
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
			return [];
		}
	};

	return (
		<EventsContext.Provider
			value={{
				events,
				eventDates,
				eventTimes,
				eventImages,
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
