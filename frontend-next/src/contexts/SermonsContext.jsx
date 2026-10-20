'use client';
import { createContext, useContext } from 'react';
import { fetchWithRetry } from '@/lib/fetchWithRetry';

const SermonsContext = createContext();

export const useSermons = () => useContext(SermonsContext);

/** Provides sermons fetched server-side in `layout.js`. */
export const SermonsProvider = ({ sermons, children }) => {
	// Fetch a single sermon by ID
	const fetchSermonById = async (id) => {
		try {
			return await fetchWithRetry(`${process.env.NEXT_PUBLIC_API_BASE_URL}/sermons/${id}`);
		} catch (error) {
			console.error(`Error fetching sermon with ID ${id}:`, error);
			return null;
		}
	};

	return (
		<SermonsContext.Provider value={{ sermons, fetchSermonById }}>
			{children}
		</SermonsContext.Provider>
	);
};
