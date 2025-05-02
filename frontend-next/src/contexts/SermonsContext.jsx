'use client';
import { createContext, useContext, useEffect, useState } from 'react';
import { fetchWithRetry } from '@/lib/fetchWithRetry';

const SermonsContext = createContext();

export const useSermons = () => useContext(SermonsContext);

// Fetch all sermons from API
const fetchSermons = async () => {
	try {
		const data = await fetchWithRetry(`${process.env.NEXT_PUBLIC_API_BASE_URL}/sermons/all`);
		return Array.isArray(data) ? data : [];
	} catch (error) {
		console.error('Error fetching sermons:', error);
		return [];
	}
};

// Manage state
export const SermonsProvider = ({ children }) => {
	const [sermons, setSermons] = useState([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(null);

	useEffect(() => {
		const loadSermons = async () => {
			try {
				const sermonsData = await fetchSermons();
				const activeSermons = sermonsData.filter((sermon) => !sermon.isArchived);
				setSermons(activeSermons);
			} catch (err) {
				console.error('Error loading sermons:', err);
				setError(err.message);
			} finally {
				setLoading(false);
			}
		};

		loadSermons();
	}, []);

	// Fetch a single sermon by ID
	const fetchSermonById = async (id) => {
		try {
			return await fetchWithRetry(`${process.env.NEXT_PUBLIC_API_BASE_URL}/sermons/${id}`);
		} catch (error) {
			console.error(`Error fetching sermon with ID ${id}:`, error);
			setError(error.message);
			return null;
		}
	};

	return (
		<SermonsContext.Provider value={{ sermons, loading, error, fetchSermonById }}>
			{children}
		</SermonsContext.Provider>
	);
};
