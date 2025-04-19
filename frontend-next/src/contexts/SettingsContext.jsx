'use client';
import { createContext, useContext, useEffect, useState } from 'react';

const SettingsContext = createContext();

export const useSettings = () => useContext(SettingsContext);

// Fetch settings dynamically
const fetchSettings = async (endpoint) => {
	try {
		const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/settings/${endpoint}`);
		if (!response.ok) {
			throw new Error(`Failed to fetch ${endpoint} settings`);
		}
		return await response.json();
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

	useEffect(() => {
		const fetchAllSettings = async () => {
			const [general, home] = await Promise.all([fetchSettings('general'), fetchSettings('home')]);

			setSettings({
				general,
				home,
			});
		};

		fetchAllSettings();
	}, []);

	return <SettingsContext.Provider value={{ settings }}>{children}</SettingsContext.Provider>;
};
