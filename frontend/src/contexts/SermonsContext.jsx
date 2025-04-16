import { createContext, useContext, useEffect, useState } from 'react';

const SermonsContext = createContext();

export const useSermons = () => useContext(SermonsContext);

// Fetch all sermons from API
const fetchSermons = async () => {
	try {
		const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/sermons/all/`);
		if (!response.ok) {
			throw new Error('Failed to fetch sermons');
		}
		return await response.json();
	} catch (error) {
		console.error('Error fetching sermons:', error);
		return [];
	}
};

// Manage state
export const SermonsProvider = ({ children }) => {
	const [sermons, setSermons] = useState([]);

	useEffect(() => {
		const loadSermons = async () => {
			const sermonsData = await fetchSermons();
			const activeSermons = sermonsData.filter((sermon) => !sermon.isArchived);
			setSermons(activeSermons);
		};

		loadSermons();
	}, []);

	return <SermonsContext.Provider value={{ sermons }}>{children}</SermonsContext.Provider>;
};
