import React, { createContext, useState, useEffect, useContext } from 'react';

const GeneralSettingsContext = createContext();

export const GeneralSettingsProvider = ({ children }) => {
	const [generalSettings, setGeneralSettings] = useState(null);
	const [loading, setLoading] = useState(true);

	// Fetch settings on mount
	useEffect(() => {
		fetch('/api/settings/general')
			.then((res) => res.json())
			.then((data) => {
				setGeneralSettings(data);
				setLoading(false);
			})
			.catch((err) => console.error('Error fetching general settings:', err));
	}, []);

	// Update settings API
	const updateGeneralSettings = (newSettings) => {
		setGeneralSettings(newSettings);
		fetch('/api/admin/settings/general', {
			method: 'PUT',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify(newSettings),
		})
			.then((res) => res.json())
			.catch((err) => console.error('Error updating general settings:', err));
	};

	return (
		<GeneralSettingsContext.Provider value={{ generalSettings, loading, updateGeneralSettings }}>
			{children}
		</GeneralSettingsContext.Provider>
	);
};

export const useGeneralSettings = () => useContext(GeneralSettingsContext);
