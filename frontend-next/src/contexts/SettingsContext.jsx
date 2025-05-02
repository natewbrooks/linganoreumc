'use client';
import { createContext, useContext, useEffect, useState } from 'react';
import { fetchWithRetry } from '@/lib/fetchWithRetry';

const SettingsContext = createContext();

export const useSettings = () => useContext(SettingsContext);

// Fetch settings dynamically
const fetchSettings = async (endpoint) => {
	try {
		return await fetchWithRetry(`${process.env.NEXT_PUBLIC_API_BASE_URL}/settings/${endpoint}`);
	} catch (error) {
		console.error(`Error fetching ${endpoint} settings:`, error);
		return null;
	}
};

// Context provider for multiple settings types
export const SettingsProvider = ({ children }) => {
	const [settings, setSettings] = useState({
		general: null,
		home: null,
		// Future pages
	});
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(null);

	useEffect(() => {
		const fetchAllSettings = async () => {
			try {
				const [general, home] = await Promise.all([
					fetchSettings('general'),
					fetchSettings('home'),
				]);

				setSettings({
					general,
					home,
				});
			} catch (err) {
				console.error('Error fetching settings:', err);
				setError(err.message);
			} finally {
				setLoading(false);
			}
		};

		fetchAllSettings();
	}, []);

	return (
		<SettingsContext.Provider value={{ settings, loading, error }}>
			{children}
		</SettingsContext.Provider>
	);
};
