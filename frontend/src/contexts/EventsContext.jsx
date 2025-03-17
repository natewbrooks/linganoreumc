import { createContext, useContext, useEffect, useState } from 'react';

const EventsContext = createContext();

export const useEvents = () => useContext(EventsContext);

// Fetch all events from API
const fetchEvents = async () => {
	try {
		const response = await fetch('http://localhost:5000/api/events/all/');
		if (!response.ok) {
			throw new Error('Failed to fetch events');
		}
		return await response.json();
	} catch (error) {
		console.error('Error fetching events:', error);
		return [];
	}
};

// Manage state
export const EventsProvider = ({ children }) => {
	const [events, setEvents] = useState([]);

	useEffect(() => {
		const loadEvents = async () => {
			const eventsData = await fetchEvents();
			setEvents(eventsData);
		};

		loadEvents();
	}, []);

	return <EventsContext.Provider value={{ events }}>{children}</EventsContext.Provider>;
};
