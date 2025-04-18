import { createContext, useContext, useEffect, useState } from 'react';

const SettingsContext = createContext();

export const useSettings = () => useContext(SettingsContext);

// Fetch settings dynamically
const fetchSettings = async (endpoint) => {
	try {
		const response = await fetch(`http://localhost:5000/api/settings/${endpoint}`);
		if (!response.ok) {
			throw new Error(`Failed to fetch ${endpoint} settings`);
		}
		return await response.json();
	} catch (error) {
		console.error(`Error fetching ${endpoint} settings:`, error);
		return null;
	}
};

function formatLongDate(dateStr) {
	const date = new Date(dateStr);
	return date.toLocaleDateString('en-US', {
		year: 'numeric',
		month: 'long',
		day: '2-digit',
	});
}

function formatDate(dateStr) {
	const [year, month, day] = dateStr.split('-').map(Number);
	return `${month}/${day}/${String(year).slice(-2)}`;
}

function formatTime(timeStr) {
	const [hour, minute] = timeStr.split(':').map(Number);
	const dateObj = new Date(0, 0, 0, hour, minute);
	return dateObj.toLocaleString('en-US', {
		hour: 'numeric',
		minute: '2-digit',
		hour12: true,
	});
}

// Context provider for multiple settings types
export const SettingsProvider = ({ children }) => {
	const [settings, setSettings] = useState({
		general: null,
		pages: {
			home: null,
			// Future pages
		},
	});

	useEffect(() => {
		const fetchAllSettings = async () => {
			const [general, home] = await Promise.all([
				fetchSettings('general'),
				fetchSettings('pages/home'),
			]);

			setSettings({
				general,
				pages: {
					home,
					// Future pages
				},
			});
		};

		fetchAllSettings();
	}, []);

	return (
		<SettingsContext.Provider value={{ settings, formatLongDate, formatDate, formatTime }}>
			{children}
		</SettingsContext.Provider>
	);
};
