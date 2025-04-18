'use client';

import React, { createContext, useState, useEffect, useContext } from 'react';
import { getEvents } from '../lib/getEvents';

const EventsContext = createContext();

export const EventsProvider = ({ initialData = {}, children }) => {
	const [events, setEvents] = useState(initialData.events || []);
	const [eventDates, setEventDates] = useState(initialData.eventDates || []);
	const [eventTimes, setEventTimes] = useState(initialData.eventTimes || []);
	const [eventImages, setEventImages] = useState(initialData.eventImages || {});
	const [loading, setLoading] = useState(!initialData.events); // only show loading if no initial data
	const [error, setError] = useState(null);

	useEffect(() => {
		// Skip fetching if SSR provided the data
		if (
			initialData.events &&
			initialData.eventDates &&
			initialData.eventTimes &&
			initialData.eventImages
		) {
			setLoading(false);
			return;
		}

		(async () => {
			try {
				const { events, eventDates, eventTimes, eventImages } = await getEvents();
				setEvents(events);
				setEventDates(eventDates);
				setEventTimes(eventTimes);
				setEventImages(eventImages);
			} catch (err) {
				console.error('Failed to load events via SSR:', err);
				setError(err.message);
			} finally {
				setLoading(false);
			}
		})();
	}, [initialData]);

	const fetchEventById = async (eventID) => {
		return events.find((e) => String(e.id) === String(eventID));
	};

	const fetchEventDatesById = async (eventID) => {
		return eventDates.filter((d) => String(d.eventID) === String(eventID));
	};

	const fetchEventImagesById = async (eventID) => {
		return eventImages[eventID] || [];
	};

	const fetchEventTimesByEventId = async (eventID) => {
		const dates = await fetchEventDatesById(eventID);
		let allTimes = [];
		for (const date of dates) {
			const timesForDate = eventTimes.filter(
				(t) =>
					String(t.eventDateID) === String(date.id) || String(t.eventDateId) === String(date.id)
			);
			allTimes = [...allTimes, ...timesForDate];
		}
		return allTimes;
	};

	const fetchEventTimesByDateId = async (eventDateId) => {
		return eventTimes.filter((t) => t.eventDateID === eventDateId || t.eventDateId === eventDateId);
	};

	return (
		<EventsContext.Provider
			value={{
				events,
				eventDates,
				eventTimes,
				eventImages,
				loading,
				error,
				fetchEventById,
				fetchEventDatesById,
				fetchEventTimesByDateId,
				fetchEventTimesByEventId,
				fetchEventImagesById,
			}}>
			{children}
		</EventsContext.Provider>
	);
};

export const useEvents = () => useContext(EventsContext);
