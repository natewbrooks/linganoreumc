'use client';

import { createContext, useContext, useEffect, useState } from 'react';
import { getSermons } from '@/lib/getSermons'; // adjust path as needed

const SermonsContext = createContext();

export const useSermons = () => useContext(SermonsContext);

export const SermonsProvider = ({ children, initialData = [] }) => {
	const [sermons, setSermons] = useState(initialData);
	const [loading, setLoading] = useState(initialData.length === 0);
	const [error, setError] = useState(null);

	useEffect(() => {
		// Skip fetch if SSR data was provided
		if (initialData.length > 0) {
			setLoading(false);
			return;
		}

		const loadSermons = async () => {
			try {
				const fetched = await getSermons();
				setSermons(fetched);
			} catch (err) {
				console.error('Failed to load sermons via client fetch:', err);
				setError(err.message);
			} finally {
				setLoading(false);
			}
		};

		loadSermons();
	}, [initialData]);

	return (
		<SermonsContext.Provider value={{ sermons, loading, error }}>
			{children}
		</SermonsContext.Provider>
	);
};
